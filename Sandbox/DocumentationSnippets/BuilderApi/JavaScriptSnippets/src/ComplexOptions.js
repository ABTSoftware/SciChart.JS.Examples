import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { EChart2DModifierType } from "scichart/types/ChartModifierType";
import { EPointMarkerType } from "scichart/types/PointMarkerType";
import { EBaseType } from "scichart/types/BaseType";
import { SelectionChangedArgs } from "scichart/Charting/Visuals/RenderableSeries/SelectionChangedArgs";
import { EFillPaletteMode, EStrokePaletteMode } from "scichart/Charting/Model/IPaletteProvider";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import { EPaletteProviderType } from "scichart/types/PaletteProviderType";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";

export async function drawWithComplexOptionsUsingBuilderApi(divElementId) {
    return chartBuilder.buildChart(divElementId, {
        series: {
            xyData: { xValues: [1, 3, 4, 7, 9], yValues: [10, 6, 7, 2, 16] },
            type: ESeriesType.ScatterSeries,
            options: {
                pointMarker: { type: EPointMarkerType.Ellipse, options: { stroke: "red" } }
            }
        }
    });
}

export async function drawChartWithRegisteredFunctionUsingBuilderApi(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        series: { type: ESeriesType.LineSeries, xyData: { xValues: [1, 3, 4, 7, 9], yValues: [10, 6, 7, 2, 16] } }
    });
    const logOnSelectionChanged = (args) => { console.log(args) };

    chartBuilder.registerFunction(EBaseType.OptionFunction, "logOnSelectionChanged", logOnSelectionChanged);
    const [chartModifier] = chartBuilder.buildModifiers({
        type: EChart2DModifierType.SeriesSelection,
        options: { onSelectionChanged: "logOnSelectionChanged" }
    });

    sciChartSurface.chartModifiers.add(chartModifier);
}

export async function drawChartWithCustomSubtypeUsingBuilderApi(divElementId) {
    class ExampleMountainPaletteProvider {
        constructor(options) {
            this.options = options;
            this.palettedStroke = parseColorToUIntArgb(options.stroke);
            this.palettedFill = parseColorToUIntArgb(options.fill);
            this.strokePaletteMode = EStrokePaletteMode.SOLID;
            this.fillPaletteMode = EFillPaletteMode.SOLID;
        }

        onAttached(parentSeries) { }

        onDetached() { }

        overrideFillArgb(xValue, yValue, index) {
            if (yValue > 0.5 && yValue < 0.75) {
                return this.palettedFill;
            } else {
                return undefined;
            }
        }

        overrideStrokeArgb(xValue, yValue, index) {
            if (yValue > 0.5 && yValue < 0.75) {
                return this.palettedStroke;
            } else {
                return undefined;
            }
        }

        // Add a toJSON method so this can be serialized.
        toJSON() {
            return {
                type: EPaletteProviderType.Custom,
                customType: "ExampleMountainPaletteProvider",
                options: this.options
            };
        }
    }

    // Register it for use by the builder api
    chartBuilder.registerType(
        EBaseType.PaletteProvider,
        "ExampleMountainPaletteProvider",
        (options) => new ExampleMountainPaletteProvider(options)
    );

    // Build the surface
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        series: {
            type: ESeriesType.MountainSeries,
            options: {
                paletteProvider: {
                    type: EPaletteProviderType.Custom,
                    customType: "ExampleMountainPaletteProvider",
                    options: { stroke: "lime", fill: "yellow" }
                },
            }
        }
    });

    // Create a dataSeries the normal way
    const dataSeries = new XyDataSeries(wasmContext);
    // Generate data
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        let y = Math.abs(Math.sin(i * STEP));
        if (y < 0.2) {
            y = NaN;
        }
        dataSeries.append(i, y);
    }

    sciChartSurface.renderableSeries.get(0).dataSeries = dataSeries;
};
