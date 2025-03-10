# Realtime Surface Mesh 3D Chart Example

## Overview

This example demonstrates a realtime 3D surface mesh chart using the SciChart.JS library. It features a dynamically updating surface mesh where the height data is continuously recalculated in real time. The example is implemented for multiple frameworks, including React, Angular, and Vanilla JavaScript/TypeScript, showcasing how to integrate SciChart 3D charts across different application types.

## Technologies Used

-   **SciChart.JS**: The primary library for high performance 3D charting.
-   **React**: Utilized in the `index.tsx` file with the `SciChartReact` component and hooks for lifecycle management.
-   **Angular**: Implemented in the `angular.ts` file which uses the `ScichartAngularComponent` to initialize the chart.
-   **Vanilla JavaScript/TypeScript**: The chart creation and update logic is provided in `drawExample.js` and `drawExample.ts`, illustrating how to use the SciChart API directly.

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the core logic to create a 3D surface chart. They initialize a `SciChart3DSurface`, configure camera settings, world dimensions, and add X, Y, and Z axes. A 50x50 grid data series is created and periodically updated using a cosine function to simulate realtime changes on the surface mesh. A gradient color palette is applied to the mesh, and various interactivity modifiers (such as mouse wheel zoom, orbit, and reset camera) are added. The updating of the chart is handled via a timer that refreshes the mesh every 20 milliseconds.
-   **angular.ts**: This Angular component wraps the chart using the `ScichartAngularComponent`. It passes the `drawExample` function to the component which handles the initialization and rendering of the 3D chart within an Angular application.
-   **index.tsx**: The React component uses the `SciChartReact` component to integrate the chart into a React application. It calls the `drawExample` function on component initialization and uses a hook to start and stop the realtime update of the chart.
-   **javascript-realtime-3d-surface-mesh-chart.jpg**: This image file likely serves as a preview or thumbnail for the example.

## Customization

Key configuration options include:

-   **Realtime Data Update**: The height values for the mesh are updated dynamically using a cosine function. The update interval is set to 20 milliseconds via a JavaScript timer.
-   **Camera Setup**: The camera is positioned with custom coordinates and target points to provide the desired 3D view of the surface mesh.
-   **Mesh Appearance**: The `SurfaceMeshRenderableSeries3D` is configured with properties such as opacity, stroke, contour intervals, and a gradient color palette, allowing customization of the visual appearance of the mesh.
-   **Interactivity**: Multiple chart modifiers (mouse wheel zoom, orbit, and camera reset) have been added to improve user interaction with the 3D chart.

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
