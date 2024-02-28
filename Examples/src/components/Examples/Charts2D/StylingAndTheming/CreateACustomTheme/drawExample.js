import { closeValues, dateValues, highValues, lowValues, openValues } from "./data/themeing2dData";
import {
    FastCandlestickRenderableSeries,
    FastColumnRenderableSeries,
    FastLineRenderableSeries,
    NumericAxis,
    NumberRange,
    OhlcDataSeries,
    RolloverModifier,
    SciChartSurface,
    XyDataSeries,
} from "scichart";
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);
    // Create and apply your custom theme
    sciChartSurface.applyTheme({
        annotationsGripsBackroundBrush: "white",
        annotationsGripsBorderBrush: "white",
        axis3DBandsFill: "#1F3D6833",
        axisBandsFill: "#1F3D6833",
        axisBorder: "#1F3D68",
        axisPlaneBackgroundFill: "Transparent",
        columnFillBrush: "white",
        columnLineColor: "white",
        cursorLineBrush: "#6495ED99",
        defaultColorMapBrush: [
            { offset: 0, color: "DarkBlue" },
            { offset: 0.5, color: "CornflowerBlue" },
            { offset: 1, color: "#FF22AA" },
        ],
        downBandSeriesFillColor: "#52CC5490",
        downBandSeriesLineColor: "#E26565FF",
        downBodyBrush: "white",
        downWickColor: "white",
        gridBackgroundBrush: "white",
        gridBorderBrush: "white",
        labelBackgroundBrush: "#6495EDAA",
        labelBorderBrush: "#6495ED",
        labelForegroundBrush: "#EEEEEE",
        legendBackgroundBrush: "#1D2C35",
        lineSeriesColor: "white",
        loadingAnimationForeground: "#6495ED",
        loadingAnimationBackground: "#0D213A",
        majorGridLineBrush: "#1F3D68",
        minorGridLineBrush: "#102A47",
        mountainAreaBrush: "white",
        mountainLineColor: "white",
        overviewFillBrush: "white",
        planeBorderColor: "white",
        rolloverLineBrush: "#FD9F2533",
        rubberBandFillBrush: "#99999933",
        rubberBandStrokeBrush: "#99999977",
        sciChartBackground: "#0D213A",
        scrollbarBackgroundBrush: "white",
        scrollbarBorderBrush: "white",
        scrollbarGripsBackgroundBrush: "white",
        scrollbarViewportBackgroundBrush: "white",
        scrollbarViewportBorderBrush: "white",
        shadowEffectColor: "white",
        textAnnotationBackground: "#6495EDAA",
        textAnnotationForeground: "#EEEEEE",
        tickTextBrush: "#6495ED",
        upBandSeriesFillColor: "white",
        upBandSeriesLineColor: "white",
        upBodyBrush: "#6495EDA0",
        upWickColor: "#6495ED",
        axisTitleColor: "#EEEEEE",
        chartTitleColor: "#EEEEEE",
    });
    // Create the XAxis, YAxis
    const xAxis = new NumericAxis(wasmContext);
    xAxis.visibleRange = new NumberRange(0, 31);
    xAxis.axisTitle = "X Axis";
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(1, 1.2);
    yAxis.labelProvider.formatLabel = (dataValue) => dataValue.toFixed(3);
    sciChartSurface.yAxes.add(yAxis);
    // Create some series with data
    const series1 = new FastLineRenderableSeries(wasmContext);
    series1.strokeThickness = 3;
    sciChartSurface.renderableSeries.add(series1);
    series1.dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 15, 30],
        yValues: [1.12, 1.11, 1.1],
    });
    const series2 = new FastCandlestickRenderableSeries(wasmContext, {
        strokeThickness: 2,
        dataSeries: new OhlcDataSeries(wasmContext, {
            xValues: dateValues,
            openValues,
            highValues,
            lowValues,
            closeValues,
        }),
        dataPointWidth: 0.5,
    });
    sciChartSurface.renderableSeries.add(series2);
    const series3 = new FastColumnRenderableSeries(wasmContext, {
        fill: "rgba(176, 196, 222, 0.7)",
        stroke: "#4682b4",
        strokeThickness: 2,
        dataPointWidth: 0.5,
    });
    sciChartSurface.renderableSeries.add(series3);
    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 1; i <= 30; i++) {
        dataSeries.append(i, 1 + Math.sin(i * 0.1) * 0.1);
    }
    series3.dataSeries = dataSeries;
    // Create tootip behaviour
    sciChartSurface.chartModifiers.add(new RolloverModifier());
    return { sciChartSurface, wasmContext };
};
