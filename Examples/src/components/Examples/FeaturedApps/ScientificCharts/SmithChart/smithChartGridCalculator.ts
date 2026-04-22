import { NumberRange } from "scichart/Core/NumberRange";

// ── Mutable runtime config (read by SmithGridCalculator.compute()) ────────────

export interface SmithGridConfig {
    majorPxThreshold: number; // min pixel radius for a major circle/arc
    minorPxThreshold: number; // min pixel radius for a minor circle/arc
    targetTicks: number; // target major count (evenly spaced in s-space)
    clipOffset: number; // the k in clipMajors[nClip - tier - k]; larger = shorter clips
    useCompactRange: boolean; // restrict lower R/G boundary to circles centred in viewport
    maxTiers: number; // 0 = auto (nClip − clipOffset); >0 hard cap on tier iterations
    minGapPx: number; // min pixel-radius gap between boundaries to allow subdivision
    _version: number; // incremented on every change; drives stale-check invalidation
}

export const smithGridConfig: SmithGridConfig = {
    majorPxThreshold: 15,
    minorPxThreshold: 5,
    targetTicks: 8,
    clipOffset: 1,
    useCompactRange: true,
    maxTiers: 0,
    minGapPx: 5,
    _version: 0,
};

/** Update one or more config fields and bump the version so caches invalidate. */
export function updateSmithGridConfig(patch: Partial<Omit<SmithGridConfig, "_version">>): void {
    Object.assign(smithGridConfig, patch);
    smithGridConfig._version++;
}

// ── Legacy constant exports (kept for external callers / tests) ───────────────

export const MAJOR_PX_THRESHOLD = 15;
export const MINOR_PX_THRESHOLD = 5;
export const TARGET_TICKS = 8;
export const GAP_ANGLE_RAD = (25 * Math.PI) / 180;
export const FALLBACK_TRIGGER = 4;

// ── Curated candidates (44 values, RF engineering convention) ────────────────

export const CURATED_CANDIDATES = [
    0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0, 2.5, 3.0, 4.0,
    5.0, 6.0, 7.0, 8.0, 9.0, 10, 12, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200,
];

// ── Pure-math helpers (all exported for testing) ─────────────────────────────

export function roundToNice(v: number): number {
    if (v <= 0) return v;
    const exp = Math.floor(Math.log10(v));
    const base = Math.pow(10, exp);
    const mant = v / base;
    let nice: number;
    if (mant < 1.5) nice = 1;
    else if (mant < 4.0) nice = 2;
    else if (mant < 9.0) nice = 5;
    else nice = 10;
    return nice * base;
}

export function pixelRadius(v: number, pixelPerUnit: number): number {
    return pixelPerUnit / (v + 1);
}

export function generateFallbackCandidates(xRange: NumberRange, pixelPerUnit: number): number[] {
    const denomMax = 1 - xRange.max;
    const rMax = denomMax > 0.001 ? Math.min((1 + xRange.max) / denomMax, 1000) : 1000;
    const rPixelCutoff = Math.max(0.001, pixelPerUnit / MINOR_PX_THRESHOLD - 1);
    if (rPixelCutoff >= rMax) return [];

    const sMin = 1 / (rMax + 1);
    const sMax = 1 / (rPixelCutoff + 1);
    const sStep = (sMax - sMin) / TARGET_TICKS;
    if (sStep <= 0) return [];

    const seen = new Set<number>();
    const result: number[] = [];
    for (let s = sMin + sStep / 2; s < sMax; s += sStep) {
        const r = 1 / s - 1;
        const nice = roundToNice(r);
        if (nice > 0 && !seen.has(nice)) {
            seen.add(nice);
            result.push(nice);
        }
    }
    return result.sort((a, b) => a - b);
}

export function buildCandidates(xRange: NumberRange, pixelPerUnit: number): number[] {
    const curatedPassing = CURATED_CANDIDATES.filter((v) => pixelRadius(v, pixelPerUnit) >= MINOR_PX_THRESHOLD);
    if (curatedPassing.length >= FALLBACK_TRIGGER) {
        return [...CURATED_CANDIDATES];
    }
    const fallback = generateFallbackCandidates(xRange, pixelPerUnit);
    const seen = new Set<number>(CURATED_CANDIDATES);
    const combined = CURATED_CANDIDATES.slice();
    for (const v of fallback) {
        if (!seen.has(v)) {
            seen.add(v);
            combined.push(v);
        }
    }
    return combined.sort((a, b) => a - b);
}

