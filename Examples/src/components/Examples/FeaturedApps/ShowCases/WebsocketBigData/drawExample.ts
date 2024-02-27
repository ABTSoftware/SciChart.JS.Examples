import * as socketIOClient from "socket.io-client";
import { appTheme } from "scichart-example-dependencies";
import {
    IBaseDataSeriesOptions,
    TSciChart,
    ESeriesType,
    BaseDataSeries,
    BaseRenderableSeries,
    XyDataSeries,
    FastLineRenderableSeries,
    AUTO_COLOR,
    XyyDataSeries,
    FastBandRenderableSeries,
    FastColumnRenderableSeries,
    StackedMountainRenderableSeries,
    XyCustomFilter,
    EDataSeriesField,
    XyScatterRenderableSeries,
    EllipsePointMarker,
    OhlcDataSeries,
    FastCandlestickRenderableSeries,
    XyTextDataSeries,
    FastTextRenderableSeries,
    EDataSeriesType,
    XyzDataSeries,
    INumericAxisOptions,
    ENumericFormat,
    SciChartSurface,
    NumericAxis,
    LayoutManager,
    IRenderableSeries,
    StackedColumnCollection,
    StackedColumnRenderableSeries,
    StackedMountainCollection,
    RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    ZoomExtentsModifier,
} from "scichart";

export type TMessage = {
    title: string;
    detail: string;
};

export interface ISettings {
    seriesCount?: number;
    pointsOnChart?: number;
    pointsPerUpdate?: number;
    sendEvery?: number;
    initialPoints?: number;
}

export const divElementId = "chart";

let loadCount: number = 0;
let loadTimes: number[];
let avgLoadTime: number = 0;
let avgRenderTime: number = 0;

function GetRandomData(xValues: number[], positive: boolean) {
    let prevYValue = Math.random();
    const yValues: number[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < xValues.length; j++) {
        const change = Math.random() * 10 - 5;
        prevYValue = positive ? Math.abs(prevYValue + change) : prevYValue + change;
        yValues.push(prevYValue);
    }
    return yValues;
}

const extendRandom = (val: number, max: number) => val + Math.random() * max;

const generateCandleData = (xValues: number[]) => {
    let open = 10;
    const openValues = [];
    const highValues = [];
    const lowValues = [];
    const closeValues = [];

    for (let i = 0; i < xValues.length; i++) {
        const close = open + Math.random() * 10 - 5;
        const high = Math.max(open, close);
        highValues.push(extendRandom(high, 5));
        const low = Math.min(open, close);
        lowValues.push(extendRandom(low, -5));
        closeValues.push(close);
        openValues.push(open);
        open = close;
    }
    return { openValues, highValues, lowValues, closeValues };
};

const generateCandleDataForAppendRange = (open: number, closeValues: number[]) => {
    const openValues = [];
    const highValues = [];
    const lowValues = [];
    for (const close of closeValues) {
        openValues.push(open);
        const high = Math.max(open, close);
        highValues.push(extendRandom(high, 5));
        const low = Math.min(open, close);
        lowValues.push(extendRandom(low, -5));
        open = close;
    }
    return { openValues, highValues, lowValues, closeValues };
};

const dsOptions: IBaseDataSeriesOptions = {
    isSorted: true,
    containsNaN: false,
};

