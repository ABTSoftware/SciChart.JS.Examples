import * as SciChart from "scichart";

async function triangleSeriesPolygonChart(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        TriangleRenderableSeries,
        XyDataSeries,
        ETriangleSeriesDrawMode,
        ZoomPanModifier,
        ZoomExtentsModifier,
        NumberRange
    } = SciChart;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    const coordinates = [
        [0, 0],
        [0, 200],
        [200, 0],
        [200, 200]
    ];
    
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: coordinates.map(p => p[0]),
        yValues: coordinates.map(p => p[1])
    });

    const italySeries = new TriangleRenderableSeries(wasmContext, {
        dataSeries,
        drawMode: ETriangleSeriesDrawMode.Polygon, // triangle connects two last points and the first point
        fill: "cornflowerblue"
    });

    sciChartSurface.renderableSeries.add(italySeries);

    // Add zoom/pan controls
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());

    return sciChartSurface;
}

triangleSeriesPolygonChart("scichart-root");

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