export function rCircleVisible(r: number, xRange: NumberRange, yRange: NumberRange): boolean {
    const xLeft = (r - 1) / (r + 1);
    const yHalf = 1 / (r + 1);
    return xLeft <= xRange.max && 1 >= xRange.min && -yHalf <= yRange.max && yHalf >= yRange.min;
}

export function gCircleVisible(g: number, xRange: NumberRange, yRange: NumberRange): boolean {
    const xRight = (1 - g) / (1 + g);
    const yHalf = 1 / (g + 1);
    return -1 <= xRange.max && xRight >= xRange.min && -yHalf <= yRange.max && yHalf >= yRange.min;
}

export function xArcVisible(absX: number, xRange: NumberRange, yRange: NumberRange): boolean {
    const rad = 1 / absX;
    return 1 - rad <= xRange.max && 1 + rad >= xRange.min && -2 * rad <= yRange.max && 2 * rad >= yRange.min;
}

export function bArcVisible(absB: number, xRange: NumberRange, yRange: NumberRange): boolean {
    const rad = 1 / absB;
    return -1 - rad <= xRange.max && -1 + rad >= xRange.min && -2 * rad <= yRange.max && 2 * rad >= yRange.min;
}

/** Kept as export for external callers; no longer used internally. */
export function computeClip(v: number, maxOther: number): number {
    const clip = (v + 1) / Math.tan(GAP_ANGLE_RAD / 2);
    return Math.min(clip, maxOther);
}

export function selectEvenlySpacedInS(candidates: number[], targetCount: number): number[] {
    if (candidates.length === 0) return [];
    if (candidates.length <= targetCount) return [...candidates];

    const sValues = candidates.map((v) => 1 / (v + 1));
    const sMin = Math.min(...sValues);
    const sMax = Math.max(...sValues);
    const step = (sMax - sMin) / (targetCount - 1);

    const selected: number[] = [];
    for (let i = 0; i < targetCount; i++) {
        const sTarget = sMin + i * step;
        let best = candidates[0];
        let bestDist = Math.abs(sValues[0] - sTarget);
        for (let j = 1; j < candidates.length; j++) {
            const d = Math.abs(sValues[j] - sTarget);
            if (d < bestDist) {
                bestDist = d;
                best = candidates[j];
            }
        }
        if (!selected.includes(best)) selected.push(best);
    }
    return selected.sort((a, b) => a - b);
}

// ── Viewport-derived visible-value max ──────────────────────────────────────

function visibleValueMax(xRange: NumberRange, isAdmittance: boolean, isXFamily: boolean): number {
    if (!isAdmittance && !isXFamily) {
        const d = 1 - xRange.max;
        return d > 0.001 ? (1 + xRange.max) / d : Infinity;
    }
    if (isAdmittance && !isXFamily) {
        const d = 1 + xRange.min;
        return d > 0.001 ? Math.max(0, (1 - xRange.min) / d) : Infinity;
    }
    if (!isAdmittance && isXFamily) {
        const d = 1 - xRange.max;
        return d > 0.001 ? 1 / d : Infinity;
    }
    const d = 1 + xRange.min;
    return d > 0.001 ? 1 / d : Infinity;
}

function syntheticMajorsForRange(
    visibleMax: number,
    targetCount: number,
    pixPerUnit: number,
    majorPxThreshold: number
): number[] {
    if (visibleMax <= 0 || !isFinite(visibleMax)) return [];
    const sMin = 1 / (visibleMax + 1);
    const sMax = 1.0;
    const step = (sMax - sMin) / targetCount;
    if (step <= 0) return [];
    const seen = new Set<number>();
    const result: number[] = [];
    for (let i = 0; i < targetCount; i++) {
        const s = sMin + (i + 0.5) * step;
        const v = 1 / s - 1;
        const nice = roundToNice(v);
        if (
            nice > 0 &&
            nice <= visibleMax * 1.1 &&
            !seen.has(nice) &&
            pixelRadius(nice, pixPerUnit) >= majorPxThreshold
        ) {
            seen.add(nice);
            result.push(nice);
        }
    }
    return result.sort((a, b) => a - b);
}

