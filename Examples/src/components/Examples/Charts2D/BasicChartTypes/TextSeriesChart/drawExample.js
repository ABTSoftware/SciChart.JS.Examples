import { appTheme } from "scichart-example-dependencies";
import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    LogarithmicAxis,
    ENumericFormat,
    XyTextDataSeries,
    FastTextRenderableSeries,
} from "scichart";
// tslint:disable:no-empty
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    const xAxis = new LogarithmicAxis(wasmContext, {
        axisTitle: "Number of Tweets",
        logBase: 2,
        labelFormat: ENumericFormat.SignificantFigures,
        growBy: new NumberRange(0, 0.1),
    });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Average Sentiment",
            labelPrecision: 2,
            visibleRange: new NumberRange(0, 1.01),
            visibleRangeLimit: new NumberRange(0, 1.01),
        })
    );
    // data is { xValues: number[], yValues: number[], textValues: string[] }
    const data = await fetch("https://demo.scichart.com/api/tweetData").then((r) => r.json());
    const series = new FastTextRenderableSeries(wasmContext, {
        dataLabels: { style: { fontFamily: "arial", fontSize: 10 }, calculateTextBounds: false },
        dataSeries: new XyTextDataSeries(wasmContext, data),
    });
    sciChartSurface.renderableSeries.add(series);
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
    return { sciChartSurface, wasmContext };
};
