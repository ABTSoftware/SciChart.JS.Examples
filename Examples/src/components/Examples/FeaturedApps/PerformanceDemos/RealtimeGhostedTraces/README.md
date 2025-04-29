# Realtime Ghosted Traces Example

## Overview

This example demonstrates a real-time ghosted traces oscilloscope chart using SciChart.JS. It shows how to create a chart with a central axes layout and multiple overlapping renderable series with decreasing opacities to create a ghosting effect. The example is implemented for multiple frameworks, including a React version (using TSX) and an Angular version (using TypeScript). There is also a version implemented in Vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS (charting library)
-   SciChartSurface, NumericAxis, FastLineRenderableSeries, GlowEffect, XyDataSeries, CentralAxesLayoutManager
-   Angular (for the Angular implementation)
-   React (for the React implementation using scichart-react)
-   Material-UI (for React toolbar icons)

## Code Explanation

-   **Angular Implementation (angular.ts):** This file defines an Angular standalone component which imports the SciChart Angular component and uses the provided `drawExample` function to initialize the chart. It demonstrates how to embed a SciChart.JS chart inside an Angular application.
-   **Draw Example Files (drawExample.js and drawExample.ts):** These files contain the core chart creation logic. They create a SciChartSurface with a central axes layout (oscilloscope style) by positioning the x and y axes centrally using a CentralAxesLayoutManager. Ten renderable series are added with the same stroke color but with decreasing opacity values to simulate ghosted traces. A timer is set up to reassign the renderable series’ data continuously, creating a real-time update effect while deleting old series to prevent memory leaks.
-   **React Implementation (index.tsx):** This file implements the example using React. It uses React hooks (`useRef` and `useState`) and the SciChartReact component from the SciChart.JS React package. A toolbar is provided with Play and Pause buttons that control the real-time updating of the chart by calling the `startUpdate` and `stopUpdate` functions provided by the chart. It also displays real-time statistics such as the number of series, data points, and frames per second (FPS).
-   **Image File (javascript-realtime-ghosted-traces-oscilloscope-chart.jpg):** This image shows a preview of the realtime ghosted traces oscilloscope chart as it appears when running the example.

## Customization

Key configuration options such as the amplitude of the sine wave (which is randomly set each update), colors from the application theme (e.g., PaleSkyBlue, VividSkyBlue, VividTeal), stroke thickness, and opacity levels for each trace are defined in the sample. The update frequency is controlled by a timer (set to 20ms intervals) and can be started or stopped via provided button controls.

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
