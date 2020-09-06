import * as React from "react";
import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {TSciChart} from "scichart/types/TSciChart";
import {EStrokePaletteMode, IStrokePaletteProvider} from "scichart/Charting/Model/IPaletteProvider";
import {IRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import {parseColorToUIntArgb} from "scichart/utils/parseColor";
import {NumberRange} from "scichart/Core/NumberRange";

const divElementId = "chart";

const createLineData = (wasmContext: TSciChart) => {
    const xyDataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 100; i++) {
        xyDataSeries.append(i, Math.sin(i* 0.1))
    }
    return xyDataSeries;
}

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create XAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "X Axis",
        growBy: new NumberRange(0.1, 0.1),
    }));

    // Create YAxis
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "Right Y Axis",
        growBy: new NumberRange(0.1, 0.1),
    }));

    // Create a line series with a PaletteProvider. See implementation of LinePaletteProvider below
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: "White",
        strokeThickness: 2,
        dataSeries: createLineData(wasmContext),
        paletteProvider: new LinePaletteProvider()
    }));

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
};

export default function StylingInCode() {
    React.useEffect(() => {
        drawExample();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}

/**
 * An example PaletteProvider which implements IStrokePaletteProvider.
 * This can be attached to line, mountain, column or candlestick series to change the stroke of the series conditionally
 */
class LinePaletteProvider implements IStrokePaletteProvider {
    /**
     * This property chooses how colors are blended when they change
     */
    readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.GRADIENT;

    onAttached(parentSeries: IRenderableSeries): void {
        // Called when the PaletteProvider is attached to a renderableseries
    }

    onDetached(): void {
        // Called when the PaletteProvider is detached from a renderableseries
    }

    /**
     * Called by SciChart and may be used to override the color of a line segment or
     * stroke outline in various chart types.
     * @remarks WARNING: CALLED PER-VERTEX, MAY RESULT IN PERFORMANCE DEGREDATION IF COMPLEX CODE EXECUTED HERE
     * @param renderSeries
     * @param xValue the current XValue
     * @param yValue the current YValue
     * @param index the current index to the data
     * @returns an ARGB color code, e.g. 0xFFFF0000 would be red, or 'undefined' for default colouring
     */
    overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        // Conditional logic for coloring here. Returning 'undefined' means 'use default renderableSeries.stroke'
        // else, we can return a color of choice.
        //
        // Note that colors returned are Argb format as number. There are helper functions which can convert from Html
        // color codes to Argb format.
        //
        // Performance considerations: overrideStrokeArgb is called per-point on the series when drawing.
        // Caching color values and doing minimal logic in this function will help performance
        return yValue > 0 ? parseColorToUIntArgb("Red") : undefined;
    }
}
