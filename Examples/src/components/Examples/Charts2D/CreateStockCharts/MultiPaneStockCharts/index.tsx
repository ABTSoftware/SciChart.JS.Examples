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
import { calcAverageForArray } from "scichart/utils/calcAverage";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { FastBandRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBandRenderableSeries";
import { XyyDataSeries } from "scichart/Charting/Model/XyyDataSeries";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { EXyDirection } from "scichart/types/XyDirection";
import { SciChartJSDarkTheme } from "scichart/Charting/Themes/SciChartJSDarkTheme";
import {
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IStrokePaletteProvider
} from "scichart/Charting/Model/IPaletteProvider";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import { TWebAssemblyChart } from "scichart/Charting/Visuals/SciChartSurface";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import { ENumericFormat } from "scichart/types/NumericFormat";
import classes from "../../../../Examples/Examples.module.scss";
import { SmartDateLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/SmartDateLabelProvider";
import { XyMovingAverageFilter } from "scichart/Charting/Model/Filters/XyMovingAverageFilter";
import { EDataSeriesField } from "scichart/Charting/Model/Filters/XyFilterBase";
import { ELabelAlignment } from "scichart/types/LabelAlignment";

const divElementId1 = "cc_chart_3_1";
const divElementId2 = "cc_chart_3_2";
const divElementId3 = "cc_chart_3_3";

const drawExample = async () => {
    const verticalGroup = new SciChartVerticalGroup();
    const {
        dateValues,
        openValues,
        highValues,
        lowValues,
        closeValues,
        volumeValues
    } = ExampleDataProvider.getTradingData();
    const darkTheme = new SciChartJSDarkTheme();

    let chart1XAxis: CategoryAxis;
    let chart2XAxis: CategoryAxis;
    let chart3XAxis: CategoryAxis;
    const axisAlignment = EAxisAlignment.Right;

    // CHART 1
    const drawChart1 = async () => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.createSingle(divElementId1, {
            widthAspect: 900,
            heightAspect: 400
        });
        sciChartSurface.applyTheme(darkTheme);

        chart1XAxis = new CategoryAxis(wasmContext, {
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false
        });
        sciChartSurface.xAxes.add(chart1XAxis);

        const yAxis = new NumericAxis(wasmContext, {
            maxAutoTicks: 5,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.3, 0.11),
            axisAlignment
        });
        yAxis.labelProvider.formatLabel = (dataValue: number) => "$" + dataValue.toFixed(4);
        sciChartSurface.yAxes.add(yAxis);

        // OHLC DATA SERIES
        const usdDataSeries = new OhlcDataSeries(wasmContext, {
            dataSeriesName: "OHLC Close",
            xValues: dateValues,
            openValues,
            highValues,
            lowValues,
            closeValues
        });
        const fcRendSeries = new FastCandlestickRenderableSeries(wasmContext, {
            dataSeries: usdDataSeries
        });
        sciChartSurface.renderableSeries.add(fcRendSeries);

        // MA1 SERIES
        const maLowDataSeries = new XyMovingAverageFilter(usdDataSeries, {
            dataSeriesName: "MA 50 Low",
            length: 50,
            field: EDataSeriesField.Low
        });
        const maLowRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: maLowDataSeries
        });
        sciChartSurface.renderableSeries.add(maLowRenderableSeries);
        maLowRenderableSeries.rolloverModifierProps.tooltipColor = "red";
        maLowRenderableSeries.rolloverModifierProps.markerColor = "red";
        maLowRenderableSeries.stroke = "#ff0000";
        maLowRenderableSeries.strokeThickness = 2;

        // MA2 SERIES
        const maHighDataSeries = new XyMovingAverageFilter(usdDataSeries, {
            dataSeriesName: "MA 200 High",
            length: 200,
            field: EDataSeriesField.High
        });
        const maHighRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: maHighDataSeries
        });
        sciChartSurface.renderableSeries.add(maHighRenderableSeries);
        maHighRenderableSeries.stroke = "#228B22";
        maHighRenderableSeries.strokeThickness = 2;

        // VOLUME SERIES
        const yAxis2 = new NumericAxis(wasmContext, {
            id: "yAxis2",
            isVisible: false,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0, 3)
        });
        sciChartSurface.yAxes.add(yAxis2);

        const volumeRenderableSeries = new FastColumnRenderableSeries(wasmContext, {
            yAxisId: "yAxis2",
            dataSeries: new XyDataSeries(wasmContext, {
                dataSeriesName: "Volume",
                xValues: dateValues,
                yValues: volumeValues
            }),
            dataPointWidth: 0.5,
            strokeThickness: 1,
            paletteProvider: new VolumePaletteProvider(usdDataSeries, "#50FF50B2", "#FF5050B2")
        });
        sciChartSurface.renderableSeries.add(volumeRenderableSeries);

        // MODIFIERS
        sciChartSurface.chartModifiers.add(new ZoomPanModifier());
        sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
        sciChartSurface.chartModifiers.add(new RolloverModifier({ modifierGroup: "first" }));

        verticalGroup.addSurfaceToGroup(sciChartSurface);

        return { wasmContext, sciChartSurface };
    };

    // CHART 2
    const drawChart2 = async () => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.createSingle(divElementId2, {
            widthAspect: 900,
            heightAspect: 150
        });
        sciChartSurface.applyTheme(darkTheme);

        chart2XAxis = new CategoryAxis(wasmContext, {
            drawLabels: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false
        });
        sciChartSurface.xAxes.add(chart2XAxis);

        const yAxis = new NumericAxis(wasmContext, {
            maxAutoTicks: 4,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
            axisAlignment,
            labelStyle: { alignment: ELabelAlignment.Right }
        });
        yAxis.labelProvider.numericFormat = ENumericFormat.Decimal;
        sciChartSurface.yAxes.add(yAxis);

        const macdArray: number[] = [];
        const signalArray: number[] = [];
        const divergenceArray: number[] = [];
        for (let i = 0; i < dateValues.length; i++) {
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
                xValues: dateValues,
                yValues: signalArray,
                y1Values: macdArray
            })
        });
        sciChartSurface.renderableSeries.add(bandSeries);

        const columnSeries = new FastColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                dataSeriesName: "Divergence",
                xValues: dateValues,
                yValues: divergenceArray
            }),
            paletteProvider: new MacdHistogramPaletteProvider("#50FF50B2", "#FF5050B2"),
            dataPointWidth: 0.5
        });
        sciChartSurface.renderableSeries.add(columnSeries);

        sciChartSurface.chartModifiers.add(new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }));
        // XDirection for ZoomExtendsModifier does not work
        sciChartSurface.chartModifiers.add(new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }));
        sciChartSurface.chartModifiers.add(new RolloverModifier({ modifierGroup: "first", showTooltip: false }));

        verticalGroup.addSurfaceToGroup(sciChartSurface);

        return { wasmContext, sciChartSurface };
    };

    // CHART 3
    const drawChart3 = async () => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.createSingle(divElementId3, {
            widthAspect: 900,
            heightAspect: 150
        });
        sciChartSurface.applyTheme(darkTheme);

        chart3XAxis = new CategoryAxis(wasmContext, { autoRange: EAutoRange.Once });
        chart3XAxis.labelProvider = new SmartDateLabelProvider();
        sciChartSurface.xAxes.add(chart3XAxis);

        const yAxis = new NumericAxis(wasmContext, {
            maxAutoTicks: 4,
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
            axisAlignment,
            labelStyle: { alignment: ELabelAlignment.Right }
        });
        yAxis.labelProvider.numericFormat = ENumericFormat.Decimal;
        sciChartSurface.yAxes.add(yAxis);

        const RSI_PERIOD = 14;
        const rsiArray: number[] = [];
        const gainArray: number[] = [];
        const lossArray: number[] = [];
        rsiArray.push(NaN);
        gainArray.push(NaN);
        lossArray.push(NaN);
        for (let i = 1; i < dateValues.length; i++) {
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
            dataSeries: new XyDataSeries(wasmContext, { dataSeriesName: "RSI", xValues: dateValues, yValues: rsiArray })
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

        return { wasmContext, sciChartSurface };
    };

    // DRAW CHARTS
    const res = await Promise.all([drawChart1(), drawChart2(), drawChart3()]);

    // SYNCHRONIZE VISIBLE RANGES
    chart1XAxis.visibleRangeChanged.subscribe(data1 => {
        chart2XAxis.visibleRange = data1.visibleRange;
        chart3XAxis.visibleRange = data1.visibleRange;
    });
    chart2XAxis.visibleRangeChanged.subscribe(data1 => {
        chart1XAxis.visibleRange = data1.visibleRange;
        chart3XAxis.visibleRange = data1.visibleRange;
    });
    chart3XAxis.visibleRangeChanged.subscribe(data1 => {
        chart1XAxis.visibleRange = data1.visibleRange;
        chart2XAxis.visibleRange = data1.visibleRange;
    });

    return res;
};

