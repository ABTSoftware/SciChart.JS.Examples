# Real Time Zoom and Pan

## Overview

This example demonstrates a real time updating chart that continuously appends new data points to a line series (sine wave) and a scatter series (cosine function). It features interactive zooming and panning functionality through the use of a rubber band zoom modifier and a zoom pan modifier (activated using the right mouse button). The example is implemented for multiple frameworks including Angular, React, and Vanilla JavaScript, and includes both JavaScript and TypeScript source files.

## Technologies Used

-   **SciChart.JS** – High performance charting library driving the chart rendering
-   **Angular** – Uses the scichart-angular component
-   **React** – Uses the scichart-react component
-   **Vanilla JavaScript/TypeScript** – Direct implementation using standard JS/TS

## Code Explanation

-   **drawExample.js/ts**: Contains the core logic to create a SciChartSurface by initializing a WebAssembly context and setting up the X and Y axes. Two renderable series are added: a fast line series for the sine wave and a scatter series for the cosine function. The data series are pre-populated with 1000 points and then new points are appended in realtime using a timer (approximately 60Hz). The chart modifiers added include a disabled animation zoom extents modifier, a rubber band zoom modifier for realtime zooming, and a zoom pan modifier that is activated by the right mouse button. The function returns start and stop update controls along with the chart surface instance.

-   **angular.ts**: Defines an Angular standalone component that makes use of the scichart-angular component. The Angular template binds to the `drawExample` function to initialize the chart within an Angular application.

-   **index.tsx**: Implements a React component that utilizes the SciChartReact component from the SciChart.JS React package. The React component initializes the chart by passing in the `drawExample` function. It also calls the returned `startUpdate` control once the chart is initialized and ensures cleanup with `stopUpdate` when the component is unmounted.

-   **vanilla.js/ts**: Provides a simple example of initializing the chart in a Vanilla JavaScript/TypeScript environment. It calls the `drawExample` function with a specified root element (with id "chart") and returns a cleanup function to dispose of the chart when necessary.

-   **zoom-and-pan-a-realtime-javascript-chart.jpg**: An image file included to visually represent the realtime zooming and panning chart.

## Customization

Key configuration options in this example include:

-   **Data Series Configuration**: The initial data series for sine and cosine functions are set up with an initial capacity of 2000 points, pre-populated with 1000 points.
-   **Realtime Updates**: A timer is used to append new data points at a rate of approximately 60Hz. When the user is not zooming, the visible range on the X-axis automatically scrolls to show the latest 1000 data points.
-   **Chart Modifiers**:
    -   The zoom extents modifier is added with animations disabled.
    -   The rubber band zoom modifier enables click-and-drag zooming.
    -   The zoom pan modifier is configured to be executed on the right mouse button, allowing for realtime panning.
-   **Theming**: The SciChartSurface is created with a theme from `appTheme.SciChartJsTheme`, ensuring consistent styling across chart components.

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