// ── Compact lower boundary ───────────────────────────────────────────────────

function compactLowerBound(
    xRange: NumberRange,
    _yRange: NumberRange,
    isAdmittance: boolean,
    isXFamily: boolean
): number {
    if (!smithGridConfig.useCompactRange || isXFamily) return 0;
    if (!isAdmittance) {
        const d = 1 - xRange.min;
        return d > 0.001 ? Math.max(0, xRange.min / d) : 0;
    } else {
        const d = 1 + xRange.max;
        return d > 0.001 ? Math.max(0, -xRange.max / d) : 0;
    }
}

// ── Tiered minor tick computation ────────────────────────────────────────────

function computeTieredMinors(
    candidates: number[],
    valueMajorsSorted: number[],
    clipMajorsSorted: number[],
    pixPerUnit: number,
    xRange: NumberRange,
    yRange: NumberRange,
    isAdmittance: boolean,
    isXFamily: boolean
): number[] {
    const result: number[] = [];
    const nClip = clipMajorsSorted.length;
    if (nClip === 0) return result;

    const cfg = smithGridConfig;
    const addedSet = new Set<number>(valueMajorsSorted);

    const compactLo = compactLowerBound(xRange, yRange, isAdmittance, isXFamily);

    let levelBoundaries = [compactLo, ...valueMajorsSorted.filter((v) => v > compactLo)];

    const autoMaxTiers = Math.max(1, nClip - cfg.clipOffset);
    const maxTiers = cfg.maxTiers > 0 ? Math.min(cfg.maxTiers, autoMaxTiers) : autoMaxTiers;

    for (let tier = 1; tier <= maxTiers; tier++) {
        const clipIdx = Math.max(0, nClip - tier - cfg.clipOffset);
        const clip = clipMajorsSorted[clipIdx];

        const tierValues: number[] = [];

        for (let i = 0; i + 1 < levelBoundaries.length; i++) {
            const lo = levelBoundaries[i];
            const hi = levelBoundaries[i + 1];

            const pixGap = pixelRadius(lo, pixPerUnit) - pixelRadius(hi, pixPerUnit);
            if (pixGap < cfg.minGapPx) continue;

            const sLo = 1 / (hi + 1);
            const sHi = 1 / (lo + 1);
            const sMid = (sLo + sHi) / 2;
            const vIdeal = 1 / sMid - 1;

            const inGap = candidates.filter(
                (v) => v > lo && v < hi && !addedSet.has(v) && pixelRadius(v, pixPerUnit) >= cfg.minorPxThreshold
            );

            let vBest: number | null = null;
            if (inGap.length > 0) {
                let bestDist = Infinity;
                for (const v of inGap) {
                    const d = Math.abs(1 / (v + 1) - sMid);
                    if (d < bestDist) {
                        bestDist = d;
                        vBest = v;
                    }
                }
            } else {
                if (vIdeal > lo && vIdeal < hi && pixelRadius(vIdeal, pixPerUnit) >= cfg.minorPxThreshold) {
                    vBest = vIdeal;
                }
            }

            if (vBest === null || addedSet.has(vBest)) continue;

            const isVisible = isXFamily
                ? isAdmittance
                    ? bArcVisible(vBest, xRange, yRange)
                    : xArcVisible(vBest, xRange, yRange)
                : isAdmittance
                ? gCircleVisible(vBest, xRange, yRange)
                : rCircleVisible(vBest, xRange, yRange);
            if (!isVisible) continue;

            result.push(vBest, clip);
            tierValues.push(vBest);
            addedSet.add(vBest);
        }

        if (tierValues.length === 0) break;
        levelBoundaries = [...levelBoundaries, ...tierValues].sort((a, b) => a - b);
    }

    return result;
}

// ── SmithGridCalculator ──────────────────────────────────────────────────────

export class SmithGridCalculator {
    private readonly _variant: "impedance" | "admittance";

    private _lastXMin = NaN;
    private _lastXMax = NaN;
    private _lastYMin = NaN;
    private _lastYMax = NaN;
    private _lastPixPerUnit = NaN;
    private _lastVersion = -1;

    private _rMajor: number[] = [];
    private _rMinor: number[] = [];
    private _xMajor: number[] = [];
    private _xMinor: number[] = [];

