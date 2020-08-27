import * as React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { TWebAssemblyChart } from "scichart/Charting/Visuals/SciChartSurface";
import { SciChartSurface } from "scichart";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { ENumericFormat } from "scichart/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider";
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

export const drawExample = async (): Promise<TWebAssemblyChart> => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new CategoryAxis(wasmContext);
    xAxis.labelProvider.numericFormat = ENumericFormat.Date_HHMM;
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
            dataSeries: volumeDataSeries,
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#ff6600",
            strokeThickness: STROKE_THICKNESS,
            dataSeries: movingAverage20DataSeries,
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#ffffff",
            strokeThickness: STROKE_THICKNESS,
            dataSeries: movingAverage50DataSeries,
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastOhlcRenderableSeries(wasmContext, {
            strokeThickness: STROKE_THICKNESS,
            dataSeries: priceDataSeries,
            dataPointWidth: 0.4,
        })
    );

    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }));
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }));
    sciChartSurface.zoomExtents();

    let timerId: NodeJS.Timeout;
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

    // Buttons for chart
    const startAnimation = () => {
        console.log("start animation");
        if (!timerId) {
            updateChart();
        }
    };
    document.getElementById("startAnimation").addEventListener("click", startAnimation);

    const stopAnimation = () => {
        console.log("stop animation");
        clearTimeout(timerId);
        timerId = undefined;
    };
    document.getElementById("stopAnimation").addEventListener("click", stopAnimation);
    return { sciChartSurface, wasmContext };
};

export default function RealtimeTickingStockCharts() {
    const [showControls, setShowControls] = React.useState(false);
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [wasmContext, setWasmContext] = React.useState<TSciChart>();
    const [strokeThickness, setStrokeThickness] = React.useState(2);
    const [seriesType, setSeriesType] = React.useState(ESeriesType.FastOhlcRenderableSeries);

    React.useEffect(() => {
        drawExample().then((webAssemblyChart) => {
            setSciChartSurface(webAssemblyChart.sciChartSurface);
            setWasmContext(webAssemblyChart.wasmContext);
            setShowControls(true);
        });
    }, []);

    const handleChangeStrokeThickness = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newStrokeThickness = event.target.value as number;
        setStrokeThickness(newStrokeThickness);
        sciChartSurface.renderableSeries.asArray().forEach((rs) => {
            rs.strokeThickness = newStrokeThickness;
        });
    };

    const handleChangeSeriesType = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newSeriesType = event.target.value as ESeriesType;
        setSeriesType(newSeriesType);
        // We know that priceDataSeries it the last one with index 3
        const priceDataSeries = sciChartSurface.renderableSeries.get(3).dataSeries;
        sciChartSurface.renderableSeries.removeAt(3);
        switch (newSeriesType) {
            case ESeriesType.FastLineRenderableSeries:
                sciChartSurface.renderableSeries.add(
                    new FastLineRenderableSeries(wasmContext, {
                        stroke: EColor.Green,
                        strokeThickness,
                        dataSeries: priceDataSeries,
                    })
                );
                break;
            case ESeriesType.FastOhlcRenderableSeries:
                sciChartSurface.renderableSeries.add(
                    new FastOhlcRenderableSeries(wasmContext, {
                        strokeThickness,
                        dataSeries: priceDataSeries as OhlcDataSeries,
                        dataPointWidth: 0.4,
                    })
                );
                break;
            case ESeriesType.FastCandlestickRenderableSeries:
                sciChartSurface.renderableSeries.add(
                    new FastCandlestickRenderableSeries(wasmContext, {
                        strokeThickness,
                        dataSeries: priceDataSeries as OhlcDataSeries,
                        dataPointWidth: 0.4,
                    })
                );
                break;
            case ESeriesType.FastMountainRenderableSeries:
                sciChartSurface.renderableSeries.add(
                    new FastMountainRenderableSeries(wasmContext, {
                        fill: "rgba(176, 196, 222, 0.7)",
                        stroke: "#4682b4",
                        strokeThickness,
                        zeroLineY: 0,
                        dataSeries: priceDataSeries,
                    })
                );
        }
    };

    return (
        <div>
            <div id={divElementId} style={{ maxWidth: 900 }} />
            <div style={{ marginTop: 20, display: showControls ? "flex" : "none" }}>
                <FormControl variant="filled" style={{ width: 200 }}>
                    <InputLabel id="stroke-thickness-label">Stroke Thickness</InputLabel>
                    <Select
                        labelId="stroke-thickness-label"
                        id="stroke-thickness"
                        value={strokeThickness}
                        onChange={handleChangeStrokeThickness}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="filled" style={{ width: 200, marginLeft: 10 }}>
                    <InputLabel id="stroke-thickness-label">Series Type</InputLabel>
                    <Select
                        labelId="stroke-thickness-label"
                        id="stroke-thickness"
                        value={seriesType}
                        onChange={handleChangeSeriesType}
                    >
                        <MenuItem value={ESeriesType.FastOhlcRenderableSeries}>OHLC</MenuItem>
                        <MenuItem value={ESeriesType.FastCandlestickRenderableSeries}>Candlestick</MenuItem>
                        <MenuItem value={ESeriesType.FastLineRenderableSeries}>Line</MenuItem>
                        <MenuItem value={ESeriesType.FastMountainRenderableSeries}>Mountain</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <FormControl style={{ marginTop: 20, display: showControls ? "flex" : "none" }}>
                <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                    <Button id="startAnimation">Start</Button>
                    <Button id="stopAnimation">Stop</Button>
                </ButtonGroup>
            </FormControl>
        </div>
    );
}
