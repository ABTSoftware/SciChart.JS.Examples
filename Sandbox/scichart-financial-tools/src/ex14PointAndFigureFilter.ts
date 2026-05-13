import { SciChartSurface, NumericAxis, DiscontinuousDateAxis, NumberRange, OhlcDataSeries, FastCandlestickRenderableSeries, XyDataSeries, XyScatterRenderableSeries, ENumericFormat } from "scichart";
import { multiPaneData } from "./multiPaneData";
import { PointAndFigureFilter } from "scichart-financial-tools";
import { PointAndFigurePointMarker } from "./PointAndFigure/PointAndFigurePointMarker";
import { PointAndFigureSplitPointMarkerDrawingProvider } from "./PointAndFigure/PointAndFigureSplitPointMarkerDrawingProvider";

const SOURCE_POINT_COUNT = 120;
const DEFAULT_BOX_SIZE = 0.004;
const DEFAULT_REVERSAL_AMOUNT = 3;

export async function ex14PointAndFigureFilter() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    sciChartSurface.xAxes.add(new DiscontinuousDateAxis(wasmContext, { growBy: new NumberRange(0.02, 0.02) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.02, 0.02), labelPrecision: 2 }));

    const sourceSeries = new OhlcDataSeries(wasmContext, {
        xValues: multiPaneData.dateValues.slice(0, SOURCE_POINT_COUNT),
        openValues: multiPaneData.openValues.slice(0, SOURCE_POINT_COUNT),
        highValues: multiPaneData.highValues.slice(0, SOURCE_POINT_COUNT),
        lowValues: multiPaneData.lowValues.slice(0, SOURCE_POINT_COUNT),
        closeValues: multiPaneData.closeValues.slice(0, SOURCE_POINT_COUNT),
        dataSeriesName: "Source OHLC"
    });

    const pointAndFigureFilter = new PointAndFigureFilter(sourceSeries, {
        boxSize: DEFAULT_BOX_SIZE,
        reversalAmount: DEFAULT_REVERSAL_AMOUNT,
        dataSeriesName: "Point & Figure Marks"
    });

    const pointAndFigurePointMarker = new PointAndFigurePointMarker(wasmContext, {
        width: 12,
        height: 12,
        stroke: "#1C7C54",
        strokeThickness: 2,
        fill: "#C0392B"
    });

    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: pointAndFigureFilter,
        pointMarker: pointAndFigurePointMarker,
        stroke: "#C0392B"
    });
    scatterSeries.drawingProviders.forEach(dp => dp.delete());
    scatterSeries.drawingProviders = [new PointAndFigureSplitPointMarkerDrawingProvider(wasmContext, scatterSeries)];

    sciChartSurface.renderableSeries.add(scatterSeries);

    sciChartSurface.zoomExtents();
}
