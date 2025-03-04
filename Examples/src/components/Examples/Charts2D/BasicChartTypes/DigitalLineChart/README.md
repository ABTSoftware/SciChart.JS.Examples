# Digital Line Chart Example

## Overview

This example demonstrates how to create a digital line chart using SciChart.js. The chart renders a digital line series with smooth animations and interactive modifiers. Implementations are provided for React (TSX), Angular (TS), and Vanilla JavaScript/TypeScript.

## Technologies Used

-   **SciChart.js**: High-performance charting library for JavaScript
-   **Angular**: Demonstrated in the Angular implementation (angular.ts)
-   **React**: Implemented via a React component (index.tsx)
-   **Vanilla JavaScript/TypeScript**: Basic implementation provided with vanilla.js and vanilla.ts
-   **Additional Modules**: Uses components such as NumericAxis, FastLineRenderableSeries, XyDataSeries, ScaleAnimation, EllipsePointMarker, and interactive modifiers like ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier from SciChart.

## Code Explanation

-   **drawExample.js/ts**: This file contains the main logic. It creates the SciChartSurface, sets up X and Y axes, and generates data using a RandomWalkGenerator. A FastLineRenderableSeries is added with the `isDigitalLine` property enabled to render a digital line. The chart is further enhanced with an EllipsePointMarker and a ScaleAnimation. Interactive modifiers for zooming and panning are also added, and the chart zooms to fit the data.
-   **angular.ts**: The Angular component imports ScichartAngularComponent and uses the `drawExample` function to initialize the chart within an Angular application.
-   **index.tsx**: The React component wraps the `drawExample` function through the SciChartReact component, integrating the chart into a React application.
-   **vanilla.js/ts**: These files demonstrate a plain JavaScript/TypeScript approach, where the `drawExample` function is called with a target DOM element to create and later dispose of the chart.

## Customization

Key configuration options include:

-   **Digital Line Style**: The `isDigitalLine` flag converts the line series into a digital line, with stroke settings defined (color: appTheme.VividPink, thickness: 3).
-   **Point Markers**: An EllipsePointMarker is configured with defined width, height, fill, and stroke properties.
-   **Animation**: ScaleAnimation is used with a duration of 500ms and a fade effect, enhancing the visual experience during rendering.
-   **Interactive Modifiers**: ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier are added to provide users with a rich interactive experience.
-   **Data Generation**: The RandomWalkGenerator (seed: 1337, 25 data points) simulates dynamic data series.

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
