# Stacked Mountain Chart

## Overview

This example demonstrates a Stacked Mountain Chart using the SciChart.JS library. It shows how to create a chart with multiple stacked mountain series and includes implementations for Angular, React, and Vanilla JavaScript. The Angular and React versions leverage framework-specific components to initialize and control the chart, including a toggle for enabling 100% stacked mode in the React version.

## Technologies Used

-   [SciChart.JS](https://www.scichart.com/javascript-chart-features/) for high performance JavaScript charts
-   Angular (standalone component using scichart-angular)
-   React (using scichart-react and Material UI for UI controls)
-   Vanilla JavaScript

## Code Explanation

-   **Angular Implementation (angular.ts):** This file defines an Angular standalone component that uses the `ScichartAngularComponent` to initialize the chart via the `drawExample` function. The Angular approach demonstrates how to integrate SciChart.JS in an Angular environment.

-   **Chart Drawing Logic (drawExample.js / drawExample.ts):** These files contain the core logic to create a SciChartSurface. They set up numeric axes, create four stacked mountain series (representing Apples, Pears, Bananas, and Oranges) using provided data, and group them in a `StackedMountainCollection`. A `WaveAnimation` is applied to the collection, and various interactivity modifiers such as zooming and panning, as well as a legend, are added to the chart.

-   **React Implementation (index.tsx):** This file provides a React component for the example. It utilizes the `SciChartReact` component to render the chart with the same `drawExample` initialization. Additionally, it incorporates a Material UI Switch that toggles the chart’s 100% stacked mode by updating the `isOneHundredPercent` property of the Stacked Mountain Collection and triggering a zoom extents recalculation.

-   **Supporting Files:** Other files include data sources for the chart and a JPEG image which is likely used as a preview or thumbnail for the example.

## Customization

Key configuration options in this example include:

-   **Animation:** The `WaveAnimation` is set with a duration of 600ms and a fade effect.
-   **Chart Appearance:** Fill and stroke colors are customized using the app theme (e.g., VividPurple, VividPink, VividSkyBlue, VividOrange, and PaleSkyBlue).
-   **Axes Configuration:** Both x and y axes are configured with a label precision of 0.
-   **Interactivity:** Chart modifiers such as `ZoomExtentsModifier`, `ZoomPanModifier`, and `MouseWheelZoomModifier` are added for user interaction.
-   **Legend:** A legend is added with a vertical orientation and placed in the Top-Left corner.
-   **100% Stacked Mode:** In the React version, a Material UI Switch allows toggling the `isOneHundredPercent` property on the Stacked Mountain Collection.

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
