import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";

export async function initSciChart2() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id-2");
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [...Array(1000).keys()];
    const yValues = xValues.map(x => Math.sin(x* 0.1));

    const dataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        // Optionally set parameters for data distribution. If not these will be computed automatically
        dataIsSortedInX: true,
        dataEvenlySpacedInX: true,
        containsNaN: false,
    });

    // Create a line series and set resampling mode
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries,
        resamplingMode: EResamplingMode.Auto // or None to disable
    }));
}

