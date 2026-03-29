// ── Pure math helpers (exported for testing) ──────────────────────────────────

/** Returns the data-space centre and radius of the constant-R circle. */
export function rCircleParams(r: number): { cx: number; cy: number; rad: number } {
    return { cx: r / (1 + r), cy: 0, rad: 1 / (1 + r) };
}

/** Returns the data-space centre and radius of the constant-X arc circle. */
export function xArcCircleCenter(
    absX: number,
    isPositive: boolean
): { cx: number; cy: number; rad: number } {
    const rad = 1 / absX;
    return { cx: 1, cy: isPositive ? rad : -rad, rad };
}

/**
 * Returns start/end angles (radians, CCW in native Y-up space) for the
 * constant-X arc from the unit-circle intersection to the point (1, 0).
 * Always endAngle > startAngle (CCW sweep).
 */
export function xArcAngles(
    absX: number,
    isPositive: boolean
): { startAngle: number; endAngle: number } {
    const xv2 = absX * absX;
    const xInt = (xv2 - 1) / (1 + xv2);
    const yInt = isPositive ? (2 * absX) / (1 + xv2) : -(2 * absX) / (1 + xv2);
    const cy = isPositive ? 1 / absX : -1 / absX;

    const thetaToIntersection = Math.atan2(yInt - cy, xInt - 1);
    const thetaToOrigin = isPositive ? -Math.PI / 2 : Math.PI / 2;

    let startAngle: number;
    let endAngle: number;

    if (isPositive) {
        startAngle = thetaToIntersection;
        endAngle = thetaToOrigin;
        // Ensure counter-clockwise sweep: wrap endAngle if angle positions require it
        while (endAngle <= startAngle) endAngle += 2 * Math.PI;
    } else {
        startAngle = thetaToOrigin;
        endAngle = thetaToIntersection;
        // Ensure counter-clockwise sweep: wrap endAngle if angle positions require it
        while (endAngle <= startAngle) endAngle += 2 * Math.PI;
    }

    return { startAngle, endAngle };
}

/**
 * Computes the `height` parameter for ArcAnnotation, given chord endpoints
 * (x1,y1)→(x2,y2) and the circle centre (cx, cy).
 * Height = signed projection of (centre − chord-midpoint) onto the chord normal.
 */
export function arcHeightFromCenter(
    x1: number, y1: number,
    x2: number, y2: number,
    cx: number, cy: number
): number {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const diffX = x2 - x1;
    const diffY = y2 - y1;
    const len = Math.sqrt(diffX * diffX + diffY * diffY);
    const normalX = diffY / len;
    const normalY = -diffX / len;
    return (cx - midX) * normalX + (cy - midY) * normalY;
}

