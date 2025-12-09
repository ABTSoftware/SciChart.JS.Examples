import {
    ENumericFormat,
    EllipsePointMarker,
    FastLineRenderableSeries,
    LegendModifier,
    LogarithmicAxis,
    MouseWheelZoomModifier,
    NumericAxis,
    RubberBandXyZoomModifier,
    SciChartSurface,
    SweepAnimation,
    XyDataSeries,
    Thickness,
    ZoomExtentsModifier,
    IndexAxis,
    NumericLabelProvider,
    NumberRange,
    CategoryAxis,
    EAxisAlignment,
    SmartDateLabelProvider,
    AxisMarkerAnnotation,
    ELabelPlacement,
    LabelProviderBase2D,
    ZoomPanModifier,
} from "scichart";
import { appTheme } from "../../../theme";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";

const X_AXIS_LINEAR_ID = "X_AXIS_LINEAR_ID";
const X_AXIS_INDEX_ID = "X_AXIS_INDEX_ID";
const Y_AXIS_LINEAR_ID = "Y_AXIS_LINEAR_ID";
const X_AXIS_CATEGORY_ID = "X_AXIS_CATEGORY_ID";

// Helper function to create data series
const createDataSeries = (wasmContext: any) => {
    const lineDataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5, 8, 9],
        yValues: [1, 4, 3, 5.21, 2, 2, 1.3],
    });

    const lineDataSeries1 = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 2, 4, 5, 8, 9],
        yValues: [1, 4, 3, 5.21, 2, 2, 1.3].map((d) => d + 1),
    });

    const lineDataSeries2 = new XyDataSeries(wasmContext, {
        xValues: [1, 3, 3, 4, 5, 8, 9],
        yValues: [1, 4, 3, 5.21, 2, 2, 1.3].map((d) => d + 2),
    });

    return { lineDataSeries, lineDataSeries1, lineDataSeries2 };
};

// Helper function to add series to a chart
const addSeriesToChart = (sciChartSurface: SciChartSurface, wasmContext: any, dataSeries: any) => {
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: dataSeries.lineDataSeries,
            stroke: appTheme.VividOrange,
            opacity: 0.7,
            strokeThickness: 4,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 8,
                height: 8,
                fill: appTheme.VividOrange,
                strokeThickness: 0,
                opacity: 0.7,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 0 }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: dataSeries.lineDataSeries1,
            stroke: appTheme.VividRed,
            opacity: 0.7,
            strokeThickness: 4,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 8,
                height: 8,
                fill: appTheme.VividRed,
                strokeThickness: 0,
                opacity: 0.7,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 100 }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: dataSeries.lineDataSeries2,
            stroke: appTheme.VividSkyBlue,
            opacity: 0.7,
            strokeThickness: 4,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 8,
                height: 8,
                fill: appTheme.VividSkyBlue,
                strokeThickness: 0,
                opacity: 0.7,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 200 }),
        })
    );
};

// Create Index Axis Chart
const createIndexChart = async (rootElement: HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: appTheme.MutedSkyBlue + "55",
            minorGridLineBrush: appTheme.MutedSkyBlue + "22",
        },
        title: "Index X Axis",
        titleStyle: {
            fontSize: 16,
            fontWeight: "bold",
            placeWithinChart: true,
            color: appTheme.ForegroundColor + "C4",
            padding: Thickness.fromString("8 0 4 0"),
        },
    });

    const xAxisIndex = new IndexAxis(wasmContext, {
        flippedCoordinates: false,
        labelPrecision: 3,
        cursorLabelPrecision: 2,
        autoTicks: true,
        majorDelta: 10,
        minorDelta: 2,
        labelProvider: new NumericLabelProvider(),
        isVisible: true,
        id: X_AXIS_INDEX_ID,
        // visibleRange: new NumberRange(-1, 12)
        growBy: new NumberRange(0.07, 0.07),
    });

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        isVisible: true,
        id: Y_AXIS_LINEAR_ID,
        growBy: new NumberRange(0.1, 0.3),
    });

    sciChartSurface.xAxes.add(xAxisIndex);
    sciChartSurface.yAxes.add(yAxisLinear);

    const dataSeries = createDataSeries(wasmContext);
    addSeriesToChart(sciChartSurface, wasmContext, dataSeries);

    // Add axis marker annotations
    const axisMarker5 = new AxisMarkerAnnotation({
        x1: 5,
        backgroundColor: appTheme.VividPink,
        opacity: 0.6,
        formattedValue: "5",
        color: appTheme.ForegroundColor,
        fontSize: 10,
        fontWeight: "bold",
    });

    const axisMarker8 = new AxisMarkerAnnotation({
        x1: 8,
        backgroundColor: appTheme.VividGreen,
        opacity: 0.6,
        formattedValue: "8",
        color: appTheme.ForegroundColor,
        fontSize: 10,
        fontWeight: "bold",
    });

    sciChartSurface.annotations.add(axisMarker5, axisMarker8);

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomExtentsModifier(), new ZoomPanModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

