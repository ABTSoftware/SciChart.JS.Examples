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
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
        })
    );
    const POINTS = 1000;
    // Create arrays of x, y values (just arrays of numbers)
    const { xValues, yValues } = new RandomWalkGenerator().Seed(0).getRandomWalkSeries(POINTS);
    // Create a Mountain Series and add to the chart
    sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 3,
            zeroLineY: 0.0,
            fill: appTheme.VividSkyBlue,
            // when a gradient is required, use fillLinearGradient
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: appTheme.MutedSkyBlue, offset: 0 },
                { color: "Transparent", offset: 1 },
            ]),
            animation: new WaveAnimation({ duration: 1000, fadeEffect: true, zeroLine: 0 }),
        })
    );
    // Optional: Add some interactivity to the chart
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new RubberBandXyZoomModifier(),
        new MouseWheelZoomModifier()
    );
    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};
