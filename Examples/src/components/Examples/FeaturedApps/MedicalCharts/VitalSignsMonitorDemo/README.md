# Vital Signs Monitor Demo

## Overview

The Vital Signs Monitor Demo demonstrates a simulated real-time monitoring system for vital signs using SciChart.js. The example visualizes streaming data for various medical metrics such as ECG, blood pressure (NIBP), stroke volume (SV), and blood oxygenation (SPO₂). It includes implementations for Angular and React, with supporting TypeScript/JavaScript logic for handling dynamic data updates.

## Technologies Used

-   SciChart.js for high-performance charting
-   Angular (using the scichart-angular component)
-   React (using the scichart-react component)
-   JavaScript and TypeScript

## Code Explanation

-   **Angular Component (angular.ts)**: Sets up the chart view using the SciChartAngularComponent and defines an info panel that displays live readings for ECG, blood pressure, stroke volume, and blood oxygenation. It subscribes to data updates from the chart to refresh these displays in real-time.
-   **Drawing Example (drawExample.js / drawExample.ts)**: Contains the core implementation of the SciChartSurface. These files configure the X and multiple Y axes, create four renderable series (each corresponding to a vital sign), and implement a timer-based simulation to update the data. The FIFO sweeping mode and a custom event handler ensure the chart continuously displays streaming data while updating the info panels.
-   **React Component (index.tsx)**: Wraps the drawing logic into the SciChartReact component. It uses React hooks to manage state for each vital sign measurement and subscribes to data update events similar to the Angular version, providing a consistent look and feel

## Customization

Key configuration options include:

-   **Data Update Parameters**: Constants such as STEP, TIMER_TIMEOUT_MS, POINTS_LOOP, and GAP_POINTS control the simulation and scrolling behavior of the chart.
-   **Chart Styling**: Stroke colors, thickness (STROKE_THICKNESS), and point marker options are defined using the appTheme values to visually distinguish each data series.
-   **Info Panel Configuration**: The textual content and layout of the panels displaying ECG, NIBP, SV, and SPO₂ details can be adjusted in the Angular and React component files.

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
