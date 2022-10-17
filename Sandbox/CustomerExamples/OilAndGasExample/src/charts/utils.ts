import { SciChartSurface } from "scichart";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { AxisCore } from "scichart/Charting/Visuals/Axis/AxisCore";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { TSciChart } from "scichart/types/TSciChart";
import { theme } from "../theme";

export function getRandomSinewave(
    wasmContext: TSciChart,
    pad: number,
    amplitude: number,
    phase: number,
    pointCount: number,
    freq: number
) {
    const dataSeries = new XyDataSeries(wasmContext);
    let min = pointCount;
    let max = 0;

    for (let i = 0; i < pad; i++) {
        const time = 10 * i / pointCount;
        dataSeries.append(time, 0);
    }

    for (let i = pad, j = 0; i < pointCount; i++, j++) {
        amplitude = Math.min(3, Math.max(0.1, amplitude * (1 + (Math.random() - 0.5) / 10)));
        freq = Math.min(50, Math.max(0.1, freq * (1 + (Math.random() - 0.5) / 50)));

        const time = 10 * i / pointCount;
        const wn = 2 * Math.PI / (pointCount / freq);

        const d = amplitude * Math.sin(j * wn + phase);
        if (d < min) {
            min = d;
        }
        if (d > max) {
            max = d;
        }
        dataSeries.append(time, d);
    }

    return { dataSeries, min, max };
}

export function generateModifiers(sciChartSurface: SciChartSurface, id: string, getLegendItemHTML?: (orientation: ELegendOrientation, showCheckboxes: boolean, showSeriesMarkers: boolean, item: TLegendItem) => string) {
    sciChartSurface.chartModifiers.add(new RolloverModifier({ modifierGroup: "first" }));
    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ modifierGroup: "first", excludedYAxisIds: [AxisCore.DEFAULT_AXIS_ID] }));
    // sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    const legendModifier = new LegendModifier({ showCheckboxes: true, placementDivId: `${id}-legend` });
    if (getLegendItemHTML) {
        legendModifier.sciChartLegend.getLegendItemHTML = getLegendItemHTML;
    }
    sciChartSurface.chartModifiers.add(legendModifier);
}

export function axesSetup(sciChartSurface: SciChartSurface, wasmContext: TSciChart, visibleRange: NumberRange, isXAxisVisible: boolean) {

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext);
    xAxis.axisAlignment = EAxisAlignment.Left;
    xAxis.visibleRange = visibleRange;
    xAxis.isVisible = isXAxisVisible;
    const yAxis = new NumericAxis(wasmContext);
    yAxis.axisAlignment = EAxisAlignment.Top;
    yAxis.flippedCoordinates = true;
    yAxis.visibleRange = new NumberRange(-3.0, 3.0);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
}

export function getColor(name: string): string {
    const colors: any = {
        red: theme.ChartsGridStroke1,
        green: theme.ChartsGridStroke2,
        blue: theme.ChartsGridStroke3,
    }
    return colors[name];
}

export function generateDefaultLegend(sciChartSurface: SciChartSurface, typeColor: string) {
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
        str += `
            <span style="display: block; padding-left: 42.5px">
                <span class="scichart__legend-item scichart__legend-item-simple" style="padding-top: 15px">
                    <label for="${id}" style="color: ${color};">${name}</label>
                    <span class="scichart__legend-line" style="border-top: 2px solid ${color}"></span>
                    <span class="scichart__legend-item-justify" style="color: ${color}">
                        <span>${Math.random().toFixed(2)}</span>
                        <span>${Math.random().toFixed(2)}</span>
                        <span>${Math.random().toFixed(2)}</span>
                    </span>
                </span>
                <span class="scichart__legend-item" style="background-color: ${typeColor}; padding-top: 10px;">
                    <label for="${id}" style="color: ${color}; ${bg}; padding: 4px 10px; display: inline-block;">${name}</label>
                </span>
                <span class="scichart__legend-item-justify" style="color: ${color}">
                    <span>${Math.random().toFixed(2)}</span>
                    <span>${Math.random().toFixed(2)}</span>
                    <span>${Math.random().toFixed(2)}</span>
                </span>
                <span class="scichart__legend-item scichart__legend-item-simple">
                    <label for="${id}" style="color: ${color};">${name}</label>
                    <span class="scichart__legend-line" style="border-top: 2px dashed ${color}"></span>
                    <span class="scichart__legend-item-justify" style="color: ${color}">
                        <span>${Math.random().toFixed(2)}</span>
                        <span>${Math.random().toFixed(2)}</span>
                        <span>${Math.random().toFixed(2)}</span>
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

export function getDataDiagonal(xValues: number[], yValues: number[], pointsByStep: number): { xValues: number[], yValues: number[] } {
    const updatedXValues = [];
    const updatedYValues = [];
    for (let i = 0; i < xValues.length - 1; i++) {
        const stepX = ((xValues[i + 1]) - xValues[i]) / pointsByStep;
        for (let j = 0; j <= pointsByStep; j++) {
            const stepY = ((yValues[i + 1]) - yValues[i]) / pointsByStep;
            updatedXValues.push(j * stepX + xValues[i]);
            updatedYValues.push((j * stepY + yValues[i]) * (Math.random() * 0.1));
        }
    }
    return {
        xValues: updatedXValues,
        yValues: updatedYValues
    };
}
