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
    IBaseRenderableSeriesOptions,
    HlcDataSeries,
    FastErrorBarsRenderableSeries,
    FastMountainRenderableSeries,
    buildSeries,
    buildDataSeries,
    TSeriesDefinition,
    UniformHeatmapDataSeries,
    NonUniformHeatmapDataSeries,
    XyxyDataSeries,
    XyxDataSeries,
    IRenderableSeries,
    IDataSeries
} from "scichart";

/**
 * Maps ESeriesType to the appropriate EDataSeriesType
 * @param seriesType The series type to map
 * @returns The corresponding data series type
 */
export const getDataSeriesTypeForRenderableSeries = (seriesType: ESeriesType): EDataSeriesType => {
    switch (seriesType) {
        // XYZ series types
        case ESeriesType.BubbleSeries:
            return EDataSeriesType.Xyz;

        // XYY series types
        case ESeriesType.BandSeries:
        case ESeriesType.SplineBandSeries:
        case ESeriesType.PolarBandSeries:
        case ESeriesType.ScatterSeries:
        case ESeriesType.PolarScatterSeries:
            return EDataSeriesType.Xyy;

        // OHLC series types
        case ESeriesType.CandlestickSeries:
        case ESeriesType.OhlcSeries:
            return EDataSeriesType.Ohlc;

        // HLC series types
        case ESeriesType.ErrorBarsSeries:
            return EDataSeriesType.Hlc;

        // XYText series types
        case ESeriesType.TextSeries:
        case ESeriesType.PolarTextSeries:
            return EDataSeriesType.XyText;

        // BoxPlot series types
        case ESeriesType.BoxPlotSeries:
            return EDataSeriesType.BoxPlot;

        // XYXY series types
        case ESeriesType.TriangleSeries:
        case ESeriesType.PolarTriangleSeries:
        case ESeriesType.LineSegmentSeries:
            return EDataSeriesType.Xyxy;

        // XYX series types
        case ESeriesType.RectangleSeries:
        case ESeriesType.PolarColumnSeries:
            return EDataSeriesType.Xyx;

        // Uniform Heatmap series types
        case ESeriesType.UniformHeatmapSeries:
        case ESeriesType.UniformContoursSeries:
        case ESeriesType.PolarUniformHeatmapSeries:
            return EDataSeriesType.HeatmapUniform;

        // Non-uniform Heatmap series types
        case ESeriesType.NonUniformHeatmapSeries:
            return EDataSeriesType.HeatmapNonUniform;

        // XY series types (default for most series)
        case ESeriesType.LineSeries:
        case ESeriesType.SplineLineSeries:
        case ESeriesType.PolarLineSeries:
        case ESeriesType.MountainSeries:
        case ESeriesType.SplineMountainSeries:
        case ESeriesType.PolarMountainSeries:
        case ESeriesType.ColumnSeries:
        case ESeriesType.ImpulseSeries:
        case ESeriesType.StackedColumnSeries:
        case ESeriesType.PolarStackedColumnSeries:
        case ESeriesType.StackedMountainSeries:
        case ESeriesType.PolarStackedMountainSeries:
        case ESeriesType.SmoothStackedMountainSeries:
        case ESeriesType.StackedColumnCollection:
        case ESeriesType.PolarStackedColumnCollection:
        case ESeriesType.StackedMountainCollection:
        case ESeriesType.PolarStackedMountainCollection:
        default:
            return EDataSeriesType.Xy;
    }
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
        highValues.push(extendRandom(high, close - open));
        const low = Math.min(open, close);
        lowValues.push(extendRandom(low, open - close));
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
        const close = open * (1 + (Math.random() - 0.5) * 0.2);
        let high = Math.max(open, close);
        highValues.push(extendRandom(high, close - open));
        const low = Math.min(open, close);
        lowValues.push(extendRandom(low, open - close));
        closeValues.push(close);
        openValues.push(open);
        open = close;
    }
    return { openValues, highValues, lowValues, closeValues };
};

type GeneratedDataMap = {
    [EDataSeriesType.Xy]: {
        xValues: number[];
        yValues: number[];
    };
    [EDataSeriesType.Xyy]: {
        xValues: number[];
        yValues: number[];
        y1Values: number[];
    };
    [EDataSeriesType.Xyz]: {
        xValues: number[];
        yValues: number[];
        zValues: number[];
    };
    [EDataSeriesType.Ohlc]: {
        xValues: number[];
        openValues: number[];
        highValues: number[];
        lowValues: number[];
        closeValues: number[];
    };
} & {
    [K in Exclude<
        EDataSeriesType,
        EDataSeriesType.Xy | EDataSeriesType.Xyy | EDataSeriesType.Xyz | EDataSeriesType.Ohlc
    >]: never;
};

