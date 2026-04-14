// ── Pure math helpers (exported for testing) ──────────────────────────────────

/** Returns the data-space centre and radius of the constant-R circle. */
export function rCircleParams(r: number): { cx: number; cy: number; rad: number } {
    return { cx: r / (1 + r), cy: 0, rad: 1 / (1 + r) };
}

/** Returns the data-space centre and radius of the constant-X arc circle. */
export function xArcCircleCenter(absX: number, isPositive: boolean): { cx: number; cy: number; rad: number } {
    const rad = 1 / absX;
    return { cx: 1, cy: isPositive ? rad : -rad, rad };
}

/**
 * Returns start/end angles (radians, CCW in Y-up space) for the
 * constant-X arc clipped to the unit circle.
 * The arc runs from the unit-circle intersection to the point (1, 0).
 */
export function xArcAngles(absX: number, isPositive: boolean): { startAngle: number; endAngle: number } {
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
        while (endAngle <= startAngle) endAngle += 2 * Math.PI;
    } else {
        startAngle = thetaToOrigin;
        endAngle = thetaToIntersection;
        while (endAngle <= startAngle) endAngle += 2 * Math.PI;
    }

    return { startAngle, endAngle };
}

import { NumericAxis, TSciChart, Rect, DpiHelper } from "scichart";
import { SciChartSurfaceBase } from "scichart/Charting/Visuals/SciChartSurfaceBase";
import { drawRimTicks, getRimLabelOffset } from "./smithChartRim";
import { WebGlRenderContext2D, ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { SCRTPen } from "scichart/types/TSciChart";
import {
    getArcParams,
    getVectorArcVertex,
    getArcVertex,
    getVectorColorVertex,
    getVertex,
    getTextBounds,
    getVector4,
} from "scichart/Charting/Visuals/Helpers/NativeObject";
import { AxisRenderer } from "scichart/Charting/Visuals/Axis/AxisRenderer";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import { convertMultiLineAlignment } from "scichart/types/TextPosition";

// ── Tick Providers ────────────────────────────────────────────────────────────

/**
 * Minor ticks are encoded as flat pairs: [value, clipOtherValue, value, clipOtherValue, ...].
 *
 * The arc for a given `value` stops at the point where it intersects the OTHER family's arc
 * at `clipOtherValue`.  The gap distance is:
 *
 *   D = 2 / sqrt((R+1)² + X²)
 *
 * where (R, X) is the intersection of the constant-R circle and constant-X arc.
 * For a resistance-axis minor arc at R=r clipped to X=xClip:  D = 2/sqrt((r+1)²+xClip²)
 * For a reactance-axis minor arc at X=x clipped to R=rClip:   D = 2/sqrt((rClip+1)²+x²)
 *
 * Multiple tiers are interleaved in the same array using different clipOtherValue settings.
 * A smaller clipOtherValue → larger D → shorter arc → only visible for the bigger circles
 * (left side of chart), naturally creating denser coverage there.
 */
export class SmithResistanceTickProvider {
    private readonly _major = [0.2, 0.5, 1, 2, 5, 10, 20, 50];
    // Pairs: [r, xClip].  Tier 1 clips at X=5 (medium arcs); tier 2 clips at X=2 (shorter).
    private readonly _minor: number[] = [
        /* tier 1 – clip at X=5 */
        0.1, 5, 0.3, 5, 0.4, 5, 0.6, 5, 0.7, 5, 0.8, 5, 0.9, 5, 1.2, 5, 1.4, 5, 1.6, 5, 1.8, 5, 3, 5, 4, 5,
        /* tier 2 – clip at X=2 */
        0.05, 2, 0.15, 2, 0.25, 2, 0.35, 2, 0.45, 2, 0.55, 2, 0.65, 2, 0.75, 2, 0.85, 2, 0.95, 2, 1.1, 2, 1.3, 2, 1.5,
        2, 1.7, 2, 1.9, 2, 2.5, 2 /* tier 3 – clip at X=1 (midpoints of tier-2 step → 0.025 spacing, equal gaps) */,
        0.025, 1, 0.075, 1, 0.125, 1, 0.175, 1, 0.225, 1, 0.275, 1, 0.325, 1, 0.375, 1, 0.425, 1, 0.475, 1, 0.525, 1,
        0.575, 1, 0.625, 1, 0.675, 1, 0.725, 1, 0.775, 1, 0.825, 1, 0.875, 1, 0.925, 1, 0.975, 1, 1.25, 1,
    ];
    constructor(_opts: any) {}
    getMajorTicks(_a: number, _b: number, _r: any): number[] {
        return [...this._major];
    }
    getMinorTicks(_a: number, _b: number, _r: any): number[] {
        return [...this._minor];
    }
    attachedToAxis(_axis: any): void {}
    detachedFromAxis(): void {}
}

export class SmithReactanceTickProvider {
    private readonly _major = [0.2, 0.5, 1, 2, 5, 10, 20, 50];
    // Pairs: [x, rClip].  Same tier structure, symmetric with resistance.
    private readonly _minor: number[] = [
        /* tier 1 – clip at R=5 */
        0.1, 5, 0.3, 5, 0.4, 5, 0.6, 5, 0.7, 5, 0.8, 5, 0.9, 5, 1.2, 5, 1.4, 5, 1.6, 5, 1.8, 5, 3, 5, 4, 5,
        /* tier 2 – clip at R=2 */
        0.05, 2, 0.15, 2, 0.25, 2, 0.35, 2, 0.45, 2, 0.55, 2, 0.65, 2, 0.75, 2, 0.85, 2, 0.95, 2, 1.1, 2, 1.3, 2, 1.5,
        2, 1.7, 2, 1.9, 2, 2.5, 2 /* tier 3 – clip at R=1 (midpoints of tier-2 step → 0.025 spacing, equal gaps) */,
        0.025, 1, 0.075, 1, 0.125, 1, 0.175, 1, 0.225, 1, 0.275, 1, 0.325, 1, 0.375, 1, 0.425, 1, 0.475, 1, 0.525, 1,
        0.575, 1, 0.625, 1, 0.675, 1, 0.725, 1, 0.775, 1, 0.825, 1, 0.875, 1, 0.925, 1, 0.975, 1, 1.25, 1,
    ];
    constructor(_opts: any) {}
    getMajorTicks(_a: number, _b: number, _r: any): number[] {
        return [...this._major];
    }
    getMinorTicks(_a: number, _b: number, _r: any): number[] {
        return [...this._minor];
    }
    attachedToAxis(_axis: any): void {}
    detachedFromAxis(): void {}
}

// ── SmithChartAxisRenderer ────────────────────────────────────────────────────

/**
 * Draws Smith chart axis labels directly onto the series view rect.
 * Supports both the native-text (DrawStringAdvanced) and texture (drawTexture)
 * rendering paths, matching the pattern used by PolarAxisRenderer.
 */
class SmithChartAxisRenderer extends AxisRenderer {
    private readonly _isResistanceAxis: boolean;

    constructor(wasmContext: TSciChart, isResistanceAxis: boolean) {
        super(wasmContext);
        this._isResistanceAxis = isResistanceAxis;
    }

    /** No axis margin needed — labels are drawn inside the series view rect. */
    public override measure(
        _isHorizontalAxis: boolean,
        _labelStyle: any,
        _majorTickLabels: string[],
        _ticksSize: number,
        _labelProvider: any,
        _drawLabels: boolean,
        _drawTicks: boolean,
        _labelInfos?: any[]
    ): void {
        (this as any).desiredHeight = 0;
        (this as any).desiredWidth = 0;
        (this as any).desiredTicksSize = 0;
    }

    public override drawLabels(
        renderContext: WebGlRenderContext2D,
        _axisAlignment: any,
        _isInnerAxis: any,
        _tickLabels: any,
        _tickCoords: any,
        _axisOffset: any,
        labelStyle: any,
        _isVerticalChart: any,
        _isFlippedCoordinates: any,
        labelProvider: any,
        _labelInfos?: any
    ): void {
        const axis = (this as any).parentAxis;
        const surface = axis?.parentSurface;
        if (!surface) return;

        const svr: Rect = surface.seriesViewRect;
        renderContext.resetAndClip(svr);

        const xCalc = surface.xAxes.get(0).getCurrentCoordinateCalculator();
        const yCalc = surface.yAxes.get(0).getCurrentCoordinateCalculator();

        // ── Set up rendering paths (mirrors PolarAxisRenderer pattern) ─────────
        const { multilineAlignment } = labelStyle;
        const textColor = parseColorToUIntArgb(labelStyle.color);
        const wasmCtx = (this as any).webAssemblyContext;

        const nativeFont = labelProvider.useNativeText ? renderContext.getFont(labelStyle, true) : null;
        const textBounds = nativeFont ? getTextBounds(wasmCtx) : null;
        // convertMultiLineAlignment called unconditionally, as in PolarAxisRenderer
        const mlaNative = convertMultiLineAlignment(multilineAlignment, wasmCtx);
        const nativeLineSpacing = labelProvider.lineSpacing;
        const lineHeight = this.calculateLineHightForNativeFont(nativeFont, textBounds);

        /**
         * Draw one label at SVR-relative pixel position (px, py), offset so the
         * label sits outside the curve at outwardAngle (standard math CCW, Y-up).
         *
         * Mirrors the PolarAxisRenderer horizontal-mode cardinal/non-cardinal logic:
         *   cos(angle) < 0  → right-align  (label to the left of the point)
         *   sin(angle) > 0  → bottom-align (label above the point, screen-Y is down)
         * Cardinal angles get centred on the appropriate axis instead.
         */
        const drawLabel = (text: string, px: number, py: number, outwardAngle: number) => {
            try {
                if (nativeFont) {
                    nativeFont.CalculateStringBounds(text, textBounds, nativeLineSpacing);
                    const w = textBounds.m_fWidth;
                    const h = textBounds.m_fHeight;
                    const { dx, dy } = SmithChartAxisRenderer._positionLabel(w, h, outwardAngle);
                    const tx = Math.round(px + svr.left + dx);
                    const ty = Math.round(py + svr.top + dy);
                    nativeFont.DrawStringAdvanced(
                        text,
                        textColor,
                        tx,
                        ty + lineHeight,
                        getVector4(wasmCtx, tx, ty + lineHeight, 0, 0),
                        mlaNative,
                        nativeLineSpacing
                    );
                } else {
                    const {
                        bitmapTexture,
                        textureWidth: w,
                        textureHeight: h,
                    } = labelProvider.getCachedLabelTexture(text, this.textureManager, labelStyle);
                    if (!bitmapTexture) return;
                    const { dx, dy } = SmithChartAxisRenderer._positionLabel(w, h, outwardAngle);
                    const tx = Math.round(px + svr.left + dx);
                    const ty = Math.round(py + svr.top + dy);
                    renderContext.drawTexture(bitmapTexture, tx, ty, w, h);
                    if (!labelProvider.useCache) bitmapTexture.delete();
                }
            } catch (_err) {
                // WebGL context lost — clear label cache so it rebuilds next frame
                labelProvider.delete?.();
            }
        };

        const tp = axis?.tickProvider as any;
        const majorTicks: number[] = tp?.getMajorTicks(0, 0, null) ?? [];

        if (this._isResistanceAxis) {
            drawLabel("0", xCalc.getCoordinate(-1), yCalc.getCoordinate(0), Math.PI);
            for (const r of majorTicks) {
                const { cx, rad } = rCircleParams(r);
                const text = r >= 1 ? r.toString() : r.toFixed(1);
                drawLabel(text, xCalc.getCoordinate(cx - rad), yCalc.getCoordinate(0), Math.PI / 2);
            }

            // Rim labels (angle-of-Γ ring)
            const rAxis = axis as SmithChartResistanceAxis;
            for (const lbl of rAxis._pendingRimLabels ?? []) {
                // lbl.px and lbl.py are already in absolute pixel coords
                // Convert to SVR-relative before drawing
                const approxW = 32;
                const approxH = 12;
                const o = getRimLabelOffset(lbl.angleDeg, approxW, approxH);
                drawLabel(lbl.text, lbl.px - svr.left + o.dx, lbl.py - svr.top + o.dy, lbl.angleDeg);
            }
        } else {
            for (const x of majorTicks) {
                const xv2 = x * x;
                const lx = (xv2 - 1) / (1 + xv2);
                const ly = (2 * x) / (1 + xv2);
                const label = x >= 1 ? x.toString() : x.toFixed(1);
                drawLabel(`+${label}`, xCalc.getCoordinate(lx), yCalc.getCoordinate(ly), Math.atan2(ly, lx));
                drawLabel(`-${label}`, xCalc.getCoordinate(lx), yCalc.getCoordinate(-ly), Math.atan2(-ly, lx));
            }
        }

        if (nativeFont) nativeFont.End();
    }

    /**
     * Computes the pixel offset (dx, dy) for a label of size (w × h) placed at
     * an anchor point, given the outward direction angle in standard math
     * convention (CCW, Y-up).
     *
     * Directly mirrors PolarAxisRenderer's horizontal-mode positioning:
     *   • Non-cardinal: cos<0 → right-align; sin>0 (Y-up upper half) → bottom-align (above in screen)
     *   • Cardinal (~0°/90°/180°/270°): centred on the relevant axis
     *
     * A small GAP pushes the label slightly outward so it doesn't sit flush
     * against the curve.
     */
    private static _positionLabel(w: number, h: number, angleRad: number): { dx: number; dy: number } {
        const GAP = 4;
        const CARDINAL_DEG = 10; // ±10° around each 90° boundary is treated as cardinal

        const aDeg = Math.round((angleRad * 180) / Math.PI);
        const absModDeg = Math.abs(aDeg) % 90;
        const isCardinal = absModDeg < CARDINAL_DEG || absModDeg > 90 - CARDINAL_DEG;
        // quadrant index 0–3: 0 = ~0° (right), 1 = ~90° (top), 2 = ~180° (left), 3 = ~270° (bottom)
        const quadrant = ((((aDeg + CARDINAL_DEG) / 90) % 4) + 4) % 4;

        let dx = 0;
        let dy = 0;

        if (isCardinal) {
            if (quadrant < 1) {
                // ~0° right: left-align, centre vertically
                dy = -h / 2;
            } else if (quadrant < 2) {
                // ~90° top: centre horizontally, bottom-align (above)
                dx = -w / 2;
                dy = -h;
            } else if (quadrant < 3) {
                // ~180° left: right-align, centre vertically
                dx = -w;
                dy = -h / 2;
            } else {
                // ~270° bottom: centre horizontally, top-align (below)
                dx = -w / 2;
            }
        } else {
            // cos < 0 means the outward direction points left → right-align so text extends leftward
            if (Math.cos(angleRad) < 0) dx = -w;
            // sin > 0 in Y-up math means upper half → label sits above the point in screen (Y-down)
            if (Math.sin(angleRad) > 0) dy = -h;
        }

        // Nudge the label slightly outward (screen Y is inverted relative to math Y)
        dx += GAP * Math.cos(angleRad);
        dy -= GAP * Math.sin(angleRad);

        return { dx, dy };
    }
}

// ── SmithChartResistanceAxis (X axis) — draws constant-R circles ──────────────

export class SmithChartResistanceAxis extends NumericAxis {
    private sibling: SmithChartReactanceAxis | null = null;
    public _pendingRimLabels: { text: string; px: number; py: number; angleDeg: number }[] = [];

    constructor(wasmContext: TSciChart, options?: object) {
        super(wasmContext, {
            drawLabels: true,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            drawMajorBands: false,
            zoomExtentsToInitialRange: true,
            ...options,
        });
        this.tickProvider = new SmithResistanceTickProvider(wasmContext) as any;
        this.axisRenderer = new SmithChartAxisRenderer(wasmContext, true);
    }

    override measure(): void {
        super.measure();
        this.sibling = (this.parentSurface?.yAxes?.get(0) as SmithChartReactanceAxis) ?? null;
    }

    protected override drawGridLines(
        renderContext: WebGlRenderContext2D,
        _tickCoords: number[],
        linesPen: SCRTPen,
        isMajor: boolean
    ): void {
        if (!this.sibling) return;

        const wasmContext = this.webAssemblyContext2D;
        const xCalc = this.getCurrentCoordinateCalculator();
        const yCalc = this.sibling.getCurrentCoordinateCalculator();
        // Use master canvas height so the y-flip matches the C++ matTransform.
        // viewportSize tracks the visible (target) canvas which shrinks on resize;
        // the master WebGL canvas only grows, and SCRTSetMainWindowSize uses its height.
        const vpHeight =
            SciChartSurfaceBase.domMasterCanvas?.height ?? this.parentSurface.renderSurface.viewportSize.height;
        const clipRect = Rect.intersect(this.parentSurface.clipRect, this.parentSurface.seriesViewRect);
        const leftPad = (this.parentSurface.padding?.left ?? 0) * DpiHelper.PIXEL_RATIO;
        const topPad = (this.parentSurface.padding?.top ?? 0) * DpiHelper.PIXEL_RATIO;

        const aspectRatio = Math.abs(xCalc.getCoordWidth(1)) / Math.abs(yCalc.getCoordWidth(1));
        const tp = this.tickProvider as any;

        const vecArcs = getVectorArcVertex(wasmContext);
        const arc = getArcVertex(wasmContext);

        // gapDistance = 2/sqrt((r+1)²+xClip²) — exact distance from (1,0) to intersection
        // of the R=r circle and X=xClip arc.  arcGap = 2·arcsin(gapDistance / (2·rad)).
        const drawArc = (r: number, gapDistance: number) => {
            const { cx, cy, rad } = rCircleParams(r);
            const sinHalfGap = gapDistance / (2 * rad);
            if (sinHalfGap >= 1) return;
            const arcGap = sinHalfGap > 0 ? 2 * Math.asin(sinHalfGap) : 0;
            const cx_px = xCalc.getCoordinate(cx);
            const cy_native = vpHeight - yCalc.getCoordinate(cy);
            const radius_px = Math.abs(xCalc.getCoordWidth(rad));
            const arcParams = getArcParams(
                wasmContext,
                cx_px,
                cy_native,
                arcGap,
                2 * Math.PI - arcGap,
                radius_px,
                0,
                1,
                aspectRatio,
                linesPen.m_fThickness
            );
            arc.MakeCircularArc(arcParams);
            vecArcs.push_back(arc);
        };

        if (isMajor) {
            for (const r of tp.getMajorTicks(0, 0, null) as number[]) {
                drawArc(r, 0); // full circles
            }
        } else {
            // Minor ticks are encoded as flat pairs [r, xClip, r, xClip, ...]
            const minor = tp.getMinorTicks(0, 0, null) as number[];
            for (let i = 0; i + 1 < minor.length; i += 2) {
                const r = minor[i];
                const xClip = minor[i + 1];
                drawArc(r, 2 / Math.sqrt((r + 1) * (r + 1) + xClip * xClip));
            }
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

            renderContext.drawLinesNative(
                vertices,
                linesPen,
                ELineDrawMode.DiscontinuousLine,
                clipRect,
                leftPad,
                topPad
            );

            // Unit circle as hardware arc (radius=1, centre=(0,0))
            const ucVec = getVectorArcVertex(wasmContext);
            const ucArc = getArcVertex(wasmContext);
            const ucx_px = xCalc.getCoordinate(0);
            const ucy_native = vpHeight - yCalc.getCoordinate(0);
            const urad_px = Math.abs(xCalc.getCoordWidth(1));
            const ucParams = getArcParams(
                wasmContext,
                ucx_px,
                ucy_native,
                0,
                2 * Math.PI,
                urad_px,
                0,
                1,
                aspectRatio,
                linesPen.m_fThickness * 2
            );
            ucArc.MakeCircularArc(ucParams);
            ucVec.push_back(ucArc);
            renderContext.drawArcs(ucVec, 0, 0, 0, clipRect, linesPen, undefined, leftPad, topPad);

            // Angle-of-Γ rim ring ticks + labels
            this._pendingRimLabels = [];
            drawRimTicks(
                renderContext,
                xCalc,
                yCalc,
                wasmContext,
                linesPen,
                clipRect,
                leftPad,
                topPad,
                (text, px, py, angleDeg) => {
                    this._pendingRimLabels.push({ text, px, py, angleDeg });
                }
            );
        }
    }
}

// ── SmithChartReactanceAxis (Y axis) — draws constant-X arcs ─────────────────

export class SmithChartReactanceAxis extends NumericAxis {
    private sibling: SmithChartResistanceAxis | null = null;

    constructor(wasmContext: TSciChart, options?: object) {
        super(wasmContext, {
            drawLabels: true,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            drawMajorBands: false,
            zoomExtentsToInitialRange: true,
            ...options,
        });
        this.tickProvider = new SmithReactanceTickProvider(wasmContext) as any;
        this.axisRenderer = new SmithChartAxisRenderer(wasmContext, false);
    }

    override measure(): void {
        super.measure();
        this.sibling = (this.parentSurface?.xAxes?.get(0) as SmithChartResistanceAxis) ?? null;
    }

    protected override drawGridLines(
        renderContext: WebGlRenderContext2D,
        _tickCoords: number[],
        linesPen: SCRTPen,
        isMajor: boolean
    ): void {
        if (!this.sibling) return;

        const wasmContext = this.webAssemblyContext2D;
        const xCalc = this.sibling.getCurrentCoordinateCalculator();
        const yCalc = this.getCurrentCoordinateCalculator();
        // Use master canvas height so the y-flip matches the C++ matTransform.
        // viewportSize tracks the visible (target) canvas which shrinks on resize;
        // the master WebGL canvas only grows, and SCRTSetMainWindowSize uses its height.
        const vpHeight =
            SciChartSurfaceBase.domMasterCanvas?.height ?? this.parentSurface.renderSurface.viewportSize.height;
        const svr = this.parentSurface.seriesViewRect;
        const clipRect = Rect.intersect(this.parentSurface.clipRect, svr);
        const leftPad = (this.parentSurface.padding?.left ?? 0) * DpiHelper.PIXEL_RATIO;
        const topPad = (this.parentSurface.padding?.top ?? 0) * DpiHelper.PIXEL_RATIO;

        const aspectRatio = Math.abs(xCalc.getCoordWidth(1)) / Math.abs(yCalc.getCoordWidth(1));
        const tp = this.tickProvider as any;

        const vecArcs = getVectorArcVertex(wasmContext);
        const arc = getArcVertex(wasmContext);

        // gapDistance = 2/sqrt((rClip+1)²+x²) — exact distance from (1,0) to intersection
        // of R=rClip circle and X=x arc.  Uses the same formula as the resistance axis.
        // Positive-X arcs end near (1,0) → clip the end; negative-X arcs clip the start.
        const drawArc = (absX: number, gapDistance: number) => {
            const pos = xArcCircleCenter(absX, true);
            const posAngles = xArcAngles(absX, true);
            const posStart = posAngles.startAngle;
            let posEnd = posAngles.endAngle;

            const neg = xArcCircleCenter(absX, false);
            const negAngles = xArcAngles(absX, false);
            let negStart = negAngles.startAngle;
            const negEnd = negAngles.endAngle;

            if (gapDistance > 0) {
                const sinHalfGap = gapDistance / (2 * pos.rad);
                if (sinHalfGap >= 1) return;
                const arcGap = 2 * Math.asin(sinHalfGap);
                posEnd -= arcGap;
                negStart += arcGap;
                if (posEnd <= posStart || negEnd <= negStart) return;
            }

            const pos_cx_px = xCalc.getCoordinate(pos.cx);
            const pos_cy_native = vpHeight - yCalc.getCoordinate(pos.cy);
            const pos_radius_px = Math.abs(xCalc.getCoordWidth(pos.rad));
            arc.MakeCircularArc(
                getArcParams(
                    wasmContext,
                    pos_cx_px,
                    pos_cy_native,
                    posStart,
                    posEnd,
                    pos_radius_px,
                    0,
                    1,
                    aspectRatio,
                    linesPen.m_fThickness
                )
            );
            vecArcs.push_back(arc);

            const neg_cx_px = xCalc.getCoordinate(neg.cx);
            const neg_cy_native = vpHeight - yCalc.getCoordinate(neg.cy);
            const neg_radius_px = Math.abs(xCalc.getCoordWidth(neg.rad));
            arc.MakeCircularArc(
                getArcParams(
                    wasmContext,
                    neg_cx_px,
                    neg_cy_native,
                    negStart,
                    negEnd,
                    neg_radius_px,
                    0,
                    1,
                    aspectRatio,
                    linesPen.m_fThickness
                )
            );
            vecArcs.push_back(arc);
        };

        if (isMajor) {
            for (const x of tp.getMajorTicks(0, 0, null) as number[]) {
                drawArc(x, 0); // full arcs
            }
        } else {
            // Minor ticks are encoded as flat pairs [x, rClip, x, rClip, ...]
            const minor = tp.getMinorTicks(0, 0, null) as number[];
            for (let i = 0; i + 1 < minor.length; i += 2) {
                const x = minor[i];
                const rClip = minor[i + 1];
                drawArc(x, 2 / Math.sqrt((rClip + 1) * (rClip + 1) + x * x));
            }
        }

        if (vecArcs.size() > 0) {
            renderContext.drawArcs(vecArcs, 0, 0, 0, clipRect, linesPen, undefined, leftPad, topPad);
        }
    }
}
