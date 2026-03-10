import { DemodWBFMStage1 } from "@jtarrio/signals/demod/demod-wbfm.js";
import { makeLowPassKernel } from "@jtarrio/signals/dsp/coefficients.js";
import { FIRFilter } from "@jtarrio/signals/dsp/filters.js";
import { RealDownsampler } from "@jtarrio/signals/dsp/resamplers.js";
import type { SampleBlock } from "@jtarrio/signals/radio/sample_block.js";

// RDS signal constants
const RDS_CARRIER = 57000; // Hz (3 × 19 kHz stereo pilot)
const RDS_BIT_RATE = 1187.5; // bits/sec
const OVERSAMPLE = 8; // samples per bit
const RDS_RATE = RDS_BIT_RATE * OVERSAMPLE; // 9500 Hz

// RDS CRC-10: g(x) = x^10 + x^8 + x^7 + x^5 + x^4 + x^3 + 1
const CRC_POLY = 0x1b9; // lower 9 bits: 0110111001

// Block offset words (IEC 62106): A, B, C, D
const BLOCK_OFFSETS = [252, 408, 360, 436] as const;

/** Compute CRC-10 syndrome of a 26-bit RDS block. */
function blockSyndrome(block: number): number {
  let reg = 0;
  for (let i = 25; i >= 0; i--) {
    const fb = (((reg >>> 9) ^ (block >>> i)) & 1);
    reg = ((reg << 1) & 0x3ff) ^ (fb ? CRC_POLY : 0);
  }
  return reg;
}

/**
 * Accumulates bits, checks CRC to sync on 26-bit RDS blocks,
 * and decodes group type 0A to extract the PS (station name).
 */
class GroupDecoder {
  private shreg = 0;
  private bitCount = 0;
  private lastSyncBit = -1;
  private lastSyncBlockPos = -1;
  private groupWords: number[] = [];
  readonly psChars = new Uint8Array(8).fill(0x20);
  readonly psSegReceived = new Uint8Array(4);

  /** Feed one decoded bit. Returns true when a complete PS name is assembled. */
  addBit(bit: number): boolean {
    this.shreg = ((this.shreg << 1) | (bit & 1)) & 0x3ffffff; // 26-bit register
    this.bitCount++;
    if (this.bitCount < 26) return false;

    const syn = blockSyndrome(this.shreg);
    const info = (this.shreg >>> 10) & 0xffff; // top 16 bits = info word

    for (let pos = 0; pos < 4; pos++) {
      if (syn !== BLOCK_OFFSETS[pos]) continue;

      const isNext =
        this.lastSyncBit >= 0 &&
        this.bitCount - 1 - this.lastSyncBit === 26 &&
        pos === (this.lastSyncBlockPos + 1) % 4;

      if (!isNext) {
        // Re-anchor: start group from block A only
        this.groupWords = [];
        this.lastSyncBit = -1;
        this.lastSyncBlockPos = -1;
        if (pos !== 0) break; // wait for block A
        this.groupWords = [info];
        this.lastSyncBit = this.bitCount - 1;
        this.lastSyncBlockPos = 0;
        break;
      }

      if (pos === 0) this.groupWords = [];
      this.groupWords.push(info);
      this.lastSyncBit = this.bitCount - 1;
      this.lastSyncBlockPos = pos;

      if (pos === 3 && this.groupWords.length === 4) {
        const decoded = this.decodeGroup(this.groupWords);
        this.groupWords = [];
        return decoded;
      }
      break;
    }
    return false;
  }

  private decodeGroup(words: number[]): boolean {
    const groupType = (words[1] >>> 12) & 0xf;
    const version = (words[1] >>> 11) & 1;
    if (groupType === 0 && version === 0) {
      const seg = words[1] & 0x3;
      const c0 = (words[3] >>> 8) & 0xff;
      const c1 = words[3] & 0xff;
      // Only accept printable ASCII
      if (c0 >= 0x20 && c0 < 0x80 && c1 >= 0x20 && c1 < 0x80) {
        this.psChars[seg * 2] = c0;
        this.psChars[seg * 2 + 1] = c1;
        this.psSegReceived[seg] = 1;
        return this.psSegReceived.every(Boolean);
      }
    }
    return false;
  }

  reset(): void {
    this.shreg = 0;
    this.bitCount = 0;
    this.lastSyncBit = -1;
    this.lastSyncBlockPos = -1;
    this.groupWords = [];
    this.psChars.fill(0x20);
    this.psSegReceived.fill(0);
  }
}

/**
 * Runs OVERSAMPLE (8) parallel decoders at different sample-phase offsets
 * to handle unknown clock alignment, then locks onto the first one that syncs.
 */
class PhaseDecoder {
  private buf = new Float32Array(OVERSAMPLE * 2); // ring buffer
  private bufIdx = 0; // total samples fed
  private decoders: GroupDecoder[];
  private lastChipSign = new Int8Array(OVERSAMPLE); // last second-half sign per phase
  private lockedPhase = -1;
  private lastEmitted = "";
  private readonly onName: (name: string) => void;

  constructor(onName: (name: string) => void) {
    this.onName = onName;
    this.decoders = Array.from({ length: OVERSAMPLE }, () => new GroupDecoder());
  }

