import { appTheme } from "../../../theme";
import {
    ChartModifierBase2D,
    EAxisAlignment,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EllipsePointMarker,
    EVerticalAnchorPoint,
    FastLineRenderableSeries,
    ModifierMouseArgs,
    MouseWheelZoomModifier,
    NumericAxis,
    NumberRange,
    PinchZoomModifier,
    SciChartSurface,
    TextAnnotation,
    TSciChart,
    XyDataSeries,
    XyScatterRenderableSeries,
    ZoomExtentsModifier,
} from "scichart";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Configure axes for Smith Chart (-1.15 to 1.15 range to show the full chart with padding)
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-1.15, 1.15),
            axisAlignment: EAxisAlignment.Bottom,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
        })
    );

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-1.15, 1.15),
            axisAlignment: EAxisAlignment.Left,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
        })
    );

    // Define colors for grid lines
    const gridColor = appTheme.ForegroundColor + "30"; // Light gray with transparency
    const outerCircleColor = appTheme.ForegroundColor + "80"; // Darker for outer circle

    // Outer circle (unit circle)
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: createCircle(wasmContext, 0, 0, 1, 360),
            stroke: outerCircleColor,
            strokeThickness: 2,
        })
    );

    // Constant resistance circles (r values)
    const resistanceValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 3.0, 4.0, 5.0, 10, 20, 50];
    const majorResistanceValues = [0.2, 0.5, 1.0, 2.0, 5.0, 10, 20, 50];

    resistanceValues.forEach((r) => {
        const center = r / (1 + r);
        const radius = 1 / (1 + r);
        const isMajor = majorResistanceValues.includes(r);

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: createCircle(wasmContext, center, 0, radius, 360),
                stroke: gridColor,
                strokeThickness: isMajor ? 1 : 0.5,
            })
        );

        // Add resistance labels on the horizontal axis
        if (isMajor) {
            const labelX = center - radius;
            sciChartSurface.annotations.add(
                new TextAnnotation({
                    text: r >= 1 ? r.toString() : r.toFixed(1),
                    x1: labelX,
                    y1: 0,
                    xCoordShift: 0,
                    yCoordShift: -15,
                    fontSize: 10,
                    textColor: appTheme.ForegroundColor,
                    opacity: 0.7,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                })
            );
        }
    });

    // Constant reactance arcs (x values)
    const reactanceValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 3.0, 4.0, 5.0, 10, 20, 50];
    const majorReactanceValues = [0.2, 0.5, 1.0, 2.0, 5.0, 10, 20, 50];

    // Positive reactance (upper half)
    reactanceValues.forEach((x) => {
        const isMajor = majorReactanceValues.includes(x);

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: createReactanceArc(wasmContext, x, true),
                stroke: gridColor,
                strokeThickness: isMajor ? 1 : 0.5,
            })
        );

        // Add reactance labels on the outer circle where the arc meets it
        if (isMajor) {
            const xVal2 = x * x;
            const labelX = (xVal2 - 1) / (1 + xVal2);
            const labelY = 2 * x / (1 + xVal2);

            sciChartSurface.annotations.add(
                new TextAnnotation({
                    text: `+${x >= 1 ? x.toString() : x.toFixed(1)}`,
                    x1: labelX,
                    y1: labelY,
                    xCoordShift: 15,
                    yCoordShift: 0,
                    fontSize: 10,
                    textColor: appTheme.ForegroundColor,
                    opacity: 0.7,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center,
                })
            );
        }
    });

    // Negative reactance (lower half)
    reactanceValues.forEach((x) => {
        const isMajor = majorReactanceValues.includes(x);

        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: createReactanceArc(wasmContext, x, false),
                stroke: gridColor,
                strokeThickness: isMajor ? 1 : 0.5,
            })
        );

        // Add reactance labels on the outer circle where the arc meets it
        if (isMajor) {
            const xVal2 = x * x;
            const labelX = (xVal2 - 1) / (1 + xVal2);
            const labelY = -2 * x / (1 + xVal2);

            sciChartSurface.annotations.add(
                new TextAnnotation({
                    text: `-${x >= 1 ? x.toString() : x.toFixed(1)}`,
                    x1: labelX,
                    y1: labelY,
                    xCoordShift: 15,
                    yCoordShift: 0,
                    fontSize: 10,
                    textColor: appTheme.ForegroundColor,
                    opacity: 0.7,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center,
                })
            );
        }
    });

    // Add horizontal axis line (real axis)
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: createLine(wasmContext, -1, 0, 1, 0),
            stroke: gridColor,
            strokeThickness: 1,
        })
    );

    // Add axis label at the left end
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "0.0",
            x1: -1,
            y1: 0,
            xCoordShift: -20,
            yCoordShift: 0,
            fontSize: 10,
            textColor: appTheme.ForegroundColor,
            opacity: 0.7,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
        })
    );

    // ═══════════════════════════════════════════════════════
    // INTERACTIVE ELEMENTS - Draggable point with highlights
    // ═══════════════════════════════════════════════════════

    const rHighlightColor = "#FF4444"; // Red for constant resistance
    const xHighlightColor = "#4488FF"; // Blue for constant reactance
    const gammaColor = "#44CC44"; // Green for |Γ| and point

    // Highlighted constant-R circle (red)
    const rCircleDS = new XyDataSeries(wasmContext);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: rCircleDS,
            stroke: rHighlightColor,
            strokeThickness: 2.5,
        })
    );

    // Highlighted constant-X arc (blue)
    const xArcDS = new XyDataSeries(wasmContext);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: xArcDS,
            stroke: xHighlightColor,
            strokeThickness: 2.5,
        })
    );

    // |Γ| circle (green, dashed)
    const gammaCircleDS = new XyDataSeries(wasmContext);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: gammaCircleDS,
            stroke: gammaColor,
            strokeThickness: 1.5,
            strokeDashArray: [5, 5],
        })
    );

    // Draggable point marker (green)
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

    // ═══════════════════════════════════════════════════════
    // TEXT READOUTS - Γ, |Γ|, Z displayed on chart
    // ═══════════════════════════════════════════════════════

    const gammaTextAnnotation = new TextAnnotation({
        x1: 0.02,
        y1: 0.02,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        text: "Γ = 0.000 + j0.000",
        fontSize: 14,
        fontFamily: "monospace",
        textColor: appTheme.ForegroundColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });

    const gammaMagTextAnnotation = new TextAnnotation({
        x1: 0.02,
        y1: 0.06,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        text: "|Γ| = 0.000",
        fontSize: 14,
        fontFamily: "monospace",
        textColor: gammaColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });

    const impedanceTextAnnotation = new TextAnnotation({
        x1: 0.02,
        y1: 0.10,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        text: "Z = 1.000 + j0.000",
        fontSize: 14,
        fontFamily: "monospace",
        textColor: appTheme.ForegroundColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });

    const resistanceLabel = new TextAnnotation({
        x1: 0.02,
        y1: 0.14,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        text: "R = 1.000",
        fontSize: 14,
        fontFamily: "monospace",
        textColor: rHighlightColor,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });

    const reactanceLabel = new TextAnnotation({
        x1: 0.02,
        y1: 0.18,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
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

    // ═══════════════════════════════════════════════════════
    // UPDATE LOGIC - Recalculates all visuals when point moves
    // ═══════════════════════════════════════════════════════

    function updateInteractiveElements(gammaR: number, gammaI: number) {
        // Clamp to unit circle
        const mag = Math.sqrt(gammaR * gammaR + gammaI * gammaI);
        let gr = gammaR;
        let gi = gammaI;
        if (mag > 1) {
            gr = gammaR / mag;
            gi = gammaI / mag;
        }

        const gammaMag = Math.sqrt(gr * gr + gi * gi);

        // Compute impedance: Z = (1 + Γ) / (1 - Γ) = R + jX
        const denom = (1 - gr) * (1 - gr) + gi * gi;
        const r = denom > 1e-10 ? (1 - gr * gr - gi * gi) / denom : Infinity;
        const x = denom > 1e-10 ? (2 * gi) / denom : Infinity;

        // Update draggable point position
        pointDS.clear();
        pointDS.append(gr, gi);

        // Update highlighted R circle
        populateRCircle(rCircleDS, r);

        // Update highlighted X arc
        populateXArc(xArcDS, x);

        // Update |Γ| circle
        populateCircle(gammaCircleDS, 0, 0, gammaMag);

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

    // Populate an XyDataSeries with a constant-R circle
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

    // Populate an XyDataSeries with a constant-X reactance arc
    function populateXArc(ds: XyDataSeries, xVal: number) {
        ds.clear();
        if (!isFinite(xVal)) return;

        // Near zero: draw horizontal axis
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

    // Populate an XyDataSeries with a circle centered at (cx, cy) with given radius
    function populateCircle(ds: XyDataSeries, cx: number, cy: number, radius: number) {
        ds.clear();
        if (radius < 0.001) return;
        const n = 200;
        for (let i = 0; i <= n; i++) {
            const angle = (i / n) * 2 * Math.PI;
            ds.append(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
        }
    }

    // Initialize interactive elements at the origin (Γ = 0 → Z = 1)
    updateInteractiveElements(0, 0);

    // ═══════════════════════════════════════════════════════
    // CUSTOM CHART MODIFIER - Handles click & drag on chart
    // ═══════════════════════════════════════════════════════

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
            const { mousePoint } = args;
            const xCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
            const yCalc = this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator();

            const dataX = xCalc.getDataValue(mousePoint.x);
            const dataY = yCalc.getDataValue(mousePoint.y);

            updateInteractiveElements(dataX, dataY);
        }
    }

    // Add interaction modifiers
    sciChartSurface.chartModifiers.add(
        new SmithChartDragModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new PinchZoomModifier()
    );

    // Preserve aspect ratio to always show circle (1:1 aspect ratio)
    const xAxis = sciChartSurface.xAxes.get(0);
    const yAxis = sciChartSurface.yAxes.get(0);

    sciChartSurface.preRender.subscribe(() => {
        const result = preserveAspectRatio(
            sciChartSurface.viewRect.width,
            sciChartSurface.viewRect.height,
            xAxis.visibleRange.min,
            xAxis.visibleRange.max,
            yAxis.visibleRange.min,
            yAxis.visibleRange.max
        );

        xAxis.visibleRange = new NumberRange(result.minVisibleX, result.maxVisibleX);
        yAxis.visibleRange = new NumberRange(result.minVisibleY, result.maxVisibleY);
    });

    return { sciChartSurface, wasmContext };
};

// ═══════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════

// Preserve aspect ratio (ensures circles remain circular)
function preserveAspectRatio(
    width: number,
    height: number,
    minVisibleX: number,
    maxVisibleX: number,
    minVisibleY: number,
    maxVisibleY: number
) {
    const visibleWidth = maxVisibleX - minVisibleX;
    const visibleHeight = maxVisibleY - minVisibleY;
    const containerAspectRatio = width / height;
    const visibleAspectRatio = visibleWidth / visibleHeight;

    let newMinX: number, newMaxX: number, newMinY: number, newMaxY: number;

    if (containerAspectRatio > visibleAspectRatio) {
        const newVisibleWidth = visibleHeight * containerAspectRatio;
        const widthDiff = newVisibleWidth - visibleWidth;
        newMinX = minVisibleX - widthDiff / 2;
        newMaxX = maxVisibleX + widthDiff / 2;
        newMinY = minVisibleY;
        newMaxY = maxVisibleY;
    } else {
        const newVisibleHeight = visibleWidth / containerAspectRatio;
        const heightDiff = newVisibleHeight - visibleHeight;
        newMinX = minVisibleX;
        newMaxX = maxVisibleX;
        newMinY = minVisibleY - heightDiff / 2;
        newMaxY = maxVisibleY + heightDiff / 2;
    }

    return { minVisibleX: newMinX, maxVisibleX: newMaxX, minVisibleY: newMinY, maxVisibleY: newMaxY };
}

// Create a circle as an XyDataSeries
function createCircle(wasmContext: TSciChart, cx: number, cy: number, radius: number, points: number = 360): XyDataSeries {
    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i <= points; i++) {
        const angle = (i / points) * 2 * Math.PI;
        dataSeries.append(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
    return dataSeries;
}

// Create a reactance arc as an XyDataSeries.
// For reactance value xVal, the circle has center (1, 1/xVal) and radius 1/xVal (positive)
// or center (1, -1/xVal) and radius 1/xVal (negative).
// All arcs pass through (1, 0) and curve to the other intersection with the unit circle.
function createReactanceArc(
    wasmContext: TSciChart,
    xVal: number,
    isPositive: boolean,
    numPoints: number = 200
): XyDataSeries {
    const dataSeries = new XyDataSeries(wasmContext);
    const radius = 1 / xVal;
    const cx = 1;
    const cy = isPositive ? radius : -radius;

    // The reactance circle intersects the unit circle at two points:
    // 1) Always at (1, 0)
    // 2) At ((xVal²-1)/(1+xVal²), ±2·xVal/(1+xVal²))
    const xVal2 = xVal * xVal;
    const xInt = (xVal2 - 1) / (1 + xVal2);
    const yInt = isPositive ? (2 * xVal) / (1 + xVal2) : (-2 * xVal) / (1 + xVal2);

    // Angle from circle center to the second intersection point
    const thetaOther = Math.atan2(yInt - cy, xInt - cx);

    // Angle from circle center to (1, 0):
    // Positive: atan2(0 - 1/xVal, 0) = -π/2
    // Negative: atan2(0 + 1/xVal, 0) = π/2
    const thetaOrigin = isPositive ? -Math.PI / 2 : Math.PI / 2;

    let startAngle: number, endAngle: number;

    if (isPositive) {
        // Sweep counterclockwise from thetaOther to thetaOrigin
        startAngle = thetaOther;
        endAngle = thetaOrigin;
        while (endAngle <= startAngle) endAngle += 2 * Math.PI;
    } else {
        // Sweep counterclockwise from thetaOrigin to thetaOther
        startAngle = thetaOrigin;
        endAngle = thetaOther;
        while (endAngle <= startAngle) endAngle += 2 * Math.PI;
    }

    for (let i = 0; i <= numPoints; i++) {
        const angle = startAngle + (i / numPoints) * (endAngle - startAngle);
        dataSeries.append(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }

    return dataSeries;
}

// Create a straight line as an XyDataSeries
function createLine(wasmContext: TSciChart, x1: number, y1: number, x2: number, y2: number): XyDataSeries {
    const dataSeries = new XyDataSeries(wasmContext);
    dataSeries.append(x1, y1);
    dataSeries.append(x2, y2);
    return dataSeries;
}
