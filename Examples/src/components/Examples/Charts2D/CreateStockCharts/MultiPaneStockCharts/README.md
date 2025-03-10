# Multi Pane Stock Charts

## Overview

This example demonstrates how to create a multi-pane stock chart application using SciChart.JS. The example displays several synchronized charts including a main price (candlestick) chart, a MACD indicator chart, an RSI indicator chart, and an overview chart for easy navigation. Implementations for Angular, React, and Vanilla JavaScript/TypeScript are provided in the example.

## Technologies Used

-   **SciChart.JS** – High performance charting library.
-   **Angular** – Utilized via the standalone Angular component (`angular.ts`) and the ScichartAngularComponent.
-   **React** – Implemented using TSX files with the SciChartReact component and ChartGroupLoader.
-   **Vanilla JavaScript / TypeScript** – The chart initialization and configuration logic is provided in both JavaScript (`drawExample.js`) and TypeScript (`drawExample.ts`) versions.
-   Various SciChart APIs such as `SciChartSurface`, `CategoryAxis`, `NumericAxis`, renderable series (Candlestick, FastLine, FastBand, FastColumn, FastMountain), and modifiers (ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier, RolloverModifier).

## Code Explanation

-   **angular.ts**: This file defines an Angular component that utilizes the `scichart-angular` component. It creates multiple chart instances by invoking functions from the shared Charts Initialization API. Each chart (price, MACD, RSI, and overview) is initialized separately, and the overview chart is only created once the main charts are ready. The function `onChartInit` manages the assignment of each chart’s SciChartSurface instance and triggers the configuration synchronization.
-   **drawExample.js & drawExample.ts**: These files contain the core API for initializing and configuring the charts. They define functions to draw the price chart, MACD chart, RSI chart, and the overview chart. Key functionalities include:
    -   Fetching and slicing trading data.
    -   Setting up axes (category and numeric) with specific styling and auto-range settings.
    -   Creating data series such as OHLC for candlestick rendering, moving averages with `XyMovingAverageFilter`, and volume using column series with a custom palette provider.
    -   Adding annotations (e.g., a watermark annotation on the price chart) and chart modifiers (zoom, pan, mouse-wheel zoom, and rollover modifiers with custom tooltip templating).
    -   Grouping charts using `SciChartVerticalGroup` to synchronize visible ranges across panes.
-   **index.tsx**: The React implementation sets up a collection of SciChartReact components. It loads the price chart, MACD chart, and RSI chart in individual panels, and conditionally displays the overview chart once the main price chart is initialized. The React components rely on the same Charts Initialization API defined in the shared drawExample files.
-   **Image File (javascript-multi-pane-stock-charts.jpg)**: This file is an image asset associated with the example, likely used for thumbnail or documentation purposes.

## Customization

The example provides several configuration options:

-   **Chart Themes and Styles**: The charts use a custom theme provided via the `appTheme` object, which sets colors for brushes, strokes, and other visual elements.
-   **Data Series Calculations**: Moving Averages (MA 50 Low and MA 200 High) are calculated using `XyMovingAverageFilter`. The MACD and RSI indicators are computed from the trading data arrays using custom averaging functions.
-   **Annotations and Modifiers**: A watermark annotation is added to the price chart, and several modifiers (ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier, and RolloverModifier) are configured for interactive chart navigation.
-   **Axis Synchronization**: The example synchronizes the visible range of all charts using subscriptions to the `visibleRangeChanged` events of the X-axes in each chart. This ensures that when the user zooms or pans on one chart, the other charts update accordingly.

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
