# Depth Chart Example

## Overview

This example demonstrates how to create a depth chart using SciChart.JS. The chart visualizes cumulative buy and sell volumes using two Fast Mountain Renderable Series and a custom depth cursor modifier that displays crosshair annotations, labels, and a mid-price line. This example is implemented for Angular, React, and Vanilla JavaScript.

## Technologies Used

-   **SciChart.JS** for high performance charting
-   **Angular** (using scichart-angular component) for the Angular implementation
-   **React** (with SciChartReact) for the React implementation
-   **Vanilla JavaScript/TypeScript** for a framework agnostic example

## Code Explanation

-   **DepthCursorModifier.js/DepthCursorModifier.ts**: These files contain the implementation of a custom modifier that enhances the chart with interactive annotations. The modifier computes the mid-price from buy and sell series, updates line annotations for buy and sell orders, and controls the display of rollover markers and labels. It handles mouse events to update the annotations dynamically as the user moves the cursor across the chart.
-   **drawExample.js/ts**: This is the main file that sets up a SciChartSurface, creates numeric axes, builds cumulative data series for buy and sell orders, and adds two Fast Mountain Renderable Series to the chart. It then applies common chart modifiers (like ZoomExtentsModifier and MouseWheelZoomModifier) along with the custom depth cursor modifier. The configuration options (such as crosshair stroke dash array, stroke thickness, and axis label fill) are set when creating the depth modifier.
-   **angular.ts**: This Angular component initializes the chart by referencing the drawExample function. It uses the scichart-angular component to render the chart in an Angular application.
-   **index.tsx**: This React component renders the SciChartReact component which initializes the chart using the drawExample function. It serves as the entry point for the React implementation.
-   **vanilla.js/vanilla.ts**: These files demonstrate how to create the depth chart in a Vanilla JavaScript or TypeScript environment. They call the drawExample function and provide a destructor function to clean up the chart when necessary.
-   **javascript-depth-chart.jpg**: This is a sample image associated with the example, showing a screenshot of the rendered chart.

## Customization

Key configuration options in this example include:

-   **crosshairStrokeThickness**: Controls the thickness of the crosshair lines in the depth cursor modifier.
-   **crosshairStrokeDashArray**: Defines the dash pattern for the crosshair lines.
-   **axisLabelFill & axisLabelStroke**: Customize the fill and stroke colors of the axis labels.
-   **buyColor & sellColor**: Define the colors for the buy and sell series respectively.
-   **highlightColor**: Sets the color for the highlight box displayed between the buy and sell lines.

These options can be adjusted to modify the visual appearance and interactivity of the depth chart.

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
