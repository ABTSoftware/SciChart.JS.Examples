import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { ThresholdLinePaletteProvider } from "./CustomPaletteProviderJs";
import { EPaletteProviderType } from "scichart/types/PaletteProviderType";
import { EBaseType } from "scichart/types/BaseType";

// Register the custom ThresholdLinePaletteProvider with the chartBuilder
chartBuilder.registerType(EBaseType.PaletteProvider, "ThresholdLinePaletteProvider",
    (options) => new ThresholdLinePaletteProvider(options.stroke, options.rule));

export const drawLineSeriesPaletteProviderBuilderApi = async (divElementId) => {
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        series: [
            {
                type: ESeriesType.LineSeries,
                xyData: {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    yValues: [2.5, 3.5, 3.7, 3.99, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0]
                },
                options: {
                    stroke: "#FF6600",
                    strokeThickness: 5,
                    // Now you can instantiate using parameters below
                    paletteProvider: {
                        type: EPaletteProviderType.Custom,
                        customType: "ThresholdLinePaletteProvider",
                        options: {
                            stroke: "Green",
                            rule: (yValue) => yValue >= 4.0,
                        }
                    }
                    // Note: Assigning an instance is also valid, e.g.
                    // paletteProvider: new ThresholdLinePaletteProvider("Green", yValue => yValue >= 4.0)
                }
            }
        ]
    });
};
