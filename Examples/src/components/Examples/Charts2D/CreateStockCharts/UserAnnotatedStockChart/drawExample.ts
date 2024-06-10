// SCICHART EXAMPLE
import {
    CategoryAxis,
    chartReviver,
    configure2DSurface,
    CursorModifier,
    CursorTooltipSvgAnnotation,
    CustomAnnotation,
    DateTimeNumericAxis,
    EAutoRange,
    EDataSeriesType,
    EExecuteOn,
    EFillPaletteMode,
    EHorizontalAnchorPoint,
    ENumericFormat,
    ESeriesType,
    EVerticalAnchorPoint,
    FastCandlestickRenderableSeries,
    FastColumnRenderableSeries,
    FastLineRenderableSeries,
    FastMountainRenderableSeries,
    FastOhlcRenderableSeries,
    GradientParams,
    IFillPaletteProvider,
    IPointMetadata,
    IRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    OhlcDataSeries,
    OhlcSeriesInfo,
    parseColorToUIntArgb,
    Point,
    SciChartOverview,
    SciChartSurface,
    SeriesInfo,
    SmartDateLabelProvider,
    XyDataSeries,
    XyMovingAverageFilter,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme } from "../../../theme";
import { CreateTradeMarkerModifier } from "./CreateTradeMarkerModifier";
import { CreateLineAnnotationModifier } from "./CreateLineAnnotationModifier";
import { VerticalYRulerModifier } from "./RulerModifier";
import { multiPaneData } from "../../../ExampleData/multiPaneData";

export interface IChartControls {
    getDefinition: () => object;
    applyDefinition: (definition: any) => void;
    resetChart: () => void;
}

export const drawExample = async (divElementId: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
    });

    const xAxis = new CategoryAxis(wasmContext, {
        // autoRange.never as we're setting visibleRange explicitly below. If you dont do this, leave this flag default
        autoRange: EAutoRange.Never,
        labelProvider: new SmartDateLabelProvider(),
    });
    sciChartSurface.xAxes.add(xAxis);

    // Create a NumericAxis on the YAxis with 2 Decimal Places
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 2,
            labelPrefix: "$",
            autoRange: EAutoRange.Always,
        })
    );

    const { dateValues: xValues, openValues, highValues, lowValues, closeValues } = multiPaneData;

    // Create and add the Candlestick series
    // The Candlestick Series requires a special dataseries type called OhlcDataSeries with o,h,l,c and date values
    const candleDataSeries = new OhlcDataSeries(wasmContext, {
        xValues,
        openValues,
        highValues,
        lowValues,
        closeValues,
        dataSeriesName: "BTC/USDT",
    });
    const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
        dataSeries: candleDataSeries,
        stroke: appTheme.ForegroundColor, // used by cursorModifier below
        strokeThickness: 1,
        brushUp: appTheme.VividGreen + "77",
        brushDown: appTheme.MutedRed + "77",
        strokeUp: appTheme.VividGreen,
        strokeDown: appTheme.MutedRed,
    });
    sciChartSurface.renderableSeries.add(candlestickSeries);

    // Add some moving averages using SciChart's filters/transforms API
    // when candleDataSeries updates, XyMovingAverageFilter automatically recomputes
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyMovingAverageFilter(candleDataSeries, {
                dataSeriesName: "Moving Average (20)",
                length: 20,
            }),
            stroke: appTheme.VividSkyBlue,
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyMovingAverageFilter(candleDataSeries, {
                dataSeriesName: "Moving Average (50)",
                length: 50,
            }),
            stroke: appTheme.VividPink,
        })
    );

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier({ id: "pan" }),
        new CreateTradeMarkerModifier({ id: "marker" }),
        new CreateLineAnnotationModifier({ id: "line" })
    );
    sciChartSurface.chartModifiers.getById("marker").isEnabled = false;
    sciChartSurface.chartModifiers.getById("line").isEnabled = false;

    const getDefinition = () => {
        return {
            visibleRange: xAxis.visibleRange,
            annotations: sciChartSurface.annotations.asArray().map((annotation) => annotation.toJSON()),
        };
    };
    const applyDefinition = (definition: any) => {
        configure2DSurface({ annotations: definition.annotations }, sciChartSurface, wasmContext);
        xAxis.visibleRange = definition.visibleRange;
    };

    const resetChart = () => {
        sciChartSurface.annotations.clear(true);
        // Zoom to the latest 100 candles
        xAxis.visibleRange = new NumberRange(xValues.length - 100, xValues.length - 1);
    };

    resetChart();

    return { sciChartSurface, controls: { getDefinition, applyDefinition, resetChart } as IChartControls };
};
