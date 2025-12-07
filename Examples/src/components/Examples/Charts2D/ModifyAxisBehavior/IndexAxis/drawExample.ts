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
} from "scichart";
import { appTheme } from "../../../theme";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";

const X_AXIS_LINEAR_ID = "X_AXIS_LINEAR_ID";
const X_AXIS_INDEX_ID = "X_AXIS_INDEX_ID";
const Y_AXIS_LINEAR_ID = "Y_AXIS_LINEAR_ID";
const X_AXIS_CATEGORY_ID = "X_AXIS_CATEGORY_ID";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: appTheme.MutedSkyBlue + "55",
            minorGridLineBrush: appTheme.MutedSkyBlue + "22",
        },
        title: "Index X Axis",
        titleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            placeWithinChart: true,
            color: appTheme.ForegroundColor + "C4",
            padding: Thickness.fromString("10 0 4 0"),
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
        growBy: new NumberRange(0.1, 0.1),
        id: X_AXIS_INDEX_ID,
    });

    sciChartSurface.xAxes.add(xAxisIndex);

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

    const xAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        isVisible: false,
        id: X_AXIS_LINEAR_ID,
        growBy: new NumberRange(0.1, 0.1),
    });
    sciChartSurface.xAxes.add(xAxisLinear);

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        isVisible: true,
        id: Y_AXIS_LINEAR_ID,
        growBy: new NumberRange(0.1, 0.3),
    });
    sciChartSurface.yAxes.add(yAxisLinear);

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: lineDataSeries,
            stroke: appTheme.VividOrange,
            strokeThickness: 6,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                fill: appTheme.VividOrange,
                strokeThickness: 0,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 0 }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: lineDataSeries1,
            stroke: appTheme.VividRed,
            strokeThickness: 6,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                fill: appTheme.VividRed,
                strokeThickness: 0,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 0 }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: lineDataSeries2,
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 6,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                fill: appTheme.VividSkyBlue,
                strokeThickness: 0,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 0 }),
        })
    );

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new RubberBandXyZoomModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier()
        // new LegendModifier({ showCheckboxes: false })
    );

    // Add axis marker annotations at values 5 and 8
    const axisMarker5 = new AxisMarkerAnnotation({
        x1: 5,
        backgroundColor: appTheme.VividPink,
        formattedValue: "5",
        color: appTheme.ForegroundColor,
        fontSize: 12,
        fontWeight: "bold",
    });

    const axisMarker8 = new AxisMarkerAnnotation({
        x1: 8,
        backgroundColor: appTheme.VividGreen,
        formattedValue: "8",
        color: appTheme.ForegroundColor,
        fontSize: 12,
        fontWeight: "bold",
    });

    sciChartSurface.annotations.add(axisMarker5, axisMarker8);

    sciChartSurface.zoomExtents();
    
    // Return chart components for axis switching functionality
    return {
        sciChartSurface,
        wasmContext,
        yAxisLinear,
        xAxisLinear,
        xAxisIndex,
    };
};