/**
 * An example PaletteProvider applied to the volume column series. It will return green / red
 * fills and strokes when the main price data bar is up or down
 */
class VolumePaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;
    private priceData: OhlcDataSeries;
    private volumeUpArgb: number;
    private volumnDownArgb: number;

    constructor(priceData: OhlcDataSeries, volumeUpColor: string, volumeDownColor: string) {
        this.priceData = priceData;
        this.volumeUpArgb = parseColorToUIntArgb(volumeUpColor);
        this.volumnDownArgb = parseColorToUIntArgb(volumeDownColor);
    }

    onAttached(parentSeries: IRenderableSeries): void { }

    onDetached(): void { }

    overrideFillArgb(xValue: number, yValue: number, index: number): number {
        const open = this.priceData.getNativeOpenValues().get(index);
        const close = this.priceData.getNativeCloseValues().get(index);

        return close >= open ? this.volumeUpArgb : this.volumnDownArgb;
    }

    overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return this.overrideFillArgb(xValue, yValue, index);
    }
}

class MacdHistogramPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;
    private aboveZeroArgb: number;
    private belowZeroArgb: number;

    constructor(aboveZeroColor: string, belowZeroColor: string) {
        this.aboveZeroArgb = parseColorToUIntArgb(aboveZeroColor);
        this.belowZeroArgb = parseColorToUIntArgb(belowZeroColor);
    }

    onAttached(parentSeries: IRenderableSeries): void { }

    onDetached(): void { }

    overrideFillArgb(xValue: number, yValue: number, index: number): number {
        return yValue >= 0 ? this.aboveZeroArgb : this.belowZeroArgb;
    }

    overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return this.overrideFillArgb(xValue, yValue, index);
    }
}

let charts: TWebAssemblyChart[];

export default function MultiPaneStockCharts() {
    React.useEffect(() => {
        (async () => {
            charts = await drawExample();
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            charts.forEach(el => el?.sciChartSurface?.delete());
        };
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div id={divElementId1} />
            <div id={divElementId2} />
            <div id={divElementId3} />
        </div>
    );
}
