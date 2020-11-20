import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {YAxisDragModifier} from "scichart/Charting/ChartModifiers/YAxisDragModifier";
import {XAxisDragModifier} from "scichart/Charting/ChartModifiers/XAxisDragModifier";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";

async function initSciChart() {
    // LICENSING //
    // Set your license code here
    // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
    // Purchased license keys can be viewed at https://www.scichart.com/profile
    //
    // e.g.
    //
    // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
    //
    // Also, once activated (trial or paid license) having the licensing wizard open on your machine
    // will mean any or all applications you run locally will be fully licensed.

    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const {sciChartSurface, wasmContext} = await SciChartSurface.create("scichart-root");

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "Primary XAxis",
        axisAlignment: EAxisAlignment.Bottom,
    });
    const xAxis2 = new NumericAxis(wasmContext, {
        axisTitle: "Secondary XAxis",
        id: "XAxis_2",
        axisAlignment: EAxisAlignment.Top,
    });
    const yAxis = new NumericAxis(wasmContext,
        {
            axisTitle: "Primary YAxis",
            axisAlignment: EAxisAlignment.Left,
        });
    const yAxis2 = new NumericAxis(wasmContext,
        {
            axisTitle: "Secondary YAxis",
            id: "YAxis_2",
            axisAlignment: EAxisAlignment.Right,
        });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.xAxes.add(xAxis2);
    sciChartSurface.yAxes.add(yAxis);
    sciChartSurface.yAxes.add(yAxis2);

    // Create first series and bind to the first Y axis
    const lineSeries1 = new FastLineRenderableSeries(wasmContext, { stroke: "#33F9FF", xAxisId: "XAxis_2" , yAxisId: "YAxis_2" });
    sciChartSurface.renderableSeries.add(lineSeries1);
    lineSeries1.dataSeries = new XyDataSeries(wasmContext, {xValues: [0, 1, 2, 3], yValues:[0, 60, 160, 300]});

    // Create second series and bind to the second Y axis
    const lineSeries2 = new FastLineRenderableSeries(wasmContext, { stroke: "#33ff33"});
    sciChartSurface.renderableSeries.add(lineSeries2);
    lineSeries2.dataSeries = new XyDataSeries(wasmContext, {xValues: [0, 1, 2, 3, 4], yValues:[0, 101, 240, 500, 600]});

    sciChartSurface.chartModifiers.add(new YAxisDragModifier());
    sciChartSurface.chartModifiers.add(new XAxisDragModifier());

    sciChartSurface.annotations.add(new TextAnnotation({
        text: "Annotations on Axis!",
        x1: 1,
        y1: 200,
        xAxisId: "XAxis_2",
        yAxisId: "YAxis_2"
    }));

}

initSciChart();
