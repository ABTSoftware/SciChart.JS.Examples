export const code = `import * as React from "react";
import Button from "@material-ui/core/Button";
import { SciChartSurface } from "scichart";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAutoRange } from "scichart/types/AutoRange";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { getNextRandomPriceBarFactory } from "scichart/utils/randomPricesDataSource";
import { calcAverageForDoubleVector } from "scichart/utils/calcAverage";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { FastOhlcRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastOhlcRenderableSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { EXyDirection } from "scichart/types/XyDirection";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import { TSciChart } from "scichart/types/TSciChart";
import { ESeriesType } from "scichart/types/SeriesType";
import { EColor } from "scichart/types/Color";
import { FastCandlestickRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { ENumericFormat } from "scichart/types/NumericFormat";
import classes from "../../../../Examples/Examples.module.scss";

export const divElementId = "chart";
// Step = 5 minutes
const STEP = 5;
const START_PRICE = 20;
const START_DATE = new Date("2020-01-01").getTime() / 1000;
const AXIS2_ID = "AXIS2_ID";
const UPDATE_TICKS = 25;
const MOVING_AVR_20 = 20;
const MOVING_AVR_50 = 50;

const STROKE_THICKNESS = 2;

let timerId: NodeJS.Timeout;

export const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new CategoryAxis(wasmContext);
    xAxis.labelProvider.numericFormat = ENumericFormat.Date_HHMM;
    xAxis.visibleRangeLimit = new NumberRange(1, 10000);
    xAxis.growBy = new NumberRange(0.0, 0.05);
    xAxis.autoRange = EAutoRange.Never;
    sciChartSurface.xAxes.add(xAxis);

    const priceYAxis = new NumericAxis(wasmContext);
    priceYAxis.growBy = new NumberRange(0.25, 0.05);
    priceYAxis.autoRange = EAutoRange.Always;
    sciChartSurface.yAxes.add(priceYAxis);

    const volumeYAxis = new NumericAxis(wasmContext, { id: AXIS2_ID, axisAlignment: EAxisAlignment.Left });
    volumeYAxis.isVisible = false;
    volumeYAxis.autoRange = EAutoRange.Always;
    volumeYAxis.growBy = new NumberRange(0, 5);
    sciChartSurface.yAxes.add(volumeYAxis);

    const priceDataSeries = new OhlcDataSeries(wasmContext);
    const volumeDataSeries = new XyDataSeries(wasmContext);
    const movingAverage20DataSeries = new XyDataSeries(wasmContext);
    const movingAverage50DataSeries = new XyDataSeries(wasmContext);

    const genPricesData = getNextRandomPriceBarFactory(START_DATE, STEP, false, START_PRICE);

    const fillPriceDataSeries = (requestUpdate: boolean, initialDataset: boolean) => {
        const generatedData = genPricesData(requestUpdate);
        const { xValue, openValue, highValue, lowValue, closeValue, volume } = generatedData;
        if (requestUpdate) {
            const length = priceDataSeries.count();
            priceDataSeries.update(length - 1, openValue, highValue, lowValue, closeValue);
            volumeDataSeries.update(length - 1, volume);
            const nativeCloseValues = priceDataSeries.getNativeCloseValues();
            movingAverage20DataSeries.update(length - 1, calcAverageForDoubleVector(nativeCloseValues, MOVING_AVR_20));
            movingAverage50DataSeries.update(length - 1, calcAverageForDoubleVector(nativeCloseValues, MOVING_AVR_50));
        } else {
            priceDataSeries.append(xValue, openValue, highValue, lowValue, closeValue);
            const volume2 = initialDataset ? volume * 2 : volume;
            volumeDataSeries.append(xValue, volume2);
            const nativeCloseValues = priceDataSeries.getNativeCloseValues();
            movingAverage20DataSeries.append(length - 1, calcAverageForDoubleVector(nativeCloseValues, MOVING_AVR_20));
            movingAverage50DataSeries.append(length - 1, calcAverageForDoubleVector(nativeCloseValues, MOVING_AVR_50));
        }
    };

    // Initial dataset
    for (let i = 0; i < 50; i++) {
        fillPriceDataSeries(false, true);
    }

    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            fill: "#b0c4de",
            stroke: "#4682b4",
            strokeThickness: STROKE_THICKNESS,
            zeroLineY: 0,
            yAxisId: AXIS2_ID,
            dataSeries: volumeDataSeries
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#ff6600",
            strokeThickness: STROKE_THICKNESS,
            dataSeries: movingAverage20DataSeries
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#ffffff",
            strokeThickness: STROKE_THICKNESS,
            dataSeries: movingAverage50DataSeries
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastOhlcRenderableSeries(wasmContext, {
            strokeThickness: STROKE_THICKNESS,
            dataSeries: priceDataSeries,
            dataPointWidth: 0.4
        })
    );

    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }));
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }));
    sciChartSurface.zoomExtents();

    let tick = 0;
    const updateChart = () => {
        const requestUpdate: boolean = !(tick % UPDATE_TICKS === 0);

        fillPriceDataSeries(requestUpdate, false);

        // if the current updated bar is visible then shift by one point
        const latestXIndex = priceDataSeries.count() - 1;
        if (latestXIndex && latestXIndex < xAxis.visibleRange.max && !requestUpdate) {
            const shiftedRange = new NumberRange(xAxis.visibleRange.min + 1, xAxis.visibleRange.max + 1);

            // Shift the XAxis by the latest point
            xAxis.animateVisibleRange(shiftedRange, 250, easing.inOutQuad);
        }

        tick++;
        timerId = setTimeout(updateChart, 20);
    };

    const stopAnimation = () => {
        clearTimeout(timerId);
        timerId = undefined;
    };

    const startAnimation = () => {
        if (timerId) {
            stopAnimation();
        }
        updateChart();
    };

    return { sciChartSurface, wasmContext, controls: { startAnimation, stopAnimation } };
};

let scs: SciChartSurface;
let autoStartTimerId: NodeJS.Timeout;

export default function RealtimeTickingStockCharts() {
    const [wasmContext, setWasmContext] = React.useState<TSciChart>();
    const [strokeThickness, setStrokeThickness] = React.useState(2);
    const [seriesType, setSeriesType] = React.useState(ESeriesType.OhlcSeries);
    const [controls, setControls] = React.useState({ startAnimation: () => {}, stopAnimation: () => {} });

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
            setWasmContext(res.wasmContext);
            setControls(res.controls);
            autoStartTimerId = setTimeout(res.controls.startAnimation, 3000);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            controls.stopAnimation();
            clearTimeout(timerId);
            clearTimeout(autoStartTimerId);
            scs?.delete();
        };
    }, []);

    const handleChangeStrokeThickness = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newStrokeThickness = +event.target.value as number;
        setStrokeThickness(newStrokeThickness);
        scs.renderableSeries.asArray().forEach(rs => {
            rs.strokeThickness = newStrokeThickness;
        });
    };

    const handleChangeSeriesType = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newSeriesType = event.target.value as ESeriesType;
        setSeriesType(newSeriesType);
        // We know that priceDataSeries it the last one with index 3
        const priceDataSeries = scs.renderableSeries.get(3).dataSeries;
        scs.renderableSeries.removeAt(3);
        switch (newSeriesType) {
            case ESeriesType.LineSeries:
                scs.renderableSeries.add(
                    new FastLineRenderableSeries(wasmContext, {
                        stroke: EColor.Green,
                        strokeThickness,
                        dataSeries: priceDataSeries
                    })
                );
                break;
            case ESeriesType.OhlcSeries:
                scs.renderableSeries.add(
                    new FastOhlcRenderableSeries(wasmContext, {
                        strokeThickness,
                        dataSeries: priceDataSeries as OhlcDataSeries,
                        dataPointWidth: 0.4
                    })
                );
                break;
            case ESeriesType.CandlestickSeries:
                scs.renderableSeries.add(
                    new FastCandlestickRenderableSeries(wasmContext, {
                        strokeThickness,
                        dataSeries: priceDataSeries as OhlcDataSeries,
                        dataPointWidth: 0.4
                    })
                );
                break;
            case ESeriesType.MountainSeries:
                scs.renderableSeries.add(
                    new FastMountainRenderableSeries(wasmContext, {
                        fill: "rgba(176, 196, 222, 0.7)",
                        stroke: "#4682b4",
                        strokeThickness,
                        zeroLineY: 0,
                        dataSeries: priceDataSeries
                    })
                );
        }
    };

    return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />

            <div className={classes.SelectWrapper}>
                <div className={classes.InputSelectWrapper}>
                    <label id="stroke-thickness-label">
                        Stroke Thickness
                        <select id="stroke-thickness" value={strokeThickness} onChange={handleChangeStrokeThickness}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </label>
                </div>
                <div className={classes.InputSelectWrapper}>
                    <label id="stroke-thickness-label">
                        Series Type
                        <select id="stroke-thickness" value={seriesType} onChange={handleChangeSeriesType}>
                            <option value={ESeriesType.OhlcSeries}>OHLC</option>
                            <option value={ESeriesType.CandlestickSeries}>Candlestick</option>
                            <option value={ESeriesType.LineSeries}>Line</option>
                            <option value={ESeriesType.MountainSeries}>Mountain</option>
                        </select>
                    </label>
                </div>
            </div>
            <div className={classes.ButtonsWrapper}>
                <Button onClick={controls.startAnimation}>Start</Button>
                <Button onClick={controls.stopAnimation}>Stop</Button>
            </div>
        </div>
    );
}
`;