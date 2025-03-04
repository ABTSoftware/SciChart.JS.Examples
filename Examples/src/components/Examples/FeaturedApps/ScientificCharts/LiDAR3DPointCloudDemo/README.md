# LiDAR 3D Point Cloud Demo

## Overview

This example demonstrates how to visualize LiDAR data in 3D using SciChart.JS. It shows a 3D point cloud rendered from ASC-format data along with a surface mesh displaying a heightmap (topology map) with contour strokes and an accompanying heatmap legend. Implementations are provided for multiple frameworks: React, Angular, and plain JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS 3D Engine
-   SciChart Angular Components
-   SciChart React Components
-   TypeScript / JavaScript
-   ASC Data Parsing Utility
-   3D Visual Components including ScatterRenderableSeries3D and SurfaceMeshRenderableSeries3D

## Code Explanation

-   **angular.ts**: This file defines an Angular standalone component that sets up the 3D chart area along with a heatmap legend. It utilizes two SciChart Angular components, one for the main LiDAR 3D surface (initialized via the `drawExample` function) and one for the heatmap legend (initialized via the `drawHeatmapLegend` function).
-   **index.tsx**: This file provides the React implementation of the example, wrapping the 3D chart and the heatmap legend within the `SciChartReact` components. A chart group loader is used to display both the main chart and the legend.
-   **drawExample.js / drawExample.ts**: These files contain the main logic to create the SciChart3DSurface. They load LiDAR data from the server, parse the ASC format data using the `AscReader`, and set up a camera, axes, and two renderable series:
    -   A point cloud rendered with the `ScatterRenderableSeries3D` using a 1px pixel marker.
    -   A surface mesh rendered with the `SurfaceMeshRenderableSeries3D` using a `UniformGridDataSeries3D` and a gradient color palette with contour strokes for topology.
        Interactivity modifiers such as `MouseWheelZoomModifier3D` and `OrbitModifier3D` are also added to allow user interaction.
-   **AscReader.js / AscReader.ts**: These utility files provide a helper class to parse ASC format LiDAR data. They read header information (like number of rows, columns, cell size, etc.) and then process the spatial and height values. The parser also optionally computes color values via a color mapping function for visualizing the point cloud with correct coloring based on height.
-   **javascript-3d-lidar-visualization.jpg**: An image file that likely serves as a preview or thumbnail for the example.

## Customization

Key configuration options available in the example include:

-   **World Dimensions & Camera**: The SciChart3DSurface world dimensions are set (e.g., `new Vector3(1000, 200, 1000)`) along with specific camera positions and target vectors for optimal visualization of the LiDAR data.
-   **Axes Configuration**: Numeric axes for X, Y, and Z are configured with custom titles (e.g., "X Distance (Meters)", "Height (Meters)", and "Z Distance (Meters)").
-   **Series Appearance**:
    -   The point cloud uses a `ScatterRenderableSeries3D` with a `PixelPointMarker3D` for rendering minimalistic 1px markers.
    -   The surface mesh series is configured to use a gradient color palette (with defined gradient stops matching various colors) and contour strokes, with options such as opacity, draw skirt, and mesh palette mode set to height map interpolation.
-   **Heatmap Legend**: A dedicated heatmap legend is configured with inner axis options and a title style to display height values clearly.

## Running the Example

To run any example from the SciChart.JS.Examples repository, follow these steps:

1. **Clone the Repository**: Download the entire repository to your local machine using Git:

    ```bash
    git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
    ```

2. **Navigate to the Examples Directory**: Change into the `Examples` folder:

    ```bash
    cd SciChart.JS.Examples/Examples
    ```

3. **Install Dependencies**: Install the necessary packages using npm:

    ```bash
    npm install
    ```

4. **Run the Development Server**: Start the development server to view and interact with the examples:

    ```bash
    npm run dev
    ```

    This will launch the demo application, allowing you to explore various examples, including the one in question.

For more detailed instructions, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
