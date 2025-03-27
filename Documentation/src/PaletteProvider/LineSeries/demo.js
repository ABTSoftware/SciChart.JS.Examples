"use strict";

const scichart_1 = SciChart;
// Custom PaletteProvider for line series
class LinePaletteProvider {
    constructor(stroke, rule) {
        this.strokePaletteMode = scichart_1.EStrokePaletteMode.SOLID;
        this.rule = rule;
        this.stroke = (0, scichart_1.parseColorToUIntArgb)(stroke);
    }
    onAttached(parentSeries) {}
    onDetached() {}
    // This function is called for every data-point.
    // Return undefined to use the default color for the line,
    // else, return a custom colour as an ARGB color code, e.g. 0xFFFF0000 is red
    overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
        return this.rule(yValue) ? this.stroke : undefined;
    }
}
async function lineChartWithPaletteProvider(divElementId) {
    const { sciChartSurface, wasmContext } = await scichart_1.SciChartSurface.create(divElementId);
    // Create XAxis
    sciChartSurface.xAxes.add(new scichart_1.NumericAxis(wasmContext));
    // Create YAxis
    sciChartSurface.yAxes.add(new scichart_1.NumericAxis(wasmContext));
    const xValues = (0, scichart_1.makeIncArray)(250);
    const yValues = (0, scichart_1.makeIncArray)(250, 1, (y) => Math.sin(y * 0.05));
    // Create a line series with your custom PaletteProvider
    sciChartSurface.renderableSeries.add(
        new scichart_1.FastLineRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            strokeThickness: 5,
            dataSeries: new scichart_1.XyDataSeries(wasmContext, { xValues, yValues }),
            // The LinePaletteProvider (declared above) implements per-point coloring for line series
            paletteProvider: new LinePaletteProvider("#55FF55", (yValue) => yValue > 0.5),
        })
    );
    sciChartSurface.zoomExtents();
}
lineChartWithPaletteProvider("scichart-root");
