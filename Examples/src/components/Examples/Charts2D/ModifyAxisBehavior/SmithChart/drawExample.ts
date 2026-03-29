import { appTheme } from "../../../theme";
import {
    ArcAnnotation,
    ChartModifierBase2D,
    EAxisAlignment,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EllipsePointMarker,
    EVerticalAnchorPoint,
    ModifierMouseArgs,
    MouseWheelZoomModifier,
    NumberRange,
    PinchZoomModifier,
    SciChartSurface,
    TextAnnotation,
    XyDataSeries,
    XyScatterRenderableSeries,
    ZoomExtentsModifier,
} from "scichart";
import {
    SmithChartResistanceAxis,
    SmithChartReactanceAxis,
    arcHeightFromCenter,
    rCircleParams,
} from "./smithChartAxes";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    console.log("[Smith] drawExample starting, custom axes:", typeof SmithChartResistanceAxis, typeof SmithChartReactanceAxis);
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // ── Axes ──────────────────────────────────────────────────────────────────
    const gridColor = appTheme.ForegroundColor + "30";
    const outerColor = appTheme.ForegroundColor + "80";

    sciChartSurface.xAxes.add(
        new SmithChartResistanceAxis(wasmContext, {
            visibleRange: new NumberRange(-1.15, 1.15),
            axisAlignment: EAxisAlignment.Bottom,
            majorGridLineStyle: { color: outerColor, strokeThickness: 1.5 },
            minorGridLineStyle: { color: gridColor, strokeThickness: 0.5 },
        })
    );

    sciChartSurface.yAxes.add(
        new SmithChartReactanceAxis(wasmContext, {
            visibleRange: new NumberRange(-1.15, 1.15),
            axisAlignment: EAxisAlignment.Left,
            majorGridLineStyle: { color: gridColor, strokeThickness: 1 },
            minorGridLineStyle: { color: gridColor, strokeThickness: 0.5 },
        })
    );

    // ── Highlight colours ─────────────────────────────────────────────────────
    const rHighlightColor = "#FF4444";
    const xHighlightColor = "#4488FF";
    const gammaColor = "#44CC44";

    // ── ArcAnnotation highlights ──────────────────────────────────────────────
    // Full circles (R circle and |Γ| circle) use two semicircle ArcAnnotations
    // because ArcAnnotation height=0 on a diameter chord is ambiguous.

    // R circle — upper semicircle (initial: r=1, cx=0.5, rad=0.5)
    const rCircleUpper = new ArcAnnotation({
        x1: 0, y1: 0, x2: 1, y2: 0,
        height: 0.5,
        isLineMode: true,
        stroke: rHighlightColor,
        strokeThickness: 2.5,
    });
    // R circle — lower semicircle
    const rCircleLower = new ArcAnnotation({
        x1: 0, y1: 0, x2: 1, y2: 0,
        height: -0.5,
        isLineMode: true,
        stroke: rHighlightColor,
        strokeThickness: 2.5,
    });

    // X arc — single arc annotation
    const xArcAnnotation = new ArcAnnotation({
        x1: 1, y1: 0, x2: 1, y2: 0,
        height: 0,
        isLineMode: true,
        stroke: xHighlightColor,
        strokeThickness: 2.5,
    });

    // |Γ| circle — upper semicircle (initial: at origin, collapsed)
    const gammaCircleUpper = new ArcAnnotation({
        x1: 0, y1: 0, x2: 0, y2: 0,
        height: 0,
        isLineMode: true,
        stroke: gammaColor,
        strokeThickness: 1.5,
        strokeDashArray: [5, 5],
    });
    // |Γ| circle — lower semicircle
    const gammaCircleLower = new ArcAnnotation({
        x1: 0, y1: 0, x2: 0, y2: 0,
        height: 0,
        isLineMode: true,
        stroke: gammaColor,
        strokeThickness: 1.5,
        strokeDashArray: [5, 5],
    });

    // ── Draggable point ───────────────────────────────────────────────────────
    const pointDS = new XyDataSeries(wasmContext);
    pointDS.append(0, 0);
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: pointDS,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 14,
                height: 14,
                fill: gammaColor,
                stroke: "#FFFFFF",
                strokeThickness: 2,
            }),
        })
    );

    // ── Text readouts ─────────────────────────────────────────────────────────
    const gammaTextAnnotation = new TextAnnotation({
        x1: 0.02, y1: 0.02,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        text: "Γ = 0.000 + j0.000",
        fontSize: 14, fontFamily: "monospace",
        textColor: appTheme.ForegroundColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });
    const gammaMagTextAnnotation = new TextAnnotation({
        x1: 0.02, y1: 0.06,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        text: "|Γ| = 0.000",
        fontSize: 14, fontFamily: "monospace",
        textColor: gammaColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });
    const impedanceTextAnnotation = new TextAnnotation({
        x1: 0.02, y1: 0.10,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        text: "Z = 1.000 + j0.000",
        fontSize: 14, fontFamily: "monospace",
        textColor: appTheme.ForegroundColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });
    const resistanceLabel = new TextAnnotation({
        x1: 0.02, y1: 0.14,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        text: "R = 1.000",
        fontSize: 14, fontFamily: "monospace",
        textColor: rHighlightColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });
    const reactanceLabel = new TextAnnotation({
        x1: 0.02, y1: 0.18,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        text: "X = 0.000",
        fontSize: 14, fontFamily: "monospace",
        textColor: xHighlightColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });

    // ── Grid labels (TextAnnotations at key positions) ────────────────────────
    for (const [r, label] of [[0.2,"0.2"],[0.5,"0.5"],[1,"1"],[2,"2"],[5,"5"],[10,"10"],[20,"20"],[50,"50"]] as [number,string][]) {
        const { cx, rad } = rCircleParams(r);
        sciChartSurface.annotations.add(new TextAnnotation({
            text: label,
            x1: cx - rad, y1: 0,
            xCoordShift: 0, yCoordShift: -15,
            fontSize: 10,
            textColor: appTheme.ForegroundColor,
            opacity: 0.7,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        }));
    }
    for (const x of [0.2, 0.5, 1, 2, 5, 10, 20, 50]) {
        const xv2 = x * x;
        const lx = (xv2 - 1) / (1 + xv2);
        const ly = 2 * x / (1 + xv2);
        const label = x >= 1 ? x.toString() : x.toFixed(1);
        sciChartSurface.annotations.add(new TextAnnotation({
            text: `+${label}`, x1: lx, y1: ly,
            xCoordShift: 15, yCoordShift: 0, fontSize: 10,
            textColor: appTheme.ForegroundColor, opacity: 0.7,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
        }));
        sciChartSurface.annotations.add(new TextAnnotation({
            text: `-${label}`, x1: lx, y1: -ly,
            xCoordShift: 15, yCoordShift: 0, fontSize: 10,
            textColor: appTheme.ForegroundColor, opacity: 0.7,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
        }));
    }
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "0.0", x1: -1, y1: 0,
        xCoordShift: -20, yCoordShift: 0, fontSize: 10,
        textColor: appTheme.ForegroundColor, opacity: 0.7,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
    }));

    // Add all highlight annotations and readouts
    sciChartSurface.annotations.add(
        rCircleUpper, rCircleLower,
        xArcAnnotation,
        gammaCircleUpper, gammaCircleLower,
        gammaTextAnnotation, gammaMagTextAnnotation,
        impedanceTextAnnotation, resistanceLabel, reactanceLabel
    );

    // ── Update logic ──────────────────────────────────────────────────────────

    function updateInteractiveElements(gammaR: number, gammaI: number) {
        const mag = Math.sqrt(gammaR * gammaR + gammaI * gammaI);
        const gr = mag > 1 ? gammaR / mag : gammaR;
        const gi = mag > 1 ? gammaI / mag : gammaI;
        const gammaMag = Math.sqrt(gr * gr + gi * gi);

        // Z = (1+Γ)/(1−Γ)
        const denom = (1 - gr) * (1 - gr) + gi * gi;
        const r = denom > 1e-10 ? (1 - gr * gr - gi * gi) / denom : Infinity;
        const x = denom > 1e-10 ? (2 * gi) / denom : Infinity;

        // Update draggable point
        pointDS.clear();
        pointDS.append(gr, gi);

        // Update R circle highlight (two semicircles)
        if (isFinite(r) && r >= 0) {
            const { cx, rad } = rCircleParams(r);
            rCircleUpper.x1 = cx - rad;
            rCircleUpper.y1 = 0;
            rCircleUpper.x2 = cx + rad;
            rCircleUpper.y2 = 0;
            rCircleUpper.height = rad;
            rCircleLower.x1 = cx - rad;
            rCircleLower.y1 = 0;
            rCircleLower.x2 = cx + rad;
            rCircleLower.y2 = 0;
            rCircleLower.height = -rad;
        }

        // Update X arc highlight
        if (isFinite(x) && Math.abs(x) > 0.001) {
            const absX = Math.abs(x);
            const isPos = x > 0;
            const xv2 = absX * absX;
            const xInt = (xv2 - 1) / (1 + xv2);
            const yInt = isPos ? (2 * absX) / (1 + xv2) : -(2 * absX) / (1 + xv2);
            const cy_arc = isPos ? 1 / absX : -1 / absX;
            xArcAnnotation.x1 = 1;
            xArcAnnotation.y1 = 0;
            xArcAnnotation.x2 = xInt;
            xArcAnnotation.y2 = yInt;
            xArcAnnotation.height = arcHeightFromCenter(1, 0, xInt, yInt, 1, cy_arc);
        } else if (isFinite(x)) {
            // Near-zero reactance: collapse arc
            xArcAnnotation.x1 = -1;
            xArcAnnotation.x2 = 1;
            xArcAnnotation.height = 0;
        }

        // Update |Γ| circle highlight (two semicircles)
        const gRad = gammaMag;
        if (gRad > 0.001) {
            gammaCircleUpper.x1 = -gRad;
            gammaCircleUpper.y1 = 0;
            gammaCircleUpper.x2 = gRad;
            gammaCircleUpper.y2 = 0;
            gammaCircleUpper.height = gRad;
            gammaCircleLower.x1 = -gRad;
            gammaCircleLower.y1 = 0;
            gammaCircleLower.x2 = gRad;
            gammaCircleLower.y2 = 0;
            gammaCircleLower.height = -gRad;
        }

        // Update text readouts
        const signG = gi >= 0 ? "+" : "−";
        gammaTextAnnotation.text = `Γ = ${gr.toFixed(3)} ${signG} j${Math.abs(gi).toFixed(3)}`;
        gammaMagTextAnnotation.text = `|Γ| = ${gammaMag.toFixed(3)}`;

        if (!isFinite(r) || !isFinite(x)) {
            impedanceTextAnnotation.text = "Z = ∞";
            resistanceLabel.text = "R = ∞";
            reactanceLabel.text = "X = ∞";
        } else {
            const signZ = x >= 0 ? "+" : "−";
            impedanceTextAnnotation.text = `Z = ${r.toFixed(3)} ${signZ} j${Math.abs(x).toFixed(3)}`;
            resistanceLabel.text = `R = ${r.toFixed(3)}`;
            reactanceLabel.text = `X = ${x >= 0 ? "" : "−"}${Math.abs(x).toFixed(3)}`;
        }
    }

    updateInteractiveElements(0, 0);

    // ── Drag modifier ─────────────────────────────────────────────────────────

    class SmithChartDragModifier extends ChartModifierBase2D {
        readonly type = "SmithChartDragModifier";
        private isDragging = false;

        modifierMouseDown(args: ModifierMouseArgs) {
            super.modifierMouseDown(args);
            this.isDragging = true;
            this.handleDrag(args);
            args.handled = true;
        }
        modifierMouseMove(args: ModifierMouseArgs) {
            super.modifierMouseMove(args);
            if (this.isDragging) { this.handleDrag(args); args.handled = true; }
        }
        modifierMouseUp(args: ModifierMouseArgs) {
            super.modifierMouseUp(args);
            this.isDragging = false;
        }
        private handleDrag(args: ModifierMouseArgs) {
            const xCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
            const yCalc = this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator();
            updateInteractiveElements(
                xCalc.getDataValue(args.mousePoint.x),
                yCalc.getDataValue(args.mousePoint.y)
            );
        }
    }

    sciChartSurface.chartModifiers.add(
        new SmithChartDragModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new PinchZoomModifier()
    );

    return { sciChartSurface, wasmContext };
};
