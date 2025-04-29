# Spline Mountain Chart Example

## Overview

This example demonstrates how to create a spline mountain chart using SciChart.JS. The chart features a smooth mountain series with spline interpolation, gradient fills, point markers, and a wave animation. Implementations are provided for Angular, React, and Vanilla JavaScript/TypeScript.

## Technologies Used

-   **SciChart.JS**: The high performance charting library
-   **Angular**: Uses the `scichart-angular` component
-   **React**: Utilizes the `SciChartReact` component
-   **Vanilla JavaScript/TypeScript**: Plain implementations for lightweight integration
-   **TypeScript**: For type-safe development

## Code Explanation

-   **drawExample.js/ts**: This file contains the main function that creates a SciChart surface, sets up numeric X and Y axes, and adds a Spline Mountain Renderable Series. Key features include:

    -   **Data Series**: Uses an array of X and Y values with spline interpolation (20 interpolation points) to smooth the line.
    -   **Styling**: Configures the series with a stroke (using a vivid blue color), stroke thickness, and a gradient fill from a muted sky blue to transparent.
    -   **Point Marker**: Adds an ellipse marker with defined width, height, and styling options.
    -   **Animation**: Implements a wave animation with a duration of 1000ms and a fade effect set around a zero line of 10.
    -   **Interactivity**: Enables zoom extents, rubber band XY zoom, and mouse wheel zoom modifiers.

-   **Angular (angular.ts)**: Integrates the chart creation function using the `scichart-angular` component. The Angular component simply passes the `drawExample` function to initialize the chart within its template.

-   **React (index.tsx)**: Uses the `SciChartReact` component to initialize the chart. This file imports common styles and passes the `drawExample` function to set up the chart in a React environment.

-   **Vanilla (vanilla.js/vanilla.ts)**: These files call the `drawExample` function directly on a specified root element (with id "chart") and return a cleanup function to delete the SciChartSurface when no longer needed.

-   **Asset (javascript-spline-mountain-chart.jpg)**: A JPEG image representing a screenshot of the example, useful for documentation or preview purposes.

## Customization

Key configuration options in this example include:

-   **Interpolation Points**: Set to 20 to smooth the mountain series line.
-   **Stroke & Fill Colors**: Derived from the application theme (e.g., Vivid Sky Blue and Muted Sky Blue) to enhance visual appeal.
-   **Animation Settings**: The wave animation is configured with a 1000ms duration, a fade effect, and a zero line parameter.
-   **Point Marker Settings**: Customizable marker dimensions and styling provide an additional level of detail on data points.
-   **Chart Modifiers**: Zoom modifiers such as ZoomExtents, RubberBandXyZoom, and MouseWheelZoom improve interactivity.

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
