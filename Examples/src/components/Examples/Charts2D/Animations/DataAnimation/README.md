# Data Animation Example

## Overview

This example demonstrates dynamic data animation on a SciChart.JS chart. It continuously updates a scatter series with randomly modified data points that animate smoothly using a gradient color palette and easing functions. The example is implemented using Angular, React, and Vanilla JavaScript/TypeScript, showing how to integrate SciChart charting across different frameworks.

## Technologies Used

-   **SciChart.JS**: For creating high performance charts.
-   **Angular**: Uses the `scichart-angular` component for chart initialization.
-   **React**: Utilizes the `scichart-react` component to embed and manage the chart.
-   **Vanilla JavaScript/TypeScript**: Provides a framework-agnostic way to launch the chart via a simple script.
-   **SciChart Components**: Including `SciChartSurface`, `NumericAxis`, `XyDataSeries`, `FastLineRenderableSeries`, `EllipsePointMarker`, `ScatterAnimation`, and gradient palette configuration tools.

## Code Explanation

-   **drawExample (drawExample.js / drawExample.ts)**: This is the core function that creates the SciChartSurface, configures the X and Y numeric axes, and sets up a scatter series with an ellipse point marker and a gradient palette. It defines the animation behavior by generating random updates to the data and running a scatter animation using an easing function. A timer repeatedly calls the animation function to update the chart dynamically.
-   **angular.ts**: Contains an Angular component that imports the `ScichartAngularComponent` and uses the `drawExample` function to initialize the chart. It demonstrates how to integrate SciChart into an Angular application.
-   **index.tsx**: This React component uses the `SciChartReact` component to initialize and display the chart. It also handles cleanup by calling the stop update control when the component is deleted.
-   **vanilla.js / vanilla.ts**: These files provide a simple script that calls `drawExample` on a DOM element with the id "chart". They include a cleanup function to delete the chart when no longer needed.
-   **javascript-data-animation.jpg**: This image is likely a screenshot preview of the animated Data Animation example.

## Customization

Key configuration options include:

-   **Animation Duration**: The scatter animation runs over 1000 milliseconds.
-   **Update Interval**: Data is updated every 1200 milliseconds using a timer.
-   **Easing Function**: The animation uses an easing function (ease.outQuad) for smooth transitions.
-   **Gradient Palette**: The scatter series is styled with a gradient palette, defined by specific color stops and offsets.
-   **Point Marker**: Uses an ellipse point marker with configurable dimensions and color based on the example theme.

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
