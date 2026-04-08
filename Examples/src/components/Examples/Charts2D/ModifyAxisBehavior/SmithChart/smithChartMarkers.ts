import { GammaPoint } from "./useSmithChart";

export type MarkerReadout = {
    gammaMag: number;
    gammaAngleDeg: number;
    zr: number;
    zx: number;
    gy: number;
    by: number;
    vswr: number;
    returnLoss: number;
    mismatchLoss: number;
    q: number;
    wtg: number;
    wtl: number;
};

export function computeReadouts(gamma: GammaPoint): MarkerReadout {
    const { re, im } = gamma;
    const gammaMag = Math.sqrt(re * re + im * im);
    const gammaAngleDeg = (Math.atan2(im, re) * 180) / Math.PI;

    // Z = (1+Γ)/(1−Γ)
    const denom = (1 - re) * (1 - re) + im * im;
    const zr = denom > 1e-10 ? (1 - re * re - im * im) / denom : Infinity;
    const zx = denom > 1e-10 ? (2 * im) / denom : Infinity;

    // Y = 1/Z
    const zMagSq = zr * zr + zx * zx;
    const gy = zMagSq > 1e-10 ? zr / zMagSq : Infinity;
    const by = zMagSq > 1e-10 ? -zx / zMagSq : Infinity;

    const vswr = gammaMag < 1 - 1e-10 ? (1 + gammaMag) / (1 - gammaMag) : Infinity;
    const returnLoss = gammaMag > 1e-10 ? -20 * Math.log10(gammaMag) : Infinity;
    const mismatchLoss = gammaMag < 1 - 1e-10 ? -10 * Math.log10(1 - gammaMag * gammaMag) : Infinity;
    const q = isFinite(zr) && zr > 1e-10 ? Math.abs(zx) / zr : Infinity;

    // WTG: (π − ∠Γ_rad) / (4π) mod 0.5
    const gammaAngleRad = Math.atan2(im, re);
    let wtg = ((Math.PI - gammaAngleRad) / (4 * Math.PI)) % 0.5;
    if (wtg < 0) wtg += 0.5;
    const wtl = 0.5 - wtg;

    return {
        gammaMag,
        gammaAngleDeg,
        zr,
        zx,
        gy,
        by,
        vswr,
        returnLoss,
        mismatchLoss,
        q,
        wtg,
        wtl,
    };
}
