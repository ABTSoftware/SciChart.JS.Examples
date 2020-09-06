import * as React from "react";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAutoRange } from "scichart/types/AutoRange";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { SciChartSurface } from "scichart";
import {
    EStrokePaletteMode,
    IFillPaletteProvider,
    IStrokePaletteProvider,
} from "scichart/Charting/Model/IPaletteProvider";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import {ExampleDataProvider} from "../../../ExampleDataProvider";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Add an X, Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always }));

    // Generate some x,y values (these are type number[] and we use ExampleDataProvider for convenience)
    const {xValues, yValues} = ExampleDataProvider.getDampedSinewave(0, 10, 5, 0.05, 100, 10);

    // Append them to a dataSeries
    const dataSeries = new XyDataSeries(wasmContext);
    dataSeries.appendRange(xValues, yValues);

    // Create an add a column series
    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        fill: "rgba(176, 196, 222, 0.7)",
        stroke: "rgba(176, 196, 222, 0.7)",
        strokeThickness: 2,
        dataPointWidth: 0.5,
        dataSeries
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
};

class MyPaletteProvider implements IFillPaletteProvider, IStrokePaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;

    public onAttached(parentSeries: IRenderableSeries): void {
        // Nothing to do
    }

    public onDetached(): void {
        // Nothing to do
    }

    public overrideFillArgb(xValue: number, yValue: number, index: number): number {
        const color = this.getColor(yValue);
        return parseColorToUIntArgb(color);
    }

    public overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        const color = this.getColor(yValue);
        return parseColorToUIntArgb(color);
    }

    private getColor(value: number) {
        if (value >= 0.95) return "#B22222";
        if (value >= 0.8) return "#FFBF00";
        return "#228B22";
    }
}

export default function ColumnChart() {
    React.useEffect(() => {
        drawExample();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
