import { SciChartSurface, NumericAxis, DiscontinuousDateAxis, NumberRange, OhlcDataSeries, FastCandlestickRenderableSeries } from "scichart";
import { multiPaneData } from "./multiPaneData";
import { OhlcHeikinAshiFilter } from "scichart-financial-tools";

const SOURCE_POINT_COUNT = 60;

export async function ex11HeikinAshiDataFilter() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    sciChartSurface.xAxes.add(new DiscontinuousDateAxis(wasmContext, { growBy: new NumberRange(0.02, 0.02) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.02, 0.02) }));

    const sourceSeries = new OhlcDataSeries(wasmContext, {
        xValues: multiPaneData.dateValues.slice(0, SOURCE_POINT_COUNT),
        openValues: multiPaneData.openValues.slice(0, SOURCE_POINT_COUNT),
        highValues: multiPaneData.highValues.slice(0, SOURCE_POINT_COUNT),
        lowValues: multiPaneData.lowValues.slice(0, SOURCE_POINT_COUNT),
        closeValues: multiPaneData.closeValues.slice(0, SOURCE_POINT_COUNT),
        dataSeriesName: "Source OHLC"
    });

    const heikinAshiFilter = new OhlcHeikinAshiFilter(sourceSeries, {
        dataSeriesName: "Heikin-Ashi"
    });
    
    const rs = new FastCandlestickRenderableSeries(wasmContext, {
        dataSeries: heikinAshiFilter,
        dataPointWidth: 0.6,
        strokeThickness: 1
    });

    sciChartSurface.renderableSeries.add(rs);

    sciChartSurface.zoomExtents();
}
