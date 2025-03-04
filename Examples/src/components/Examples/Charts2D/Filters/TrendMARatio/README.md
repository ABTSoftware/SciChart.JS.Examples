# Trend MA Ratio Example

## Overview

This example demonstrates dynamic data transforms using SciChart.js. It creates a chart that displays an original random walk series and applies several filters including moving averages, a linear trendline, a scale offset, and finally a ratio filter. Implementations for Angular, React, and Vanilla JavaScript are provided.

## Technologies Used

-   SciChart.js Library
-   Angular (using the scichart-angular component)
-   React (using the SciChartReact component)
-   Vanilla JavaScript & TypeScript
-   RandomWalkGenerator and SciChart Filters API for dynamic transforms

## Code Explanation

-   **drawExample (drawExample.js / drawExample.ts):** This function initializes a SciChartSurface with a theme and sets up axes. It creates an original data series from a random walk and applies dynamic transforms: two moving average filters (lengths 10 and 20), a scale offset filter, a linear trend filter, and a ratio filter (comparing the original to the offset series). An annotation is added to explain that SciChart.js supports dynamic transforms. Chart modifiers for zooming and panning are also added.
-   **Angular (angular.ts):** Defines an Angular standalone component that uses the scichart-angular component. The component passes the drawExample callback to initialize the chart.
-   **React (index.tsx):** Provides a React functional component that uses the SciChartReact component to call drawExample and render the chart.
-   **Vanilla (vanilla.js and vanilla.ts):** Both files show how to invoke the drawExample function in a plain JavaScript/TypeScript environment and obtain a destructor function for clean-up.
-   **Supporting Files:** The example also includes an image file (javascript-trend-ma-ratio.jpg) and imports from shared resources (such as theme definitions and data generators) that are part of the SciChart.JS examples repository.

## Customization

-   **Chart Styles:** Stroke colors, thickness, and dash arrays are defined using the imported theme (appTheme) and are applied to each renderable series.
-   **Axis and Visible Range:** The ratio axis has a visible range of (-20, 20), which can be adjusted based on the desired display.
-   **Filter Parameters:** The moving average filters have configurable lengths (10 and 20). The scale offset filter’s offset and scale are also set and can be modified as needed to experiment with different transformations.

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
