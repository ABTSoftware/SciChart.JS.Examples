import {
    ESeriesType,
    EDataSeriesType,
    BaseDataSeries,
    XyDataSeries,
    XyyDataSeries,
    XyzDataSeries,
    OhlcDataSeries,
    XyTextDataSeries,
    IBaseDataSeriesOptions,
    TSciChart,
    BaseRenderableSeries,
    FastLineRenderableSeries,
    AUTO_COLOR,
    FastBubbleRenderableSeries,
    EllipsePointMarker,
    FastBandRenderableSeries,
    StackedColumnRenderableSeries,
    FastColumnRenderableSeries,
    StackedMountainRenderableSeries,
    XyCustomFilter,
    EDataSeriesField,
    XyScatterRenderableSeries,
    FastCandlestickRenderableSeries,
} from "scichart";

export interface Mark {
    value: number;
    label?: React.ReactNode;
}

export const getDataSeriesTypeForRenderableSeries = (seriesType: ESeriesType) => {
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

    return dataSeriesType;
};

export function getSubChartPositionIndexes(chartIndex: number, columnNumber: number) {
    const rowIndex = Math.floor(chartIndex / columnNumber);
    const columnIndex = chartIndex % columnNumber;
    return { rowIndex, columnIndex };
}

const extendRandom = (val: number, max: number) => val + Math.random() * max;

export const generateCandleDataForAppendRange = (open: number, closeValues: number[]) => {
    const openValues = [];
    const highValues = [];
    const lowValues = [];
    for (const close of closeValues) {
        openValues.push(open);
        let high = Math.max(open, close);
        highValues.push(extendRandom(high, 5));
        const low = Math.min(open, close);
        lowValues.push(extendRandom(low, -5));
        open = close;
    }
    return { openValues, highValues, lowValues, closeValues };
};

const generateCandleData = (xValues: number[]) => {
    let open = 10;
    const openValues = [];
    const highValues = [];
    const lowValues = [];
    const closeValues = [];

    for (let i = 0; i < xValues.length; i++) {
        const close = open + Math.random() * 10 - 5;
        let high = Math.max(open, close);
        highValues.push(extendRandom(high, 5));
        const low = Math.min(open, close);
        lowValues.push(extendRandom(low, -5));
        closeValues.push(close);
        openValues.push(open);
        open = close;
    }
    return { openValues, highValues, lowValues, closeValues };
};

export const appendData = (
    seriesType: ESeriesType,
    dataSeries: BaseDataSeries,
    dataSeriesType: EDataSeriesType,
    index: number,
    pointsOnChart: number,
    pointsPerUpdate: number
) => {
    const lastIndex = dataSeries.count() - 1;
    const lastX = dataSeries.getNativeXValues().get(lastIndex);
    const xValues = Array.from(Array(pointsPerUpdate)).map((_, i) => lastX + 1 + i);
    const positive = [ESeriesType.StackedColumnSeries, ESeriesType.StackedMountainSeries].includes(seriesType);
    switch (dataSeriesType) {
        case EDataSeriesType.Xy:
            const xySeries = dataSeries as XyDataSeries;
            xySeries.appendRange(xValues, GetRandomData(xValues, positive, xySeries.getNativeYValues().get(lastIndex)));
            if (xySeries.count() > pointsOnChart) {
                xySeries.removeRange(0, pointsPerUpdate);
            }
            break;
        case EDataSeriesType.Xyy:
            const xyySeries = dataSeries as XyyDataSeries;
            xyySeries.appendRange(
                xValues,
                GetRandomData(xValues, positive, xyySeries.getNativeYValues().get(lastIndex)),
                GetRandomData(xValues, positive, xyySeries.getNativeY1Values().get(lastIndex))
            );
            if (xyySeries.count() > pointsOnChart) {
                xyySeries.removeRange(0, pointsPerUpdate);
            }
            break;
        case EDataSeriesType.Xyz:
            const xyzSeries = dataSeries as XyzDataSeries;
            xyzSeries.appendRange(
                xValues,
                GetRandomData(xValues, positive, xyySeries.getNativeYValues().get(lastIndex)),
                GetRandomData(xValues, positive, xyySeries.getNativeY1Values().get(lastIndex)).map((z) =>
                    Math.abs(z / 5)
                )
            );
            if (xyzSeries.count() > pointsOnChart) {
                xyzSeries.removeRange(0, pointsPerUpdate);
            }
            break;
        case EDataSeriesType.Ohlc:
            const ohlcSeries = dataSeries as OhlcDataSeries;
            const lastClose = ohlcSeries.getNativeCloseValues().get(ohlcSeries.count() - 1);
            const { openValues, highValues, lowValues, closeValues } = generateCandleDataForAppendRange(
                lastClose,
                GetRandomData(xValues, positive, lastClose)
            );
            ohlcSeries.appendRange(xValues, openValues, highValues, lowValues, closeValues);
            if (ohlcSeries.count() > pointsOnChart) {
                ohlcSeries.removeRange(0, pointsPerUpdate);
            }
            break;
        default:
            break;
    }
};