// TODO currently this is unused and requires proper logic to handle other types
export const generateData = <T extends EDataSeriesType>(
    seriesType: ESeriesType,
    dataSeries: BaseDataSeries,
    dataSeriesType: T,
    index: number,
    pointsOnChart: number,
    pointsPerUpdate: number
): GeneratedDataMap[T] => {
    const lastIndex = dataSeries.count() - 1;
    const lastX = dataSeries.getNativeXValues().get(lastIndex);
    const xValues = Array.from({ length: pointsPerUpdate }, (_, i) => lastX + 1 + i);
    const positive = [ESeriesType.StackedColumnSeries, ESeriesType.StackedMountainSeries].includes(
        seriesType
    );

    switch (dataSeriesType) {
        case EDataSeriesType.Xy: {
            const xySeries = dataSeries as XyDataSeries;
            const yValues = GetRandomData(
                xValues,
                positive,
                xySeries.getNativeYValues().get(lastIndex)
            );
            return { xValues, yValues } as GeneratedDataMap[T];
        }
        case EDataSeriesType.Xyy: {
            const xyySeries = dataSeries as XyyDataSeries;
            const yValues = GetRandomData(
                xValues,
                positive,
                xyySeries.getNativeYValues().get(lastIndex)
            );
            const y1Values = GetRandomData(
                xValues,
                positive,
                xyySeries.getNativeY1Values().get(lastIndex)
            );
            return { xValues, yValues, y1Values } as GeneratedDataMap[T];
        }
        case EDataSeriesType.Xyz: {
            const xyzSeries = dataSeries as XyzDataSeries;
            const yValues = GetRandomData(
                xValues,
                positive,
                xyzSeries.getNativeYValues().get(lastIndex)
            );
            const zValues = GetRandomData(
                xValues,
                positive,
                xyzSeries.getNativeZValues().get(lastIndex)
            ).map(z => Math.abs(z / 5));
            return { xValues, yValues, zValues } as GeneratedDataMap[T];
        }
        case EDataSeriesType.Ohlc: {
            const ohlcSeries = dataSeries as OhlcDataSeries;
            const lastClose = ohlcSeries.getNativeCloseValues().get(ohlcSeries.count() - 1);
            const { openValues, highValues, lowValues, closeValues } =
                generateCandleDataForAppendRange(
                    lastClose,
                    GetRandomData(xValues, positive, lastClose)
                );
            return { xValues, openValues, highValues, lowValues, closeValues } as any;
        }
        default:
            throw new Error("Not implemented!");
    }
};
export const appendData = <T extends keyof GeneratedDataMap>(
    seriesType: ESeriesType,
    dataSeries: BaseDataSeries,
    dataSeriesType: T,
    index: number,
    pointsOnChart: number,
    pointsPerUpdate: number,
    data: GeneratedDataMap[T]
) => {
    if (!data) return;
    const currentCount = dataSeries.count();
    const newCount = currentCount + pointsPerUpdate;

    switch (dataSeriesType) {
        case EDataSeriesType.Xy: {
            const xySeries = dataSeries as XyDataSeries;
            const { xValues, yValues } = data as { xValues: number[]; yValues: number[] };
            if (!xySeries.fifoCapacity && newCount > pointsOnChart) {
                xySeries.removeRange(0, newCount - pointsOnChart);
            }
            xySeries.appendRange(xValues, yValues);
            break;
        }
        case EDataSeriesType.Xyy: {
            const xyySeries = dataSeries as XyyDataSeries;
            const { xValues, yValues, y1Values } = data as {
                xValues: number[];
                yValues: number[];
                y1Values: number[];
            };
            if (!xyySeries.fifoCapacity && newCount > pointsOnChart) {
                xyySeries.removeRange(0, newCount - pointsOnChart);
            }
            xyySeries.appendRange(xValues, yValues, y1Values);
            break;
        }
        case EDataSeriesType.Xyx: {
            const xyxSeries = dataSeries as XyxDataSeries;
            const { xValues, yValues, x1Values } = data as {
                xValues: number[];
                yValues: number[];
                x1Values: number[];
            };
            if (!xyxSeries.fifoCapacity && newCount > pointsOnChart) {
                xyxSeries.removeRange(0, newCount - pointsOnChart);
            }
            xyxSeries.appendRange(xValues, yValues, x1Values);
            break;
        }
        case EDataSeriesType.Xyz: {
            const xyzSeries = dataSeries as XyzDataSeries;
            const { xValues, yValues, zValues } = data as {
                xValues: number[];
                yValues: number[];
                zValues: number[];
            };
            if (!xyzSeries.fifoCapacity && newCount > pointsOnChart) {
                xyzSeries.removeRange(0, newCount - pointsOnChart);
            }
            xyzSeries.appendRange(xValues, yValues, zValues);
            break;
        }
        case EDataSeriesType.Xyxy: {
            const xyxySeries = dataSeries as XyxyDataSeries;
            const { xValues, yValues, x1Values, y1Values } = data as {
                xValues: number[];
                yValues: number[];
                x1Values: number[];
                y1Values: number[];
            };
            if (!xyxySeries.fifoCapacity && newCount > pointsOnChart) {
                xyxySeries.removeRange(0, newCount - pointsOnChart);
            }
            xyxySeries.appendRange(xValues, yValues, x1Values, y1Values);
            break;
        }
        case EDataSeriesType.Hlc: {
            const hlcSeries = dataSeries as HlcDataSeries;
            const { xValues, highValues, lowValues, closeValues } = data as {
                xValues: number[];
                highValues: number[];
                lowValues: number[];
                closeValues: number[];
            };
            if (!hlcSeries.fifoCapacity && newCount > pointsOnChart) {
                hlcSeries.removeRange(0, newCount - pointsOnChart);
            }
            hlcSeries.appendRange(xValues, highValues, lowValues, closeValues);
            break;
        }
        case EDataSeriesType.Ohlc: {
            const ohlcSeries = dataSeries as OhlcDataSeries;
            const { xValues, openValues, highValues, lowValues, closeValues } = data as {
                xValues: number[];
                openValues: number[];
                highValues: number[];
                lowValues: number[];
                closeValues: number[];
            };
            if (!ohlcSeries.fifoCapacity && newCount > pointsOnChart) {
                ohlcSeries.removeRange(0, newCount - pointsOnChart);
            }
            ohlcSeries.appendRange(xValues, openValues, highValues, lowValues, closeValues);
            break;
        }
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
            (dataSeries as XyyDataSeries).appendRange(
                xValues,
                yValues,
                GetRandomData(xValues, positive)
            );
            break;
        case EDataSeriesType.Xyz:
            (dataSeries as XyzDataSeries).appendRange(
                xValues,
                yValues,
                GetRandomData(xValues, positive).map(z => Math.abs(z / 5))
            );
            break;
        case EDataSeriesType.Xyx:
            (dataSeries as XyxDataSeries).appendRange(
                xValues,
                yValues,
                GetRandomData(xValues, positive)
            );
            break;
        case EDataSeriesType.Xyxy:
            (dataSeries as XyxyDataSeries).appendRange(
                xValues,
                yValues,
                GetRandomData(xValues, positive),
                GetRandomData(xValues, positive)
            );
            break;
        case EDataSeriesType.Hlc: {
            const { openValues, highValues, lowValues, closeValues } = generateCandleData(xValues);
            (dataSeries as HlcDataSeries).appendRange(xValues, highValues, lowValues, closeValues);
            break;
        }
        case EDataSeriesType.Ohlc: {
            const { openValues, highValues, lowValues, closeValues } = generateCandleData(xValues);
            (dataSeries as OhlcDataSeries).appendRange(
                xValues,
                openValues,
                highValues,
                lowValues,
                closeValues
            );
            break;
        }
        case EDataSeriesType.XyText:
            (dataSeries as XyTextDataSeries).appendRange(
                xValues,
                yValues,
                yValues.map(textval => textval.toFixed())
            );
            break;
        default:
            break;
    }
};

