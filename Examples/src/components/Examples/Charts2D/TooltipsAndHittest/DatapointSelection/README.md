# Data Point Selection Example

## Overview

This example demonstrates how to implement interactive data point selection using SciChart.JS. It renders multiple spline line series with elliptical point markers and uses a data point selection modifier to visually highlight and customize selected data points. The example includes a React implementation (using TSX) along with corresponding JavaScript and TypeScript examples, showing how to integrate SciChart’s selection functionality into your web applications.

## Technologies Used

-   SciChart.JS (Charting Library)
-   SciChart React (via scichart-react)
-   TypeScript / JavaScript
-   React
-   CSS for basic styling

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the core logic of the example. They create a SciChartSurface with numeric X and Y axes, generate random data for several series, and add multiple SplineLineRenderableSeries to the surface. Each series is configured with an elliptical point marker, a palette provider for visual feedback on selected points, and a data label provider that displays details (x,y values) when a point is selected. Additionally, text annotations are added to instruct the user on selecting points and a legend is included via the LegendModifier.
-   **index.tsx**: This file defines the main React component that uses the SciChartReact component to initialize the chart. It manages state for the selected data points and displays them in a side panel. The component also utilizes hooks (useRef, useState, and a container size hook) to adapt the chart view and demonstrate how to capture selection events through the DataPointSelectionModifier’s `selectionChanged` event.
-   **javascript-datapoint-selection.jpg**: A JPEG image provided in the example directory, likely used for thumbnail or documentation purposes.

## Customization

-   **Theming**: The example uses the `appTheme` for setting the chart’s visual appearance including colors for axes, stroke, and fill.
-   **Series Configuration**: Each spline series is configured with options such as `strokeThickness`, point marker style (using ellipse markers with customizable fill and stroke), and an attached palette provider for selected points to override default visuals when a point is selected.
-   **Data Labels**: Optional data labels are provided via the `LineSeriesDataLabelProvider` that conditionally show the formatted x and y values of selected points.
-   **Annotations and Legend**: Text annotations provide usage instructions and a legend is added to the chart for better context. These can be customized in terms of text, font size, opacity, and placement.
-   **Selection Modifier**: The `DataPointSelectionModifier` is added to the chart modifiers, and it subscribes to selection changes. The callback in this modifier passes the selected data points to the React component, which then renders them in a table. This behavior can be tweaked to programmatically set points or alter user interaction patterns.

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
