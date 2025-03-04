# Text Series Chart Example

## Overview

This example demonstrates how to render a chart with text labels using tweet data. It creates a logarithmic X axis (labeled "Number of Tweets") and a numeric Y axis (labeled "Average Sentiment") and uses a text renderable series to display text from the tweet data. The example is implemented for multiple frameworks including Angular, React, and Vanilla JavaScript.

## Technologies Used

-   SciChart.JS (scichart)
-   Angular (scichart-angular)
-   React (scichart-react)
-   Vanilla JavaScript

## Code Explanation

The core logic of this example is contained in the `drawExample` function (provided in both JavaScript and TypeScript versions). This function creates a `SciChartSurface`, sets up a Logarithmic X axis with a log base of 2 and a Numeric Y axis with a defined visible range, and applies a theme from an external theme module. It then fetches tweet data from a remote API and populates an `XyTextDataSeries`. A `FastTextRenderableSeries` is used to render the text labels on the chart with custom font settings. Chart modifiers such as ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier are added to enable user interaction.

The Angular implementation (`angular.ts`) defines a standalone component using the `ScichartAngularComponent` and passes the `drawExample` function to initialize the chart.

The React implementation (`index.tsx`) leverages the `SciChartReact` component to initialize the chart within a React component.

The Vanilla JavaScript/TypeScript implementations (`vanilla.js` and `vanilla.ts`) simply call `drawExample` on an HTML element with the ID "chart" and provide a cleanup function to dispose of the chart when necessary.

An image file (`javascript-text-chart.jpg`) is also included to illustrate the expected output of the chart.

## Customization

Key configuration options in this example include:

-   **X Axis**: Configured as a LogarithmicAxis with a log base of 2, using significant figures for label formatting and a growBy range of 0 to 0.1.
-   **Y Axis**: Configured as a NumericAxis with a defined visible range of 0 to 1.01 and a label precision of 2.
-   **Data Labels**: Text labels are styled with Arial font at size 10 and have the `calculateTextBounds` option set to false.
-   **Chart Modifiers**: ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier are added to enable zooming and panning interactions.

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
