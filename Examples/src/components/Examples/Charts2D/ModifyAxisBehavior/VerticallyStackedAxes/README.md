# Vertically Stacked Axes Example

## Overview

This example demonstrates how to create a SciChart.js chart that uses a custom layout for multiple Y axes. The axes are arranged vertically in a left-aligned, overlapping stack – a layout particularly useful for visualizations such as ECG charts. Implementations for Angular, React, and Vanilla JavaScript/TypeScript are provided.

## Technologies Used

-   **SciChart.js** – High performance charting library
-   **Angular** – Uses the scichart-angular component
-   **React** – Uses the SciChartReact component
-   **Vanilla JavaScript/TypeScript** – Standalone implementation

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files define the core `drawExample` function. This function creates a SciChartSurface with a custom theme and sets the layout manager’s left outer axes layout strategy to `LeftAlignedOuterVerticallyStackedAxisLayoutStrategy`. It adds a numeric X axis and then creates 10 separate numeric Y axes. For each Y axis, a corresponding FastLineRenderableSeries is created using a randomly generated sine wave (via the `getRandomSinewave` function). Additionally, several chart modifiers (like YAxisDragModifier, XAxisDragModifier, RubberBandXyZoomModifier, MouseWheelZoomModifier, and ZoomExtentsModifier) are added to enable interactive zooming and panning.
-   **angular.ts**: This Angular standalone component uses the `scichart-angular` component. It passes the `drawExample` function via property binding to initialize the chart in an Angular context.
-   **index.tsx**: The React component imports and uses the `SciChartReact` component, passing the `drawExample` function via the `initChart` prop to render the chart in a React application.
-   **vanilla.js / vanilla.ts**: These files demonstrate how to initialize the chart in a plain JavaScript/TypeScript environment. They call the `drawExample` function with a DOM element id and expose a destructor function to clean up the SciChartSurface when needed.
-   **javascript-vertically-stacked-axes.jpg**: This image file is likely a screenshot of the resulting chart, visually demonstrating the vertically stacked axes layout.

## Customization

Key configuration options in this example include:

-   **Axis Layout Strategy**: The chart’s layout manager is set to use the `LeftAlignedOuterVerticallyStackedAxisLayoutStrategy` to stack Y axes vertically.
-   **Axis Configuration**: Each Y axis is configured with its own visible range, minor grid line settings, and a unique axis title (e.g., 'Y 0', 'Y 1', etc.).
-   **Data Series**: The example uses a helper function to generate random sine wave data for each renderable series.
-   **Interactivity**: Several built-in modifiers enable panning, zooming (including rubber band and mouse wheel), and dragging of axes, enhancing the user experience.

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
