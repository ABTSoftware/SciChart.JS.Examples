import * as SciChart from "scichart";
import { NumberRange } from "scichart";
async function basicTriangleSeriesChart(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        TriangleRenderableSeries,
        XyDataSeries,
        ETriangleSeriesDrawMode
    } = SciChart;
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));
    // const sXValues = [200, 400, 400, 200, 200, 400, 450, 450, 650, 650, 650, 450];
    // const sYValues = [200, 200, 400, 250, 450, 450, 400, 200, 200, 250, 450, 450];
    const sXValues = [200, 200, 300, 320, 420, 420, 220, 400, 310, 220, 400, 310];
    const sYValues = [200, 400, 300, 300, 400, 200, 400, 400, 310, 200, 200, 290];
    const colors = {
        0: "#f39c12",
        1: "#27ae60",
        2: "#2980b9",
        3: "#8e44ad"
    };
    class TrianglePaletteProvider {
        fillPaletteMode = SciChart.EFillPaletteMode.SOLID;
        onAttached() {}
        onDetached() {}
        overrideFillArgb(_xValue, _yValue, index, _opacity) {
            // return SciChart.parseColorToUIntArgb(Math.floor(index / 3) % 2 === 0 ? "cornflowerblue" : "lightgray");
            console.log(Math.floor(index / 3));
            return SciChart.parseColorToUIntArgb(colors[Math.floor(index / 3)]);
        }
    }
    const polygonSeries = new TriangleRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: sXValues,
            yValues: sYValues
        }),
        isDigitalLine: false,
        // fill: "steelblue",
        // opacity: 0.2,
        // stroke: "#ffffff",
        // strokeThickness: 4,
        drawMode: ETriangleSeriesDrawMode.List, // Polygon / List / Strip
        paletteProvider: new TrianglePaletteProvider()
    });
    sciChartSurface.renderableSeries.add(polygonSeries);
}
basicTriangleSeriesChart("scichart-root");
// async function builderExample(divElementId) {
//     const { chartBuilder, ESeriesType, EThemeProviderType, ETriangleSeriesDrawMode } = SciChart;
//     const xValues = [200, 200, 400, 400, 400, 200];
//     const yValues = [400, 200, 200, 220, 420, 420];
//     const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
//         surface: { theme: { type: EThemeProviderType.Navy } },
//         series: [
//             {
//                 type: ESeriesType.TriangleSeries,
//                 xyData: {
//                     xValues,
//                     yValues
//                 },
//                 options: {
//                     isDigitalLine: false,
//                     fill: "white",
//                     drawMode: ETriangleSeriesDrawMode.List
//                 }
//             }
//         ]
//     });
// }
// if (location.search.includes("builder=1")) builderExample("scichart-root");
