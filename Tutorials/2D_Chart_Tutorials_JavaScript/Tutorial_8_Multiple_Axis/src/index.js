import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EAxisAlignment} from "scichart/types/AxisAlignment";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {LineAnnotation} from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import {YAxisDragModifier} from "scichart/Charting/ChartModifiers/YAxisDragModifier";
import {EDragMode} from "scichart/types/DragMode";

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

    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const {sciChartSurface, wasmContext} = await SciChartSurface.create("scichart-root");

    // Create an X Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    // Create first Y Axis and add to the chart
    const yAxis1 = new NumericAxis(wasmContext);
    yAxis1.id = "y_axis_1_id";
    yAxis1.axisTitleStyle = {
        color: "#33F9FF",
        fontSize: 40,
        fontFamily: "Courier New"
    };
    yAxis1.axisTitle = "First Y Axis"
    yAxis1.axisAlignment = EAxisAlignment.Left;
    sciChartSurface.yAxes.add(yAxis1);

    // Create second Y Axis and add to the chart
    const yAxis2 = new NumericAxis(wasmContext);
    yAxis2.id = "y_axis_2_id";
    yAxis2.axisTitleStyle = {
        color: "#33ff33",
        fontSize: 40,
        fontFamily: "Courier New"
    };
    yAxis2.axisTitle = "Second Y Axis"
    sciChartSurface.yAxes.add(yAxis2);

    // Create first series and bind to the first Y axis
    const lineSeries1 = new FastLineRenderableSeries(wasmContext, { stroke: "#33F9FF", yAxisId: "y_axis_1_id"});
    sciChartSurface.renderableSeries.add(lineSeries1);
    lineSeries1.dataSeries = new XyDataSeries(wasmContext, {xValues: [0, 1, 2, 3], yValues:[0, 60, 160, 300]});

    // Create second series and bind to the second Y axis
    const lineSeries2 = new FastLineRenderableSeries(wasmContext, { stroke: "#33ff33", yAxisId: "y_axis_2_id"});
    sciChartSurface.renderableSeries.add(lineSeries2);
    lineSeries2.dataSeries = new XyDataSeries(wasmContext, {xValues: [0, 1, 2, 3, 4], yValues:[0, 101, 240, 500, 600]});

    // Add line annotation and bind to Y2 axis
    sciChartSurface.annotations.add(
        new LineAnnotation({
            yAxisId: "y_axis_2_id",
            stroke: "#FF6600",
            strokeThickness: 3,
            x1: 0,
            x2: 4,
            y1: 300,
            y2: 300,
        })
    );

    // Add a drag modifier for Y Axis
    sciChartSurface.chartModifiers.add(new YAxisDragModifier({ dragMode: EDragMode.Scaling }));
    sciChartSurface.zoomExtents();
}

initSciChart();
