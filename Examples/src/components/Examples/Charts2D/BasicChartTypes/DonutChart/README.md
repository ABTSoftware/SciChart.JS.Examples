# Donut Chart Example

## Overview

This example demonstrates how to create a customizable donut chart using SciChart.js. The example includes implementations for Angular, React, and Vanilla JavaScript/TypeScript. It visualizes market share data of internet browsers in a donut chart with animated transitions and a stylized legend.

## Technologies Used

-   **SciChart.js** for charting capabilities
-   **Angular** (using scichart-angular component)
-   **React** (using scichart-react component)
-   **Vanilla JavaScript/TypeScript**
-   JavaScript ES modules and TypeScript for type safety

## Code Explanation

-   **angular.ts**: The Angular entry point defines a standalone component that uses the `ScichartAngularComponent` to initialize the chart by calling the common `drawExample` function.
-   **drawExample.js / drawExample.ts**: These files contain the core chart creation logic. They create a `SciChartPieSurface` configured as a donut chart. Key properties set include the donut hole radius (relative sizing), animation options, series spacing, and legend configuration (vertical orientation placed at the top left). The data for the pie segments represents market share percentages of various browsers. Each segment is styled using linear gradients and optional radius adjustments.
-   **index.tsx**: The React implementation utilizes the `SciChartReact` component to render the chart. A placeholder title is added for context, and the same `drawExample` function is used to initialize the chart.
-   **vanilla.js / vanilla.ts**: These files demonstrate the Vanilla JavaScript/TypeScript usage. They call the `drawExample` function on an element with id "chart" and provide a cleanup function to delete the chart when needed.

## Customization

Key configuration options in this example include:

-   **Donut Type and Hole Radius**: The chart type is set to donut with a relative hole radius of 0.6.
-   **Animation**: Both the chart and legend animations are enabled, providing smooth transitions on load.
-   **Series Spacing**: A custom spacing of 10 is applied between series.
-   **Legend Configuration**: The legend is displayed with vertical orientation and placed at the top left.
-   **Pie Segment Styling**: Each pie segment is configured with a gradient fill, label styling, and an optional radius adjustment to emphasize specific segments.

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
