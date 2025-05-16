import {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    TriangleRenderableSeries,
    XyDataSeries,
    ETriangleSeriesDrawMode,
    ZoomPanModifier,
    ZoomExtentsModifier,
    NumberRange
} from "scichart";


async function triangleSeriesPolygonChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    // const coordinates = [
    //     [0, 0],
    //     [0, 200],
    //     [200, 0],
    //     [200, 200]
    // ];

    const coordinates = [
        [100, 100],
        [0, 50],
        [50, 0],
        [50, 0],
        [150, 0],
        [200, 50],
        [200, 150],
        [150, 200],
        [50, 200],
        [0, 150],
        [0, 50]
    ];

    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: coordinates.map(p => p[0]),
        yValues: coordinates.map(p => p[1])
    });

    const triangleSeries = new TriangleRenderableSeries(wasmContext, {
        dataSeries,
        drawMode: ETriangleSeriesDrawMode.Polygon, // triangle connects two last points and the first point
        fill: "cornflowerblue",
        opacity: 0.5
    });

    sciChartSurface.renderableSeries.add(triangleSeries);

    // Add zoom/pan controls
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());

    return sciChartSurface;
}

triangleSeriesPolygonChart("scichart-root");
