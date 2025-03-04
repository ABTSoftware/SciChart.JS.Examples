# Spline Band Series Chart

## Overview

This example demonstrates how to create a spline band series chart using SciChart.JS. It showcases two spline band renderable series: a default spline and a Bezier spline with a curvature transform. The example includes interactive elements such as an editable axis marker annotation that allows the user to modify the Bezier curvature in real-time. Implementations are provided for Angular, React, and Vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS core library
-   SciChart Angular component (scichart-angular)
-   SciChart React component (scichart-react)
-   Vanilla JavaScript/TypeScript

## Code Explanation

-   **drawExample.js / drawExample.ts**: Contains the main logic to create a SciChartSurface, add numeric axes, and create two Spline Band Renderable Series using a special XyyDataSeries. One series uses default styling while the other uses a Bezier render data transform. It also demonstrates configuring animations (using ScaleAnimation), point markers (EllipsePointMarker), and interactive annotations (AxisMarkerAnnotation and NativeTextAnnotation) to manipulate chart properties such as the Bezier curvature.
-   **angular.ts**: Implements an Angular standalone component that imports the SciChart Angular component and uses the drawExample function to initialize the chart.
-   **index.tsx**: Provides a React component that initializes the chart using the SciChartReact component and the same drawExample function.
-   **vanilla.js / vanilla.ts**: Demonstrates a Vanilla JavaScript/TypeScript implementation that initializes the chart on a provided root element and returns a destructor function to clean up the chart.
-   **javascript-spline-band-chart.jpg**: An image file included as part of the example assets.

## Customization

Key configuration options include:

-   **Interpolation Points**: The number of points used to interpolate the spline for smoothing (set to 20 in the example).
-   **Stroke and Fill Styles**: Custom colors and outlines are applied to the spline series using theme colors from the appTheme settings.
-   **Animation Settings**: A ScaleAnimation with a duration of 800 milliseconds, zeroLine set to 0, and a fade effect is applied to both series.
-   **Axis Ranges and Styles**: The visible range of the Y axes is configured along with background colors and label styles, allowing for clear differentiation between the left and right axes.
-   **Interactive Annotations**: An editable AxisMarkerAnnotation is provided to adjust the curvature of the Bezier spline series interactively.

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
