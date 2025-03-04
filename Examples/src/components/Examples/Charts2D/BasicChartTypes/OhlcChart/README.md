# OHLC Chart Example

## Overview

This example demonstrates an OHLC (Open, High, Low, Close) chart created with SciChart.JS. The example shows implementations for multiple frameworks including Angular, React, and Vanilla JavaScript, allowing you to see how to integrate the SciChart charting library in different environments.

## Technologies Used

-   SciChart.JS library
-   Angular (standalone component)
-   React
-   Vanilla JavaScript & TypeScript
-   SciChart components such as SciChartSurface, CategoryAxis, NumericAxis, FastOhlcRenderableSeries, OhlcDataSeries, SweepAnimation, and chart modifiers (Zoom, Pan, MouseWheelZoom)

## Code Explanation

-   **angular.ts**: Defines an Angular standalone component that utilizes the scichart-angular component to initialize and render the chart by calling the `drawExample` function.
-   **data.js / data.ts**: Provide sample stock market data in the form of date values and corresponding open, high, low, and close values for the OHLC chart.
-   **drawExample.js / drawExample.ts**: Contain the main chart configuration. These files create a SciChartSurface with a navy theme, add a CategoryAxis with SmartDateLabelProvider for the X-axis, and a NumericAxis for the Y-axis with specific visible range and label precision. They then add a FastOhlcRenderableSeries configured with properties such as stroke thickness, data point width, distinct colors for rising and falling values, and a sweep animation with an 800ms duration and fade effect. Additional interactive modifiers like ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier are also attached to the chart.
-   **index.tsx**: Implements the React component by wrapping the chart initialization inside the SciChartReact component using the `drawExample` function.
-   **vanilla.js / vanilla.ts**: Provide a simple vanilla JavaScript/TypeScript approach to creating the chart. These files call the `drawExample` function and also demonstrate how to clean up by returning and later calling the destructor function that deletes the SciChartSurface.

## Customization

Key configuration options include:

-   **Axis Configuration**: The X-axis uses a CategoryAxis with a SmartDateLabelProvider to manage stock market dates, while the Y-axis is a NumericAxis with a specified visible range and label precision (4 decimals).
-   **Renderable Series Settings**: The OHLC series is customized with properties like stroke thickness (1), data point width (0.7), and distinct colors for up ("#50ff50") and down ("#ff5050") movements.
-   **Animation**: A SweepAnimation is configured with a duration of 800 milliseconds and a fade effect. This adds a smooth animated transition when the chart is rendered.
-   **Interactivity**: Zoom, pan, and mouse wheel zoom modifiers are added to provide an interactive user experience.

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
