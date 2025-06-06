import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { SciChartVerticalGroup } from "scichart/Charting/LayoutManager/SciChartVerticalGroup";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { axesSetup, generateDefaultLegend, generateModifiers, getRandomSinewave } from "./chartUtils";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { NumberRange } from "scichart/Core/NumberRange";

export default async function initRhdbChart(
    id: string,
    group: SciChartVerticalGroup,
    pointsCount: number,
    visibleRange: NumberRange
) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(id);

    axesSetup(sciChartSurface, wasmContext, visibleRange, false);

    // Create some data and set on a line series
    let color = Math.round(Math.random() * 250);
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: `rgba(${255 - color},${color},${(color + 125) % 255},0.7)`,
    });
    lineSeries.dataSeries = getRandomSinewave(
        wasmContext,
        0,
        Math.random() * 3,
        Math.random() * 50,
        pointsCount,
        10
    ).dataSeries;
    lineSeries.dataSeries.dataSeriesName = "RHDB";
    sciChartSurface.renderableSeries.add(lineSeries);
    const getLegendItemHtml = generateDefaultLegend(sciChartSurface, "rgba(254,162,9,255)");
    generateModifiers(sciChartSurface, id, getLegendItemHtml);
    group.addSurfaceToGroup(sciChartSurface);
}
