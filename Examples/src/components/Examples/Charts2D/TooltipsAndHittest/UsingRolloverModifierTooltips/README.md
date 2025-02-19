# Using Rollover Modifier Tooltips Example

## Overview

This example demonstrates how to use the SciChart.js RolloverModifier to display custom tooltips on a line chart. It shows how to configure and customize tooltip content and legend appearance for multiple data series. The example is implemented across multiple frameworks including Angular, React, and Vanilla JavaScript/TypeScript.

## Technologies Used

-   **SciChart.js** – Core charting library
-   **Angular** – Example provided in Angular using a standalone component
-   **React** – Example provided in TSX format using the SciChartReact component
-   **Vanilla JavaScript/TypeScript** – Standalone implementations
-   **ExampleDataProvider & AppTheme** – Utilities for generating sample Fourier series data and applying theme colors

## Code Explanation

-   **drawExample (drawExample.js / drawExample.ts):** This is the main function that creates a SciChartSurface with Numeric X and Y axes. It adds three FastLineRenderableSeries populated with Fourier series data. The function also configures the RolloverModifier with custom tooltip settings such as showing a vertical line, setting stroke thickness and color, and overriding the default tooltip templates with custom functions (`getTooltipDataTemplate` and `getTooltipLegendTemplate`). Customization per-series is performed by setting properties like `tooltipTitle`, `tooltipTextColor`, and `tooltipColor` on the series' `rolloverModifierProps`.
-   **Angular Implementation (angular.ts):** An Angular standalone component imports the SciChartAngular component and utilizes the `drawExample` function to initialize the chart.
-   **React Implementation (index.tsx):** A React component uses the `SciChartReact` component and passes the `drawExample` initializer to create the chart. This demonstrates how SciChart.js can be integrated into React applications.
-   **Vanilla JavaScript/TypeScript Implementations (vanilla.js, vanilla.ts):** These files call the `drawExample` function on a DOM element (with id "chart") and provide a cleanup function to delete the chart when necessary.
-   **Image File (javascript-chart-rollovermodifier-tooltips.jpg):** This is a screenshot of the rendered chart showing the customized rollover tooltips.

## Customization

The example highlights several key configuration options:

-   **Rollover Line:** Configurable via `showRolloverLine`, `rolloverLineStrokeThickness`, and `rolloverLineStroke` to control the appearance of the vertical line following the cursor.
-   **Tooltip Templates:** Custom functions `getTooltipDataTemplate` and `getTooltipLegendTemplate` override the default tooltip and legend display to show formatted X and Y values along with series names.
-   **Per-Series Customization:** Individual series properties can be customized by setting `rolloverModifierProps` to change tooltip titles, text colors, and marker colors.
-   **Additional Modifiers:** The example also demonstrates integration with other chart modifiers like `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` for interactive navigation.

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
