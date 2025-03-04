# 3D Tenor Curves Example

## Overview

This example demonstrates how to create a multi-chart display that combines a 3D surface mesh with two 2D line charts and an integrated heatmap legend. The 3D chart renders “tenor curves” based on generated dummy data, while the two line charts provide alternative 2D views of the same data. Implementations for Angular (using scichart-angular) and React (using SciChartReact) are included alongside TypeScript and JavaScript versions of the drawing functions.

## Technologies Used

-   **SciChart**: The high performance charting library for both 2D and 3D charts
-   **Angular**: Utilized in the Angular component (`angular.ts`) with scichart-angular
-   **React**: Implemented in the React component (`index.tsx`) using SciChartReact
-   **TypeScript/JavaScript**: Drawing functions and data generation are provided in both TS and JS files

## Code Explanation

-   **angular.ts**: An Angular standalone component that lays out the multi-chart view. It uses the scichart-angular component to initialize the individual charts by passing in drawing functions (draw3DChart, drawLineChart1, drawLineChart2, and drawHeatmapLegend).
-   **drawExample.js / drawExample.ts**: These files contain the core functions that initialize the charts. The `draw3DChart` function sets up a SciChart3DSurface with a custom camera, axes, modifiers and a surface mesh renderable series using a gradient color palette. The two line chart functions (`drawLineChart1` and `drawLineChart2`) create 2D mountain series with different data perspectives derived from the tenor curves. The `drawHeatmapLegend` function configures and displays a heatmap legend with corresponding axis styling.
-   **index.tsx**: The React implementation provides a component that arranges the 3D chart and its corresponding heatmap legend on one side and the two line charts on the other. It uses the SciChartReact component to initialize each part of the example.
-   **TenorCurveData.js / TenorCurveData.ts**: These modules generate the dummy 2D array data that drives both the 3D and 2D charts. They mathematically compute “tenor curve” data by utilizing a power function along with a parabolic component based on each (x, z) coordinate.

## Customization

The example highlights several configuration options:

-   **3D Chart Parameters**: Custom camera settings (position, target, aspect ratio, field of view), world dimensions, and 3D numeric axes with titles are configured to provide a tailored 3D view.
-   **Surface Mesh Styling**: The renderable series uses a gradient color palette with multiple stops that map the height values to colors. Options such as stroke color, stroke thickness, opacity, and mesh style (solid wireframe) can be customized.
-   **2D Charts**: Both line charts use mountain renderable series with different stroke settings, fill gradients, and point markers. One chart averages the tenor curve data across the x-axis while the other takes a middle slice of the data.
-   **Heatmap Legend**: The legend is constructed with configurable axes, labels, tick styles, and a color map that corresponds with the 3D surface mesh.

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
