import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";

export async function initSciChart1() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id");

    const dataSeries = new XyDataSeries(wasmContext, {
        // Optional: pass X,Y values to DataSeries constructor for fast initialization
        xValues: [0,1,2,3,4],
        yValues: [10,11,12,13,14],
        // Optional: pass data distribution properties (this improves performance)
        // else SciChart.js will auto-detect these properties as you update data
        dataIsSortedInX: true,
        dataEvenlySpacedInX: true,
        containsNaN: false,
    });

    dataSeries.isSorted = true;
    dataSeries.containsNaN = true;

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries }));
}

