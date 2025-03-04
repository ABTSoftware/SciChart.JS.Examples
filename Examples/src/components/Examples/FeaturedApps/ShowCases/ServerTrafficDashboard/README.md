# Server Traffic Dashboard

## Overview

The Server Traffic Dashboard example demonstrates how to build a multi-chart interactive dashboard using SciChart.JS with React and TypeScript. The example displays real-time simulated server traffic using several coordinated charts including a main time series (mountain series) chart, a URL statistics stacked column chart, a server load chart with grid layout capability, and region statistics presented both as a column chart and as a pie chart. The dashboard also features customization options such as visible range synchronization, threshold filtering for average request duration, and interactive legends.

## Technologies Used

-   React with TypeScript (TSX)
-   SciChart.JS and SciChart-React
-   Material-UI for the configuration dialog and UI components
-   SciChart chartBuilder API for registering tooltip templates and functions

## Code Explanation

-   **after-all-charts-init.ts**: Coordinates the initialization of all charts by synchronizing their visible ranges and setting up data filtering. It applies initial animations for visible range changes and subscribes to server and location selection events to update chart data.
-   **chart-configurations.ts**: Registers common tooltip data templates using the chartBuilder API to ensure consistent rollover tooltips across different charts.
-   **chart-types.ts**: Defines TypeScript types and tuples for the various SciChart configuration functions used throughout the dashboard.
-   **data-generation.ts**: Generates synthetic server traffic data including fields for timestamp, page, server, location, and request duration. It also provides helper functions to aggregate data for plotting.
-   **GridLayoutModifier.ts**: Implements a custom grid layout modifier to subdivide a chart (used in the server load chart) into a grid of sub-charts. It provides animations to switch between a single chart and a grid layout view.
-   **index.html**: Contains the basic HTML scaffold to load the bundled JavaScript of the example.
-   **index.tsx**: The main React component that brings together all charts. It sets up the dashboard layout, initializes each chart (main chart, URL statistics chart, server load chart, region statistics column chart, and pie chart), and manages UI controls such as the configuration dialog and toggle switches for synchronization, percentage mode, and grid layout.
-   **main-chart-config.ts**: Creates the main chart displaying the number of requests over time with a mountain series. It includes configuration for axes, animations, tooltips, and a custom data label that displays average request duration if it exceeds a configurable threshold.
-   **ModifierGroup.ts**: Provides a group modifier which automatically synchronizes mouse move and leave events across the charts. This helps in keeping tooltips and cursors coordinated across multiple chart surfaces.
-   **Overview.tsx**: Defines an overview component that creates a simplified copy of the main mountain series chart used as a contextual overview for zooming and panning.
-   **page-statistics-chart-config.ts**: Sets up a stacked column chart that displays URL statistics. Each column represents a different page type and the chart supports both a normal view and a 100% stacked view.
-   **region-statistic-charts.ts**: Creates two interrelated charts – a column chart and a pie chart – to display server traffic distribution by region. It uses country flag icons (via inline SVGs) and custom palette providers for styling the segments.
-   **server-load-chart-config.ts**: Builds the server load chart which displays overlapping mountain series for each server. It integrates the grid layout modifier and offers interactive legend checkboxes to selectively show or hide individual server series.
-   **ThresholdSlider.tsx**: Implements a slider component that allows users to adjust the average request duration threshold for the main chart. The threshold determines when to display data labels on the chart.
-   **VisibleRangeSynchronizationManager.ts**: Provides a simple mechanism to synchronize the visible X-axis ranges of multiple charts. This manager subscribes to visible range changes and updates the corresponding ranges on other charts when synchronization is enabled.

## Customization

-   **Animation and Styling**: Various animations such as range animation on chart initialization and wave animations on series load are configured (e.g. in the main chart and stacked column chart). Colors, gradients, and marker styles are customized for each series.
-   **Threshold Filtering**: The main chart uses a configurable threshold (adjustable via the ThresholdSlider component) to determine when to show a data label for average request duration.
-   **Grid Layout Toggle**: The server load chart can switch between a combined view and a grid layout view using the GridLayoutModifier, with animations to fade in/out sub-charts.
-   **Visible Range Synchronization**: A toggle allows users to enable or disable synchronization of the X-axis visible ranges across the charts, ensuring consistent zooming and panning behavior.

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
