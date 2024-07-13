"use strict";

const scichart_1 = SciChart;
async function lineChartWithyGradient(divElementId) {
    const { sciChartSurface, wasmContext } = await scichart_1.SciChartSurface.create(divElementId);
    // Create XAxis
    sciChartSurface.xAxes.add(new scichart_1.NumericAxis(wasmContext));
    // Create YAxis
    sciChartSurface.yAxes.add(new scichart_1.NumericAxis(wasmContext));
    const xValues = (0, scichart_1.makeIncArray)(250);
    const yValues = (0, scichart_1.makeIncArray)(250, 1, (y) => Math.sin(y * 0.05) + Math.sin(y * 0.01));
    // #region ExampleA
    const yGradientPalette = scichart_1.PaletteFactory.createYGradient(wasmContext, new scichart_1.GradientParams(new scichart_1.Point(0, 0), new scichart_1.Point(0, 1), [
        { offset: 0, color: "blue" },
        { offset: 0.5, color: "green" },
        { offset: 1, color: "red" },
    ]), new scichart_1.NumberRange(-0.5, 2) // the range of y-values to apply the gradient to
    );
    // #endregion
    sciChartSurface.renderableSeries.add(new scichart_1.FastLineRenderableSeries(wasmContext, {
        strokeThickness: 5,
        dataSeries: new scichart_1.XyDataSeries(wasmContext, { xValues, yValues }),
        paletteProvider: yGradientPalette,
    }));
    sciChartSurface.zoomExtents();
}
lineChartWithyGradient("scichart-root");
