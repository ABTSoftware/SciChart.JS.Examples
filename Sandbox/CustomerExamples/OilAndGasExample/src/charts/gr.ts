import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SciChartVerticalGroup } from "scichart/Charting/LayoutManager/SciChartVerticalGroup";
import { axesSetup, generateModifiers, getRandomSinewave } from "./utils";
import { NumberRange } from "scichart/Core/NumberRange";
import { XyLinearTrendFilter } from "scichart/Charting/Model/Filters/XyLinearTrendFilter";
import { XyRatioFilter } from "scichart/Charting/Model/Filters/XyRatioFilter";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";

export default async function initGrChart(id: string, group: SciChartVerticalGroup, pointsCount: number, visibleRange: NumberRange) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(id);

    axesSetup(sciChartSurface, wasmContext, visibleRange, true);

    // Create some data and set on a line series
    let color1 = Math.round((Math.random() * 250));
    let color2 = Math.round((Math.random() * 250));
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: `rgba(${255 - color1},${color1},${(color1 + 125) % 255},0.7)`
    });
    const lineDataSeries = getRandomSinewave(wasmContext, 0, Math.random() * 3, Math.random() * 50, pointsCount, 1);
    lineSeries.dataSeries = lineDataSeries.dataSeries;
    const dashedSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: `rgba(${255 - color2},${color2},${(color2 + 125) % 255},0.7)`,
        strokeThickness: 2,
        strokeDashArray: [10, 3]
    });
    const dashedDataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < pointsCount; i += pointsCount / 10) {
        dashedDataSeries.append(i, (Math.random() * (lineDataSeries.min + 1 - lineDataSeries.min) + lineDataSeries.min));
    }
    dashedSeries.dataSeries = dashedDataSeries;

    sciChartSurface.renderableSeries.add(lineSeries);
    sciChartSurface.renderableSeries.add(dashedSeries);
    const getLegendItemHtml = generateLegend(sciChartSurface);
    generateModifiers(sciChartSurface, id, getLegendItemHtml);

    group.addSurfaceToGroup(sciChartSurface);
}


function generateLegend(sciChartSurface: SciChartSurface) {
    return (
        orientation: ELegendOrientation,
        showCheckboxes: boolean,
        showSeriesMarkers: boolean,
        item: TLegendItem
    ): string => {
        sciChartSurface.renderableSeries.getById(item.id);
        let str = `<span class="scichart__legend-item">`;
        if (showCheckboxes) {
            const checked = item.checked ? "checked" : "";
            str += `<input ${checked} type="checkbox" id="${item.id}">`;
        }
        str += `<label for="${item.id}" style="background-color: ${item.color}; margin: 4px; width: 40px !important; height: 2px;"></label>`;
        str += `<label for="${item.id}" style="margin-left: 4px;">${item.name}</label>`;
        str += `</span>`;
        return str;
    };
}