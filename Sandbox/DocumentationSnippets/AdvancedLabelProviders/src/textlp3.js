import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { FastColumnRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { TextLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/TextLabelProvider";
import { ELabelAlignment } from "scichart/Charting/Visuals/Axis/ELabelAlignment";
import { Thickness } from 'scichart/Core/Thickness';


export async function initSciChart3() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-div-id-3');
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1) }));

    const xAxis = new CategoryAxis(wasmContext);
    const labelProvider = new TextLabelProvider({    
        labels: [
            // Provide multiple lines directly
            ["Apples","and Bananas"],
            ["Strawberries","and Raspberries"],
            ["Lemons, Limes", "and Oranges"],
            // These will be auto-wrapped
            "Apples and Bananas",
            "Strawberries and Raspberries",
            "Lemons Limes and Oranges",
        ],
        maxLength: 10
    });
    xAxis.labelProvider = labelProvider;
    xAxis.labelStyle.padding = Thickness.fromNumber(4);
    xAxis.labelStyle.alignment = ELabelAlignment.Center;

    sciChartSurface.xAxes.add(xAxis);

    xAxis.axisTitle = ["This is a very long axis title", "that has been split into multiple lines", "to demonstrate the new functionality"];
    // Axis titles are 24px by default.  Multi-line ones may need to be smaller
    xAxis.axisTitleStyle.fontSize = 16;

    const dataSeries = new XyDataSeries(wasmContext);
    dataSeries.appendRange([1,2,3,4,5,6], [100, 40, 60,15,36,54]);

    const columnSeries = new FastColumnRenderableSeries(wasmContext, { dataSeries, dataPointWidth: 0.5, fill:"#5555ff" });
    sciChartSurface.renderableSeries.add(columnSeries);
    
}
