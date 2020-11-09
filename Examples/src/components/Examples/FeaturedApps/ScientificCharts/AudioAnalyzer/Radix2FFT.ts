/**
 * FFT implementation based on code from
 * http://stackoverflow.com/documentation/algorithm/8683/fast-fourier-transform/27088/radix-2-fft
 */

type TComplex = {
    re: number;
    im: number;
};

export class Radix2FFT {
    public readonly fftSize: number;

    private n: number;
    private m: number;
    private mm1: number;

    private x: TComplex[];
    private dft: TComplex[];
    private TwoPi_N: number;

    private WN: TComplex = { re: 0, im: 0 }; // Wn is the exponential weighting function in the form a + jb
    private TEMP: TComplex = { re: 0, im: 0 }; // TEMP is used to save computation in the butterfly calc

    constructor(n: number) {
        this.n = n;
        this.m = Math.round(Math.log(n) / Math.log(2));

        if (Math.pow(2, this.m) !== n) {
            throw new Error("n should be with power of 2");
        }

        this.fftSize = n / 2;
        this.TwoPi_N = (Math.PI * 2) / n; // constant to save computational time.  = 2*PI / N
        this.mm1 = this.m - 1;

        this.x = new Array<TComplex>(n);
        this.dft = new Array<TComplex>(n);

        for (let i = 0; i < n; i++) {
            this.x[i] = { re: 0, im: 0 };
            this.dft[i] = { re: 0, im: 0 };
        }
    }

    public run(input: number[]) {
        if (input.length !== this.n) {
            throw new Error("Length of the input array should match n");
        }

        // init input values
        for (let i = 0; i < this.n; i++) {
            const complex = this.x[i];
            complex.re = input[i];
            complex.im = 0;
        }

        // perform fft
        this.rad2FFT(this.x, this.dft);

        // set output
        const output = Array<number>(this.fftSize);
        for (let i = 0; i < this.fftSize; i++) {
            output[i] = this.calculateOutputValue(this.dft[i]);
        }

        return output;
    }

    private calculateOutputValue(complex: TComplex) {
        const magnitude = Math.sqrt(complex.re * complex.re + complex.im * complex.im);

        // convert to magnitude to dB
        return 20 * Math.log10(magnitude / this.n);
    }

    private rad2FFT(x: TComplex[], DFT: TComplex[]) {
        let BSep; // BSep is memory spacing between butterflies
        let BWidth; // BWidth is memory spacing of opposite ends of the butterfly
        let P; // P is number of similar Wn's to be used in that stage
        let iaddr; // bitmask for bit reversal
        let ii; // leteger bitfield for bit reversal (Decimation in Time)

        let DFTindex = 0; // Poleter to first elements in DFT array

        // Decimation In Time - x[n] sample sorting
        for (let i = 0; i < this.n; i++, DFTindex++) {
            const pX = x[i]; // Calculate current x[n] from index i.
            ii = 0; // Reset new address for DFT[n]
            iaddr = i; // Copy i for manipulations
            for (
                let l = 0;
                l < this.m;
                l++ // Bit reverse i and store in ii...
            ) {
                // tslint:disable-next-line:no-bitwise
                if ((iaddr & 0x01) !== 0) {
                    // Detemine least significant bit
                    // tslint:disable-next-line:no-bitwise
                    ii += 1 << (this.mm1 - l); // Increment ii by 2^(M-1-l) if lsb was 1
                }
                // tslint:disable-next-line:no-bitwise
                iaddr >>= 1; // right shift iaddr to test next bit. Use logical operations for speed increase
                if (iaddr === 0) {
                    break;
                }
            }

            const dft = DFT[ii]; // Calculate current DFT[n] from bit reversed index ii
            dft.re = pX.re; // Update the TComplex array with address sorted time domain signal x[n]
            dft.im = pX.im; // NB: Imaginary is always zero
        }

        // FFT Computation by butterfly calculation
        for (let stage = 1; stage <= this.m; stage++) {
            // Loop for M stages, where 2^M = N
            BSep = Math.pow(2, stage); // Separation between butterflies = 2^stage
            P = this.n / BSep; // Similar Wn's in this stage = N/Bsep
            BWidth = BSep / 2; // Butterfly width (spacing between opposite polets) = Separation / 2.

            for (let j = 0; j < BWidth; j++) {
                // Loop for j calculations per butterfly
                if (j !== 0) {
                    // Save on calculation if R = 0, as WN^0 = (1 + j0)
                    this.WN.re = Math.cos(this.TwoPi_N * P * j); // Calculate Wn (Real and Imaginary)
                    this.WN.im = -Math.sin(this.TwoPi_N * P * j);
                }

                // HiIndex is the index of the DFT array for the top value of each butterfly calc
                for (let HiIndex = j; HiIndex < this.n; HiIndex += BSep) {
                    // Loop for HiIndex Step BSep butterflies per stage
                    const pHi = DFT[HiIndex]; // Polet to higher value
                    const pLo = DFT[HiIndex + BWidth]; // Polet to lower value

                    if (j !== 0) {
                        // If exponential power is not zero...
                        // Perform TComplex multiplication of LoValue with Wn
                        this.TEMP.re = pLo.re * this.WN.re - pLo.im * this.WN.im;
                        this.TEMP.im = pLo.re * this.WN.im + pLo.im * this.WN.re;

                        // Find new LoValue (TComplex subtraction)
                        pLo.re = pHi.re - this.TEMP.re;
                        pLo.im = pHi.im - this.TEMP.im;

                        // Find new HiValue (TComplex addition)
                        pHi.re = pHi.re + this.TEMP.re;
                        pHi.im = pHi.im + this.TEMP.im;
                    } else {
                        this.TEMP.re = pLo.re;
                        this.TEMP.im = pLo.im;

                        // Find new LoValue (TComplex subtraction)
                        pLo.re = pHi.re - this.TEMP.re;
                        pLo.im = pHi.im - this.TEMP.im;

                        // Find new HiValue (TComplex addition)
                        pHi.re = pHi.re + this.TEMP.re;
                        pHi.im = pHi.im + this.TEMP.im;
                    }
                }
            }
        }
    }
}
