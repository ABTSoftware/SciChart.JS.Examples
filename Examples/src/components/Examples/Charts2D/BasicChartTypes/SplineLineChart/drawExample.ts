import { appTheme } from "../../../theme";
import {
    ELegendOrientation,
    EllipsePointMarker,
    FastLineRenderableSeries,
    LegendModifier,
    MouseWheelZoomModifier,
    NumericAxis,
    NumberRange,
    SciChartSurface,
    SplineLineRenderableSeries,
    WaveAnimation,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
    BezierRenderDataTransform,
} from "scichart";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create the X,Y Axis
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.2) });
    sciChartSurface.yAxes.add(yAxis);

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const yValues = [50, 35, 61, 58, 50, 50, 40, 53, 55, 23, 45, 12, 59, 60];

    // Create an XyDataSeries as data source
    const xyDataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "Original Data ",
        xValues,
        yValues,
    });

    const splineXyDataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "Cubic Spline",
        xValues,
        yValues,
    });

    // Create and add a standard line series to the chart.
    // This will be used to compare the spline (smoothed) algorithm
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: appTheme.VividOrange,
        strokeThickness: 3,
        dataSeries: xyDataSeries,
        animation: new WaveAnimation({ zeroLine: 10, pointDurationFraction: 0.5, duration: 1000 }),
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    // Create and add a Spline line series to the chart
    const splineSeries = new SplineLineRenderableSeries(wasmContext, {
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 4,
        dataSeries: splineXyDataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 11,
            height: 11,
            fill: appTheme.ForegroundColor,
            stroke: appTheme.VividSkyBlue,
        }),
        interpolationPoints: 10, // Set interpolation points to decide the amount of smoothing,
        animation: new WaveAnimation({ zeroLine: 10, pointDurationFraction: 0.5, duration: 1000, fadeEffect: true }),
    });
    sciChartSurface.renderableSeries.add(splineSeries);

    const bezierDataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "Range Restricted Bezier",
        xValues,
        yValues,
    });

    const bezierSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: appTheme.VividPurple,
        strokeThickness: 4,
        dataSeries: bezierDataSeries,
        animation: new WaveAnimation({ zeroLine: 10, pointDurationFraction: 0.5, duration: 1000, fadeEffect: true }),
    });
    bezierSeries.renderDataTransform = new BezierRenderDataTransform(bezierSeries, wasmContext, [
        bezierSeries.drawingProviders[0],
    ]);
    sciChartSurface.renderableSeries.add(bezierSeries);

    // OPTIONAL: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(
        new LegendModifier({ orientation: ELegendOrientation.Vertical, showCheckboxes: true })
    );

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};
