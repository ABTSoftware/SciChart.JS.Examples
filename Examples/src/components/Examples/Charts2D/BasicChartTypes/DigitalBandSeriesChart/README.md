# Digital Band Series Chart

## Overview

This example demonstrates how to create a Digital Band Series Chart using SciChart.js. The chart displays a band series with a digital line appearance. The example is implemented in multiple frameworks including React (TSX), Angular (TS), and Vanilla JavaScript/TypeScript.

## Technologies Used

-   **SciChart.js** – Core charting library
-   **Angular** – Example implementation via scichart-angular
-   **React** – Example implementation via scichart-react
-   **Vanilla JavaScript/TypeScript** – Standalone implementation
-   Various SciChart.js components such as NumericAxis, FastBandRenderableSeries, XyyDataSeries, and SweepAnimation

## Code Explanation

-   **drawExample (drawExample.js / drawExample.ts)**: The main function that creates the SciChartSurface, sets up the X and Y numeric axes, and generates sine and cosine based data points for the band series. It creates a FastBandRenderableSeries with digital line styling by using a special data series type (XyyDataSeries). The series is styled with colors from the appTheme and features a SweepAnimation with a duration of 800 milliseconds. Additional interactivity is added through modifiers like ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier.
-   **Angular Implementation (angular.ts)**: Defines an Angular component that uses the scichart-angular wrapper component. It passes the drawExample function to initialize the chart within the component template.
-   **React Implementation (index.tsx)**: Uses the SciChartReact component to initialize and render the chart. The drawExample function is provided via the initChart property to set up the chart on mount.
-   **Vanilla Implementation (vanilla.js / vanilla.ts)**: Contains a self-invoking function to create the chart on a designated HTML element with the id 'chart' and provides a destructor function for cleanup.
-   **javascript-digital-band-chart.jpg**: An image file that likely provides a preview or snapshot of the rendered digital band series chart.

## Customization

Key configuration options that can be customized include:

-   **Animation**: The band series utilizes a SweepAnimation with a duration set to 800 ms. Adjust this value to modify the speed of the animation.
-   **Series Styling**: The FastBandRenderableSeries is configured with specific stroke thickness, fill colors, and stroke colors using theme values. The colors (e.g., VividOrange and VividSkyBlue with an added transparency of "33") can be modified to change the visual appearance.
-   **Data Generation**: The example generates data for X, Y, and Y1 using sine and cosine functions. You can adjust the number of points, step size, or the mathematical functions to explore different data patterns.

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
