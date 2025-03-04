# Impulse Chart Example

## Overview

This example demonstrates how to create a dynamic impulse chart using SciChart.JS. It showcases implementations in Angular, React, and Vanilla JavaScript/TypeScript. The impulse chart visualizes data points using the Fast Impulse Renderable Series with an animated wave effect.

## Technologies Used

-   SciChart.JS core library
-   Angular (with scichart-angular component)
-   React (using SciChartReact component)
-   Vanilla JavaScript / TypeScript
-   SciChart theme and various chart modifiers (ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier)

## Code Explanation

-   **drawExample.js/ts**: This file contains the main logic to create the chart. It initializes the SciChartSurface, adds numeric axes, creates a data series using XyDataSeries, and renders the Fast Impulse Renderable Series. The impulse series is styled with a vivid pink fill, a stroke thickness of 2, a small ellipse point marker, and a wave animation (500ms duration, 200ms delay, with a fade effect). Chart modifiers for zoom and pan functionality are also added.
-   **angular.ts**: Implements the Angular version of the example using a standalone component that imports the SciChartAngularComponent and sets its initChart property to the drawExample function.
-   **index.tsx**: Implements the React version. It uses the SciChartReact component to initialize the chart with the drawExample function and applies custom wrapper styles.
-   **vanilla.js/ts**: Provide a simple implementation for plain JavaScript/TypeScript usage. These files demonstrate how to create the chart on a specified DOM element by calling the drawExample function and include a cleanup function to delete the chart.

## Customization

Key configuration options in the example include:

-   **Animation settings**: The impulse series uses a wave animation with a duration of 500ms, a delay of 200ms, and a fade effect.
-   **Chart styling**: The chart uses the SciChartJsTheme from the theme configuration and applies a vivid pink fill to the impulse series.
-   **Axes customization**: Both X and Y axes are added with axis titles and configured with a growBy option on the Y-axis to provide spacing.
-   **Modifiers**: ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier are added to enable interactive chart manipulation.

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
