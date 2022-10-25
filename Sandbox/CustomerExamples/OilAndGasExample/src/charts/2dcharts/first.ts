import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { StackedMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries";
import { StackedMountainCollection } from "scichart/Charting/Visuals/RenderableSeries/StackedMountainCollection";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { WaveAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import { getColor, getDataDiagonal } from "../utils";
import {appTheme} from "../../theme";


export default async function init2dFirstChart(id: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(id, { theme: appTheme.SciChartJsTheme });
    // Create an xAxis, yAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(-0.5, 5.5), isVisible: false }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(-0.5, 5.5), isVisible: false }));

    const xValues = [0, 0.72, 1.18, 1.8, 2.55, 2.92, 3.2, 4, 4.5];
    const yValues = [0, 1.3, 0.44, 5.92, 0.4, 0.3, 0.2, 0.1, 0];
    const dataR = getDataDiagonal(xValues, yValues, 50);
    const dataG = getDataDiagonal(xValues, yValues.map(el => el += 0.005), 50);
    const dataB = getDataDiagonal(xValues, yValues.map(el => el += 0.01), 50);

    // Create the three Stacked Mountain series
    const rendSeries1 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: dataR.xValues, yValues: dataR.yValues, dataSeriesName: "Red" }),
        fill: getColor('red'),
        stroke: getColor('red'),
        strokeThickness: 0,
    });
    const rendSeries2 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: dataG.xValues, yValues: dataG.yValues, dataSeriesName: "Green" }),
        fill: getColor('green'),
        stroke: getColor('green'),
        strokeThickness: 0,
    });
    const rendSeries3 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: dataB.xValues, yValues: dataB.yValues, dataSeriesName: "Blue" }),
        fill: getColor('blue'),
        stroke: getColor('blue'),
        strokeThickness: 0,
    });

    // Group these StackedMountain series together in a StackedMountainCollection
    const stackedMountainCollection = new StackedMountainCollection(wasmContext);
    stackedMountainCollection.add(rendSeries1, rendSeries2, rendSeries3);
    stackedMountainCollection.animation = new WaveAnimation({ duration: 600, fadeEffect: true });

    // Add the StackedMountainCollection to the chart
    sciChartSurface.renderableSeries.add(stackedMountainCollection);

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
}
