import { appTheme } from "scichart-example-dependencies";
import {
    EllipsePointMarker,
    GradientParams,
    MouseWheelZoomModifier,
    NumericAxis,
    NumberRange,
    Point,
    RubberBandXyZoomModifier,
    SciChartSurface,
    SplineMountainRenderableSeries,
    WaveAnimation,
    XyDataSeries,
    ZoomExtentsModifier,
} from "scichart";
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Create an XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis" }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.2),
            axisTitle: "Y Axis",
        })
    );
    // Create some data to add to the chart
    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const yValues = [50, 35, 61, 58, 50, 50, 40, 53, 55, 23, 45, 12, 59, 60];
    // Create a Spline Mountain Series and add to the chart
    sciChartSurface.renderableSeries.add(
        new SplineMountainRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            interpolationPoints: 20,
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 5,
            zeroLineY: 0.0,
            fill: appTheme.VividSkyBlue,
            // when a gradient is required, use fillLinearGradient
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: appTheme.MutedSkyBlue, offset: 0 },
                { color: "Transparent", offset: 1 },
            ]),
            pointMarker: new EllipsePointMarker(wasmContext, {
                strokeThickness: 3,
                width: 13,
                height: 13,
                stroke: appTheme.VividSkyBlue,
                fill: appTheme.ForegroundColor,
            }),
            animation: new WaveAnimation({ duration: 1000, fadeEffect: true, zeroLine: 10 }),
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
