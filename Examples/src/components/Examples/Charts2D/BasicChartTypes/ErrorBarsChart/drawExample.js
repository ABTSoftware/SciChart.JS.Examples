import { appTheme } from "scichart-example-dependencies";
import {
    NumericAxis,
    XyDataSeries,
    SciChartSurface,
    NumberRange,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    HlcDataSeries,
    PinchZoomModifier,
    EllipsePointMarker,
    FastErrorBarsRenderableSeries,
    EErrorMode,
    EErrorDirection,
    EDataPointWidthMode,
    EAnimationType,
    SplineMountainRenderableSeries,
    GradientParams,
    Point,
} from "scichart";
export const drawExample = async (rootElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    // Xy values for the data
    const xValues = [0, 1, 2, 2.5, 4.5, 5, 6, 7, 8];
    const yValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];
    const randomError = () => Math.random() * 0.2 + 0.2;
    // Low high error (absolute values)
    const lowValues = yValues.map((y) => y - randomError());
    const highValues = yValues.map((y) => y + randomError());
    // Left/right error (absolute values)
    const leftValues = xValues.map((x) => x - randomError());
    const rightValues = xValues.map((x) => x + randomError());
    // add optional mountain series. We use Spline type, for higher performance use FastLine or FastMountainRenderableSeries
    const lineSeries = new SplineMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        strokeThickness: 5,
        stroke: appTheme.VividSkyBlue,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { offset: 0, color: appTheme.VividSkyBlue + "77" },
            { offset: 1, color: "Transparent" },
        ]),
        animation: { type: EAnimationType.Sweep, options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 } },
    });
    sciChartSurface.renderableSeries.add(lineSeries);
    // Define Horizontal Error Bars Series, Error bars require HLC data with absolute values for error whiskers
    const errorBarsHorizontalSeries = new FastErrorBarsRenderableSeries(wasmContext, {
        dataSeries: new HlcDataSeries(wasmContext, {
            xValues,
            yValues,
            highValues: leftValues,
            lowValues: rightValues,
        }),
        errorMode: EErrorMode.Both,
        errorDirection: EErrorDirection.Horizontal,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.3,
        strokeThickness: 4,
        stroke: appTheme.VividSkyBlue + "77",
        animation: { type: EAnimationType.Sweep, options: { zeroLine: 0, pointDurationFraction: 0.5, duration: 500 } },
    });
    sciChartSurface.renderableSeries.add(errorBarsHorizontalSeries);
    // Define Vertical Error Bars Series, Error bars require HLC data with absolute values for error whiskers
    const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
        dataSeries: new HlcDataSeries(wasmContext, { xValues, yValues, highValues, lowValues }),
        errorMode: EErrorMode.Both,
        errorDirection: EErrorDirection.Vertical,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.3,
        strokeThickness: 4,
        stroke: appTheme.VividSkyBlue,
        animation: { type: EAnimationType.Sweep, options: { zeroLine: 0, pointDurationFraction: 0.5, duration: 500 } },
        // Add optional pointmarker (or use separate XyScatterRenderableSeries)
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 9,
            height: 9,
            strokeThickness: 0,
            fill: appTheme.VividOrange,
        }),
    });
    sciChartSurface.renderableSeries.add(errorBarsSeries);
    // add some interactivity
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new PinchZoomModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();
    return { sciChartSurface };
};
