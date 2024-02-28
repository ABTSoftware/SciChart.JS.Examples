import { appTheme, ExampleDataProvider } from "scichart-example-dependencies";
import {
    ENumericFormat,
    FastBandRenderableSeries,
    FastLineRenderableSeries,
    FastMountainRenderableSeries,
    GradientParams,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    Point,
    SciChartSurface,
    XyDataSeries,
    XyyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
// tslint:disable:no-empty
// tslint:disable:max-classes-per-file
export const drawExample = async (rootElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Create XAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { labelFormat: ENumericFormat.Decimal, labelPrecision: 2 }));
    // Create YAxis
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
        })
    );
    // Create a Mountain series with a dashed line
    sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: appTheme.VividSkyBlue + "77", offset: 0 },
                { color: "Transparent", offset: 0.5 },
            ]),
            strokeThickness: 3,
            dataSeries: createLineData(wasmContext, 2),
            // Strokedash array defines the stroke dash. [10,5] means draw for 10pts, gap for 5pts
            strokeDashArray: [10, 5],
        })
    );
    // Create a line series with a dotted line
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 2,
            dataSeries: createLineData(wasmContext, 1),
            // Strokedash array defines the stroke dash. [5,5] means draw for 5pts, gap for 5pts
            strokeDashArray: [5, 5],
        })
    );
    // Create a line series a dotted line
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 2,
            dataSeries: createLineData(wasmContext, 0),
            // Strokedash array defines the stroke dash. [3,3] means draw for 3pt, gap for 3pt
            strokeDashArray: [3, 3],
        })
    );
    // Create a band series with dashed lines and add to the chart
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: createBandData(wasmContext),
            strokeThickness: 2,
            fill: appTheme.VividSkyBlue + "33",
            fillY1: appTheme.VividSkyBlue + "33",
            stroke: appTheme.VividSkyBlue,
            strokeY1: appTheme.VividSkyBlue,
            // strokeDashArray: [10, 10],
            // strokeY1DashArray: [3, 3]
        })
    );
    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};
// Creates some dummy data and appends into an XyDataSeries for the example
const createLineData = (wasmContext, whichSeries) => {
    const data = ExampleDataProvider.getFourierSeriesZoomed(1.0, 0.1, 5.0, 5.15);
    const xyDataSeries = new XyDataSeries(wasmContext);
    xyDataSeries.appendRange(
        data.xValues,
        data.yValues.map((y) => (whichSeries === 0 ? y : whichSeries === 1 ? y * 1.1 : y * 1.5))
    );
    return xyDataSeries;
};
const createBandData = (wasmContext) => {
    const data0 = ExampleDataProvider.getFourierSeriesZoomed(0.6, 0.13, 5.0, 5.15);
    const data1 = ExampleDataProvider.getFourierSeriesZoomed(0.5, 0.12, 5.0, 5.15);
    const xyyDataSeries = new XyyDataSeries(wasmContext);
    xyyDataSeries.appendRange(data0.xValues, data0.yValues, data1.yValues);
    return xyyDataSeries;
};
