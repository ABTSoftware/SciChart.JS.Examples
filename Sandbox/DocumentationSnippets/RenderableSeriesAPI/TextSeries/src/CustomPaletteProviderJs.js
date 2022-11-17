import {DefaultPaletteProvider, EStrokePaletteMode} from "scichart/Charting/Model/IPaletteProvider";
import {parseColorToUIntArgb} from "scichart/utils/parseColor";
import {chartBuilder} from "scichart/Builder/chartBuilder";
import {EBaseType} from "scichart/types/BaseType";

// Custom PaletteProvider for line series
export class ThresholdLinePaletteProvider extends DefaultPaletteProvider {
    constructor(stroke, rule) {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.rule = rule;
        this.stroke = parseColorToUIntArgb(stroke);
    }

    // This function is called for every data-point.
    // Return undefined to use the default color for the line,
    // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
    overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
        return this.rule(yValue) ? this.stroke : undefined;
    }
}

// Register the custom ThresholdLinePaletteProvider with the chartBuilder
chartBuilder.registerType(EBaseType.PaletteProvider, "ThresholdLinePaletteProvider",
    (options) => new ThresholdLinePaletteProvider(options.stroke, options.rule));
