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
    ZoomExtentsModifier,
    Thickness,
} from "scichart";
import { appTheme } from "../../../theme";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";

const Y_AXIS_LINEAR_ID = "Y_AXIS_LINEAR_ID";
const X_AXIS_LINEAR_ID = "X_AXIS_LINEAR_ID";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: appTheme.MutedSkyBlue + "55",
            minorGridLineBrush: appTheme.MutedSkyBlue + "22",
        },
        title: "Logarithmic X & Y Axis",
        titleStyle: {
            fontSize: 20,
            fontWeight: "Bold",
            placeWithinChart: true,
            color: appTheme.ForegroundColor + "C4",
            padding: Thickness.fromString("10 0 4 0"),
        },
    });

    // Create an X and Y Axis
    const xAxisLogarithmic = new LogarithmicAxis(wasmContext, {
        logBase: 10,
        labelFormat: ENumericFormat.Scientific,
        labelPrecision: 2,
        minorsPerMajor: 10,
    });
    sciChartSurface.xAxes.add(xAxisLogarithmic);

    // The LogarithmicAxis will apply logarithmic scaling and labelling to your data.
    // Simply replace a NumericAxis for a LogarithmicAxis on X or Y to apply this scaling
    // Note options logBase, labelFormat which lets you specify exponent on labels
    const yAxisLogarithmic = new LogarithmicAxis(wasmContext, {
        logBase: 10,
        labelFormat: ENumericFormat.Scientific,
        labelPrecision: 2,
        minorsPerMajor: 10,
    });
    sciChartSurface.yAxes.add(yAxisLogarithmic);

    const xAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        isVisible: false,
        id: X_AXIS_LINEAR_ID,
    });
    sciChartSurface.xAxes.add(xAxisLinear);

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        isVisible: false,
        id: Y_AXIS_LINEAR_ID,
    });
    sciChartSurface.yAxes.add(yAxisLinear);

    // Create some data
    const data0 = ExampleDataProvider.getExponentialCurve(2, 100);
    const data1 = ExampleDataProvider.getExponentialCurve(2.2, 100);
    const data2 = ExampleDataProvider.getExponentialCurve(2.4, 100);

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: data0.xValues,
                yValues: data0.yValues,
                dataSeriesName: "y = x ^ 2",
            }),
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 7,
                height: 7,
                fill: appTheme.VividSkyBlue,
                strokeThickness: 0,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 0 }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: data1.xValues,
                yValues: data1.yValues,
                dataSeriesName: "y = x ^ 2.2",
            }),
            stroke: appTheme.VividPink,
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 7,
                height: 7,
                fill: appTheme.VividPink,
                strokeThickness: 0,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 0 }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: data2.xValues,
                yValues: data2.yValues,
                dataSeriesName: "y = x ^ 2.4",
            }),
            stroke: appTheme.VividOrange,
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 7,
                height: 7,
                fill: appTheme.VividOrange,
                strokeThickness: 0,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 0 }),
        })
    );

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new RubberBandXyZoomModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new LegendModifier({ showCheckboxes: false })
    );

    sciChartSurface.zoomExtents();
    return {
        sciChartSurface,
        wasmContext,
        yAxisLogarithmic,
        yAxisLinear,
        xAxisLinear,
        xAxisLogarithmic,
    };
};
