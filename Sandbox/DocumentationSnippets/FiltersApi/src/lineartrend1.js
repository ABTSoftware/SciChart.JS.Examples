import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyScatterRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { XyLinearTrendFilter } from 'scichart/Charting/Model/Filters/XyLinearTrendFilter';
import { TextAnnotation } from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart/types/AnchorPoint";

export async function initSciChart2() {

    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-div-id-2');

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Original Data
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5],
        yValues: [1, 3, 2, 4, 6],
    });
    const originalLine = new XyScatterRenderableSeries(wasmContext, { dataSeries });

    // Create the filter, passing in the original series
    const linearTrendFilter = new XyLinearTrendFilter(dataSeries);
    const filteredLine = new FastLineRenderableSeries(wasmContext, { dataSeries: linearTrendFilter, stroke: "#cc6600" });

    sciChartSurface.renderableSeries.add(originalLine, filteredLine);

    const textAnnotation = new TextAnnotation({
        x1: 1,
        y1: 5,
        fontSize: 20,
        text: `Slope: ${linearTrendFilter.slope}, y-intercept: ${linearTrendFilter.intercept}, correlation: ${linearTrendFilter.correlation.toFixed(3)}`
    });

    sciChartSurface.annotations.add(textAnnotation);
}