# Pie Chart Example

## Overview

This example demonstrates how to create an animated pie chart using SciChart.js. The example visualizes the market share of mobile phone manufacturers in 2022 with gradient-colored pie segments and a customized legend. Implementations for Angular, React, and Vanilla JavaScript are provided.

## Technologies Used

-   SciChart.js
-   Angular (standalone component using scichart-angular)
-   React (using SciChartReact)
-   Vanilla JavaScript/TypeScript

## Code Explanation

-   **Angular Implementation (angular.ts)**: The Angular file defines a standalone component that imports the SciChart Angular component. The chart is initialized by passing the `drawExample` function to the `[initChart]` binding.
-   **React Implementation (index.tsx)**: The React component uses `SciChartReact` to render the chart. It applies styling and includes a heading that describes the chart.
-   **Common Chart Creation (drawExample.js/ts)**: These files contain the main logic to create the pie chart. The function:
    -   Initializes a SciChartPieSurface with a specified theme and pie type.
    -   Configures animations, legend display (horizontal orientation and bottom-left placement), and series spacing.
    -   Transforms a static dataset (mobile phone manufacturers and their market share percentages) into pie segments with gradient color fills and optional radius adjustments for visual emphasis.
-   **Vanilla JavaScript Implementation (vanilla.js/ts)**: These files demonstrate how to set up and clean up the chart in a Vanilla JS/TS context by calling the same `drawExample` function and managing the chart lifecycle.
-   **Supporting Assets**: An image file named `javascript-pie-chart.jpg` is included, which likely serves as a preview or thumbnail for the example.

## Customization

Key configuration options in this example include:

-   **Theme and Colors**: The chart uses a predefined theme (`appTheme.SciChartJsTheme`) and specific gradient color options for each pie segment.
-   **Animation**: The chart and legend animations are enabled for smooth rendering.
-   **Legend Configuration**: Legend orientation is set to horizontal with a bottom-left placement.
-   **Pie Segments**: Each segment is customized with a relative radius adjustment and gradient fill using a linear gradient defined by start and end points. Labels are conditionally displayed based on the segment value.

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
