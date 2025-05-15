# The Triangle Series Type

Triangle Series can be created using the [TriangleRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/trianglerenderableseries.html) type.

Here is simple Rectangle Series made using [XyDataSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html):

```javascript
const sXValues = [200, 400, 400, 200, 200, 400, 420, 420, 620, 620, 620, 420];
const sYValues = [200, 200, 400, 220, 420, 420, 400, 200, 200, 220, 420, 420];

const polygonSeries = new TriangleRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
        xValues: sXValues,
        yValues: sYValues
    }),
    isDigitalLine: false,
    fill: "white",
    drawMode: ETriangleSeriesDrawMode.List // Polygon / List / Strip
});
sciChartSurface.renderableSeries.add(polygonSeries);
```

Triangle Series could be used for displaying

- Polygons ?
- Maps ?

- strip mode, polygons

## Properties

**ETriangleSeriesDrawMode.Strip** is a rendering mode used with the TriangleSeries in SciChart.js, which is a high-performance JavaScript charting library for scientific and financial applications.

**How ETriangleSeriesDrawMode.Strip Works**

When you use the Strip mode, the series connects a sequence of points as a continuous "triangle strip." In computer graphics, a triangle strip is an efficient way to render connected triangles by sharing vertices between adjacent triangles. This approach reduces the amount of data needed and improves rendering performance.

- Vertex Connection: In Strip mode, after the first triangle is defined by three points (A, B, C), each subsequent point (D, E, ...) forms a new triangle by connecting to the previous two points. For example, the second triangle uses points (B, C, D), the third triangle uses (C, D, E), and so on.

- Rendering Efficiency: This mode is particularly efficient for rendering surfaces or filled areas where the triangles share edges, such as mesh plots or terrain surfaces.

- Visual Appearance: The result is a smooth, connected strip of triangles, which can be used to represent surfaces or bands in 2D or 3D charts.

**Typical Usage**

- Surface Plots: Triangle strips are commonly used in surface or mesh plots where you want to efficiently display a grid or a band of connected triangles.

- Filled Areas: Useful for visualizing filled areas between lines or curves, where performance and smooth appearance are important.

**Example (Generalized)**
