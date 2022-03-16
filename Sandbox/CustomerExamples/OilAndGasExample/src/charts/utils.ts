import { SciChartSurface } from "scichart";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { AxisCore } from "scichart/Charting/Visuals/Axis/AxisCore";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { TSciChart } from "scichart/types/TSciChart";

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