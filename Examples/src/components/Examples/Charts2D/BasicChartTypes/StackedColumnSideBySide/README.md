# Stacked Column Side By Side

## Overview

This example demonstrates how to create a grouped column chart using SciChart.JS. It displays produce data (Tomato, Pepper, and Cucumber) sold in various years with each series rendered as a grouped (side by side) column. Implementations for multiple frameworks are provided in this example including React, Angular, and Vanilla JavaScript.

## Technologies Used

-   **SciChart.JS** – High performance charting library
-   **TypeScript / JavaScript** – For core logic and configuration
-   **Angular**, **React**, and **Vanilla JS** – Framework-specific integrations
-   **WaveAnimation** – For animating the series
-   SciChart components including SciChartSurface, NumericAxis, StackedColumnRenderableSeries, StackedColumnCollection, and various interactivity modifiers

## Code Explanation

-   **drawExample (drawExample.js / drawExample.ts)**: This file contains the core logic to create the SciChartSurface. It sets up the numeric X and Y axes, configures three different renderable series (one each for Tomato, Pepper, and Cucumber) with unique `stackedGroupId`s to display them side by side (grouped columns). Data labels are configured along with a wave animation (duration of 1000ms) for the collection. Interactive modifiers such as zoom extents, pan, mouse wheel zoom, and a legend are also added.
-   **angular.ts**: This Angular component imports the `drawExample` function and uses the `scichart-angular` component to initialize the chart.
-   **index.tsx**: This React component demonstrates how to integrate SciChart with React by utilizing the `SciChartReact` component with the `drawExample` initializer.
-   **vanilla.js / vanilla.ts**: These files show how to set up and create the chart in a Vanilla JavaScript or TypeScript environment. They call the `drawExample` function and include a cleanup (destructor) function to dispose of the chart when necessary.
-   **javascript-stacked-grouped-column-chart.jpg**: This image file likely shows a preview or screenshot of how the chart appears.

## Customization

Key configuration options in this example include:

-   **Data Labels and Style**: Labels are styled with a specific font size, family, and padding. Their color and positioning are also customizable.
-   **Animation**: The chart uses a WaveAnimation effect with a duration set to 1000ms and a fade effect enabled.
-   **Axes Customization**: The NumericAxis for both X and Y axes is set up with custom formats, tick intervals, and growBy margins for better spacing.
-   **Column Grouping**: The use of unique `stackedGroupId` values ensures that the columns are grouped side by side rather than stacked on top of each other.
-   **Interactivity**: ZoomExtents, ZoomPan, MouseWheelZoom, and a LegendModifier provide interactive functionality out of the box.

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