    constructor(variant: "impedance" | "admittance") {
        this._variant = variant;
    }

    get rMajor(): number[] {
        return this._rMajor;
    }
    get rMinor(): number[] {
        return this._rMinor;
    }
    get xMajor(): number[] {
        return this._xMajor;
    }
    get xMinor(): number[] {
        return this._xMinor;
    }

    compute(
        xRange: NumberRange,
        yRange: NumberRange,
        xCoordCalc: { getCoordWidth(v: number): number },
        _yCoordCalc: { getCoordWidth(v: number): number }
    ): void {
        const pixPerUnit = Math.abs(xCoordCalc.getCoordWidth(1));
        const cfg = smithGridConfig;

        if (
            this._lastXMin === xRange.min &&
            this._lastXMax === xRange.max &&
            this._lastYMin === yRange.min &&
            this._lastYMax === yRange.max &&
            this._lastPixPerUnit === pixPerUnit &&
            this._lastVersion === cfg._version
        )
            return;

        this._lastXMin = xRange.min;
        this._lastXMax = xRange.max;
        this._lastYMin = yRange.min;
        this._lastYMax = yRange.max;
        this._lastPixPerUnit = pixPerUnit;
        this._lastVersion = cfg._version;

        const isAdmittance = this._variant === "admittance";
        const candRange = isAdmittance ? new NumberRange(-xRange.max, -xRange.min) : xRange;
        const candidates = buildCandidates(candRange, pixPerUnit);

        // ── Majors ────────────────────────────────────────────────────────────
        let rMajorAll = candidates.filter((v) => {
            if (pixelRadius(v, pixPerUnit) < cfg.majorPxThreshold) return false;
            return isAdmittance ? gCircleVisible(v, xRange, yRange) : rCircleVisible(v, xRange, yRange);
        });
        if (rMajorAll.length < cfg.targetTicks) {
            const visMax = visibleValueMax(xRange, isAdmittance, false);
            const synthetic = syntheticMajorsForRange(visMax, cfg.targetTicks, pixPerUnit, cfg.majorPxThreshold);
            const rSet = new Set(rMajorAll);
            for (const v of synthetic) {
                const isVis = isAdmittance ? gCircleVisible(v, xRange, yRange) : rCircleVisible(v, xRange, yRange);
                if (!rSet.has(v) && isVis) {
                    rSet.add(v);
                    rMajorAll.push(v);
                }
            }
            rMajorAll.sort((a, b) => a - b);
        }
        this._rMajor = selectEvenlySpacedInS(rMajorAll, cfg.targetTicks);

        let xMajorAll = candidates.filter((v) => {
            if (pixelRadius(v, pixPerUnit) < cfg.majorPxThreshold) return false;
            return isAdmittance ? bArcVisible(v, xRange, yRange) : xArcVisible(v, xRange, yRange);
        });
        if (xMajorAll.length < cfg.targetTicks) {
            const visMax = visibleValueMax(xRange, isAdmittance, true);
            const synthetic = syntheticMajorsForRange(visMax, cfg.targetTicks, pixPerUnit, cfg.majorPxThreshold);
            const xSet = new Set(xMajorAll);
            for (const v of synthetic) {
                const isVis = isAdmittance ? bArcVisible(v, xRange, yRange) : xArcVisible(v, xRange, yRange);
                if (!xSet.has(v) && isVis) {
                    xSet.add(v);
                    xMajorAll.push(v);
                }
            }
            xMajorAll.sort((a, b) => a - b);
        }
        this._xMajor = selectEvenlySpacedInS(xMajorAll, cfg.targetTicks);

        const rMajorSorted = [...this._rMajor].sort((a, b) => a - b);
        const xMajorSorted = [...this._xMajor].sort((a, b) => a - b);

        // ── Tiered minors ──────────────────────────────────────────────────────
        this._rMinor = computeTieredMinors(
            candidates,
            rMajorSorted,
            xMajorSorted,
            pixPerUnit,
            xRange,
            yRange,
            isAdmittance,
            false
        );
        this._xMinor = computeTieredMinors(
            candidates,
            xMajorSorted,
            rMajorSorted,
            pixPerUnit,
            xRange,
            yRange,
            isAdmittance,
            true
        );
    }
}
