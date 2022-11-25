import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SciChartVerticalGroup } from "scichart/Charting/LayoutManager/SciChartVerticalGroup";
import { axesSetup, generateModifiers, getRandomSinewave } from "./utils";
import { NumberRange } from "scichart/Core/NumberRange";
import { ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";

export default async function initVshChart(id: string, group: SciChartVerticalGroup, pointsCount: number, visibleRange: NumberRange) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(id);

    axesSetup(sciChartSurface, wasmContext, visibleRange, false);

    // Create some data and set on a line series
    let color = Math.round((Math.random() * 250));
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: `rgba(${255 - color},${color},${(color + 125) % 255},0.7)`
    });
    lineSeries.dataSeries = getRandomSinewave(wasmContext, 0, Math.random() * 3, Math.random() * 50, pointsCount, 1).dataSeries;
    lineSeries.dataSeries.dataSeriesName = 'VSH';
    sciChartSurface.renderableSeries.add(lineSeries);
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
        const { id, color, name } = item;
        const bg = `background: radial-gradient(circle, rgb(60, 60, 63) 0%, rgb(28, 28, 30) 100%);`;
        let str: string = ``;
        const crossmark = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="10" height="10" viewBox="0 0 256 256" xml:space="preserve">
            <g transform="translate(128 128) scale(0.72 0.72)">
                <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)">
                <path d="M 3 90 c -0.768 0 -1.536 -0.293 -2.121 -0.879 c -1.172 -1.171 -1.172 -3.071 0 -4.242 l 84 -84 c 1.172 -1.172 3.07 -1.172 4.242 0 c 1.172 1.171 1.172 3.071 0 4.242 l -84 84 C 4.536 89.707 3.768 90 3 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255, 255, 255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                <path d="M 87 90 c -0.768 0 -1.535 -0.293 -2.121 -0.879 l -84 -84 c -1.172 -1.171 -1.172 -3.071 0 -4.242 c 1.171 -1.172 3.071 -1.172 4.242 0 l 84 84 c 1.172 1.171 1.172 3.071 0 4.242 C 88.535 89.707 87.768 90 87 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255, 255, 255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
            </g>
            </g>
        </svg>
        `;
        str += `
            <span style="display: block; padding-left: 42.5px; padding-top: 67px;">
                <span class="scichart__legend-item scichart__legend-item-simple" style="position: relative;">
                    <label for="${id}" style="color: #fff;">${name}_D</label>
                    <span style="position: absolute;left: 30%;top: calc(50% - 5px);">${crossmark}</span>
                    <span style="position: absolute;right: 30%;top: calc(50% - 5px);">${crossmark}</span>
                    <span class="scichart__legend-line" style="border-top: 2px solid #fff"></span>
                    <span class="scichart__legend-item-justify" style="color: #fff">
                        <span>0</span>
                        <span>0</span>
                        <span>100</span>
                    </span>
                </span>
                <span class="scichart__legend-item scichart__legend-item-simple">
                    <label for="${id}" style="color: ${color};">WRE_${name}_1</label>
                    <span class="scichart__legend-line" style="border-top: 2px solid ${color}"></span>
                    <span class="scichart__legend-item-justify" style="color: ${color}">
                        <span>0</span>
                        <span>${Math.random().toFixed(2)}</span>
                        <span>1</span>
                    </span>
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