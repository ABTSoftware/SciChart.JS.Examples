import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { EChart2DModifierType } from "scichart/types/ChartModifierType";
import { EPointMarkerType } from "scichart/types/PointMarkerType";
import { EBaseType } from "scichart/types/BaseType";
import { SelectionChangedArgs } from "scichart/Charting/Visuals/RenderableSeries/SelectionChangedArgs";
import { EFillPaletteMode, EStrokePaletteMode, IFillPaletteProvider, IStrokePaletteProvider } from "scichart/Charting/Model/IPaletteProvider";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { EPaletteProviderType } from "scichart/types/PaletteProviderType";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { TPaletteProviderDefinition } from "scichart/Builder/buildSeries";

export async function drawWithComplexOptionsUsingBuilderApi(divElementId: string) {
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

export async function drawChartWithRegisteredFunctionUsingBuilderApi(divElementId: string) {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        series: { type: ESeriesType.LineSeries, xyData: { xValues: [1, 3, 4, 7, 9], yValues: [10, 6, 7, 2, 16] } }
    });
    const logOnSelectionChanged = (args: SelectionChangedArgs) => { console.log(args) };

    chartBuilder.registerFunction(EBaseType.OptionFunction, "logOnSelectionChanged", logOnSelectionChanged);
    const [chartModifier] = chartBuilder.buildModifiers({
        type: EChart2DModifierType.SeriesSelection,
        options: { onSelectionChanged: "logOnSelectionChanged" }
    });

    sciChartSurface.chartModifiers.add(chartModifier);
}

export async function drawChartWithCustomSubtypeUsingBuilderApi(divElementId: string) {
    class ExampleMountainPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
        public static Name: "ExampleMountainPaletteProvider";
        public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
        public readonly fillPaletteMode = EFillPaletteMode.SOLID;
        private readonly palettedStroke: number;
        private readonly palettedFill: number;
        private readonly options: { stroke: string; fill: string };

        constructor(options: { stroke: string; fill: string }) {
            this.options = options;
            this.palettedStroke = parseColorToUIntArgb(options.stroke);
            this.palettedFill = parseColorToUIntArgb(options.fill);
        }

        public onAttached(parentSeries: IRenderableSeries): void { }

        public onDetached(): void { }

        public overrideFillArgb(xValue: number, yValue: number, index: number): number {
            if (yValue > 0.5 && yValue < 0.75) {
                return this.palettedFill;
            } else {
                return undefined;
            }
        }

        public overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
            if (yValue > 0.5 && yValue < 0.75) {
                return this.palettedStroke;
            } else {
                return undefined;
            }
        }

        // Add a toJSON method so this can be serialized.
        public toJSON(): TPaletteProviderDefinition {
            return {
                type: EPaletteProviderType.Custom,
                customType: ExampleMountainPaletteProvider.Name,
                options: this.options
            };
        }
    }

    // Register it for use by the builder api
    chartBuilder.registerType(
        EBaseType.PaletteProvider,
        ExampleMountainPaletteProvider.Name,
        (options: { stroke: string; fill: string }) => new ExampleMountainPaletteProvider(options)
    );

    // Build the surface
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        series: {
            type: ESeriesType.MountainSeries,
            options: {
                paletteProvider: {
                    type: EPaletteProviderType.Custom,
                    customType: ExampleMountainPaletteProvider.Name,
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
