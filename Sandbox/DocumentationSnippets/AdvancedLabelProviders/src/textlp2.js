import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { FastColumnRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { TextLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/TextLabelProvider";
import { ELabelAlignment } from "scichart/Charting/Visuals/Axis/ELabelAlignment";

export async function initSciChart2() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-div-id-2');

    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1) }));

    const xAxis = new CategoryAxis(wasmContext);
    const labelProvider = new TextLabelProvider({
        // When passed as an object, data values will be mapped to fields
        labels: {
            1: "Bananas",
            2: "Apples",
            3: "Oranges",
            4: "Strawberries",
            5: "Plums"
        }
    });
    xAxis.labelProvider = labelProvider;
    xAxis.labelStyle.alignment = ELabelAlignment.Center;

    sciChartSurface.xAxes.add(xAxis);

    const dataSeries = new XyDataSeries(wasmContext);
    dataSeries.appendRange([5, 4, 3, 2, 1], [100, 40, 60, 30, 80]);

    const columnSeries = new FastColumnRenderableSeries(wasmContext, { dataSeries, dataPointWidth: 0.5, fill:"#5555ff" });
    sciChartSurface.renderableSeries.add(columnSeries);
}
