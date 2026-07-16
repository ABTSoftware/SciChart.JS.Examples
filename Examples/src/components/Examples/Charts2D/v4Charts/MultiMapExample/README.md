# Multi-Map Example

## Overview

This example demonstrates how to create a **multi-map visualization** using SciChart.js by combining `FastTriangleRenderableSeries` for filled regions with `FastLineRenderableSeries` for outlines. The implementation features geographic data rendering through triangle meshes, dynamic aspect ratio preservation, and interactive zoom/pan functionality.

## Technologies Used

-   SciChart.js - High performance WebGL charting library
-   GeoJSON data processing
-   Constrained Delaunay triangulation algorithm
-   TypeScript - For type-safe implementation

## Code Explanation

The core functionality revolves around the `drawExample` function which:

1. **Creates the SciChartSurface** with X and Y numeric axes
2. **Implements aspect ratio preservation** through the `preserveAspectRatio` helper function that maintains correct proportions during resizing
3. **Handles map data** via:
    - `setConvertedData` - Processes converted geographic data into renderable formats
    - `setMap` - Creates the visualization using:
        - `FastTriangleRenderableSeries` with `ETriangleSeriesDrawMode.List` for filled regions
        - `FastLineRenderableSeries` for border outlines
4. **Provides cleanup** through `clearMap` function
5. **Adds interactivity** with ZoomExtentsModifier, ZoomPanModifier and MouseWheelZoomModifier

The example also includes a comprehensive `transformToAlbersUSA` function that handles geographic projection transformations for proper US map display, including special handling for Alaska and Hawaii.

## Customization

Key customization aspects include:

1. **Aspect Ratio Preservation**: The `preserveAspectRatio` function dynamically adjusts visible ranges to maintain correct proportions when the chart is resized. This is implemented through a `preRender` subscription that recalculates ranges before each frame.

2. **Color Palette**: The example uses a predefined color palette (11 Brewer colors) for differentiating regions, with automatic cycling when there are more regions than colors.

3. **Projection System**: The custom Albers USA projection system handles:

    - Different projection parameters for continental US, Alaska and Hawaii
    - Special scaling and positioning for Alaska and Hawaii
    - Coordinate transformation for all geographic features

4. **Performance Optimization**: The implementation counts rendered triangles (logged to console) to monitor rendering performance.

## Running the Example

To run this example from the SciChart.JS.Examples repository:

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
    ```

2. **Navigate to the Examples Directory**:

    ```bash
    cd SciChart.JS.Examples/Examples
    ```

3. **Install Dependencies**:

    ```bash
    npm install
    ```

4. **Run the Development Server**:
    ```bash
    npm run dev
    ```

For more detailed instructions, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
