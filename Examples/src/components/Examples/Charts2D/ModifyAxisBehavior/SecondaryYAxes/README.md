# Secondary Y Axes

## Overview

This example demonstrates how to implement multiple Y axes in a SciChart.JS chart. Two separate Y axes are created—one on the left and a secondary one on the right—each bound to its own renderable series. The example is provided in three implementations: Angular, React (TSX), and Vanilla JavaScript/TypeScript.

## Technologies Used

-   **SciChart.JS** for creating high performance charts
-   **Angular** (standalone component using scichart-angular)
-   **React** (using SciChartReact component)
-   **Vanilla JavaScript / TypeScript** for direct integration
-   Additional dependencies include utilities for generating random walk data and a custom theme configuration from the repository

## Code Explanation

-   **drawExample.js / drawExample.ts**: This file contains the core implementation. It creates a SciChartSurface with a shared X axis and two Y axes. The primary left Y axis and the secondary right Y axis are configured with distinct colors, titles, and border styles. Two line series are added with random walk data—one bound to the default axes and the other specifically bound to the secondary right Y axis. Interactivity modifiers (drag, pan, zoom) and annotations are added to provide additional functionality and information.
-   **angular.ts**: This Angular component wraps the SciChart functionality using the `scichart-angular` component. It uses the `drawExample` function to initialize the chart when the component is rendered.
-   **index.tsx**: The React version uses the `SciChartReact` component to initialize the chart using the same `drawExample` function. It shows how SciChart.JS can be integrated into a React application.
-   **vanilla.js and vanilla.ts**: These files demonstrate how to initialize and run the chart directly in a vanilla JavaScript or TypeScript environment. They call the `drawExample` function and handle chart disposal through a destructor function.

## Customization

The example highlights several configuration options:

-   **Axis Customization**: Both Y axes are customized with specific colors (such as VividSkyBlue, VividGreen, VividOrange), titles, label styles, background colors, and border settings.
-   **Data Series**: Two separate data series are generated using a random walk generator. The second series is explicitly bound to the secondary Y axis using its unique ID.
-   **Interactivity**: Multiple chart modifiers are added to enable panning, zooming (including mouse wheel zoom), and axis dragging, which illustrates how users can interact with multiple axes.
-   **Annotations**: Text annotations are added to describe which series belong to which axis, including a native text annotation that demonstrates relative positioning.

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
