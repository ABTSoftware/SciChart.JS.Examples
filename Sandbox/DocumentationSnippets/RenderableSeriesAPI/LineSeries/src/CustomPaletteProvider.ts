import {EStrokePaletteMode, IStrokePaletteProvider} from "scichart/Charting/Model/IPaletteProvider";
import {IRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import {parseColorToUIntArgb} from "scichart/utils/parseColor";

// An example PaletteProvider which implements IStrokePaletteProvider.
// This can be attached to line, mountain, column or candlestick series to change the stroke of the series conditionally
export class ThresholdLinePaletteProvider implements IStrokePaletteProvider {

    // This property chooses how colors are blended when they change
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.GRADIENT;
    private readonly rule: any;
    private readonly stroke: number;

    public constructor(stroke: string, rule: (yValue: number) => number) {
        this.rule = rule;
        this.stroke = parseColorToUIntArgb(stroke);
    }

    onAttached(parentSeries: IRenderableSeries): void { }
    onDetached(): void { }

    // This function is called for every data-point.
    // Return undefined to use the default color for the line,
    // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
    overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        // Conditional logic for coloring here. Returning 'undefined' means 'use default renderableSeries.stroke'
        // else, we can return a color of choice.
        return this.rule(yValue) ? this.stroke : undefined;
    }
}
