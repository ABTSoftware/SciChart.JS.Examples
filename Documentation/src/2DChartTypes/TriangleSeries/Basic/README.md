# The Triangle Series Type

Triangle Series can be created using the [TriangleRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/trianglerenderableseries.html) type.

The TriangleRenderableSeries class in SciChart.js is a specialized renderable series used for visualizing data as a series of triangles on a 2D chart. It extends the base BaseRenderableSeries class and provides additional properties and methods tailored for rendering triangle shapes.

Here is a simple Triangle Series made using [XyDataSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html):

```javascript
const sXValues = [200, 400, 400, 200, 200, 400, 420, 420, 620, 620, 620, 420];
const sYValues = [200, 200, 400, 220, 420, 420, 400, 200, 200, 220, 420, 420];

const polygonSeries = new TriangleRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
        xValues: sXValues,
        yValues: sYValues
    }),
    fill: "white",
    drawMode: ETriangleSeriesDrawMode.List // Polygon / List / Strip
});
sciChartSurface.renderableSeries.add(polygonSeries);
```

## Overview

The TriangleRenderableSeries is designed to plot data points as triangles, often used for custom scatter plots, mesh visualizations, or highlighting specific data points with a triangle marker. It supports full customization, including stroke, fill, and point marker options.

## Properties

-   **drawMode** Determines how the triangles are rendered on the chart. Options are
    -   ETriangleSeriesDrawMode.List - In this mode, each group of three consecutive points in the list defines an independent triangle. The triangles are not connected, every set of three points forms a separate triangle.
    -   ETriangleSeriesDrawMode.Polygon - In this mode, each group of two consecutive points and the first one in the list defines a triangle. The triangles are connected in a way that they share the same point defined by the first point on the list.
    -   ETriangleSeriesDrawMode.Strip - In this mode, each group of three consecutive points in the list defines a triangle. The triangles are connected, every point is connected to the last two points.
-   **fill** The fill color of the triangle.
-   **dataSeries** The data series containing the X, and Y values to plot.
-   **isVisible** Determines whether the series is visible on the chart.
-   **polygonVertices** Sets the number of points per polygon. Applies only for drawMode ETriangleSeriesDrawMode.Polygon

**ETriangleSeriesDrawMode.Strip** is a rendering mode used with the TriangleSeries in SciChart.js, which is a high-performance JavaScript charting library for scientific and financial applications.

## Polygon and Strip mode explained by using the same set of data

Polygon and Strip modes are explained by using the same set of four coordinates.

```
const coordinates = [
 [0, 0],
 [0, 200],
 [200, 0],
 [200, 200]
];
```

Here is the result using Polygon mode. Each group of two consecutive points and the first one in the list defines a triangle.
Out of these four points from this data set we have two triangles [[0, 0],[0, 200],[200, 0]] and [[0, 0],[200, 0], [200, 200]]

![TriangleSeriesPolygon](images/TriangleSeriesPolygon.png)

Here is the result using Strip mode mode. Each group of three consecutive points in the list defines a triangle.
Out of these four points from this data set we also have two triangles [[0, 0],[0, 200],[200, 0]] and [[0, 200],[200, 0], [200, 200]]

![TriangleSeriesStrip](images/TriangleSeriesStrip.png)
