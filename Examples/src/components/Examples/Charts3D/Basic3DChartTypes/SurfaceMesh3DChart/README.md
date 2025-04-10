# Surface Mesh 3D Chart Example

## Overview

This example demonstrates how to create a 3D surface mesh chart using SciChart.JS. The chart renders a dynamically generated height map based on a sine function and displays it with a gradient color palette in a solid wireframe style. Both Angular and React implementations are provided to show how the SciChart library can be integrated into different frameworks.

## Technologies Used

-   SciChart.JS (SciChart3DSurface, NumericAxis3D, UniformGridDataSeries3D, SurfaceMeshRenderableSeries3D, GradientColorPalette, and various chart modifiers)
-   Angular (using the ScichartAngularComponent)
-   React (using the SciChartReact component)
-   TypeScript and JavaScript

## Code Explanation

-   **angular.ts**: This file defines an Angular component that renders the SciChart chart by using the `ScichartAngularComponent` and passing the `drawExample` function as the initializer.
-   **drawExample.js / drawExample.ts**: These files contain the main chart creation logic. They create a SciChart 3D surface, set up the camera, define world dimensions and axes, and generate a 2D height map using a sine function. A `UniformGridDataSeries3D` is used to pass the data into a `SurfaceMeshRenderableSeries3D`, which is configured with properties like opacity, stroke, and mesh rendering style (SOLID_WIREFRAME). The example also creates a gradient color palette and applies several interactive modifiers such as Mouse Wheel Zoom, Orbit, Reset Camera, and Tooltip modifiers. Additionally, the `drawHeatmapLegend` function is provided to render a separate heatmap legend on the side of the chart.
-   **index.tsx**: This React component shows how to render the chart and the corresponding heatmap legend using two `SciChartReact` components. Both are wrapped in a `ChartGroupLoader` container to organize the layout.
-   **javascript-3d-surface-mesh-chart.jpg**: This image file provides a visual preview of the rendered 3D surface mesh chart.

## Customization

Key configuration options in this example include:

-   **Camera and View Settings**: The camera is positioned at `(-200, 150, 200)` and targets a point in the 3D space, while the world dimensions are set to a `Vector3(200, 100, 200)`.
-   **Axes Configuration**: The X, Y, and Z axes are created with customized titles and, for example, the Y axis is limited with a visible range from 0 to 0.3.
-   **Data Generation**: A 2D height map is generated using loops that create a sine wave pattern modulated by the x and z coordinates.
-   **Color Palette**: The gradient color palette is defined with multiple stops using colors from the provided theme, which affects the look of the mesh surface.
-   **Rendering Options**: The chart uses a `SurfaceMeshRenderableSeries3D` with properties such as opacity, stroke thickness, contour strokes, and a specific rendering style set to SOLID_WIREFRAME.
-   **Interactivity**: Various modifiers (e.g., MouseWheelZoomModifier3D, OrbitModifier3D, ResetCamera3DModifier, TooltipModifier3D) are added to enhance user interaction with the chart.

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
