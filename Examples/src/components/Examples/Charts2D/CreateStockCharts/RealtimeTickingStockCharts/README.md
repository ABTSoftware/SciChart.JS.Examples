# Realtime Ticking Stock Charts

## Overview

This example demonstrates a real-time stock chart that updates continuously, displaying candlestick or OHLC series along with volume and large trade indicators. It integrates live crypto market data from Binance (and can also generate random data) and showcases how to combine SciChart.JS with React to create dynamic, interactive financial charts.

## Technologies Used

-   **React** with TypeScript (TSX)
-   **SciChart.JS** for high-performance charting
-   **RxJS** for handling real-time data streams
-   **websocket-ts** for WebSocket connectivity to Binance
-   **@mui/material** for UI components and toolbar controls

## Code Explanation

-   **binanceSocketClient.ts**: Implements a simple WebSocket client to connect to Binance endpoints. It provides methods to subscribe to candle data, trade data, and even generate random candle streams. The module converts raw WebSocket messages to structured price bar objects using helper functions and RxJS operators (e.g., combineLatest, scan).

-   **createCandlestickChart.ts**: Sets up the SciChart surface and configures the axes, series, and annotations. It creates a candlestick renderable series based on an OhlcDataSeries and registers additional series for OHLC, moving averages, volume (with a custom palette provider), and large trade bubbles. It also defines helper functions to update chart data and manage viewport changes.

-   **VolumePaletteProvider.ts**: A custom palette provider that colors the volume column series based on whether the corresponding candle is up or down. It inspects the open and close values from the OhlcDataSeries to decide which color to use.

-   **index.tsx**: This is the main React component that ties everything together. It initializes the chart via the `drawExample` function and sets up interactive controls. Users can switch between candlestick and OHLC series and choose different data sources (Binance.com, Binance.us, or Random). The component manages subscriptions to real-time data streams and updates the chart accordingly.

-   **javascript-realtime-ticking-stock-charts.jpg**: A sample image provided to visually represent the example.

## Customization

Key configuration options include:

-   **Chart Appearance**: Colors and themes are set using an `appTheme`, which controls the foreground, brush colors, and more. The chart style (candlestick vs. OHLC) can be toggled via UI controls.
-   **Animation and Viewport**: The x-axis visible range is animated when new candles are appended, and the moving average filters update automatically as new data arrives.
-   **Real-Time Data Source**: The example allows switching between live Binance data streams and a random data generator for demonstration purposes. WebSocket connections are managed through RxJS observables, providing a continuous stream of updated price bars.
-   **Volume and Large Trade Visualization**: Custom palette providers (VolumePaletteProvider and LargeTradesPaletteProvider defined inline in the chart creation file) are used to render volume bars and bubble markers for large trades, adding an extra layer of data insights.

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
