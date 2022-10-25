import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { getColor, getDataDiagonal } from "../utils";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import {appTheme} from "../../theme";

export default async function init2dNinthChart(id: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(id, { theme: appTheme.SciChartJsTheme });
    // Create an xAxis, yAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(-0.5, 5.5), isVisible: false }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(-0.5, 5.5), isVisible: false }));

    const xValues = [0, 0.72, 1.18, 1.8, 2.55, 2.92, 3.2, 4, 4.5];
    const yValues = [0, 7.35, 1.44, 2.02, 1.6, 2.1, 0.5, 0.1, 0];
    const dataR = getDataDiagonal(xValues, yValues, 100);
    const dataG = getDataDiagonal(xValues, yValues.map(el => el += 1), 100);
    const dataB = getDataDiagonal(xValues, yValues.map(el => el += 2), 100);

    // Create the three Stacked Mountain series
    const rendSeriesR = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: dataR.xValues, yValues: dataR.yValues, dataSeriesName: "Red" }),
        fill: getColor('red'),
        stroke: getColor('red'),
        strokeThickness: 0,
    });
    const rendSeriesG = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: dataG.xValues, yValues: dataG.yValues, dataSeriesName: "Green" }),
        fill: getColor('green'),
        stroke: getColor('green'),
        strokeThickness: 0,
    });
    const rendSeriesB = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: dataB.xValues, yValues: dataB.yValues, dataSeriesName: "Blue" }),
        fill: getColor('blue'),
        stroke: getColor('blue'),
        strokeThickness: 0,
    });


    // Add the StackedMountainCollection to the chart
    sciChartSurface.renderableSeries.add(rendSeriesB, rendSeriesG, rendSeriesR);

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
}