const createRenderableSeries = (
    wasmContext: TSciChart,
    seriesType: ESeriesType
): { dataSeries: BaseDataSeries; rendSeries: BaseRenderableSeries } => {
    if (seriesType === ESeriesType.LineSeries) {
        const dataSeries: XyDataSeries = new XyDataSeries(wasmContext, dsOptions);
        const rendSeries: FastLineRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke: AUTO_COLOR,
            strokeThickness: 3,
            opacity: 0.8,
        });
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.BandSeries) {
        const dataSeries: XyyDataSeries = new XyyDataSeries(wasmContext, dsOptions);
        const rendSeries: FastBandRenderableSeries = new FastBandRenderableSeries(wasmContext, {
            stroke: AUTO_COLOR,
            strokeY1: AUTO_COLOR,
            fill: AUTO_COLOR,
            fillY1: AUTO_COLOR,
            dataSeries,
            strokeThickness: 2,
            opacity: 0.8,
        });
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.ColumnSeries) {
        const dataSeries: XyDataSeries = new XyDataSeries(wasmContext, dsOptions);
        const rendSeries: FastColumnRenderableSeries = new FastColumnRenderableSeries(wasmContext, {
            fill: AUTO_COLOR,
            stroke: AUTO_COLOR,
            dataSeries,
            strokeThickness: 1,
        });
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.StackedMountainSeries) {
        const dataSeries: XyDataSeries = new XyDataSeries(wasmContext, dsOptions);
        const rendSeries: StackedMountainRenderableSeries = new StackedMountainRenderableSeries(wasmContext, {
            stroke: AUTO_COLOR,
            fill: AUTO_COLOR,
            dataSeries,
        });
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.ScatterSeries) {
        const dataSeries: XyyDataSeries = new XyyDataSeries(wasmContext, { containsNaN: false });
        // Use Y and Y1 as X and Y for scatter
        const filteredSeries: XyDataSeries = new XyCustomFilter(dataSeries, {
            xField: EDataSeriesField.Y,
            field: EDataSeriesField.Y1,
        });
        const rendSeries: XyScatterRenderableSeries = new XyScatterRenderableSeries(wasmContext, {
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 9,
                height: 9,
                strokeThickness: 2,
                fill: AUTO_COLOR,
                stroke: AUTO_COLOR,
                opacity: 0.8,
            }),
            dataSeries: filteredSeries,
        });
        // return the unfiltered xyy series as that is the one we want to append to
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.CandlestickSeries) {
        const dataSeries: OhlcDataSeries = new OhlcDataSeries(wasmContext, dsOptions);
        const rendSeries: FastCandlestickRenderableSeries = new FastCandlestickRenderableSeries(wasmContext, {
            strokeThickness: 1,
            dataSeries,
            dataPointWidth: 0.9,
            opacity: 0.75,
            strokeUp: AUTO_COLOR,
            brushUp: AUTO_COLOR,
            strokeDown: AUTO_COLOR,
            brushDown: AUTO_COLOR,
        });
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.TextSeries) {
        const dataSeries: XyTextDataSeries = new XyTextDataSeries(wasmContext, dsOptions);
        const rendSeries: FastTextRenderableSeries = new FastTextRenderableSeries(wasmContext, {
            dataSeries,
            dataLabels: {
                style: {
                    fontFamily: "Arial",
                    fontSize: 6,
                },
                color: AUTO_COLOR,
                calculateTextBounds: false,
            },
        });
        return { dataSeries, rendSeries };
    }
    return { dataSeries: undefined, rendSeries: undefined };
};

const prePopulateData = (
    dataSeries: BaseDataSeries,
    dataSeriesType: EDataSeriesType,
    xValues: number[],
    positive: boolean
) => {
    const yValues: number[] = GetRandomData(xValues, positive);
    switch (dataSeriesType) {
        case EDataSeriesType.Xy:
            (dataSeries as XyDataSeries).appendRange(xValues, yValues);
            break;
        case EDataSeriesType.Xyy:
            (dataSeries as XyyDataSeries).appendRange(xValues, yValues, GetRandomData(xValues, positive));
            break;
        case EDataSeriesType.Xyz:
            (dataSeries as XyzDataSeries).appendRange(
                xValues,
                yValues,
                GetRandomData(xValues, positive).map((z) => Math.abs(z / 5))
            );
            break;
        case EDataSeriesType.Ohlc:
            const { openValues, highValues, lowValues, closeValues } = generateCandleData(xValues);
            (dataSeries as OhlcDataSeries).appendRange(xValues, openValues, highValues, lowValues, closeValues);
            break;
        case EDataSeriesType.XyText:
            (dataSeries as XyTextDataSeries).appendRange(
                xValues,
                yValues,
                yValues.map((textval) => textval.toFixed())
            );
            break;
        default:
            break;
    }
};

