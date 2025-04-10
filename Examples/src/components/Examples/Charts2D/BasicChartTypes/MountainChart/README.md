# Mountain Chart Example

## Overview

This example demonstrates how to create a Mountain Chart using SciChart.JS. The chart renders a fast mountain series with an animated wave effect and gradient fill generated from a random walk data series. Implementations for Angular, React (TSX), and Vanilla JavaScript/TypeScript are provided.

## Technologies Used

-   SciChart.JS for high performance charting
-   Angular (standalone component using scichart-angular)
-   React (using SciChartReact component)
-   Vanilla JavaScript and TypeScript
-   Random data generation with RandomWalkGenerator
-   SciChart modifiers for zooming and interactivity

## Code Explanation

The central piece of the example is the `drawExample` function (provided in both `.js` and `.ts` variants) which creates the SciChartSurface with a Floating Point WASM context. It adds numeric X and Y axes with configurable ranges and uses the `FastMountainRenderableSeries` to visualize the mountain chart. The series is styled with a stroke, a gradient fill defined by `GradientParams`, and an animation effect provided by `WaveAnimation` with a 1000 ms duration. Interactivity is added to the chart using modifiers like `ZoomExtentsModifier`, `RubberBandXyZoomModifier`, and `MouseWheelZoomModifier`.

The framework-specific files include:

-   **Angular (`angular.ts`)**: A standalone Angular component that uses the `ScichartAngularComponent` to initialize the chart with the `drawExample` function.
-   **React (`index.tsx`)**: A React component that renders the chart using the `SciChartReact` component along with associated CSS classes.
-   **Vanilla (`vanilla.js` and `vanilla.ts`)**: Simple scripts that directly call the `drawExample` function and return a cleanup function to dispose of the SciChartSurface when needed.

## Customization

Key configuration options in this example include:

-   **Animation Duration**: The wave animation for the mountain series is set to a duration of 1000 ms with a fade effect.
-   **Chart Styles**: The mountain series is styled with specific stroke colors, stroke thickness, and a gradient fill defined by two colors.
-   **Interactivity**: The chart is enhanced with zoom extents, rubber band zoom, and mouse wheel zoom modifiers, which can be adjusted or extended further.

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
