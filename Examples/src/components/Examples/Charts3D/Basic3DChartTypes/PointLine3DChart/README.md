# Point Line 3D Chart

## Overview

This example demonstrates a 3D point-line chart that visualizes spectral data in three dimensions using the SciChart.JS library. The example is implemented using multiple frameworks including Angular and React, with supporting implementations in both JavaScript and TypeScript. It generates spectral data using a Fourier transform (via a Radix2FFT algorithm) and applies a heatmap legend to visually map values such as power (dB) onto a color gradient.

## Technologies Used

-   SciChart.JS (including SciChart3DSurface, NumericAxis3D, and PointLineRenderableSeries3D)
-   Angular (standalone components via scichart-angular)
-   React (using SciChartReact)
-   TypeScript and JavaScript

## Code Explanation

-   **angular.ts**: This file defines an Angular standalone component that renders the 3D chart area and the heatmap legend. It uses the `<scichart-angular>` component and passes the `drawExample` and `drawHeatmapLegend` functions to initialize the SciChart 3D surface and its legend respectively.
-   **drawExample.js / drawExample.ts**: These files contain the core logic for creating the 3D chart. They set up the SciChart 3DSurface with defined world dimensions, camera position, and axis titles for frequency (Hz), power (dB), and time (s). The code generates spectral data by combining sinusoidal components with random noise, applies a Fourier transform, and then formats the resulting data into metadata with color gradients based on value ranges. A 3D point-line series is then added for each generated dataset.
-   **index.tsx**: This React component wraps the SciChartReact components to display the 3D chart and heatmap legend. It serves as the entry point when using the React version of the example.
-   **javascript-3d-point-line-chart.jpg**: An image file (likely a screenshot) that shows the rendered chart example.

## Customization

Key configuration options in this example include:

-   **World Dimensions and Camera Settings**: The SciChart3DSurface is configured with specific `worldDimensions`, camera position and target, which can be adjusted for different views of the data.
-   **Axis Configuration**: Each of the three axes (X for frequency, Y for power, and Z for time) has configurable properties such as axis titles, grid line visibility, and label offsets.
-   **Data Styling and Metadata**: The chart series uses dynamically generated metadata to control the color and scale of each data point, based on a defined set of gradient stops that map spectral power values to colors.
-   **Chart Modifiers**: Modifiers such as MouseWheelZoomModifier3D, OrbitModifier3D, and ResetCamera3DModifier are added to enhance interactive navigation around the 3D chart.

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
