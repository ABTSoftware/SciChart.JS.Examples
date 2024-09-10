import {
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    XyyDataSeries,
    NumericAxis,
    FastBandRenderableSeries,
    SciChartSurface,
    NumberRange,
    SweepAnimation,
    GradientParams,
    Point,
} from "scichart";
import { appTheme } from "../../../theme";
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    // Create some data for the example. We need X, Y and Y1 values
    const xValues = [];
    const yValues = [];
    const y1Values = [];
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        const k = 1 - i / 2000;
        xValues.push(i);
        yValues.push(Math.sin(i * STEP) * k * 0.7);
        y1Values.push(Math.cos(i * STEP) * k);
    }
    // Create the band series and add to the chart
    // The bandseries requires a special dataseries type called XyyDataSeries with X,Y and Y1 values
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: new XyyDataSeries(wasmContext, { xValues, yValues, y1Values }),
            strokeThickness: 3,
            fill: appTheme.VividOrange + "33",
            fillY1: appTheme.VividSkyBlue + "33",
            stroke: appTheme.VividOrange,
            strokeY1: appTheme.VividSkyBlue,
            animation: new SweepAnimation({ duration: 800 }),
        })
    );
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: new XyyDataSeries(wasmContext, {
                xValues,
                yValues: yValues.map((y) => y - 2),
                y1Values: y1Values.map((y) => y - 2),
            }),
            strokeThickness: 3,
            stroke: appTheme.VividOrange,
            strokeY1: appTheme.VividSkyBlue,
            fillLinearGradient: new GradientParams(new Point(0, 0.6), new Point(0, 0.9), [
                { color: appTheme.MutedRed + "99", offset: 0 },
                { color: appTheme.MutedOrange + "99", offset: 1 },
            ]),
            fillLinearGradientY1: new GradientParams(new Point(0, 0.6), new Point(0, 0.9), [
                { color: appTheme.MutedPurple + "99", offset: 0 },
                { color: appTheme.MutedTeal + "99", offset: 1 },
            ]),
            animation: new SweepAnimation({ duration: 800 }),
        })
    );
    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};
