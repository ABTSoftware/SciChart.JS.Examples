# Real Time Performance Demo

## Overview

This example demonstrates a high-performance real time data streaming chart using SciChart.JS. The demo continuously appends a large number of data points (1,000 per timer tick every 10 milliseconds) generated by a random walk algorithm and updates the chart in real time. Implementations for multiple frameworks are provided, including React (using TSX), Angular (using standalone components), and Vanilla JavaScript.

## Technologies Used

-   SciChart.JS (WebGL-based charting library)
-   Random Walk Data Generator
-   NumericAxis, FastLineRenderableSeries
-   Chart interactivity modifiers (e.g. RubberBandXyZoomModifier, MouseWheelZoomModifier, Drag Modifiers, ZoomExtentsModifier)
-   React, Angular, Vanilla JavaScript

## Code Explanation

-   **drawExample.js / drawExample.ts**: This file contains the main chart creation logic. A SciChartSurface is created with a single WebGL canvas for optimized performance. Numeric axes with auto-ranging are added along with three XyDataSeries and corresponding FastLineRenderableSeries. The series are rendered with high stroke thickness and custom colors. Interactive modifiers are added for zooming and panning when the update is paused. A RandomWalkGenerator is used to simulate real time data, appending 1,000 points every 10 milliseconds until a maximum number of points is reached. A statistics callback is set up to update metrics like data point count and FPS on each render.
-   **angular.ts**: Implements the Angular component using the SciChart Angular wrapper. The component template includes toolbar buttons for starting and stopping the real time updates, and binds to the chart provided by the drawExample function. The Angular component sets up the statistics callback so that live data point and FPS values are displayed.
-   **index.tsx**: Provides the React (TSX) version of the example using hooks. The React component uses the SciChartReact component to initialize the chart via the drawExample function. It manages its own state for the running status, data points count, and FPS, and provides start/stop controls using Material UI icons and buttons.
-   **vanilla.js / vanilla.ts**: These files demonstrate the Vanilla JavaScript/TypeScript implementation. They call the drawExample function on a DOM element with the id "chart", start the real time data updates, and provide a cleanup function to stop the updates and dispose of the chart.

## Customization

Key configuration options in this example include:

-   **numberOfPointsPerTimerTick**: Set to 1,000 points, representing the quantity of data appended on each timer tick.
-   **timerInterval**: The update timer is set to trigger every 10 milliseconds for high frequency rendering.
-   **maxPoints**: A limit (1e6 points) is defined to stop the demo after a maximum number of points is reached.
-   **Chart Appearance**: The series stroke thickness and colors are defined based on the provided theme configuration. Axes are set with auto-ranging to ensure all data is visible.

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
