import { appTheme } from "scichart-example-dependencies";
import {
    EllipsePointMarker,
    MouseWheelZoomModifier,
    NumericAxis,
    NumberRange,
    SciChartSurface,
    SweepAnimation,
    TrianglePointMarker,
    XyDataSeries,
    XyScatterRenderableSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Create X,Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));
    // Create some xValues, yValues arrays
    const xValues = Array.from({ length: 250 }, (x, i) => i);
    const yValues = xValues.map((x) => 3 * x + x * Math.random());
    const y2Values = xValues.map((x) => x + x * Math.random());
    // Create a Scatter Series with EllipsePointMarker
    // Multiple point-marker types are available including Square, Triangle, Cross and Sprite (custom)
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 14,
                height: 14,
                strokeThickness: 0,
                fill: appTheme.VividSkyBlue,
            }),
            opacity: 0.67,
            animation: new SweepAnimation({ duration: 600, fadeEffect: true }),
        })
    );
    // Add a second scatter chart with a different pointmarker
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y2Values }),
            pointMarker: new TrianglePointMarker(wasmContext, {
                width: 15,
                height: 15,
                strokeThickness: 0,
                fill: appTheme.VividOrange,
            }),
            opacity: 0.77,
            animation: new SweepAnimation({ duration: 600, fadeEffect: true, delay: 200 }),
        })
    );
    // Optional: Add Interactivity Modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};
