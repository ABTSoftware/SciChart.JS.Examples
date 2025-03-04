# Chart Legends API Example

## Overview

This example demonstrates how to add and customize a chart legend using SciChart.JS. The example shows a chart with multiple line series, where a legend is added via the LegendModifier and can be dynamically configured. The example includes both Vanilla JavaScript (and TypeScript) as well as a React implementation. In the React version, a toolbar is provided to adjust legend placement, orientation, and visibility of checkboxes and series markers on the legend.

## Technologies Used

-   SciChart.JS core library
-   LegendModifier, NumericAxis, XyDataSeries, FastLineRenderableSeries
-   Material-UI (MUI) for React UI components
-   React (with TypeScript in the TSX file)

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files set up the SciChartSurface by creating numeric X and Y axes, adding four Fourier series line renderable series to the chart, and applying a LegendModifier with initial configuration (show legend, placement in the top left, vertical orientation, and options to show checkboxes and series markers).
-   **index.tsx**: This React component integrates the chart example using the SciChartReact component. It includes a toolbar built with Material-UI components (Checkboxes and select drop-downs) that allow the user to modify various legend properties at runtime. The component initializes the chart and holds references to the SciChartSurface and LegendModifier for dynamic updates to the legend configuration.
-   **javascript-chart-legends.jpg**: An image asset provided as part of the example resources.

## Customization

Key configuration options include:

-   **Legend Placement**: Configurable via the `ELegendPlacement` property (TopLeft, TopRight, BottomLeft, BottomRight).
-   **Legend Orientation**: Can be set to either Vertical or Horizontal using the `ELegendOrientation` property.
-   **Legend Visibility Options**: Options to toggle the display of the legend, visibility checkboxes, and series markers are available and can be controlled dynamically via the toolbar in the React implementation.
-   **Series Styling**: Each line series is configured with a stroke thickness of 3 and an automatic stroke color.

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
