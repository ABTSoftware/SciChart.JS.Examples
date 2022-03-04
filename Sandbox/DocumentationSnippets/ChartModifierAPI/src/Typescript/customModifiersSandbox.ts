import {SciChartSurface} from 'scichart/Charting/Visuals/SciChartSurface';
import {NumericAxis} from 'scichart/Charting/Visuals/Axis/NumericAxis';
import {DetectClicksOnChartPartsModifier} from "./DetectClicksOnChartPartsModifier";
import {EAxisAlignment} from "scichart/types/AxisAlignment";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";

export async function customModifiersSandboxTs(divId: string) {
    console.log('customModifier typescript example');

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { id: "XAxis_0", axisTitle: "XAxis 0", axisAlignment: EAxisAlignment.Top}));
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { id: "XAxis_1", axisTitle: "XAxis 1", axisAlignment: EAxisAlignment.Bottom}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { id: "YAxis_0", axisTitle: "YAxis 0", axisAlignment: EAxisAlignment.Left}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { id: "YAxis_1", axisTitle: "YAxis 1", axisAlignment: EAxisAlignment.Right}));

    sciChartSurface.chartModifiers.add(new DetectClicksOnChartPartsModifier());

    const xValues = Array.from(Array(25).keys())
    const yValues = xValues.map(x => Math.sin(x * 0.1));
    console.log(yValues);
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        strokeThickness: 3,
        stroke: "Yellow",
        yAxisId: "YAxis_0",
        xAxisId: "XAxis_0",
        onHoveredChanged: sourceSeries => sourceSeries.strokeThickness = sourceSeries.isHovered ? 7 : 3,
    }));
}
