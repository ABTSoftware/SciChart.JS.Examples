import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SciChartVerticalGroup } from "scichart/Charting/LayoutManager/SciChartVerticalGroup";
import { axesSetup, generateDefaultLegend, generateModifiers, getRandomSinewave } from "./chartUtils";
import { NumberRange } from "scichart/Core/NumberRange";

export default async function initLldChart(
    id: string | HTMLDivElement,
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
        1
    ).dataSeries;
    lineSeries.dataSeries.dataSeriesName = "LLD";
    sciChartSurface.renderableSeries.add(lineSeries);
    const getLegendItemHtml = generateDefaultLegend(sciChartSurface, "rgba(5,254,252,255)");
    generateModifiers(sciChartSurface, id, getLegendItemHtml);
    group.addSurfaceToGroup(sciChartSurface);

    return { sciChartSurface };
}
