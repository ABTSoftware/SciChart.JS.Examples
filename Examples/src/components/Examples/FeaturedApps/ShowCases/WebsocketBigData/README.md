# Websocket Big Data

## Overview

This example demonstrates a high-performance, real-time chart that streams large amounts of data over a WebSocket connection. The example showcases multiple implementations including an Angular component and a React component. Both implementations use SciChart.JS to render various chart types (Line, Column, Stacked Mountain, Band, Scatter, and Candlestick) and update them dynamically as new data is received via Socket.IO.

## Technologies Used

-   **SciChart.JS**: High-performance charting library for rendering financial and scientific data.
-   **Socket.IO**: For establishing real-time WebSocket connections to stream data.
-   **Angular**: The Angular implementation uses the standalone component approach and Angular Material for UI controls.
-   **React**: The React version makes use of React hooks and the SciChartReact component for rendering the chart.
-   **Material UI / Angular Material**: For user interface elements such as sliders, radio buttons, and buttons to control chart settings.

## Code Explanation

-   **Angular Component (angular.ts)**: This file defines the `RealtimeBigDataShowcaseComponent` which initializes a SciChart chart using the `ScichartAngularComponent`. It provides a configuration panel with sliders and radio buttons that let users adjust settings like series count, initial points, points per update, and data streaming interval. The component listens for user actions to start and stop real-time updates, and updates the chart settings by invoking methods on the chart control.

-   **Chart Drawing Logic (drawExample.js/drawExample.ts)**: These files contain the shared logic for creating and updating the chart. The functions in these files are responsible for setting up the chart (axes, renderable series, and data series), pre-populating initial data, and appending new data as it is streamed from the WebSocket. They also handle performance measurement by computing average load and render times, and updating messages that inform the user about the current performance metrics.

-   **React Component (index.tsx)**: This file implements the React version of the example using functional components and React hooks. It sets up the SciChartReact component, manages state for chart settings and performance messages, and provides a control panel using Material UI components. The React version also supports dynamic reconfiguration and uses a similar chart initialization function as the Angular implementation.

-   **Supporting Asset (javascript-streaming-data.jpg)**: An image asset is included which may be used for documentation or visual representation of the streaming data process.

## Customization

The example provides several key configuration options that can be adjusted by the user:

-   **Series Type**: Choose between Line, Column (with stacked axes), Stacked Mountain, Band, Scatter, and Candlestick charts.
-   **Series Count**: Number of data series rendered on the chart.
-   **Initial Points**: The number of points initially populated on the chart.
-   **Points on Chart**: Maximum number of points maintained on the chart at any one time.
-   **Points Per Update**: Number of new points added per update cycle.
-   **Send Data Interval (ms)**: The interval in milliseconds at which new data is streamed from the server via WebSocket.

These settings allow you to experiment with different performance characteristics and visual styles according to your data volume and update frequency requirements.

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
