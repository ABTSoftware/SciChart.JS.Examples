import * as React from "react";
import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {TSciChart} from "scichart/types/TSciChart";

const divElementId = "chart";

const createLineData = (wasmContext: TSciChart) => {
    const xyDataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 100; i++) {
        xyDataSeries.append(i, Math.sin(i* 0.1))
    }
    return xyDataSeries;
}

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create XAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "X Axis",
    }));

    // Create YAxis
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "Right Y Axis",
    }));

    // Create a line series
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: "White",
        strokeThickness: 2,
        dataSeries: createLineData(wasmContext)
    }))

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
};
export default function StylingInCode() {
    React.useEffect(() => {
        drawExample();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