const appendData = (
    dataSeries: BaseDataSeries,
    dataSeriesType: EDataSeriesType,
    index: number,
    xValues: number[],
    yArray: number[][],
    pointsOnChart: number,
    pointsPerUpdate: number
) => {
    switch (dataSeriesType) {
        case EDataSeriesType.Xy:
            const xySeries = dataSeries as XyDataSeries;
            xySeries.appendRange(xValues, yArray[index]);
            if (xySeries.count() > pointsOnChart) {
                xySeries.removeRange(0, pointsPerUpdate);
            }
            break;
        case EDataSeriesType.Xyy:
            const xyySeries = dataSeries as XyyDataSeries;
            xyySeries.appendRange(xValues, yArray[2 * index], yArray[2 * index + 1]);
            if (xyySeries.count() > pointsOnChart) {
                xyySeries.removeRange(0, pointsPerUpdate);
            }
            break;
        case EDataSeriesType.Xyz:
            const xyzSeries = dataSeries as XyzDataSeries;
            xyzSeries.appendRange(
                xValues,
                yArray[2 * index],
                yArray[2 * index + 1].map((z) => Math.abs(z / 5))
            );
            if (xyzSeries.count() > pointsOnChart) {
                xyzSeries.removeRange(0, pointsPerUpdate);
            }
            break;
        case EDataSeriesType.Ohlc:
            const ohlcSeries = dataSeries as OhlcDataSeries;
            const { openValues, highValues, lowValues, closeValues } = generateCandleDataForAppendRange(
                ohlcSeries.getNativeCloseValues().get(ohlcSeries.count() - 1),
                yArray[index]
            );
            ohlcSeries.appendRange(xValues, openValues, highValues, lowValues, closeValues);
            if (ohlcSeries.count() > pointsOnChart) {
                ohlcSeries.removeRange(0, pointsPerUpdate);
            }
            break;
        case EDataSeriesType.XyText:
            const xytextSeries = dataSeries as XyTextDataSeries;
            xytextSeries.appendRange(
                xValues,
                yArray[index],
                yArray[index].map((obj) => obj.toFixed())
            );
            if (xytextSeries.count() > pointsOnChart) {
                xytextSeries.removeRange(0, pointsPerUpdate);
            }
            break;
        default:
            break;
    }
};

const axisOptions: INumericAxisOptions = {
    drawMajorBands: false,
    drawMinorGridLines: false,
    drawMinorTickLines: false,
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
};

