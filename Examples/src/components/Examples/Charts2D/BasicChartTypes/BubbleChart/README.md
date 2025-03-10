# Bubble Chart Example

## Overview

This example demonstrates how to create a dynamic Bubble Chart using SciChart.JS. It displays a spline line series along with a bubble series where bubble sizes are determined by a third (Z) value. The example is implemented with multiple framework integrations including Angular, React, and Vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS (core charting library)
-   Angular (standalone component using scichart-angular)
-   React (using SciChartReact component)
-   Vanilla JavaScript/TypeScript

## Code Explanation

The main chart logic is located in the drawExample files (drawExample.js and drawExample.ts). These files initialize a SciChartSurface with numeric axes and create data points using mathematical functions. The code then adds:

-   A spline line series using XyDataSeries with an animation applied via SweepAnimation.
-   A bubble series using XyzDataSeries where each bubble is rendered with an EllipsePointMarker. A custom BubblePaletteProvider conditionally overrides the fill and stroke of bubble markers for x-values between 8 and 12.
-   Chart modifiers such as ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier to enable interactive panning and zooming.

Framework-specific files include:

-   **angular.ts**: Sets up a standalone Angular component that embeds the SciChartAngularComponent and references the drawExample function.
-   **index.tsx**: Provides a React component that uses the SciChartReact component to initialize the chart.
-   **vanilla.js / vanilla.ts**: Directly call the drawExample function and include cleanup logic to delete the SciChartSurface when necessary.
-   **javascript-bubble-chart.jpg**: A reference screenshot image of the expected bubble chart output.

## Customization

Key configuration options available in this example include:

-   Animation settings for the series (duration and delay using SweepAnimation).
-   Marker styling such as width, height, stroke thickness, and fill color with transparency for the bubble series.
-   Customization of point marker appearance through the BubblePaletteProvider, which conditionally changes the fill and stroke colors based on the x-values of the data points.

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
