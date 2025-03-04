# Rotated Labels Example

## Overview

This example demonstrates how to create a chart with rotated axis labels using SciChart.JS. The x-axis labels are rotated 90 degrees to display dates in the DD/MM/YYYY format and the chart uses a spline mountain renderable series with gradient fill and wave animation. The example is implemented with both React (using TypeScript with a SciChartReact component) and Vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS core library (SciChartSurface, NumericAxis, XyDataSeries, WaveAnimation, etc.)
-   React via the scichart-react package (in the React version)
-   Vanilla JavaScript and TypeScript

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the main function that creates the SciChart surface, configures the x and y axes, and generates a spline mountain series. The x-axis is set up with a 90° rotation for its labels, a customized font size, date formatting, and a higher number of major ticks while disabling minor grid lines. A random dataset is generated to simulate date/time-based data. The mountain series is styled with both a solid fill and a linear gradient, and animated using a wave animation.
-   **index.tsx**: This React component uses the `SciChartReact` component to initialize the chart with the `drawExample` function. This illustrates how SciChart.JS can be integrated into a React application.
-   **vanilla.js / vanilla.ts**: These files show how to initialize the chart in a vanilla JavaScript or TypeScript environment. They call the `drawExample` function and provide a cleanup mechanism to delete the chart surface when necessary.

## Customization

Key configuration options demonstrated in the example include:

-   **Axis Label Rotation**: The x-axis labels are rotated by 90° using the `rotation` property.
-   **Label Formatting**: The x-axis uses a date format (`Date_DDMMYYYY`) to display the labels.
-   **Tick Configuration**: The `maxAutoTicks` property is increased to 30 to ensure more major ticks appear on the axis, making the rotated labels easier to read.
-   **Series Styling and Animation**: The spline mountain series is customized with stroke color, stroke thickness, and a combination of solid and gradient fills. The `WaveAnimation` is used with a duration of 1000ms and enabled fade effect for smooth series rendering.

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
