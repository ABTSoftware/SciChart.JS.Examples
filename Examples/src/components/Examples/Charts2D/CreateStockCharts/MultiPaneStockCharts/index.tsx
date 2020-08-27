import * as React from "react";
import { SciChartVerticalGroup } from "scichart/Charting/LayoutManager/SciChartVerticalGroup";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { SciChartSurface } from "scichart";
import { EAutoRange } from "scichart/types/AutoRange";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { FastCandlestickRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { calcAverageForArray, calcAverageForDoubleVector } from "scichart/utils/calcAverage";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ENumericFormat } from "scichart/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider";
import { FastBandRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBandRenderableSeries";
import { XyyDataSeries } from "scichart/Charting/Model/XyyDataSeries";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { EXyDirection } from "scichart/types/XyDirection";
import { SciChartJSDarkTheme } from "scichart/Charting/Themes/SciChartJSDarkTheme";
import { multiPaneData } from "./data/multiPaneData";

const divElementId1 = "cc_chart_3_1";
const divElementId2 = "cc_chart_3_2";
const divElementId3 = "cc_chart_3_3";
const divElementId4 = "cc_chart_3_4";

const drawExample = async () => {
    const verticalGroup = new SciChartVerticalGroup();
    const { dateValues: xValues, openValues, highValues, lowValues, closeValues, volumeValues } = multiPaneData;
    const darkTheme = new SciChartJSDarkTheme();

    let chart1XAxis: CategoryAxis;
    let chart2XAxis: CategoryAxis;
    let chart3XAxis: CategoryAxis;
    let chart4XAxis: CategoryAxis;
    const axisAlignment = EAxisAlignment.Right;

    // CHART 1
    const drawChart1 = async () => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId1, 900, 400);
        sciChartSurface.applyTheme(darkTheme);

        chart1XAxis = new CategoryAxis(wasmContext, { autoRange: EAutoRange.Once });
        sciChartSurface.xAxes.add(chart1XAxis);

        const yAxis = new NumericAxis(wasmContext, {
            maxAutoTicks: 5,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.11, 0.11),
            axisAlignment,
        });
        yAxis.labelProvider.formatLabel = (dataValue: number) => "$" + dataValue.toFixed(4);
        sciChartSurface.yAxes.add(yAxis);

        const usdDataSeries = new OhlcDataSeries(wasmContext, {
            dataSeriesName: "OHLC Close",
            xValues,
            openValues,
            highValues,
            lowValues,
            closeValues,
        });
        sciChartSurface.renderableSeries.add(
            new FastCandlestickRenderableSeries(wasmContext, {
                dataSeries: usdDataSeries,
            })
        );

        const maLowDataSeries = new XyDataSeries(wasmContext, { dataSeriesName: "MA 50 Low" });
        for (let i = 0; i < xValues.length; i++) {
            const xValue = xValues[i];
            const avr50 = calcAverageForDoubleVector(usdDataSeries.getNativeLowValues(), 50, i);
            maLowDataSeries.append(xValue, avr50);
        }
        const maLowRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: maLowDataSeries,
        });
        sciChartSurface.renderableSeries.add(maLowRenderableSeries);
        maLowRenderableSeries.stroke = "#ff0000";
        maLowRenderableSeries.strokeThickness = 2;

        const maHighDataSeries = new XyDataSeries(wasmContext, { dataSeriesName: "MA 200 High" });
        for (let i = 0; i < xValues.length; i++) {
            const xValue = xValues[i];
            const avr200 = calcAverageForDoubleVector(usdDataSeries.getNativeHighValues(), 200, i);
            maHighDataSeries.append(xValue, avr200);
        }
        const maHighRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: maHighDataSeries,
        });
        sciChartSurface.renderableSeries.add(maHighRenderableSeries);
        maHighRenderableSeries.stroke = "#228B22";
        maHighRenderableSeries.strokeThickness = 2;

        sciChartSurface.chartModifiers.add(new ZoomPanModifier());
        sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
        sciChartSurface.chartModifiers.add(new RolloverModifier({ modifierGroup: "first" }));

        verticalGroup.addSurfaceToGroup(sciChartSurface);
    };

    // CHART 2
    const drawChart2 = async () => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId2, 900, 150);
        sciChartSurface.applyTheme(darkTheme);

        chart2XAxis = new CategoryAxis(wasmContext, {
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
        });
        sciChartSurface.xAxes.add(chart2XAxis);

        const yAxis = new NumericAxis(wasmContext, {
            maxAutoTicks: 4,
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(-0.06, 0.06),
            axisAlignment,
        });
        yAxis.labelProvider.numericFormat = ENumericFormat.Decimal_2;
        sciChartSurface.yAxes.add(yAxis);

        const macdArray: number[] = [];
        const signalArray: number[] = [];
        const divergenceArray: number[] = [];
        for (let i = 0; i < xValues.length; i++) {
            const maSlow = calcAverageForArray(closeValues, 12, i);
            const maFast = calcAverageForArray(closeValues, 25, i);
            const macd = maSlow - maFast;
            macdArray.push(macd);
            const signal = calcAverageForArray(macdArray, 9, i);
            signalArray.push(signal);
            const divergence = macd - signal;
            divergenceArray.push(divergence);
        }

        const bandSeries = new FastBandRenderableSeries(wasmContext, {
            dataSeries: new XyyDataSeries(wasmContext, {
                dataSeriesName: "MACD",
                xValues,
                yValues: signalArray,
                y1Values: macdArray,
            }),
        });
        sciChartSurface.renderableSeries.add(bandSeries);

        const columnSeries = new FastColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                dataSeriesName: "Divergence",
                xValues,
                yValues: divergenceArray,
            }),
            dataPointWidth: 0.5,
        });
        sciChartSurface.renderableSeries.add(columnSeries);

        sciChartSurface.chartModifiers.add(new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }));
        // XDirection for ZoomExtendsModifier does not work
        sciChartSurface.chartModifiers.add(new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(new RolloverModifier({ modifierGroup: "first" }));

        verticalGroup.addSurfaceToGroup(sciChartSurface);
    };

    // CHART 3
    const drawChart3 = async () => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId3, 900, 150);
        sciChartSurface.applyTheme(darkTheme);

        chart3XAxis = new CategoryAxis(wasmContext, {
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
        });
        sciChartSurface.xAxes.add(chart3XAxis);

        const yAxis = new NumericAxis(wasmContext, {
            maxAutoTicks: 4,
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(0, 100),
            axisAlignment,
            // growBy: new NumberRange(0.1, 0.1)
        });
        yAxis.labelProvider.numericFormat = ENumericFormat.Decimal_1;
        sciChartSurface.yAxes.add(yAxis);

        const RSI_PERIOD = 14;
        const rsiArray: number[] = [];
        const gainArray: number[] = [];
        const lossArray: number[] = [];
        rsiArray.push(NaN);
        gainArray.push(NaN);
        lossArray.push(NaN);
        for (let i = 1; i < xValues.length; i++) {
            const previousClose = closeValues[i - 1];
            const currentClose = closeValues[i];
            const gain = currentClose > previousClose ? currentClose - previousClose : 0;
            gainArray.push(gain);
            const loss = previousClose > currentClose ? previousClose - currentClose : 0;
            lossArray.push(loss);
            const relativeStrength =
                calcAverageForArray(gainArray, RSI_PERIOD) / calcAverageForArray(lossArray, RSI_PERIOD);
            const rsi = 100 - 100 / (1 + relativeStrength);
            rsiArray.push(rsi);
        }
        const macdRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { dataSeriesName: "RSI", xValues, yValues: rsiArray }),
        });
        sciChartSurface.renderableSeries.add(macdRenderableSeries);
        macdRenderableSeries.stroke = "#c3e4fe";
        macdRenderableSeries.strokeThickness = 2;

        sciChartSurface.chartModifiers.add(new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }));
        // XDirection for ZoomExtendsModifier does not work
        sciChartSurface.chartModifiers.add(new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(new RolloverModifier({ modifierGroup: "first" }));

        verticalGroup.addSurfaceToGroup(sciChartSurface);
    };

    // CHART 4
    const drawChart4 = async () => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId4, 900, 150);
        sciChartSurface.applyTheme(darkTheme);

        chart4XAxis = new CategoryAxis(wasmContext, {
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
        });
        sciChartSurface.xAxes.add(chart4XAxis);

        const yAxis = new NumericAxis(wasmContext, {
            maxAutoTicks: 4,
            autoRange: EAutoRange.Always,
            axisAlignment,
        });
        yAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
        sciChartSurface.yAxes.add(yAxis);

        const volumeRenderableSeries = new FastColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { dataSeriesName: "Volume", xValues, yValues: volumeValues }),
            dataPointWidth: 0.5,
        });
        sciChartSurface.renderableSeries.add(volumeRenderableSeries);

        sciChartSurface.chartModifiers.add(new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }));
        // XDirection for ZoomExtendsModifier does not work
        sciChartSurface.chartModifiers.add(new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(new RolloverModifier({ modifierGroup: "first" }));

        verticalGroup.addSurfaceToGroup(sciChartSurface);
    };

    // DRAW CHARTS
    await drawChart1();
    await drawChart2();
    await drawChart3();
    await drawChart4();

    // SYNCHRONIZE VISIBLE RANGES
    chart1XAxis.visibleRangeChanged.subscribe((data1) => {
        chart2XAxis.visibleRange = data1.visibleRange;
        chart3XAxis.visibleRange = data1.visibleRange;
        chart4XAxis.visibleRange = data1.visibleRange;
    });
    chart2XAxis.visibleRangeChanged.subscribe((data1) => {
        chart1XAxis.visibleRange = data1.visibleRange;
        chart3XAxis.visibleRange = data1.visibleRange;
        chart4XAxis.visibleRange = data1.visibleRange;
    });
    chart3XAxis.visibleRangeChanged.subscribe((data1) => {
        chart1XAxis.visibleRange = data1.visibleRange;
        chart2XAxis.visibleRange = data1.visibleRange;
        chart4XAxis.visibleRange = data1.visibleRange;
    });
    chart4XAxis.visibleRangeChanged.subscribe((data1) => {
        chart1XAxis.visibleRange = data1.visibleRange;
        chart2XAxis.visibleRange = data1.visibleRange;
        chart3XAxis.visibleRange = data1.visibleRange;
    });
};

export default function MultiPaneStockCharts() {
    const [showCharts, setShowCharts] = React.useState(false);

    React.useEffect(() => {
        drawExample().then(() => setShowCharts(true));
    }, []);

    return (
        <div style={{ display: showCharts ? "block" : "none", maxWidth: 900 }}>
            <div id={divElementId1} />
            <div id={divElementId2} />
            <div id={divElementId3} />
            <div id={divElementId4} />
        </div>
    );
}
