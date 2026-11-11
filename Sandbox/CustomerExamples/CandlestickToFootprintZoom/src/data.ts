// Loads the sample file and builds what the chart draws:
//  - candles for any timeframe, from the 15s candles
//  - footprint cells (buy/sell volume per candle and price level), from the 15s x $1 volume grid
//
// In a real app the footprint aggregation would normally live on your server.

type SampleFile = {
  startTimeUtc: string;
  candleSeconds: number;
  candles: { i: number[]; o: number[]; h: number[]; l: number[]; c: number[]; v: number[] };
  footprint: { i: number[]; price: number[]; buy: number[]; sell: number[] };
};

export type Candles = {
  /** candle length in 15s steps (4 = 1 minute) */
  k: number;
  n: number;
  /** candle centre time, unix seconds */
  x: Float64Array;
  o: Float64Array;
  h: Float64Array;
  l: Float64Array;
  c: Float64Array;
};

/** cb = first 15s step of the candle, pb = bottom of the price level */
export type FootprintCell = { cb: number; pb: number; buy: number; sell: number };

export class OrderFlowData {
  readonly startS: number;
  readonly endS: number;
  readonly baseSeconds: number;
  private readonly raw: SampleFile;
  /** where each 15s step's rows start in the footprint arrays */
  private readonly rowStart: Int32Array;
  private readonly candleCache = new Map<number, Candles>();

  constructor(raw: SampleFile) {
    this.raw = raw;
    this.startS = Date.parse(raw.startTimeUtc) / 1000;
    this.baseSeconds = raw.candleSeconds;
    const steps = raw.candles.i[raw.candles.i.length - 1] + 1;
    this.endS = this.startS + steps * this.baseSeconds;

    const fi = raw.footprint.i;
    this.rowStart = new Int32Array(steps + 1);
    for (let i = 0, r = 0; i <= steps; i++) {
      while (r < fi.length && fi[r] < i) r++;
      this.rowStart[i] = r;
    }
  }

  static async load(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    return new OrderFlowData(await res.json());
  }

  get steps() {
    return this.rowStart.length - 1;
  }

  /** Candles made of k 15s steps each. */
  candles(k: number): Candles {
    const cached = this.candleCache.get(k);
    if (cached) return cached;
    const src = this.raw.candles;
    const size = Math.ceil(this.steps / k);
    const out: Candles = {
      k,
      n: 0,
      x: new Float64Array(size),
      o: new Float64Array(size),
      h: new Float64Array(size),
      l: new Float64Array(size),
      c: new Float64Array(size),
    };
    let j = -1;
    let current = -1;
    for (let r = 0; r < src.i.length; r++) {
      const first = Math.floor(src.i[r] / k) * k;
      if (first !== current) {
        current = first;
        j++;
        out.x[j] = this.startS + (first + k / 2) * this.baseSeconds;
        out.o[j] = src.o[r];
        out.h[j] = src.h[r];
        out.l[j] = src.l[r];
      } else {
        out.h[j] = Math.max(out.h[j], src.h[r]);
        out.l[j] = Math.min(out.l[j], src.l[r]);
      }
      out.c[j] = src.c[r];
    }
    out.n = j + 1;
    this.candleCache.set(k, out);
    return out;
  }

  /** Footprint cells for k-step candles and `bucket`-dollar price levels, between 15s steps from and to. */
  footprint(k: number, bucket: number, from: number, to: number): FootprintCell[] {
    const src = this.raw.footprint;
    from = Math.max(0, from);
    to = Math.min(this.steps - 1, to);
    const cells = new Map<number, FootprintCell>();
    for (let r = this.rowStart[from]; r < this.rowStart[to + 1]; r++) {
      const cb = Math.floor(src.i[r] / k) * k;
      const pb = Math.floor(src.price[r] / bucket) * bucket;
      const key = cb * 1e7 + pb;
      let cell = cells.get(key);
      if (!cell) cells.set(key, (cell = { cb, pb, buy: 0, sell: 0 }));
      cell.buy += src.buy[r];
      cell.sell += src.sell[r];
    }
    return [...cells.values()];
  }
}
