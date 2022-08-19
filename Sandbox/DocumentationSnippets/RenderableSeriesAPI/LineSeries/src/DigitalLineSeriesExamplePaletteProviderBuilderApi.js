import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { ThresholdLinePaletteProvider } from "./CustomPaletteProviderJs";
import { EPaletteProviderType } from "scichart/types/PaletteProviderType";
import { EBaseType } from "scichart/types/BaseType";

// Register the custom ThresholdLinePaletteProvider with the chartBuilder
// chartBuilder.registerType(EBaseType.PaletteProvider, "ThresholdLinePaletteProvider",
//     (options) => new ThresholdLinePaletteProvider(options.stroke, options.rule));

export const drawDigitalLineSeriesPaletteProviderBuilderApi = async (divElementId) => {

    const xValues = [];
    const yValues = [];
    for(let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * 0.1));
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        series: [
            {
                type: ESeriesType.LineSeries,
                xyData: {
                    xValues,
                    yValues
                },
                options: {
                    stroke: "White",
                    strokeThickness: 5,
                    isDigitalLine: true,
                    // Now you can instantiate using parameters below
                    paletteProvider: {
                        type: EPaletteProviderType.Custom,
                        customType: "ThresholdLinePaletteProvider",
                        options: {
                            stroke: "Red",
                            rule: (yValue) => yValue >= 0.0,
                        }
                    }
                    // Note: Assigning an instance is also valid, e.g.
                    // paletteProvider: new ThresholdLinePaletteProvider("Green", yValue => yValue >= 4.0)
                }
            }
        ]
    });
};