import { NumericAxis, TSciChart, Rect, DpiHelper } from "scichart";
import { WebGlRenderContext2D, ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { SCRTPen } from "scichart/types/TSciChart";
import {
    getArcParams,
    getVectorArcVertex,
    getArcVertex,
    getVectorColorVertex,
    getVertex,
} from "scichart/Charting/Visuals/Helpers/NativeObject";

// ── Tick Providers ────────────────────────────────────────────────────────────

/** Fixed R tick values. r=0 is the unit circle; negatives never appear on a Smith chart. */
export class SmithResistanceTickProvider {
    private readonly _major = [0, 0.2, 0.5, 1, 2, 5, 10, 20, 50];
    private readonly _minor = [0.1, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 1.2, 1.4, 1.6, 1.8, 3, 4];

    constructor(_opts: any) {}

    getMajorTicks(_a: number, _b: number, _r: any): number[] { return [...this._major]; }
    getMinorTicks(_a: number, _b: number, _r: any): number[] { return [...this._minor]; }
    attachedToAxis(_axis: any): void {}
    detachedFromAxis(): void {}
}

/** Fixed positive X tick values. The axis mirrors these for negative arcs. */
export class SmithReactanceTickProvider {
    private readonly _major = [0.2, 0.5, 1, 2, 5, 10, 20, 50];
    private readonly _minor = [0.1, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 1.2, 1.4, 1.6, 1.8, 3, 4];

    constructor(_opts: any) {}

    getMajorTicks(_a: number, _b: number, _r: any): number[] { return [...this._major]; }
    getMinorTicks(_a: number, _b: number, _r: any): number[] { return [...this._minor]; }
    attachedToAxis(_axis: any): void {}
    detachedFromAxis(): void {}
}

// ── SmithChartResistanceAxis (X axis) — draws constant-R circles ──────────────

export class SmithChartResistanceAxis extends NumericAxis {
    private sibling: SmithChartReactanceAxis | null = null;
    // Full R-value lists — stored here to bypass SciChart's visible-range tick filter
    private readonly _majorR = [0, 0.2, 0.5, 1, 2, 5, 10, 20, 50];
    private readonly _minorR = [0.1, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 1.2, 1.4, 1.6, 1.8, 3, 4];

    constructor(wasmContext: TSciChart, options?: object) {
        super(wasmContext, {
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            drawMajorBands: false,
            ...options,
        });
        this.tickProvider = new SmithResistanceTickProvider(wasmContext) as any;
    }

    override measure(): void {
        super.measure();
        this.sibling = (this.parentSurface?.yAxes?.get(0) as SmithChartReactanceAxis) ?? null;
        console.log(`[SmithR] measure() sibling=${!!this.sibling} isPrimary=${this.isPrimaryAxis} drawMajorGL=${this.drawMajorGridLines} drawMinorGL=${this.drawMinorGridLines}`);
    }

    protected override drawGridLines(
        renderContext: WebGlRenderContext2D,
        _tickCoords: number[],
        linesPen: SCRTPen,
        isMajor: boolean
    ): void {
        try {
        if (!this.sibling) { console.warn("[SmithR] no sibling"); return; }

        const wasmContext = this.webAssemblyContext2D;
        const xCalc = this.getCurrentCoordinateCalculator();
        const yCalc = this.sibling.getCurrentCoordinateCalculator();
        const vpHeight = this.parentSurface.renderSurface.viewportSize.height;
        const aspectRatio = xCalc.getCoordWidth(1) / yCalc.getCoordWidth(1);
        const clipRect = Rect.intersect(this.parentSurface.clipRect, this.parentSurface.seriesViewRect);
        const leftPad = (this.parentSurface.padding?.left ?? 0) * DpiHelper.PIXEL_RATIO;
        const topPad = (this.parentSurface.padding?.top ?? 0) * DpiHelper.PIXEL_RATIO;
        console.log(`[SmithR] drawGridLines isMajor=${isMajor} vpH=${vpHeight} ar=${aspectRatio.toFixed(3)} svr=${JSON.stringify(this.parentSurface.seriesViewRect)} lp=${leftPad} tp=${topPad}`);

        // Use our own R-value lists — not getTicksWithCoords() which filters against visibleRange
        const dataValues = isMajor ? this._majorR : this._minorR;

        const vecArcs = getVectorArcVertex(wasmContext);
        const arc = getArcVertex(wasmContext);

        for (const r of dataValues) {
            const { cx, cy, rad } = rCircleParams(r);
            const cx_px = xCalc.getCoordinate(cx);
            const cy_native = vpHeight - yCalc.getCoordinate(cy);
            const radius_px = Math.abs(xCalc.getCoordWidth(rad));

            const arcParams = getArcParams(
                wasmContext,
                cx_px, cy_native,
                0, 2 * Math.PI,
                radius_px, 0,
                1,
                aspectRatio,
                linesPen.m_fThickness
            );
            arc.MakeCircularArc(arcParams);
            vecArcs.push_back(arc);
        }

        if (vecArcs.size() > 0) {
            renderContext.drawArcs(vecArcs, 0, 0, 0, clipRect, linesPen, undefined, leftPad, topPad);
        }

        // Draw the horizontal real axis line once, on the major pass
        if (isMajor) {
            const vertices = getVectorColorVertex(wasmContext);
            const vertex = getVertex(wasmContext, 0, 0);

            vertex.SetPosition(xCalc.getCoordinate(-1), yCalc.getCoordinate(0));
            vertices.push_back(vertex);
            vertex.SetPosition(xCalc.getCoordinate(1), yCalc.getCoordinate(0));
            vertices.push_back(vertex);

            renderContext.drawLinesNative(vertices, linesPen, ELineDrawMode.DiscontinuousLine, clipRect, leftPad, topPad);
        }
        } catch (e) { console.error("[SmithR] drawGridLines threw:", e); }
    }
}

// ── SmithChartReactanceAxis (Y axis) — draws constant-X arcs ─────────────────

export class SmithChartReactanceAxis extends NumericAxis {
    private sibling: SmithChartResistanceAxis | null = null;
    // Full X-value lists — stored here to bypass SciChart's visible-range tick filter
    private readonly _majorX = [0.2, 0.5, 1, 2, 5, 10, 20, 50];
    private readonly _minorX = [0.1, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 1.2, 1.4, 1.6, 1.8, 3, 4];

    constructor(wasmContext: TSciChart, options?: object) {
        super(wasmContext, {
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            drawMajorBands: false,
            ...options,
        });
        this.tickProvider = new SmithReactanceTickProvider(wasmContext) as any;
    }

    override measure(): void {
        super.measure();
        this.sibling = (this.parentSurface?.xAxes?.get(0) as SmithChartResistanceAxis) ?? null;
        console.log(`[SmithX] measure() sibling=${!!this.sibling} isPrimary=${this.isPrimaryAxis} drawMajorGL=${this.drawMajorGridLines} drawMinorGL=${this.drawMinorGridLines}`);
    }

    protected override drawGridLines(
        renderContext: WebGlRenderContext2D,
        _tickCoords: number[],
        linesPen: SCRTPen,
        isMajor: boolean
    ): void {
        try {
        if (!this.sibling) { console.warn("[SmithX] no sibling"); return; }

        const wasmContext = this.webAssemblyContext2D;
        const xCalc = this.sibling.getCurrentCoordinateCalculator();
        const yCalc = this.getCurrentCoordinateCalculator();
        const vpHeight = this.parentSurface.renderSurface.viewportSize.height;
        const aspectRatio = xCalc.getCoordWidth(1) / yCalc.getCoordWidth(1);
        const clipRect = Rect.intersect(this.parentSurface.clipRect, this.parentSurface.seriesViewRect);
        const leftPad = (this.parentSurface.padding?.left ?? 0) * DpiHelper.PIXEL_RATIO;
        const topPad = (this.parentSurface.padding?.top ?? 0) * DpiHelper.PIXEL_RATIO;
        console.log(`[SmithX] drawGridLines isMajor=${isMajor} vpH=${vpHeight} ar=${aspectRatio.toFixed(3)}`);

        // Use our own X-value lists — not getTicksWithCoords() which filters against visibleRange
        const dataValues = isMajor ? this._majorX : this._minorX;

        const vecArcs = getVectorArcVertex(wasmContext);
        const arc = getArcVertex(wasmContext);

        for (const absX of dataValues) {
            // Positive X arc (upper half)
            const pos = xArcCircleCenter(absX, true);
            const posAngles = xArcAngles(absX, true);
            const pos_cx_px = xCalc.getCoordinate(pos.cx);
            const pos_cy_native = vpHeight - yCalc.getCoordinate(pos.cy);
            const pos_radius_px = Math.abs(xCalc.getCoordWidth(pos.rad));

            const posArcParams = getArcParams(
                wasmContext,
                pos_cx_px, pos_cy_native,
                posAngles.startAngle, posAngles.endAngle,
                pos_radius_px, 0,
                1, aspectRatio,
                linesPen.m_fThickness
            );
            arc.MakeCircularArc(posArcParams);
            vecArcs.push_back(arc);

            // Negative X arc (lower half, mirrored)
            const neg = xArcCircleCenter(absX, false);
            const negAngles = xArcAngles(absX, false);
            const neg_cx_px = xCalc.getCoordinate(neg.cx);
            const neg_cy_native = vpHeight - yCalc.getCoordinate(neg.cy);
            const neg_radius_px = Math.abs(xCalc.getCoordWidth(neg.rad));

            const negArcParams = getArcParams(
                wasmContext,
                neg_cx_px, neg_cy_native,
                negAngles.startAngle, negAngles.endAngle,
                neg_radius_px, 0,
                1, aspectRatio,
                linesPen.m_fThickness
            );
            arc.MakeCircularArc(negArcParams);
            vecArcs.push_back(arc);
        }

        if (vecArcs.size() > 0) {
            renderContext.drawArcs(vecArcs, 0, 0, 0, clipRect, linesPen, undefined, leftPad, topPad);
        }
        } catch (e) { console.error("[SmithX] drawGridLines threw:", e); }
    }
}
