import { NumericAxis, TSciChart, Rect, DpiHelper } from "scichart";
import { SciChartSurfaceBase } from "scichart/Charting/Visuals/SciChartSurfaceBase";
import { WebGlRenderContext2D, ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { SCRTPen } from "scichart/types/TSciChart";
import {
    getArcParams,
    getVectorArcVertex,
    getArcVertex,
    getVectorColorVertex,
    getVertex,
} from "scichart/Charting/Visuals/Helpers/NativeObject";
import { TickProvider } from "scichart/Charting/Numerics/TickProviders/TickProvider";
import { NumberRange } from "scichart/Core/NumberRange";
import { SmithGridCalculator } from "./smithChartGridCalculator";
import { SmithChartAxisRenderer } from "./smithChartAxes";

const FALLBACK_ADMITTANCE_MAJOR = [0.2, 0.5, 1, 2, 5, 10, 20, 50];

export class SmithAdmittanceGTickProvider extends TickProvider {
    constructor(_wasmContext: TSciChart) {
        super();
    }

    getMajorTicks(_minorDelta: number, _majorDelta: number, _visibleRange: NumberRange): number[] {
        return this._runCompute()?.rMajor ?? FALLBACK_ADMITTANCE_MAJOR;
    }

    getMinorTicks(_minorDelta: number, _majorDelta: number, _visibleRange: NumberRange): number[] {
        return this._runCompute()?.rMinor ?? [];
    }

    private _runCompute(): SmithGridCalculator | null {
        const gAxis = this.parentAxis as SmithChartAdmittanceResistanceAxis | undefined;
        if (!gAxis?.gridCalculator) return null;
        const surface = (gAxis as any).parentSurface;
        if (!surface) return null;
        const xRange: NumberRange = gAxis.visibleRange;
        const bAxis = surface.yAxes?.get(1);
        const yRange: NumberRange = bAxis?.visibleRange ?? xRange;
        const xCalc = gAxis.getCurrentCoordinateCalculator();
        const yCalc = bAxis?.getCurrentCoordinateCalculator() ?? xCalc;
        gAxis.gridCalculator.compute(xRange, yRange, xCalc, yCalc);
        return gAxis.gridCalculator;
    }
}

export class SmithAdmittanceBTickProvider extends TickProvider {
    constructor(_wasmContext: TSciChart) {
        super();
    }

    getMajorTicks(_minorDelta: number, _majorDelta: number, _visibleRange: NumberRange): number[] {
        return this._runCompute()?.xMajor ?? FALLBACK_ADMITTANCE_MAJOR;
    }

    getMinorTicks(_minorDelta: number, _majorDelta: number, _visibleRange: NumberRange): number[] {
        return this._runCompute()?.xMinor ?? [];
    }

    private _runCompute(): SmithGridCalculator | null {
        const bAxis = this.parentAxis;
        if (!bAxis) return null;
        // parentSurface is on AxisBase2D, not AxisCore (TickProvider's parentAxis type) — cast required
        const surface = (bAxis as any).parentSurface;
        if (!surface) return null;
        // Admittance G-axis is at xAxes[1] — Z axes register first in drawExample.ts
        const gAxis = surface.xAxes?.get(1) as SmithChartAdmittanceResistanceAxis | undefined;
        if (!gAxis?.gridCalculator) return null;
        const xRange: NumberRange = gAxis.visibleRange;
        const yRange: NumberRange = bAxis.visibleRange;
        const xCalc = gAxis.getCurrentCoordinateCalculator();
        const yCalc = bAxis.getCurrentCoordinateCalculator();
        gAxis.gridCalculator.compute(xRange, yRange, xCalc, yCalc);
        return gAxis.gridCalculator;
    }
}

// ── Admittance resistance axis (constant-G circles) ──────────────────────────
// Mirror of constant-R: centre = (-g/(1+g), 0), radius = 1/(1+g)

export class SmithChartAdmittanceResistanceAxis extends NumericAxis {
    private sibling: SmithChartAdmittanceReactanceAxis | null = null;
    public readonly gridCalculator = new SmithGridCalculator("admittance");

    constructor(wasmContext: TSciChart, options?: object) {
        super(wasmContext, {
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            drawMajorBands: false,
            zoomExtentsToInitialRange: true,
            ...options,
        });
        this.tickProvider = new SmithAdmittanceGTickProvider(wasmContext);
        this.axisRenderer = new SmithChartAxisRenderer(wasmContext, true, true);
    }

    // SciChart only draws grid lines for isPrimaryAxis axes. Admittance axes are
    // always secondary (Z axes attach first). Override getter so this axis
    // participates in grid drawing whenever it is visible, without disturbing
    // the Z axis isPrimaryAxis state.
    override get isPrimaryAxis(): boolean {
        return this.isVisible;
    }
    override set isPrimaryAxis(_: boolean) {
        // Suppress: visibility-based participation is managed by the getter above.
    }

    override measure(): void {
        super.measure();
        this.sibling = (this.parentSurface?.yAxes?.get(1) as SmithChartAdmittanceReactanceAxis) ?? null;
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
        const vpHeight =
            SciChartSurfaceBase.domMasterCanvas?.height ?? this.parentSurface.renderSurface.viewportSize.height;
        const clipRect = Rect.intersect(this.parentSurface.clipRect, this.parentSurface.seriesViewRect);
        const leftPad = (this.parentSurface.padding?.left ?? 0) * DpiHelper.PIXEL_RATIO;
        const topPad = (this.parentSurface.padding?.top ?? 0) * DpiHelper.PIXEL_RATIO;
        const aspectRatio = Math.abs(xCalc.getCoordWidth(1)) / Math.abs(yCalc.getCoordWidth(1));
        const tp = this.tickProvider as any;
        const vecArcs = getVectorArcVertex(wasmContext);
        const arc = getArcVertex(wasmContext);

        const drawGCircle = (g: number, gapDistance: number) => {
            const cx = -(g / (1 + g));
            const rad = 1 / (1 + g);
            const sinHalfGap = gapDistance / (2 * rad);
            if (sinHalfGap >= 1) return;
            const arcGap = sinHalfGap > 0 ? 2 * Math.asin(sinHalfGap) : 0;
            const cx_px = xCalc.getCoordinate(cx);
            const cy_native = vpHeight - yCalc.getCoordinate(0);
            const radius_px = Math.abs(xCalc.getCoordWidth(rad));
            // Gap centred at angle π — the tangent point (-1,0) where all G-circles converge.
            arc.MakeCircularArc(
                getArcParams(
                    wasmContext,
                    cx_px,
                    cy_native,
                    0,
                    Math.PI - arcGap,
                    radius_px,
                    0,
                    1,
                    aspectRatio,
                    linesPen.m_fThickness
                )
            );
            vecArcs.push_back(arc);
            if (arcGap < Math.PI) {
                arc.MakeCircularArc(
                    getArcParams(
                        wasmContext,
                        cx_px,
                        cy_native,
                        Math.PI + arcGap,
                        2 * Math.PI,
                        radius_px,
                        0,
                        1,
                        aspectRatio,
                        linesPen.m_fThickness
                    )
                );
                vecArcs.push_back(arc);
            }
        };

        if (isMajor) {
            for (const g of tp.getMajorTicks(0, 0, null) as number[]) {
                drawGCircle(g, 0); // full circles
            }
            // Flush G-circle arcs BEFORE calling getVectorArcVertex/getArcVertex again —
            // those helpers return WASM singletons and a second call would reset vecArcs/arc.
            if (vecArcs.size() > 0) {
                renderContext.drawArcs(vecArcs, 0, 0, 0, clipRect, linesPen, undefined, leftPad, topPad);
            }

            // Unit circle (radius=1, centre=(0,0)) — drawn here so it appears in Y-only mode
            const ucVec = getVectorArcVertex(wasmContext);
            const ucArc = getArcVertex(wasmContext);
            ucArc.MakeCircularArc(
                getArcParams(
                    wasmContext,
                    xCalc.getCoordinate(0),
                    vpHeight - yCalc.getCoordinate(0),
                    0,
                    2 * Math.PI,
                    Math.abs(xCalc.getCoordWidth(1)),
                    0,
                    1,
                    aspectRatio,
                    linesPen.m_fThickness * 2
                )
            );
            ucVec.push_back(ucArc);
            renderContext.drawArcs(ucVec, 0, 0, 0, clipRect, linesPen, undefined, leftPad, topPad);

            // Real axis line from (-1,0) to (1,0)
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
        } else {
            // Minor ticks are encoded as flat pairs [g, bClip, g, bClip, ...]
            const minor = tp.getMinorTicks(0, 0, null) as number[];
            for (let i = 0; i + 1 < minor.length; i += 2) {
                const g = minor[i];
                const bClip = minor[i + 1];
                drawGCircle(g, 2 / Math.sqrt((g + 1) * (g + 1) + bClip * bClip));
            }
            if (vecArcs.size() > 0) {
                renderContext.drawArcs(vecArcs, 0, 0, 0, clipRect, linesPen, undefined, leftPad, topPad);
            }
        }
    }
}

// ── Admittance reactance axis (constant-B arcs) ───────────────────────────────
// Mirror of constant-X arcs: centre = (-1, ±1/b), radius = 1/b
// Arc runs from (-1, 0) to unit circle intersection: xInt=(1-b²)/(1+b²), yInt=±2b/(1+b²)

export class SmithChartAdmittanceReactanceAxis extends NumericAxis {
    private sibling: SmithChartAdmittanceResistanceAxis | null = null;

    constructor(wasmContext: TSciChart, options?: object) {
        super(wasmContext, {
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            drawMajorBands: false,
            zoomExtentsToInitialRange: true,
            ...options,
        });
        this.tickProvider = new SmithAdmittanceBTickProvider(wasmContext);
        this.axisRenderer = new SmithChartAxisRenderer(wasmContext, false, true);
    }

    override get isPrimaryAxis(): boolean {
        return this.isVisible;
    }
    override set isPrimaryAxis(_: boolean) {
        // Suppress: see SmithChartAdmittanceResistanceAxis for rationale.
    }

    override measure(): void {
        super.measure();
        this.sibling = (this.parentSurface?.xAxes?.get(1) as SmithChartAdmittanceResistanceAxis) ?? null;
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
        const vpHeight =
            SciChartSurfaceBase.domMasterCanvas?.height ?? this.parentSurface.renderSurface.viewportSize.height;
        const clipRect = Rect.intersect(this.parentSurface.clipRect, this.parentSurface.seriesViewRect);
        const leftPad = (this.parentSurface.padding?.left ?? 0) * DpiHelper.PIXEL_RATIO;
        const topPad = (this.parentSurface.padding?.top ?? 0) * DpiHelper.PIXEL_RATIO;
        const aspectRatio = Math.abs(xCalc.getCoordWidth(1)) / Math.abs(yCalc.getCoordWidth(1));
        const tp = this.tickProvider as any;
        const vecArcs = getVectorArcVertex(wasmContext);
        const arc = getArcVertex(wasmContext);

        const drawBArc = (absB: number, gapDistance: number) => {
            const rad = 1 / absB;
            const cx_data = -1;

            const cy_pos = rad;
            const cy_neg = -rad;

            const bv2 = absB * absB;
            const xInt = (1 - bv2) / (1 + bv2);
            const yInt_pos = (2 * absB) / (1 + bv2);
            const yInt_neg = -yInt_pos;

            let posStart = Math.atan2(-cy_pos, 0);
            let posEnd = Math.atan2(yInt_pos - cy_pos, xInt - cx_data);
            while (posEnd <= posStart) posEnd += 2 * Math.PI;

            const negStart = Math.atan2(yInt_neg - cy_neg, xInt - cx_data);
            let negEnd = Math.atan2(-cy_neg, 0);
            while (negEnd <= negStart) negEnd += 2 * Math.PI;

            if (gapDistance > 0) {
                const sinHalfGap = gapDistance / (2 * rad);
                if (sinHalfGap >= 1) return;
                const arcGap = 2 * Math.asin(sinHalfGap);
                posStart += arcGap;
                negEnd -= arcGap;
                if (posEnd <= posStart || negEnd <= negStart) return;
            }

            const cx_px = xCalc.getCoordinate(cx_data);
            const rad_px = Math.abs(xCalc.getCoordWidth(rad));

            arc.MakeCircularArc(
                getArcParams(
                    wasmContext,
                    cx_px,
                    vpHeight - yCalc.getCoordinate(cy_pos),
                    posStart,
                    posEnd,
                    rad_px,
                    0,
                    1,
                    aspectRatio,
                    linesPen.m_fThickness
                )
            );
            vecArcs.push_back(arc);

            arc.MakeCircularArc(
                getArcParams(
                    wasmContext,
                    cx_px,
                    vpHeight - yCalc.getCoordinate(cy_neg),
                    negStart,
                    negEnd,
                    rad_px,
                    0,
                    1,
                    aspectRatio,
                    linesPen.m_fThickness
                )
            );
            vecArcs.push_back(arc);
        };

        if (isMajor) {
            for (const b of tp.getMajorTicks(0, 0, null) as number[]) {
                drawBArc(b, 0); // full arcs
            }
        } else {
            // Minor ticks are encoded as flat pairs [b, gClip, b, gClip, ...]
            const minor = tp.getMinorTicks(0, 0, null) as number[];
            for (let i = 0; i + 1 < minor.length; i += 2) {
                const b = minor[i];
                const gClip = minor[i + 1];
                drawBArc(b, 2 / Math.sqrt((gClip + 1) * (gClip + 1) + b * b));
            }
        }

        if (vecArcs.size() > 0) {
            renderContext.drawArcs(vecArcs, 0, 0, 0, clipRect, linesPen, undefined, leftPad, topPad);
        }
    }
}
