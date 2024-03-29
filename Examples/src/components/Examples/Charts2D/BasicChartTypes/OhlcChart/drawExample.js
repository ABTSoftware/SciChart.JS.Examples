import { closeValues, dateValues as xValues, highValues, lowValues, openValues } from "./data/data";
import {
    CategoryAxis,
    ENumericFormat,
    FastOhlcRenderableSeries,
    MouseWheelZoomModifier,
    NumericAxis,
    NumberRange,
    OhlcDataSeries,
    SciChartSurface,
    SmartDateLabelProvider,
    SweepAnimation,
    ZoomExtentsModifier,
    ZoomPanModifier,
    SciChartJsNavyTheme,
} from "scichart";
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme(),
    });
    // Add an XAxis of type CategoryAxis - which collapses gaps in stock market data
    // SmartLabelProvider returns useful labels for stock market data
    sciChartSurface.xAxes.add(
        new CategoryAxis(wasmContext, {
            labelProvider: new SmartDateLabelProvider(),
            growBy: new NumberRange(0.05, 0.05),
        })
    );
    // Create a NumericAxis on the YAxis with 4 Decimal Places
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(1.1, 1.2),
            growBy: new NumberRange(0.1, 0.1),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 4,
        })
    );
    // Create the Ohlc series and add to the chart
    sciChartSurface.renderableSeries.add(
        new FastOhlcRenderableSeries(wasmContext, {
            dataSeries: new OhlcDataSeries(wasmContext, { xValues, openValues, highValues, lowValues, closeValues }),
            strokeThickness: 1,
            dataPointWidth: 0.7,
            strokeUp: "#50ff50",
            strokeDown: "#ff5050",
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
        })
    );
    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};