export const createRenderableSeries = (
    wasmContext: TSciChart,
    seriesType: ESeriesType,
    xAxisId: string,
    yAxisId: string,
    dsOptions: IBaseDataSeriesOptions
): { dataSeries: IDataSeries; rendSeries: IRenderableSeries } => {
    const dataSeriesType = getDataSeriesTypeForRenderableSeries(seriesType);
    const options: IBaseRenderableSeriesOptions = {
        stroke,
        // @ts-ignore
        fill,
        opacity: 0.8,
        xAxisId,
        yAxisId,
        stackedGroupId: "StackedGroupId"
    };

    const definition = { type: seriesType, options } as TSeriesDefinition;
    const [rendSeries] = buildSeries(wasmContext, definition);
    const dataSeries = buildDataSeries(wasmContext, {
        type: dataSeriesType,
        options: dsOptions
    });
    rendSeries.dataSeries = dataSeries;
    return { rendSeries, dataSeries };
};

const fill = AUTO_COLOR;
const stroke = AUTO_COLOR;
export function bytesToMB(bytes: number, useDecimal = false) {
    if (bytes !== undefined) {
        const divisor = useDecimal ? 1000 ** 2 : 1024 ** 2;
        return bytes / divisor;
    } else {
        return null;
    }
}

export function cloneArray(arr: any[]) {
    return arr.map(x => x);
}
