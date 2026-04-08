import { appTheme } from "../../../theme";
import {
    ChartModifierBase2D,
    EAxisAlignment,
    ECoordinateMode,
    EExecuteOn,
    EHorizontalAnchorPoint,
    EllipsePointMarker,
    EVerticalAnchorPoint,
    FastLineRenderableSeries,
    ModifierMouseArgs,
    MouseWheelZoomModifier,
    NumberRange,
    PinchZoomModifier,
    SciChartSurface,
    TextAnnotation,
    XyDataSeries,
    XyScatterRenderableSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { SmithChartResistanceAxis, SmithChartReactanceAxis } from "./smithChartAxes";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // ── Axes (custom: draw constant-R circles and constant-X arcs as grid lines) ─
    const gridColor = "#aaaaaa"; //appTheme.SciChartJsTheme.polarMajorGridLineBrush;

    sciChartSurface.xAxes.add(
        new SmithChartResistanceAxis(wasmContext, {
            visibleRange: new NumberRange(-1.15, 1.15),
            axisAlignment: EAxisAlignment.Bottom,
            majorGridLineStyle: { color: gridColor, strokeThickness: 2 },
            minorGridLineStyle: { color: gridColor, strokeThickness: 1 },
        })
    );

    sciChartSurface.yAxes.add(
        new SmithChartReactanceAxis(wasmContext, {
            visibleRange: new NumberRange(-1.15, 1.15),
            axisAlignment: EAxisAlignment.Left,
            majorGridLineStyle: { color: gridColor, strokeThickness: 2 },
            minorGridLineStyle: { color: gridColor, strokeThickness: 1 },
        })
    );

    // ── Highlight colours ─────────────────────────────────────────────────────
    const rHighlightColor = "#FF4444";
    const xHighlightColor = "#4488FF";
    const gammaColor = "#44CC44";

    // ── Interactive highlight series (polyline-based for correct full circles) ─
    const rCircleDS = new XyDataSeries(wasmContext);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: rCircleDS,
            stroke: rHighlightColor,
            strokeThickness: 2.5,
        })
    );

    const xArcDS = new XyDataSeries(wasmContext);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: xArcDS,
            stroke: xHighlightColor,
            strokeThickness: 2.5,
        })
    );

    const gammaCircleDS = new XyDataSeries(wasmContext);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: gammaCircleDS,
            stroke: gammaColor,
            strokeThickness: 1.5,
            strokeDashArray: [5, 5],
        })
    );

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

    // ── Text readouts (fixed pixel position so they're always visible) ────────
    const gammaTextAnnotation = new TextAnnotation({
        x1: 10,
        y1: 10,
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        text: "Γ = 0.000 + j0.000",
        fontSize: 14,
        fontFamily: "monospace",
        textColor: appTheme.ForegroundColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });
    const gammaMagTextAnnotation = new TextAnnotation({
        x1: 10,
        y1: 30,
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        text: "|Γ| = 0.000",
        fontSize: 14,
        fontFamily: "monospace",
        textColor: gammaColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });
    const impedanceTextAnnotation = new TextAnnotation({
        x1: 10,
        y1: 50,
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        text: "Z = 1.000 + j0.000",
        fontSize: 14,
        fontFamily: "monospace",
        textColor: appTheme.ForegroundColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });
    const resistanceLabel = new TextAnnotation({
        x1: 10,
        y1: 70,
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        text: "R = 1.000",
        fontSize: 14,
        fontFamily: "monospace",
        textColor: rHighlightColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });
    const reactanceLabel = new TextAnnotation({
        x1: 10,
        y1: 90,
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
        text: "X = 0.000",
        fontSize: 14,
        fontFamily: "monospace",
        textColor: xHighlightColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });

    sciChartSurface.annotations.add(
        gammaTextAnnotation,
        gammaMagTextAnnotation,
        impedanceTextAnnotation,
        resistanceLabel,
        reactanceLabel
    );

    // ── Update logic ──────────────────────────────────────────────────────────

    function updateInteractiveElements(gammaR: number, gammaI: number) {
        const mag = Math.sqrt(gammaR * gammaR + gammaI * gammaI);
        let gr = gammaR;
        let gi = gammaI;
        if (mag > 1) {
            gr = gammaR / mag;
            gi = gammaI / mag;
        }
        const gammaMag = Math.sqrt(gr * gr + gi * gi);

        // Z = (1+Γ)/(1−Γ)
        const denom = (1 - gr) * (1 - gr) + gi * gi;
        const r = denom > 1e-10 ? (1 - gr * gr - gi * gi) / denom : Infinity;
        const x = denom > 1e-10 ? (2 * gi) / denom : Infinity;

        pointDS.clear();
        pointDS.append(gr, gi);

        populateRCircle(rCircleDS, r);
        populateXArc(xArcDS, x);
        populateCircle(gammaCircleDS, 0, 0, gammaMag);

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
            if (!this.checkExecuteConditions(args).isPrimary) return;
            this.isDragging = true;
            this.handleDrag(args);
            args.handled = true;
        }
        modifierMouseMove(args: ModifierMouseArgs) {
            super.modifierMouseMove(args);
            if (this.isDragging) {
                this.handleDrag(args);
                args.handled = true;
            }
        }
        modifierMouseUp(args: ModifierMouseArgs) {
            super.modifierMouseUp(args);
            this.isDragging = false;
        }
        private handleDrag(args: ModifierMouseArgs) {
            const xCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
            const yCalc = this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator();
            updateInteractiveElements(xCalc.getDataValue(args.mousePoint.x), yCalc.getDataValue(args.mousePoint.y));
        }
    }

    sciChartSurface.chartModifiers.add(
        new SmithChartDragModifier({ executeCondition: { button: EExecuteOn.MouseLeftButton } }),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ executeCondition: { button: EExecuteOn.MouseRightButton } })
    );

    return { sciChartSurface, wasmContext };
};

