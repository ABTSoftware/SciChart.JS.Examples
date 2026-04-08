import { NumericAxis, TSciChart, Rect, DpiHelper } from "scichart";
import { WebGlRenderContext2D } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { SCRTPen } from "scichart/types/TSciChart";
import { getArcParams, getVectorArcVertex, getArcVertex } from "scichart/Charting/Visuals/Helpers/NativeObject";
import { SmithResistanceTickProvider, SmithReactanceTickProvider } from "./smithChartAxes";

// ── Admittance resistance axis (constant-G circles) ──────────────────────────
// Mirror of constant-R: centre = (-g/(1+g), 0), radius = 1/(1+g)

export class SmithChartAdmittanceResistanceAxis extends NumericAxis {
    private sibling: SmithChartAdmittanceReactanceAxis | null = null;

    constructor(wasmContext: TSciChart, options?: object) {
        super(wasmContext, {
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            drawMajorBands: false,
            zoomExtentsToInitialRange: true,
            ...options,
        });
        this.tickProvider = new SmithResistanceTickProvider(wasmContext) as any;
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
        const vpHeight = this.parentSurface.renderSurface.viewportSize.height;
        const clipRect = Rect.intersect(this.parentSurface.clipRect, this.parentSurface.seriesViewRect);
        const leftPad = (this.parentSurface.padding?.left ?? 0) * DpiHelper.PIXEL_RATIO;
        const topPad = (this.parentSurface.padding?.top ?? 0) * DpiHelper.PIXEL_RATIO;
        const aspectRatio = Math.abs(xCalc.getCoordWidth(1)) / Math.abs(yCalc.getCoordWidth(1));
        const tp = this.tickProvider as any;
        const vecArcs = getVectorArcVertex(wasmContext);
        const arc = getArcVertex(wasmContext);

        // gapDistance = 2/sqrt((g+1)²+bClip²) — mirrors resistance axis formula
        const drawGCircle = (g: number, gapDistance: number) => {
            // centre = (-g/(1+g), 0), radius = 1/(1+g)
            const cx = -(g / (1 + g));
            const rad = 1 / (1 + g);
            const sinHalfGap = gapDistance / (2 * rad);
            if (sinHalfGap >= 1) return;
            const arcGap = sinHalfGap > 0 ? 2 * Math.asin(sinHalfGap) : 0;
            const cx_px = xCalc.getCoordinate(cx);
            const cy_native = vpHeight - yCalc.getCoordinate(0);
            const radius_px = Math.abs(xCalc.getCoordWidth(rad));
            arc.MakeCircularArc(
                getArcParams(
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
                )
            );
            vecArcs.push_back(arc);
        };

        if (isMajor) {
            for (const g of tp.getMajorTicks(0, 0, null) as number[]) {
                drawGCircle(g, 0); // full circles
            }
        } else {
            // Minor ticks are encoded as flat pairs [g, bClip, g, bClip, ...]
            const minor = tp.getMinorTicks(0, 0, null) as number[];
            for (let i = 0; i + 1 < minor.length; i += 2) {
                const g = minor[i];
                const bClip = minor[i + 1];
                drawGCircle(g, 2 / Math.sqrt((g + 1) * (g + 1) + bClip * bClip));
            }
        }

        if (vecArcs.size() > 0) {
            renderContext.drawArcs(vecArcs, 0, 0, 0, clipRect, linesPen, undefined, leftPad, topPad);
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
        this.tickProvider = new SmithReactanceTickProvider(wasmContext) as any;
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
        const vpHeight = this.parentSurface.renderSurface.viewportSize.height;
        const clipRect = Rect.intersect(this.parentSurface.clipRect, this.parentSurface.seriesViewRect);
        const leftPad = (this.parentSurface.padding?.left ?? 0) * DpiHelper.PIXEL_RATIO;
        const topPad = (this.parentSurface.padding?.top ?? 0) * DpiHelper.PIXEL_RATIO;
        const aspectRatio = Math.abs(xCalc.getCoordWidth(1)) / Math.abs(yCalc.getCoordWidth(1));
        const tp = this.tickProvider as any;
        const vecArcs = getVectorArcVertex(wasmContext);
        const arc = getArcVertex(wasmContext);

        // gapDistance = 2/sqrt((gClip+1)²+b²) — mirrors reactance axis formula
        const drawBArc = (absB: number, gapDistance: number) => {
            const rad = 1 / absB;
            const cx_data = -1;

            // Positive B arc: centre = (-1, +1/b)
            const cy_pos = rad;
            // Negative B arc: centre = (-1, -1/b)
            const cy_neg = -rad;

            // Unit circle intersection: xInt=(1-b²)/(1+b²), yInt=±2b/(1+b²)
            const bv2 = absB * absB;
            const xInt = (1 - bv2) / (1 + bv2);
            const yInt_pos = (2 * absB) / (1 + bv2);
            const yInt_neg = -yInt_pos;

            // Angles from centre to (-1,0) and to unit circle intersection
            // Positive B: centre is at (-1, rad)
            //   angle to (-1,0): atan2(0 - rad, -1 - (-1)) = atan2(-rad, 0) = -π/2
            //   angle to intersection: atan2(yInt_pos - rad, xInt - (-1))
            const thetaStart_pos = Math.atan2(-cy_pos, 0); // = -π/2
            const thetaEnd_pos = Math.atan2(yInt_pos - cy_pos, xInt - cx_data);

            // Negative B: centre is at (-1, -rad)
            //   angle to (-1,0): atan2(0 - (-rad), 0) = atan2(rad, 0) = π/2
            //   angle to intersection: atan2(yInt_neg - (-rad), xInt - (-1))
            const thetaStart_neg = Math.atan2(-cy_neg, 0); // = π/2
            const thetaEnd_neg = Math.atan2(yInt_neg - cy_neg, xInt - cx_data);

            let posStart = thetaStart_pos;
            let posEnd = thetaEnd_pos;
            while (posEnd <= posStart) posEnd += 2 * Math.PI;

            let negStart = thetaStart_neg;
            let negEnd = thetaEnd_neg;
            while (negEnd <= negStart) negEnd += 2 * Math.PI;

            if (gapDistance > 0) {
                const sinHalfGap = gapDistance / (2 * rad);
                if (sinHalfGap >= 1) return;
                const arcGap = 2 * Math.asin(sinHalfGap);
                // Positive B arcs end near (-1, 0) — clip the start
                posStart += arcGap;
                // Negative B arcs start near (-1, 0) — clip the end
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
