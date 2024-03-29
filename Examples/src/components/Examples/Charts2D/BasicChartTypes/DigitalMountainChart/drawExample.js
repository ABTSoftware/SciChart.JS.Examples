import {
    FastMountainRenderableSeries,
    GradientParams,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    Point,
    RubberBandXyZoomModifier,
    SciChartSurface,
    WaveAnimation,
    XyDataSeries,
    ZoomExtentsModifier,
} from "scichart";
import { appTheme, RandomWalkGenerator } from "scichart-example-dependencies";
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Create an XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis" }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
            axisTitle: "Y Axis",
        })
    );
    const POINTS = 200;
    // Create arrays of x, y values
    const xValues = Array.from(Array(POINTS).keys());
    const yValues = new RandomWalkGenerator().Seed(0).getRandomWalkSeries(POINTS).yValues;
    // Create a Mountain Series and add to the chart
    const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        stroke: appTheme.VividOrange,
        strokeThickness: 3,
        zeroLineY: 0.0,
        fill: appTheme.VividOrange,
        // when a gradient is required, use fillLinearGradient
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: appTheme.MutedOrange, offset: 0 },
            { color: "Transparent", offset: 1 },
        ]),
        isDigitalLine: true,
        animation: new WaveAnimation({ duration: 1000, fadeEffect: true, zeroLine: 0 }),
    });
    sciChartSurface.renderableSeries.add(mountainSeries);
    // Optional: Add some interactivity to the chart
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new RubberBandXyZoomModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};
