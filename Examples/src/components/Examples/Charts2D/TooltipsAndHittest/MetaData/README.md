# Metadata Example

## Overview

This example demonstrates how to create a line chart with metadata attached to each data point. The metadata objects drive custom coloring, labeling, tooltip information, and selection behavior. The example includes implementations for React (using TSX), Vanilla JavaScript, and TypeScript, and shows how to integrate SciChart.JS charts into different frameworks.

## Technologies Used

-   SciChart.JS for high performance charting
-   SciChartReact for the React implementation
-   TypeScript and JavaScript
-   WebAssembly (via the SciChartSurface creation)

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the core chart setup and rendering logic. They initialize the SciChartSurface, configure numeric axes with a grow-by range, and create an XyDataSeries that includes a metadata object for each data point. A spline line renderable series is then created with custom configurations:

    -   A palette provider uses metadata to override point colors (with a special color for selected points).
    -   A data label provider routes metadata labels to the chart’s data labels and customizes label color based on metadata.
    -   A rollover modifier is configured for interactive tooltips that display both the data point values and metadata properties.
    -   A text annotation adds a title to the chart.

-   **index.tsx**: This file contains a React component that wraps the chart using the SciChartReact component. It initializes the chart by calling the drawExample function and applies a CSS class for styling.

-   **vanilla.js / vanilla.ts**: These files provide a plain JavaScript (and TypeScript) implementation that creates the chart on a root element with the id "chart". They demonstrate how to initialize the chart and how to obtain a destructor function to clean up resources.

-   **javascript-chart-metadata.jpg**: An image asset likely used for documentation or preview purposes, illustrating the final chart appearance.

## Customization

Key configuration options in this example include:

-   **Point Appearance**: The selection of colors is driven by metadata properties (`pointColor` and `isSelected`). The palette provider overrides both the stroke and fill colors of the point markers.
-   **Data Labels**: The data label provider extracts labels from the metadata and applies custom styles (font family, size, and padding). It also customizes the label color based on the metadata.
-   **Tooltips and Rollover Modifier**: The rollover modifier has configurable properties, such as marker color and tooltip color. The tooltipDataTemplate function uses metadata to display additional information for each data point.
-   **Annotations**: A text annotation is added to display the chart title, which is positioned relatively within the chart area.

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
