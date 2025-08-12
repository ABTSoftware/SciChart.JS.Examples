# Fast Triangle Series Chart Example

## Overview

This example demonstrates how to create a triangle series chart using the SciChart.JS library. The example showcases implementations for multiple frameworks including Angular, React, and Vanilla JavaScript/TypeScript. A triangle chart is rendered if three modes triangle strip, triangle list and polygon mode.

## Technologies Used

-   **SciChart.JS Library** for high performance chart rendering
-   **Angular** (standalone Angular component using scichart-angular)
-   **React** (using SciChartReact component)
-   **Vanilla JavaScript/TypeScript** for a framework-independent implementation
-   Various SciChart modules such as: NumericAxis, FastTriangleRenderableSeries, XyDataSeries, WaveAnimation, PaletteFactory, and several chart modifiers (ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier)

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the core logic to create the SciChartSurface, add X and Y axes, and render the triangle series chart. The triangle series is configured with palette provider to render triangles in the strip mode.
-   **angular.ts**: This Angular component uses the SciChart Angular integration to initialize the chart by referencing the drawExample function. It demonstrates how to embed SciChart into an Angular standalone component.
-   **index.tsx**: The React implementation wraps the drawExample function into a React component using the SciChartReact helper component. This allows the chart to be displayed within a React application.
-   **vanilla.js / vanilla.ts**: These files provide a framework-agnostic setup. They execute the drawExample function on a DOM element (with id "chart") and return a cleanup function to dispose of the chart when necessary.
-   **javascript-triangle-series-chart.jpg**: An image asset that likely depicts the rendered triangle series chart for reference.

## Customization

The example is highly configurable with several key options:

-   **Data Series Configuration**: The x-values and y-values arrays define the dataset for the triangle series chart. For the triangle mode every tree x and y values define a triangle. For the polygon mode every N-values define a convex polygon. By changing x and y values we can create triangle or convex polygon of any shape and size.
-   **Triangle Series Styling**: The fill color (with transparency) can be modified to change the appearance of the triangles or polygons.
-   **Data Labels**: Options such as horizontal and vertical text positions, font family, font size, and padding are configurable.
-   **Interactivity**: Zooming and panning are enabled by adding modifiers like the ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier.

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
