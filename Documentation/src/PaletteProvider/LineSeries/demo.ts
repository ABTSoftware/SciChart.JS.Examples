import {
    IStrokePaletteProvider,
    IPointMetadata,
    IRenderableSeries,
    EStrokePaletteMode,
    parseColorToUIntArgb,
    SciChartSurface,
    FastLineRenderableSeries,
    NumericAxis,
    XyDataSeries,
    makeIncArray
} from "scichart";

// Custom PaletteProvider for line series
class LinePaletteProvider implements IStrokePaletteProvider {
    readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    private stroke: number;
    private rule: (yValue: number) => boolean;
    constructor(stroke: string, rule: (yValue: number) => boolean) {
        this.rule = rule;
        this.stroke = parseColorToUIntArgb(stroke);
    }
    onAttached(parentSeries: IRenderableSeries): void {}
    onDetached(): void {}

    // This function is called for every data-point.
    // Return undefined to use the default color for the line,
    // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
    overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        return this.rule(yValue) ? this.stroke : undefined;
    }
}

async function lineChartWithPaletteProvider(divElementId: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    // Create XAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    // Create YAxis
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = makeIncArray(250);
    const yValues = makeIncArray(250, 1, y => Math.sin(y * 0.05));
    // Create a line series with your custom PaletteProvider
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            // The LinePaletteProvider (declared above) implements per-point coloring for line series
            paletteProvider: new LinePaletteProvider("#55FF55", yValue => yValue > 0.5)
        })
    );
    sciChartSurface.zoomExtents();
}

lineChartWithPaletteProvider("scichart-root");
