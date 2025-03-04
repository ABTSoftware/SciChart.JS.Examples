# Custom Filters Example

## Overview

This example demonstrates how to create and apply custom data filters in SciChart.JS. In particular, it shows how to use a custom filter (an aggregation filter) that transforms a data series into a frequency distribution histogram. The example is implemented for multiple frameworks including Angular and React, and it employs both JavaScript and TypeScript implementations.

## Technologies Used

-   SciChart.JS with high performance charting components
-   Angular (using the SciChartAngular component)
-   React (using the SciChartReact component)
-   TypeScript and JavaScript

## Code Explanation

-   **drawExample Files (JavaScript and TypeScript)**: Both files implement the main chart creation logic. They create a SciChart surface with two x-axes and two y-axes. A raw data series is generated using a simple incremental data approach. A custom filter is applied using the built-in `XyCustomFilter` with a Gaussian random multiplier. In addition, an `AggregationFilter` class is defined which extends `XyFilterBase` to calculate the frequency distribution (histogram) of the filtered data, based on a configurable bin width. Renderable series for scatter, line, and column charts are added to visualize the original data, the filtered data, and the frequency distribution respectively.
-   **Angular Component (angular.ts)**: This standalone Angular component integrates the SciChartAngular component. It passes the `drawExample` function as the initialization function for the chart, and starts/stops updates via exposed control methods.
-   **React Component (index.tsx)**: The React component uses the SciChartReact component. It initializes the chart by calling the `drawExample` function and starts and stops real-time updates using the provided control methods once the chart is mounted and before it is deleted.
-   **Supporting Files**: An image file (`javascript-custom-filters.jpg`) is included which likely provides a visual preview of the example result. Themes and application configurations are imported from a shared theme file.

## Customization

Key configuration options include:

-   **Data Generation**: The example simulates a straight-line data series with random fluctuations by employing the central limit theorem to approximate a normal distribution. The rate of data update is controlled by parameters such as `numberOfPointsPerTimerTick` (set to 500), `timerInterval` (10 milliseconds), and a maximum point count (`maxPoints`) of 100,000.
-   **Aggregation Filter**: The custom `AggregationFilter` class uses a configurable `binWidth` (default set to 5) to group y-values into bins and generate a histogram. Changing the bin width property will recalculate the aggregation filter output automatically.
-   **Chart Styles and Modifiers**: Various renderable series styles and axis configurations (like auto-range, titles, label precision) are set up. A legend modifier is added to the chart to display series information.

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