// ── Helper functions ──────────────────────────────────────────────────────────

function populateRCircle(ds: XyDataSeries, r: number) {
    ds.clear();
    if (!isFinite(r) || r < 0) return;
    const cx = r / (1 + r);
    const rad = 1 / (1 + r);
    const n = 200;
    for (let i = 0; i <= n; i++) {
        const angle = (i / n) * 2 * Math.PI;
        ds.append(cx + rad * Math.cos(angle), rad * Math.sin(angle));
    }
}

function populateXArc(ds: XyDataSeries, xVal: number) {
    ds.clear();
    if (!isFinite(xVal)) return;

    if (Math.abs(xVal) < 0.001) {
        ds.append(-1, 0);
        ds.append(1, 0);
        return;
    }

    const absX = Math.abs(xVal);
    const isPos = xVal > 0;
    const radius = 1 / absX;
    const cx = 1;
    const cy = isPos ? radius : -radius;

    const xv2 = absX * absX;
    const xInt = (xv2 - 1) / (1 + xv2);
    const yInt = isPos ? (2 * absX) / (1 + xv2) : (-2 * absX) / (1 + xv2);

    const thetaOther = Math.atan2(yInt - cy, xInt - cx);
    const thetaOrigin = isPos ? -Math.PI / 2 : Math.PI / 2;

    let startAngle: number;
    let endAngle: number;

    if (isPos) {
        startAngle = thetaOther;
        endAngle = thetaOrigin;
        while (endAngle <= startAngle) endAngle += 2 * Math.PI;
    } else {
        startAngle = thetaOrigin;
        endAngle = thetaOther;
        while (endAngle <= startAngle) endAngle += 2 * Math.PI;
    }

    const n = 200;
    for (let i = 0; i <= n; i++) {
        const angle = startAngle + (i / n) * (endAngle - startAngle);
        ds.append(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
}

function populateCircle(ds: XyDataSeries, cx: number, cy: number, radius: number) {
    ds.clear();
    if (radius < 0.001) return;
    const n = 200;
    for (let i = 0; i <= n; i++) {
        const angle = (i / n) * 2 * Math.PI;
        ds.append(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
}