export function GetRandomData(xValues: number[], positive: boolean, prevYValue?: number) {
    prevYValue = prevYValue ?? Math.random();
    const yValues: number[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < xValues.length; j++) {
        const change = Math.random() * 10 - 5;
        prevYValue = positive ? Math.abs(prevYValue + change) : prevYValue + change;
        yValues.push(prevYValue);
    }
    return yValues;
}

export const prePopulateData = (
    dataSeries: BaseDataSeries,
    dataSeriesType: EDataSeriesType,
    xValues: number[],
    positive: boolean
) => {
    const yValues: number[] = GetRandomData(xValues, positive);
    const lastY: number[] = [];
    switch (dataSeriesType) {
        case EDataSeriesType.Xy:
            (dataSeries as XyDataSeries).appendRange(xValues, yValues);
            lastY.push(yValues[yValues.length - 1]);
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

const dsOptions: IBaseDataSeriesOptions = {
    isSorted: true,
    containsNaN: false,
};

export const createRenderableSeries = (
    wasmContext: TSciChart,
    seriesType: ESeriesType,
    xAxisId: string,
    yAxisId: string
): { dataSeries: BaseDataSeries; rendSeries: BaseRenderableSeries } => {
    if (seriesType === ESeriesType.LineSeries) {
        const dataSeries: XyDataSeries = new XyDataSeries(wasmContext, dsOptions);
        const rendSeries: FastLineRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke: AUTO_COLOR,
            strokeThickness: 3,
            opacity: 0.8,
            xAxisId,
            yAxisId,
        });
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.BubbleSeries) {
        const dataSeries: XyzDataSeries = new XyzDataSeries(wasmContext, dsOptions);
        const stroke = AUTO_COLOR;
        const rendSeries: FastBubbleRenderableSeries = new FastBubbleRenderableSeries(wasmContext, {
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 32,
                height: 32,
                strokeThickness: 0,
                fill: stroke,
            }),
            xAxisId,
            yAxisId,
            zMultiplier: 0.4,
            opacity: 0.5,
            dataSeries,
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
            xAxisId,
            yAxisId,
            strokeThickness: 2,
            opacity: 0.8,
        });
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.StackedColumnSeries) {
        const dataSeries: XyDataSeries = new XyDataSeries(wasmContext, dsOptions);
        const rendSeries: StackedColumnRenderableSeries = new StackedColumnRenderableSeries(wasmContext, {
            stroke: AUTO_COLOR,
            fill: AUTO_COLOR,
            dataSeries,
            strokeThickness: 0,
            spacing: 0,
        });
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.ColumnSeries) {
        const dataSeries: XyDataSeries = new XyDataSeries(wasmContext, dsOptions);
        const rendSeries: FastColumnRenderableSeries = new FastColumnRenderableSeries(wasmContext, {
            fill: AUTO_COLOR,
            stroke: AUTO_COLOR,
            xAxisId,
            yAxisId,
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
                width: 3,
                height: 3,
                strokeThickness: 2,
                fill: AUTO_COLOR,
                stroke: AUTO_COLOR,
                opacity: 0.8,
            }),
            xAxisId,
            yAxisId,
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
            xAxisId,
            yAxisId,
            strokeUp: AUTO_COLOR,
            brushUp: AUTO_COLOR,
            strokeDown: AUTO_COLOR,
            brushDown: AUTO_COLOR,
        });
        return { dataSeries, rendSeries };
    }
    return { dataSeries: undefined, rendSeries: undefined };
};
