import { SciChartSurface, TSciChart, XyDataSeries, FastLineRenderableSeries } from "scichart";
import { GammaPoint, ChainStep, ComponentType, SmithState, SmithAction } from "./useSmithChart";

const ARC_STEPS = 100;

export function computeChainStep(
    fromGamma: GammaPoint,
    type: ComponentType,
    value: number,
    frequency: number,
    Z0: number
): { toGamma: GammaPoint; arcPoints: GammaPoint[] } {
    const omega = 2 * Math.PI * frequency;
    const { re: gr, im: gi } = fromGamma;

    // Γ → z = (1+Γ)/(1−Γ)
    const dz = (1 - gr) ** 2 + gi ** 2;
    const zr = dz > 1e-12 ? (1 - gr ** 2 - gi ** 2) / dz : 1e6;
    const zx = dz > 1e-12 ? (2 * gi) / dz : 0;

    // z → y = 1/z
    const zm2 = zr ** 2 + zx ** 2;
    const gy = zm2 > 1e-12 ? zr / zm2 : 1e6;
    const by = zm2 > 1e-12 ? -zx / zm2 : 0;

    if (type === "TL") {
        const rotAngle = -4 * Math.PI * value; // clockwise = negative
        const mag = Math.sqrt(gr ** 2 + gi ** 2);
        const startAngle = Math.atan2(gi, gr);
        const arcPoints: GammaPoint[] = [];
        for (let i = 0; i <= ARC_STEPS; i++) {
            const a = startAngle + (i / ARC_STEPS) * rotAngle;
            arcPoints.push({ re: mag * Math.cos(a), im: mag * Math.sin(a) });
        }
        const endAngle = startAngle + rotAngle;
        return { toGamma: { re: mag * Math.cos(endAngle), im: mag * Math.sin(endAngle) }, arcPoints };
    }

    if (type === "seriesL" || type === "seriesC" || type === "seriesR") {
        let dzx = 0,
            dzr = 0;
        if (type === "seriesL") dzx = (omega * value) / Z0;
        else if (type === "seriesC") dzx = -1 / (omega * value * Z0);
        else dzr = value / Z0;

        const arcPoints: GammaPoint[] = [];
        if (type === "seriesR") {
            for (let i = 0; i <= ARC_STEPS; i++) arcPoints.push(zToGamma(zr + (i / ARC_STEPS) * dzr, zx));
        } else {
            for (let i = 0; i <= ARC_STEPS; i++) arcPoints.push(zToGamma(zr, zx + (i / ARC_STEPS) * dzx));
        }
        return { toGamma: zToGamma(zr + dzr, zx + dzx), arcPoints };
    }

    // Shunt
    let dby = 0,
        dgy = 0;
    if (type === "shuntL") dby = -Z0 / (omega * value);
    else if (type === "shuntC") dby = omega * value * Z0;
    else dgy = Z0 / value;

    const arcPoints: GammaPoint[] = [];
    if (type === "shuntR") {
        for (let i = 0; i <= ARC_STEPS; i++) arcPoints.push(yToGamma(gy + (i / ARC_STEPS) * dgy, by));
    } else {
        for (let i = 0; i <= ARC_STEPS; i++) arcPoints.push(yToGamma(gy, by + (i / ARC_STEPS) * dby));
    }
    return { toGamma: yToGamma(gy + dgy, by + dby), arcPoints };
}

function zToGamma(zr: number, zx: number): GammaPoint {
    const d = (zr + 1) ** 2 + zx ** 2;
    if (d < 1e-12) return { re: 1, im: 0 };
    return { re: (zr ** 2 + zx ** 2 - 1) / d, im: (2 * zx) / d };
}

function yToGamma(gy: number, by: number): GammaPoint {
    const m2 = gy ** 2 + by ** 2;
    if (m2 < 1e-12) return { re: 1, im: 0 };
    return zToGamma(gy / m2, -by / m2);
}

// ── SmithChainAdapter ─────────────────────────────────────────────────────────

export const CHAIN_COLOURS = ["#FF8800", "#FF4488", "#88FF00", "#00FFFF", "#FF0088", "#FFFF00"];

export class SmithChainAdapter {
    private surface: SciChartSurface;
    private wasmContext: TSciChart;
    private stepSeries: Map<string, { ds: XyDataSeries; rs: FastLineRenderableSeries }> = new Map();
    private dispatch: (a: SmithAction) => void = () => {};
    readonly Z0 = 50;

    constructor(surface: SciChartSurface, wasmContext: TSciChart) {
        this.surface = surface;
        this.wasmContext = wasmContext;
    }

    setDispatch(d: (a: SmithAction) => void) {
        this.dispatch = d;
    }

    addStep(fromGamma: GammaPoint, type: ComponentType, value: number, frequency: number): void {
        const { toGamma, arcPoints } = computeChainStep(fromGamma, type, value, frequency, this.Z0);
        const step: ChainStep = {
            id: `step-${Date.now()}`,
            type,
            value,
            frequency,
            fromGamma,
            toGamma,
            arcPoints,
        };
        this.dispatch({ type: "ADD_CHAIN_STEP", step });
    }

    update(state: SmithState): void {
        for (const [id, { ds, rs }] of this.stepSeries) {
            if (!state.chain.find((s) => s.id === id)) {
                this.surface.renderableSeries.remove(rs);
                ds.delete();
                this.stepSeries.delete(id);
            }
        }
        state.chain.forEach((step, i) => {
            if (!this.stepSeries.has(step.id)) {
                const colour = CHAIN_COLOURS[i % CHAIN_COLOURS.length];
                const ds = new XyDataSeries(this.wasmContext);
                step.arcPoints.forEach((p) => ds.append(p.re, p.im));
                const rs = new FastLineRenderableSeries(this.wasmContext, {
                    dataSeries: ds,
                    stroke: colour,
                    strokeThickness: 2.5,
                });
                this.surface.renderableSeries.add(rs);
                this.stepSeries.set(step.id, { ds, rs });
            }
        });
    }

    getChainTip(state: SmithState): GammaPoint | null {
        if (state.chain.length > 0) return state.chain[state.chain.length - 1].toGamma;
        const startMarker = state.markers.find((m) => m.isChainStart);
        if (startMarker) return startMarker.gamma;
        if (state.chainStartGamma) return state.chainStartGamma;
        // Fall back: use the active marker as implicit chain start
        const active = state.markers.find((m) => m.id === state.activeMarkerId);
        return active?.gamma ?? null;
    }
}
