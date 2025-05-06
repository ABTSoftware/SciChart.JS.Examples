import { 
    PolarNumericAxis,
    SciChartSurface,
    NumberRange,
    EDraggingGripPoint,
    EAxisAlignment,
    EPolarAxisMode,
    EArrowHeadPosition,
    LineArrowAnnotation,
    Thickness,
    PolarLineRenderableSeries,
    XyDataSeries,
    NumericAxis,
    FastLineRenderableSeries,
    EXyDirection,
    CentralAxesLayoutManager,
    EInnerAxisPlacementCoordinateMode,
    ESciChartSurfaceType,
    EVerticalAnchorPoint,
    LineAnnotation,
    Rect,
    SciChartPolarSubSurface,
    SciChartSubSurface,
    RadianLabelProvider,
    SplineMountainRenderableSeries,
    SplineLineRenderableSeries,
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    TextAnnotation, 
    TLtrbCoordinates
} from "scichart";

import { appTheme } from "../../../theme";
import { LineDumbbellAnnotation } from "./LineDumbbellAnnotation";

function calculateDiameterProjection(x: number, y: number) {
    return {
        x2: x % Math.PI < Math.PI ? Math.PI / 2 : (Math.PI * 3) / 2,
        y2: y * Math.sin(x)
    };
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Add master axes
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            drawLabels: false,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            visibleRange: new NumberRange(0, 100)
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            drawLabels: false,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            visibleRange: new NumberRange(0, 100)
        })
    );

    // 1. add polar subchart
    const polarSub = SciChartPolarSubSurface.createSubSurface(sciChartSurface, {
        surfaceType: ESciChartSurfaceType.Polar2D,
        padding: Thickness.fromNumber(5),
        position: new Rect(0, 0, 0.5, 1) // left half of the screen
    });

    // add polar x / y axes
    const angularAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, Math.PI * 2),
        autoTicks: false,
        majorDelta: Math.PI / 2,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        majorGridLineStyle: { color: "#666666", strokeThickness: 1 },
        labelProvider: new RadianLabelProvider(),
        isInnerAxis: true
    });
    polarSub.xAxes.add(angularAxis);

    const radialAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Left,
        labelPrecision: 0,
        visibleRange: new NumberRange(0, 2),
        autoTicks: false,
        majorDelta: 1,
        flippedCoordinates: false,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        majorGridLineStyle: { color: "#666666", strokeThickness: 1 }
    });
    polarSub.yAxes.add(radialAxis);

    // pointer annotations
    const vector1 = new LineArrowAnnotation({
        x1: 0,
        y1: 0,
        x2: 2.8,
        y2: 1,
        strokeThickness: 3,
        stroke: "#FF0000",
        arrowStyle: {
            headLength: 10,
            headWidth: 10,
            headDepth: 0.6
        },
        isEditable: true,
        dragPoints: [EDraggingGripPoint.x2y2],
        selectionBoxStroke: "#FFAAAA88"
    });
    const vector1ToDiameter = new LineAnnotation({
        stroke: "#AA0000",
        strokeThickness: 3
    });

    const vector2 = new LineArrowAnnotation({
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 0.8,
        strokeThickness: 3,
        stroke: "#00FF00",
        arrowStyle: {
            headLength: 10,
            headWidth: 10,
            headDepth: 0.6
        },
        isEditable: true,
        dragPoints: [EDraggingGripPoint.x2y2],
        selectionBoxStroke: "#AAFFAA88"
    });
    const vector2ToDiameter = new LineAnnotation({
        stroke: "#00AA00",
        strokeThickness: 3
    });

    const vectorSum = new LineArrowAnnotation({
        x1: 0,
        y1: 0,
        strokeThickness: 3,
        stroke: "white",
        arrowStyle: {
            headLength: 10,
            headWidth: 10,
            headDepth: 0.6
        },
        isEditable: false
    });
    const vectorSumToDiameter = new LineAnnotation({
        stroke: "#AAAAAA",
        strokeThickness: 3
    });

    // draw lines from x2y2 of vector1 and vector2 to the x2y2 of vectorSum
    const vector1ToSumLine = new LineAnnotation({
        stroke: "gray",
        strokeThickness: 2
    });
    const vector2ToSumLine = new LineAnnotation({
        stroke: "gray",
        strokeThickness: 2
    });

    polarSub.annotations.add(
        vector1ToSumLine,
        vector2ToSumLine,
        vector1ToDiameter,
        vector1,
        vector2ToDiameter,
        vector2,
        vectorSumToDiameter,
        vectorSum
    );

    function updateAnnotations(relativeCoords: any) {
        if (!vector1 || !vector2) {
            return;
        }

        // Normalize to (0, 1)
        vector1.y2 = Math.min(vector1.y2, 1);
        vector2.y2 = Math.min(vector2.y2, 1);

        const v1x = vector1.y2 * Math.cos(vector1.x2);
        const v1y = vector1.y2 * Math.sin(vector1.x2);

        const v2x = vector2.y2 * Math.cos(vector2.x2);
        const v2y = vector2.y2 * Math.sin(vector2.x2);

        const sumX = v1x + v2x;
        const sumY = v1y + v2y;

        // Convert back to polar coordinates
        vectorSum.x2 = Math.atan2(sumY, sumX); // angle
        vectorSum.y2 = Math.sqrt(sumX * sumX + sumY * sumY); // magnitude

        // Update perpendicular projections
        vector1ToDiameter.x1 = vector1.x2;
        vector1ToDiameter.y1 = vector1.y2;
        const v1Projection = calculateDiameterProjection(vector1.x2, vector1.y2);
        vector1ToDiameter.x2 = v1Projection.x2;
        vector1ToDiameter.y2 = v1Projection.y2;

        vector2ToDiameter.x1 = vector2.x2;
        vector2ToDiameter.y1 = vector2.y2;
        const v2Projection = calculateDiameterProjection(vector2.x2, vector2.y2);
        vector2ToDiameter.x2 = v2Projection.x2;
        vector2ToDiameter.y2 = v2Projection.y2;

        vectorSumToDiameter.x1 = vectorSum.x2;
        vectorSumToDiameter.y1 = vectorSum.y2;
        const sumProjection = calculateDiameterProjection(vectorSum.x2, vectorSum.y2);
        vectorSumToDiameter.x2 = sumProjection.x2;
        vectorSumToDiameter.y2 = sumProjection.y2;

        // Update lines to sum vector
        vector1ToSumLine.x1 = vector1.x2;
        vector1ToSumLine.y1 = vector1.y2;
        vector1ToSumLine.x2 = vectorSum.x2;
        vector1ToSumLine.y2 = vectorSum.y2;

        vector2ToSumLine.x1 = vector2.x2;
        vector2ToSumLine.y1 = vector2.y2;
        vector2ToSumLine.x2 = vectorSum.x2;
        vector2ToSumLine.y2 = vectorSum.y2;
    }

    updateAnnotations(null);

    vector1.dragDelta.subscribe(relativeCoords => updateAnnotations(relativeCoords));
    vector2.dragDelta.subscribe(relativeCoords => updateAnnotations(relativeCoords));

    // ------
    // 2. add cartesian subchart which traces the polar vectors
    const cartesianSub = SciChartSubSurface.createSubSurface(sciChartSurface, {
        surfaceType: ESciChartSurfaceType.Default2D,
        padding: new Thickness(5, 0, 5, 0),
        position: new Rect(0.5, 0, 0.5, 1), // right half of the screen
    });

    // add cartesian x / y axes
    const xAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-0.56, Math.PI * 4),
        autoTicks: false,
        majorDelta: Math.PI / 2,
        labelStyle: { color: "white" },
        labelProvider: new RadianLabelProvider(),
        growBy: new NumberRange(0.2, 0)
    });
    cartesianSub.xAxes.add(xAxis);

    const rectWidth = sciChartSurface?.viewRect.width;
    const rectHeight = sciChartSurface?.viewRect.height;
    const cartesianHeight = rectWidth / 2;

    const growBy = (rectHeight / cartesianHeight) / 4;

    console.log("rectWidth", rectWidth, "rectHeight", rectHeight, "cartesianHeight", cartesianHeight, "growBy", growBy);
    

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        isInnerAxis: true,
        growBy: new NumberRange(-growBy, growBy),
        autoTicks: false,
        majorDelta: 0.5,
        labelStyle: { color: "white" }
    });
    // Force 0 in the middle of the axis and keep it there regardless of zooming
    yAxis.visibleRangeChanged.subscribe(() => {
        const range = yAxis.visibleRange;
        const max = Math.max(Math.abs(range.min), Math.abs(range.max));
        yAxis.visibleRange = new NumberRange(-max, max);
    });
    cartesianSub.yAxes.add(yAxis);

    // add the 3 cartesian projections of the polar vectors
    const vector1DS = new XyDataSeries(wasmContext, {
        xValues: Array.from({ length: 17 }, (_, i) => (i * Math.PI) / 4),
        yValues: Array.from({ length: 17 }, (_, i) => Math.sin(i + 0.25))
    });
    const Vector1Mountain = new SplineMountainRenderableSeries(wasmContext, {
        dataSeries: vector1DS,
        fill: "#BB000033",
        stroke: "#BB0000",
        strokeThickness: 3
    });

    const vector2DS = new XyDataSeries(wasmContext, {
        xValues: Array.from({ length: 17 }, (_, i) => (i * Math.PI) / 4),
        yValues: Array.from({ length: 17 }, (_, i) => Math.sin(i + 2.3))
    });
    const Vector2Mountain = new SplineMountainRenderableSeries(wasmContext, {
        dataSeries: vector2DS,
        fill: "#00FF0033",
        stroke: "#00FF00",
        strokeThickness: 3
    });

    const vectorSumDS = new XyDataSeries(wasmContext, {
        xValues: Array.from({ length: 17 }, (_, i) => (i * Math.PI) / 4),
        yValues: Array.from({ length: 17 }, (_, i) => Math.sin(i + 1.1) * 2)
    });
    const VectorSumMountain = new SplineMountainRenderableSeries(wasmContext, {
        dataSeries: vectorSumDS,
        fill: "#DDDDDD33",
        stroke: "#AAAAAA",
        strokeThickness: 3
    });

    cartesianSub.renderableSeries.add(
        VectorSumMountain,
        Vector1Mountain,
        Vector2Mountain,
    );

    // ----
    // Master annotations:
    const vector1BarbellMain = new LineDumbbellAnnotation({
        x1: 24.6,
        x2: 52.2,
        y1: 58,
        y2: 58,
        stroke: "#880000",
        strokeThickness: 3,
        circleRadius: 1,
        circleStroke: "#880000",
        circleStrokeThickness: 6,
        strokeDashArray: [3, 2]
    });
    const vector2BarbellMain = new LineDumbbellAnnotation({
        x1: 24.6,
        x2: 52.2,
        y1: 70.1,
        y2: 70.1,
        stroke: "#008800",
        strokeThickness: 3,
        circleRadius: 1,
        circleStroke: "#008800",
        circleStrokeThickness: 6,
        strokeDashArray: [3, 2]
    });
    const vectorSumBarbellMain = new LineDumbbellAnnotation({
        x1: 24.6,
        x2: 52.2,
        y1: 78.1,
        y2: 78.1,
        stroke: "#AAAAAA",
        strokeThickness: 3,
        circleRadius: 1,
        circleStroke: "#AAAAAA",
        circleStrokeThickness: 6,
        strokeDashArray: [3, 2]
    });
    sciChartSurface.annotations.add(vector1BarbellMain, vector2BarbellMain, vectorSumBarbellMain);

    return { sciChartSurface, wasmContext };
}