export const drawExample = async (updateMessages: (newMessages: TMessage[]) => void, seriesType: ESeriesType) => {
    let seriesCount = 10;
    let pointsOnChart = 1000;
    let pointsPerUpdate = 100;
    let sendEvery = 30;
    let initialPoints: number = 0;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
    });
    const xAxis = new NumericAxis(wasmContext, axisOptions);
    sciChartSurface.xAxes.add(xAxis);
    let yAxis = new NumericAxis(wasmContext, { ...axisOptions });
    sciChartSurface.yAxes.add(yAxis);
    let dataSeriesArray: BaseDataSeries[];
    let dataSeriesType = EDataSeriesType.Xy;
    if (seriesType === ESeriesType.BubbleSeries) {
        dataSeriesType = EDataSeriesType.Xyz;
    } else if (seriesType === ESeriesType.BandSeries || seriesType === ESeriesType.ScatterSeries) {
        dataSeriesType = EDataSeriesType.Xyy;
    } else if (seriesType === ESeriesType.CandlestickSeries) {
        dataSeriesType = EDataSeriesType.Ohlc;
    } else if (seriesType === ESeriesType.TextSeries) {
        dataSeriesType = EDataSeriesType.XyText;
    }

    const initChart = () => {
        sciChartSurface.renderableSeries.asArray().forEach((rs) => rs.delete());
        sciChartSurface.renderableSeries.clear();
        sciChartSurface.chartModifiers.asArray().forEach((cm) => cm.delete());
        sciChartSurface.chartModifiers.clear();
        sciChartSurface.yAxes.asArray().forEach((ya) => ya.delete());
        sciChartSurface.yAxes.clear();
        sciChartSurface.layoutManager = new LayoutManager();
        yAxis = new NumericAxis(wasmContext, { ...axisOptions });
        sciChartSurface.yAxes.add(yAxis);
        dataSeriesArray = new Array<BaseDataSeries>(seriesCount);
        let stackedCollection: IRenderableSeries;
        let xValues: number[];
        const positive = [ESeriesType.StackedColumnSeries, ESeriesType.StackedMountainSeries].includes(seriesType);
        for (let i = 0; i < seriesCount; i++) {
            const { dataSeries, rendSeries } = createRenderableSeries(wasmContext, seriesType);
            dataSeriesArray[i] = dataSeries;
            if (seriesType === ESeriesType.StackedColumnSeries) {
                if (i === 0) {
                    stackedCollection = new StackedColumnCollection(wasmContext, { dataPointWidth: 1 });
                    sciChartSurface.renderableSeries.add(stackedCollection);
                }
                (rendSeries as StackedColumnRenderableSeries).stackedGroupId = i.toString();
                (stackedCollection as StackedColumnCollection).add(rendSeries as StackedColumnRenderableSeries);
            } else if (seriesType === ESeriesType.StackedMountainSeries) {
                if (i === 0) {
                    stackedCollection = new StackedMountainCollection(wasmContext);
                    sciChartSurface.renderableSeries.add(stackedCollection);
                }
                (stackedCollection as StackedMountainCollection).add(rendSeries as StackedMountainRenderableSeries);
            } else if (seriesType === ESeriesType.ColumnSeries) {
                // create stacked y axis
                if (i === 0) {
                    // tslint:disable-next-line: max-line-length
                    sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
                        new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();
                    yAxis.id = "0";
                } else {
                    sciChartSurface.yAxes.add(
                        new NumericAxis(wasmContext, {
                            id: i.toString(),
                            ...axisOptions,
                        })
                    );
                }
                rendSeries.yAxisId = i.toString();
                sciChartSurface.renderableSeries.add(rendSeries);
            } else {
                sciChartSurface.renderableSeries.add(rendSeries);
            }

            if (i === 0) {
                xValues = Array.from(Array(initialPoints).keys());
            }
            // Generate points
            prePopulateData(dataSeries, dataSeriesType, xValues, positive);
            sciChartSurface.zoomExtents(0);
        }
        return positive;
    };

    const dataBuffer: { x: number[]; ys: number[][]; sendTime: number }[] = [];
    let isRunning: boolean = false;
    const newMessages: TMessage[] = [];
    let loadStart = 0;
    let loadTime = 0;
    let renderStart = 0;
    let renderTime = 0;

    const loadData = (data: { x: number[]; ys: number[][]; sendTime: number }) => {
        for (let i = 0; i < seriesCount; i++) {
            appendData(dataSeriesArray[i], dataSeriesType, i, data.x, data.ys, pointsOnChart, pointsPerUpdate);
        }
        sciChartSurface.zoomExtents(0);
        loadTime = new Date().getTime() - loadStart;
    };

    sciChartSurface.preRender.subscribe(() => {
        renderStart = new Date().getTime();
    });

    sciChartSurface.rendered.subscribe(() => {
        if (!isRunning || loadStart === 0) return;
        avgLoadTime = (avgLoadTime * loadCount + loadTime) / (loadCount + 1);
        renderTime = new Date().getTime() - renderStart;
        avgRenderTime = (avgRenderTime * loadCount + renderTime) / (loadCount + 1);
        newMessages.push({
            title: `Average Load Time `,
            detail: `${avgLoadTime.toFixed(2)} ms`,
        });
        newMessages.push({
            title: `Average Render Time `,
            detail: `${avgRenderTime.toFixed(2)} ms`,
        });
        newMessages.push({
            title: `Max FPS `,
            detail: `${Math.min(60, 1000 / (avgLoadTime + avgRenderTime)).toFixed(1)}`,
        });
        updateMessages(newMessages);
        newMessages.length = 0;
    });

    const loadFromBuffer = () => {
        if (dataBuffer.length > 0) {
            loadStart = new Date().getTime();
            const x: number[] = dataBuffer[0].x;
            const ys: number[][] = dataBuffer[0].ys;
            const sendTime = dataBuffer[0].sendTime;
            for (let i = 1; i < dataBuffer.length; i++) {
                const el = dataBuffer[i];
                x.push(...el.x);
                for (let y = 0; y < el.ys.length; y++) {
                    ys[y].push(...el.ys[y]);
                }
            }
            loadData({ x, ys, sendTime });
            dataBuffer.length = 0;
        }
        if (isRunning) {
            setTimeout(loadFromBuffer, Math.min(1, 10 - renderTime));
        }
    };

    let socket: socketIOClient.Socket;

    const initWebSocket = (positive: boolean) => {
        if (socket) {
            socket.disconnect();
            socket.connect();
        } else {
            if (window.location.hostname === "localhost" && parseInt(window.location.port) > 8000) {
                socket = socketIOClient.io("http://localhost:3000");
                console.log("3000");
            } else {
                socket = socketIOClient.io();
                console.log("local");
            }
            socket.on("data", (message: any) => {
                dataBuffer.push(message);
            });
            socket.on("finished", () => {
                socket.disconnect();
            });
        }

        // If initial data has been generated, this should be an array of the last y values of each series
        const index = dataSeriesArray[0].count() - 1;
        let series: number[];
        if (
            dataSeriesType === EDataSeriesType.Xy ||
            dataSeriesType === EDataSeriesType.Ohlc ||
            dataSeriesType === EDataSeriesType.XyText
        ) {
            if (index >= 0) {
                series = dataSeriesArray.map((d) => d.getNativeYValues().get(index));
            } else {
                series = Array.from(Array(seriesCount)).fill(0);
            }
        } else if (dataSeriesType === EDataSeriesType.Xyy) {
            if (index >= 0) {
                series = [];
                for (const dataSeries of dataSeriesArray) {
                    const xyy = dataSeries as XyyDataSeries;
                    series.push(xyy.getNativeYValues().get(index));
                    series.push(xyy.getNativeY1Values().get(index));
                }
            } else {
                series = Array.from(Array(seriesCount * 2)).fill(0);
            }
        } else if (dataSeriesType === EDataSeriesType.Xyz) {
            if (index >= 0) {
                series = [];
                for (const dataSeries of dataSeriesArray) {
                    const xyy = dataSeries as XyzDataSeries;
                    series.push(xyy.getNativeYValues().get(index));
                    series.push(xyy.getNativeZValues().get(index));
                }
            } else {
                series = Array.from(Array(seriesCount * 2)).fill(0);
            }
        }
        socket.emit("getData", { series, startX: index + 1, pointsPerUpdate, sendEvery, positive, scale: 10 });
        isRunning = true;
        loadFromBuffer();
    };

    const settings = {
        seriesCount: 10,
        pointsOnChart: 5000,
        pointsPerUpdate: 10,
        sendEvery: 100,
        initialPoints: 5000,
    };

    const updateSettings = (newValues: ISettings) => {
        Object.assign(settings, newValues);
    };

    // Buttons for chart
    const startStreaming = () => {
        console.log("start streaming");
        loadCount = 0;
        avgLoadTime = 0;
        avgRenderTime = 0;
        loadTimes = [];
        loadStart = 0;
        seriesCount = settings.seriesCount;
        initialPoints = settings.initialPoints;
        pointsOnChart = settings.pointsOnChart;
        pointsPerUpdate = settings.pointsPerUpdate;
        sendEvery = settings.sendEvery;
        const positive = initChart();
        initWebSocket(positive);
    };

    const stopStreaming = () => {
        console.log("stop streaming");
        socket?.disconnect();
        isRunning = false;
        if (sciChartSurface.chartModifiers.size() === 0) {
            sciChartSurface.chartModifiers.add(
                new MouseWheelZoomModifier(),
                new ZoomPanModifier(),
                new ZoomExtentsModifier()
            );
        }
    };
    return { wasmContext, sciChartSurface, controls: { startStreaming, stopStreaming, updateSettings } };
};