  feed(sample: number): void {
    this.buf[this.bufIdx % (OVERSAMPLE * 2)] = sample;
    this.bufIdx++;

    // Each phase p fires when bufIdx % OVERSAMPLE === p % OVERSAMPLE
    const activePhase = (this.bufIdx % OVERSAMPLE);

    // Skip until we have a full OVERSAMPLE window for any phase
    if (this.bufIdx < OVERSAMPLE) return;

    // Only process the active phase (or all if not yet locked)
    for (let p = 0; p < OVERSAMPLE; p++) {
      if (p !== activePhase) continue; // only one phase fires per sample
      if (this.lockedPhase >= 0 && p !== this.lockedPhase) continue;

      // Sum first and second half of the OVERSAMPLE window ending now
      const half = OVERSAMPLE >> 1; // 4
      let fh = 0, sh = 0;
      const base = this.bufIdx - OVERSAMPLE;
      for (let i = 0; i < half; i++) fh += this.buf[(base + i) % (OVERSAMPLE * 2)];
      for (let i = half; i < OVERSAMPLE; i++) sh += this.buf[(base + i) % (OVERSAMPLE * 2)];

      // Differential biphase decode:
      // RDS uses differential encoding: bit = (last chip == current first chip) ? 1 : 0
      // (same sign at boundary = transition occurred in differential signal = bit 1)
      const currSign: number = fh > 0 ? 1 : -1;
      const bit = currSign === this.lastChipSign[p] ? 1 : 0;
      this.lastChipSign[p] = sh > 0 ? 1 : -1;

      const complete = this.decoders[p].addBit(bit);
      if (complete) {
        const name = String.fromCharCode(...this.decoders[p].psChars).trim();
        if (name && name !== this.lastEmitted) {
          this.lastEmitted = name;
          this.lockedPhase = p;
          this.onName(name);
        }
      }
    }
  }

  reset(): void {
    this.decoders.forEach((d) => d.reset());
    this.lockedPhase = -1;
    this.lastEmitted = "";
    this.lastChipSign.fill(0);
    this.bufIdx = 0;
  }
}

/**
 * A SampleReceiver that decodes RDS PS (station name) from FM broadcasts.
 *
 * Add to CompositeReceiver BEFORE the main Demodulator so the I/Q arrays
 * haven't been frequency-shifted yet. The receiver copies them internally.
 */
export class RdsReceiver {
  private stage1: DemodWBFMStage1;
  private lpfI: FIRFilter;
  private lpfQ: FIRFilter;
  private downsamplerI: RealDownsampler;
  private downsamplerQ: RealDownsampler;
  private phaseDecoderI: PhaseDecoder;
  private phaseDecoderQ: PhaseDecoder;
  private mixPhase = 0;
  private interRate: number;
  private readonly getFreqOffset: () => number;

  constructor(
    inRate: number,
    getFreqOffset: () => number,
    onStationName: (name: string) => void
  ) {
    this.getFreqOffset = getFreqOffset;
    this.interRate = Math.min(inRate, 336000);
    this.stage1 = new DemodWBFMStage1(inRate, this.interRate, {
      scheme: "WBFM",
      stereo: false,
    });
    this.lpfI = new FIRFilter(makeLowPassKernel(this.interRate, 3000, 101));
    this.lpfQ = new FIRFilter(makeLowPassKernel(this.interRate, 3000, 101));
    this.downsamplerI = new RealDownsampler(this.interRate, RDS_RATE, 101);
    this.downsamplerQ = new RealDownsampler(this.interRate, RDS_RATE, 101);
    this.phaseDecoderI = new PhaseDecoder(onStationName);
    this.phaseDecoderQ = new PhaseDecoder(onStationName);
  }

  setSampleRate(inRate: number): void {
    this.interRate = Math.min(inRate, 336000);
    this.stage1 = new DemodWBFMStage1(inRate, this.interRate, {
      scheme: "WBFM",
      stereo: false,
    });
    this.lpfI = new FIRFilter(makeLowPassKernel(this.interRate, 3000, 101));
    this.lpfQ = new FIRFilter(makeLowPassKernel(this.interRate, 3000, 101));
    this.downsamplerI = new RealDownsampler(this.interRate, RDS_RATE, 101);
    this.downsamplerQ = new RealDownsampler(this.interRate, RDS_RATE, 101);
    this.reset();
  }

  reset(): void {
    this.phaseDecoderI.reset();
    this.phaseDecoderQ.reset();
    this.mixPhase = 0;
  }

  receiveSamples(block: SampleBlock): void {
    // Copy I/Q so we don't corrupt data for subsequent receivers in the chain
    const I = block.I.slice();
    const Q = block.Q.slice();

    // FM demodulate to get the baseband signal (contains RDS at 57 kHz)
    const { left: baseband } = this.stage1.demodulate(I, Q, this.getFreqOffset());

    // Downconvert to quadrature so the decoder doesn't depend on an arbitrary
    // subcarrier phase match with the local oscillator.
    const mixedI = new Float32Array(baseband.length);
    const mixedQ = new Float32Array(baseband.length);
    const phaseStep = (2 * Math.PI * RDS_CARRIER) / this.interRate;
    let phase = this.mixPhase;
    for (let i = 0; i < baseband.length; i++) {
      mixedI[i] = baseband[i] * Math.cos(phase);
      mixedQ[i] = baseband[i] * -Math.sin(phase);
      phase += phaseStep;
      if (phase >= 2 * Math.PI) phase -= 2 * Math.PI;
    }
    this.mixPhase = phase;

    // LPF to keep only the RDS baseband (~±2.4 kHz)
    this.lpfI.inPlace(mixedI);
    this.lpfQ.inPlace(mixedQ);

    // Downsample to 9500 Hz (8× RDS bit rate)
    const dsI = this.downsamplerI.downsample(mixedI);
    const dsQ = this.downsamplerQ.downsample(mixedQ);

    // Feed samples to the phase-aligned bit decoder
    const sampleCount = Math.min(dsI.length, dsQ.length);
    for (let i = 0; i < sampleCount; i++) {
      this.phaseDecoderI.feed(dsI[i]);
      this.phaseDecoderQ.feed(dsQ[i]);
    }
  }
}
