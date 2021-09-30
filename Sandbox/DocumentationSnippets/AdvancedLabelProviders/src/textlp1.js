import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { FastColumnRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { TextLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/TextLabelProvider";
import { ELabelAlignment } from "scichart/Charting/Visuals/Axis/ELabelAlignment";

export async function initSciChart1() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-div-id');

    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1) }));

    const xAxis = new CategoryAxis(wasmContext);
    const labelProvider = new TextLabelProvider({
        // When passed as an array, labels will be used in order, regardless of the x Value
        labels: [
            "Bananas",
            "Apples",
            "Oranges",
            "Strawberries",
            "Plums"
        ]
    });
    xAxis.labelProvider = labelProvider;
    xAxis.labelStyle.alignment = ELabelAlignment.Center;
    sciChartSurface.xAxes.add(xAxis);

    const dataSeries = new XyDataSeries(wasmContext);
    dataSeries.appendRange([5, 4, 3, 2, 1], [100, 40, 60, 30, 80]);

    const columnSeries = new FastColumnRenderableSeries(wasmContext, { dataSeries, dataPointWidth: 0.5, fill:"#5555ff" });
    sciChartSurface.renderableSeries.add(columnSeries);
}
