import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SciChartVerticalGroup } from "scichart/Charting/LayoutManager/SciChartVerticalGroup";
import { axesSetup, generateModifiers, getRandomSinewave } from "./utils";
import { NumberRange } from "scichart/Core/NumberRange";
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
    lineDataSeries.dataSeries.dataSeriesName = 'GR';
    lineSeries.dataSeries = lineDataSeries.dataSeries;
    const dashedSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: `rgba(${255 - color2},${color2},${(color2 + 125) % 255},0.7)`,
        strokeThickness: 2,
        strokeDashArray: [10, 3],
    });
    const dashedDataSeries = new XyDataSeries(wasmContext, { dataSeriesName: 'CALI' });
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
        // console.log(sciChartSurface.renderableSeries.getById(item.id).getDataSeriesName());

        const { id, color, name } = item;
        const bg = `background: radial-gradient(circle, rgb(60, 60, 63) 0%, rgb(28, 28, 30) 100%);`;
        let str: string = ``;
        let lineType: string = 'dashed';
        if (name === 'GR') {
            lineType = 'solid';
            const secondaryColor = sciChartSurface.renderableSeries.asArray()[1].stroke;
            str += `
            <span class="scichart__legend-item-justify" style="color: ${color}">
                <span>${Math.random().toFixed(2)}</span>
                <span>${Math.random().toFixed(2)}</span>
                <span>${Math.random().toFixed(2)}</span>
            </span>
            <span class="scichart__legend-item" style="background-color: rgba(253,161,7,255); padding-top: 10px;">
                <label for="${id}" style="color: ${secondaryColor}; ${bg}; padding: 4px 10px; display: inline-block;">${name}</label>
            </span>
            <span class="scichart__legend-item-justify" style="color: ${secondaryColor}">
                <span>${Math.random().toFixed(2)}</span>
                <span>${Math.random().toFixed(2)}</span>
                <span>${Math.random().toFixed(2)}</span>
            </span>
            `;
        }
        str += `
        <span class="scichart__legend-item scichart__legend-item-simple">
            <label for="${id}" style="color: ${color};">${name}</label>
            <span class="scichart__legend-line" style="border-top: 2px ${lineType} ${color}"></span>
            <span class="scichart__legend-item-justify" style="color: ${color}">
                <span>${Math.random().toFixed(2)}</span>
                <span>${Math.random().toFixed(2)}</span>
                <span>${Math.random().toFixed(2)}</span>
            </span>
        </span>
        `;
        // if (showCheckboxes) {
        //     const checked = item.checked ? "checked" : "";
        //     str += `<input ${checked} type="checkbox" id="${item.id}">`;
        // }
        return str;
    };
}
