# Candlestick Chart

## Overview

This example demonstrates how to build a highly interactive candlestick chart using SciChart.JS. The chart displays candlestick and OHLC series along with volume data and moving averages. It also includes interactive modifiers such as zoom, pan, and cursor tooltips. Implementations for Angular, React (with TSX), and Vanilla JavaScript are provided in this example.

## Technologies Used

-   SciChart.JS
-   React
-   Angular
-   TypeScript and JavaScript
-   SciChart React & Angular components

## Code Explanation

-   **Angular.ts**: This file defines an Angular standalone component which utilizes the SciChart Angular component. It imports the `drawExample` function and binds it to the SciChartAngular component's initializer.
-   **drawExample.js / drawExample.ts**: These files contain the core chart construction logic. They create a SciChartSurface, set up a DateTime axis for the X-axis and two Numeric axes for the Y-axes (one for price and one for volume). The code maps candle data (open, high, low, close and volume) into the required data series, creates a candlestick series (and an optional OHLC series that can be toggled), applies SciChart’s moving average filters to display trend lines, and adds a custom palette provider to colour volume bars based on candle direction. The chart modifiers for zooming, panning, and displaying customizable tooltips are also defined here.
-   **index.tsx**: This React component sets up the example within a React environment. It includes UI elements such as toggle buttons to switch between candlestick and OHLC series and a dropdown to change the data source. It then uses the SciChartReact component and nested overview to render the chart and its overview panel.
-   **javascript-candlestick-chart.jpg**: This image preview file provides a snapshot of the chart as rendered by the example.

## Customization

Key configuration options include:

-   **Data Source**: The chart can display either random data or data fetched from a Binance API by changing the data source parameter.
-   **Axis Formatting**: Price values are formatted with two decimal places and a dollar prefix, while the time axis is set up to display DateTime values. The volume axis is hidden and scales independently.
-   **Chart Series Styles**: Colors and brush styles are configured for the candlestick series (with distinct styling for up- and down-candles) as well as for moving average lines.
-   **Interactivity**: The chart includes several modifiers such as zoom extents, mouse wheel zoom, and cursor tooltips that display detailed information including open, high, low, close values.

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
