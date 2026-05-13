import { SciChartSurface, NumericAxis, DiscontinuousDateAxis, NumberRange, OhlcDataSeries, FastCandlestickRenderableSeries } from "scichart";
import { multiPaneData } from "./multiPaneData";
import { OhlcRenkoFilter } from "scichart-financial-tools";

const SOURCE_POINT_COUNT = 300;
const DEFAULT_BRICK_SIZE = 0.004;
const DEFAULT_REVERSAL_AMOUNT = 2;

export async function ex12RenkoDataFilter() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    sciChartSurface.xAxes.add(new DiscontinuousDateAxis(wasmContext, { growBy: new NumberRange(0.02, 0.02) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.02, 0.02), labelPrecision: 3 }));

    const sourceSeries = new OhlcDataSeries(wasmContext, {
        xValues: multiPaneData.dateValues.slice(0, SOURCE_POINT_COUNT),
        openValues: multiPaneData.openValues.slice(0, SOURCE_POINT_COUNT),
        highValues: multiPaneData.highValues.slice(0, SOURCE_POINT_COUNT),
        lowValues: multiPaneData.lowValues.slice(0, SOURCE_POINT_COUNT),
        closeValues: multiPaneData.closeValues.slice(0, SOURCE_POINT_COUNT),
        dataSeriesName: "Source OHLC"
    });

    const renkoFilter = new OhlcRenkoFilter(sourceSeries, {
        dataSeriesName: "Renko",
        brickSize: DEFAULT_BRICK_SIZE,
        reversalAmount: DEFAULT_REVERSAL_AMOUNT
    });
    
    const rs = new FastCandlestickRenderableSeries(wasmContext, {
        dataSeries: renkoFilter,
        dataPointWidth: 0.9,
        strokeThickness: 1
    });

    sciChartSurface.renderableSeries.add(rs);

    sciChartSurface.zoomExtents();
}