// Create Linear Axis Chart
const createLinearChart = async (rootElement: HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: appTheme.MutedSkyBlue + "55",
            minorGridLineBrush: appTheme.MutedSkyBlue + "22",
        },
        title: "Numeric X Axis",
        titleStyle: {
            fontSize: 16,
            fontWeight: "bold",
            placeWithinChart: true,
            color: appTheme.ForegroundColor + "C4",
            padding: Thickness.fromString("8 0 4 0"),
        },
    });

    const xAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        isVisible: true,
        id: X_AXIS_LINEAR_ID,
        growBy: new NumberRange(0.094, 0.094),
    });

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        isVisible: true,
        id: Y_AXIS_LINEAR_ID,
        growBy: new NumberRange(0.1, 0.3),
    });

    sciChartSurface.xAxes.add(xAxisLinear);
    sciChartSurface.yAxes.add(yAxisLinear);

    const dataSeries = createDataSeries(wasmContext);
    addSeriesToChart(sciChartSurface, wasmContext, dataSeries);

    // Add axis marker annotations
    const axisMarker5 = new AxisMarkerAnnotation({
        x1: 5,
        backgroundColor: appTheme.VividPink,
        opacity: 0.6,
        formattedValue: "5",
        color: appTheme.ForegroundColor,
        fontSize: 10,
        fontWeight: "bold",
    });

    const axisMarker8 = new AxisMarkerAnnotation({
        x1: 8,
        backgroundColor: appTheme.VividGreen,
        opacity: 0.6,
        formattedValue: "8",
        color: appTheme.ForegroundColor,
        fontSize: 10,
        fontWeight: "bold",
    });

    sciChartSurface.annotations.add(axisMarker5, axisMarker8);

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomExtentsModifier(), new ZoomPanModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

// Create Category Axis Chart
const createCategoryChart = async (rootElement: HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: appTheme.MutedSkyBlue + "55",
            minorGridLineBrush: appTheme.MutedSkyBlue + "22",
        },
        title: "Category X Axis",
        titleStyle: {
            fontSize: 16,
            fontWeight: "bold",
            placeWithinChart: true,
            color: appTheme.ForegroundColor + "C4",
            padding: Thickness.fromString("8 0 4 0"),
        },
    });

    const xAxisCategory = new CategoryAxis(wasmContext, {
        isVisible: true,
        id: X_AXIS_CATEGORY_ID,
        growBy: new NumberRange(0.009, 0.009),
        labels: [1, 2, 3, 4, 5, 8, 9].map((d) => d.toString()),
    });

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        isVisible: true,
        id: Y_AXIS_LINEAR_ID,
        growBy: new NumberRange(0.1, 0.3),
    });

    sciChartSurface.xAxes.add(xAxisCategory);
    sciChartSurface.yAxes.add(yAxisLinear);

    const categoryDataSeries = createDataSeries(wasmContext);

    addSeriesToChart(sciChartSurface, wasmContext, categoryDataSeries);

    // Add axis marker annotations - for category axis, use indices
    const axisMarker5 = new AxisMarkerAnnotation({
        x1: 4, // Index for label "5"
        backgroundColor: appTheme.VividPink,
        opacity: 0.6,
        formattedValue: "5",
        color: appTheme.ForegroundColor,
        fontSize: 10,
        fontWeight: "bold",
    });

    const axisMarker8 = new AxisMarkerAnnotation({
        x1: 5, // Index for label "8"
        backgroundColor: appTheme.VividGreen,
        opacity: 0.6,
        formattedValue: "8",
        color: appTheme.ForegroundColor,
        fontSize: 10,
        fontWeight: "bold",
    });

    sciChartSurface.annotations.add(axisMarker5, axisMarker8);

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomExtentsModifier(), new ZoomPanModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

// Export individual chart creation functions for separate components
export const drawIndexChart = async (rootElement: string | HTMLDivElement) => {
    const result = await createIndexChart(rootElement as HTMLDivElement);
    return {
        sciChartSurface: result.sciChartSurface,
        wasmContext: result.wasmContext,
    };
};

export const drawLinearChart = async (rootElement: string | HTMLDivElement) => {
    const result = await createLinearChart(rootElement as HTMLDivElement);
    return {
        sciChartSurface: result.sciChartSurface,
        wasmContext: result.wasmContext,
    };
};

export const drawCategoryChart = async (rootElement: string | HTMLDivElement) => {
    const result = await createCategoryChart(rootElement as HTMLDivElement);
    return {
        sciChartSurface: result.sciChartSurface,
        wasmContext: result.wasmContext,
    };
};
