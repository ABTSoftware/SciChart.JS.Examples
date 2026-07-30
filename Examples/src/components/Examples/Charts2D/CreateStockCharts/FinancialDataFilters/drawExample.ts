import {
    EllipsePointMarker,
    FastCandlestickRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    OhlcDataSeries,
    RolloverModifier,
    SciChartJsNavyTheme,
    SciChartSurface,
    XPointMarker,
    XyDataSeries,
    XyScatterRenderableSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { OhlcHeikinAshiFilter, OhlcRenkoFilter, PointAndFigureFilter } from "scichart-financial-tools";

export type TFilterMode = "source" | "heikinAshi" | "renko" | "pointAndFigure";

const SOURCE_POINT_COUNT = 90;
const RENKO_BRICK_SIZE = 1.4;
const RENKO_REVERSAL_AMOUNT = 2;
const PNF_BOX_SIZE = 1.2;
const PNF_REVERSAL_AMOUNT = 2;

const createSeededRandom = (seed: number) => {
    let state = seed >>> 0;
    return () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 0x100000000;
    };
};

const createSeededOhlcData = (count: number) => {
    const random = createSeededRandom(20260514);
    const xValues: number[] = [];
    const openValues: number[] = [];
    const highValues: number[] = [];
    const lowValues: number[] = [];
    const closeValues: number[] = [];

    let close = 116;
    for (let i = 0; i < count; i++) {
        const trend = Math.sin(i / 9) * 0.9 + Math.cos(i / 18) * 0.45;
        const noise = (random() - 0.5) * 1.9;
        const open = close + (random() - 0.5) * 1.2;
        close = Math.max(78, open + trend + noise);
        const high = Math.max(open, close) + 0.5 + random() * 1.6;
        const low = Math.min(open, close) - 0.5 - random() * 1.5;

        xValues.push(i);
        openValues.push(Number(open.toFixed(2)));
        highValues.push(Number(high.toFixed(2)));
        lowValues.push(Number(low.toFixed(2)));
        closeValues.push(Number(close.toFixed(2)));
    }

    return { xValues, openValues, highValues, lowValues, closeValues };
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme(),
    });

    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "Source Index",
        growBy: new NumberRange(0.01, 0.01),
        labelPrecision: 0,
    });
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "Price",
        growBy: new NumberRange(0.08, 0.18),
        labelPrecision: 2,
    });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const sourceData = createSeededOhlcData(SOURCE_POINT_COUNT);
    const sourceSeries = new OhlcDataSeries(wasmContext, {
        ...sourceData,
        dataSeriesName: "Source OHLC",
    });
    const heikinAshiFilter = new OhlcHeikinAshiFilter(sourceSeries, {
        dataSeriesName: "Heikin-Ashi",
    });
    const renkoFilter = new OhlcRenkoFilter(sourceSeries, {
        dataSeriesName: "Renko",
        brickSize: RENKO_BRICK_SIZE,
        reversalAmount: RENKO_REVERSAL_AMOUNT,
    });
    const pointAndFigureFilter = new PointAndFigureFilter(sourceSeries, {
        dataSeriesName: "Point & Figure",
        boxSize: PNF_BOX_SIZE,
        reversalAmount: PNF_REVERSAL_AMOUNT,
    });

    const candleSeries = new FastCandlestickRenderableSeries(wasmContext, {
        dataSeries: sourceSeries,
        dataPointWidth: 0.62,
        strokeThickness: 1,
    });

    const xMarksData = new XyDataSeries(wasmContext, { dataSeriesName: "Rising X" });
    const oMarksData = new XyDataSeries(wasmContext, { dataSeriesName: "Falling O" });
    const xMarks = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: xMarksData,
        pointMarker: new XPointMarker(wasmContext, {
            width: 16,
            height: 16,
            stroke: "#41D6A4",
            strokeThickness: 3,
        }),
    });
    const oMarks = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: oMarksData,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 15,
            height: 15,
            stroke: "#FF6B6B",
            fill: "transparent",
            strokeThickness: 3,
        }),
    });

    sciChartSurface.renderableSeries.add(candleSeries, xMarks, oMarks);
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier(),
        new RolloverModifier()
    );

    const syncPointAndFigureData = () => {
        const result = pointAndFigureFilter.lastResult;
        xMarksData.clear();
        oMarksData.clear();
        xMarksData.appendRange(
            result.xMarks.map((mark) => mark.columnIndex),
            result.xMarks.map((mark) => mark.price)
        );
        oMarksData.appendRange(
            result.oMarks.map((mark) => mark.columnIndex),
            result.oMarks.map((mark) => mark.price)
        );
        return result;
    };

    const setFilterMode = (mode: TFilterMode) => {
        candleSeries.isVisible = mode !== "pointAndFigure";
        xMarks.isVisible = mode === "pointAndFigure";
        oMarks.isVisible = mode === "pointAndFigure";
        xAxis.axisTitle = mode === "pointAndFigure" ? "P&F Column" : "Source Index";

        if (mode === "source") {
            candleSeries.dataSeries = sourceSeries;
        } else if (mode === "heikinAshi") {
            candleSeries.dataSeries = heikinAshiFilter;
        } else if (mode === "renko") {
            candleSeries.dataSeries = renkoFilter;
        } else {
            syncPointAndFigureData();
        }

        sciChartSurface.zoomExtents(300);
    };

    setFilterMode("source");

    return { sciChartSurface, setFilterMode };
};
