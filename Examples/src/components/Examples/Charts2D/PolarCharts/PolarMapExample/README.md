# Polar Map Chart

## Overview

This example demonstrates how to create a **polar map visualization** using SciChart.js. The implementation renders geographic data as a series of colored triangles on a polar coordinate system, with options to view from either the North or South pole. The chart uses constrained Delaunay triangulation to convert geographic polygons into triangles, with colors representing population density.

## Technologies Used

-   SciChart.js - High performance WebGL charting library
-   Polar coordinate system - Angular (longitude) and radial (latitude) axes
-   Constrained Delaunay triangulation - Algorithm for polygon triangulation
-   Color interpolation - Population-based coloring from white to blue
-   React/Angular/JavaScript - Framework-specific implementations available

## Code Explanation

The core functionality is implemented in `drawExample`, which:

1. Creates a `SciChartPolarSurface` with:

    - Angular `PolarNumericAxis` for longitude (-180 to 180 degrees)
    - Radial `PolarNumericAxis` for latitude (-90 to 90 degrees)
    - Flippable coordinate system for North/South pole views

2. Processes geographic data by:

    - Loading GeoJSON features
    - Converting polygons to triangles using `constrainedDelaunayTriangulation`
    - Coloring triangles based on population density via `interpolateColor`

3. Adds interactive modifiers:
    - `PolarPanModifier` for panning
    - `PolarZoomExtentsModifier` for zoom-to-fit
    - `PolarMouseWheelZoomModifier` for zooming

Key components include:

-   `PolarTriangleRenderableSeries` - Renders triangulated data in polar coordinates
-   `constrainedDelaunayTriangulation.js` - Custom triangulation algorithm implementation
-   Dynamic view switching between North/South pole perspectives

## Customization

Notable customizations in this example:

1. **Coordinate Flipping**:
   The `flippedCoordinates` property on axes enables switching between North/South pole views dynamically. When viewing from the South pole:

    ```typescript
    flippedCoordinates: showFromSouthPole ? true : false;
    ```

2. **Population-Based Coloring**:
   A custom `interpolateColor` function maps population values to a white-to-blue gradient:

    ```typescript
    function interpolateColor(min, max, value) {
        // Normalize and lerp between #ffffff and #1e3489
        const t = (value - min) / (max - min);
        return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
    }
    ```

3. **Antarctica Handling**:
   Special logic excludes Antarctica when viewing from North pole:
    ```typescript
    if (state.properties.SOVEREIGNT === "Antarctica" && showFromSouthPole === false) {
        return;
    }
    ```

## Running the Example

To run this example from the SciChart.JS.Examples repository:

1. Clone the repository:

    ```bash
    git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
    ```

2. Navigate to the Examples folder:

    ```bash
    cd SciChart.JS.Examples/Examples
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

For more details, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
