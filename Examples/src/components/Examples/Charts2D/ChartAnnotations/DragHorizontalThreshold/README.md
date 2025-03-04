# Drag Horizontal Threshold

## Overview

This example demonstrates how to create interactive charts in SciChart.js by using draggable annotations to dynamically update chart data. The example displays a damped sinewave rendered as a mountain series with two parts; one series uses a custom threshold filter and a palette provider to change colours based on an adjustable threshold. Two editable annotations—one horizontal and one vertical—allow you to modify the threshold values in real time. The example has implementations for Angular, React, and Vanilla JavaScript.

## Technologies Used

-   **SciChart.js** for high performance charting
-   **Angular** (TypeScript) implementation
-   **React** (TSX) implementation
-   **Vanilla JavaScript/TypeScript** implementation

## Code Explanation

-   **drawExample (drawExample.js/ts)**: This module is the core of the example. It creates the SciChartSurface, sets up numeric X and Y axes, and adds two renderable series. One series displays the entire sinewave, while a second series uses a custom threshold filter (implemented via the `ThresholdFilter` class, which extends `XyFilterBase`) to selectively hide or adjust parts of the data.
-   **Annotations**: A horizontal line annotation is added and made editable. When dragged, it updates a threshold in the filter and adjusts the series so that values below the threshold are either removed or altered. A vertical line annotation is also added to change the x threshold for a palette provider (`XThresholdPaletteProvider`), which dynamically changes series colours based on the x-value. Additionally, text annotations are used to prompt the user to interact with the chart.
-   **Framework Specific Files**:
    -   **Angular (angular.ts)**: Contains an Angular component that uses the `ScichartAngularComponent` to initialize the chart with the `drawExample` function.
    -   **React (index.tsx)**: Uses the `SciChartReact` component and calls the `drawExample` function to render the chart within a React component.
    -   **Vanilla (vanilla.js/vanilla.ts)**: Provides a simple setup that calls the `drawExample` function and ensures proper disposal of the SciChartSurface.
-   **Supporting Files**: The included image file (javascript-chart-drag-horizontal-threshold.jpg) is likely a screenshot of the example in action. The example leverages several SciChart modifiers such as ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier for interactivity.

## Customization

-   **Threshold Value**: The initial threshold value is set to 4.0 and gets updated when the horizontal line annotation is dragged. This thresholds the data points in the filter to dynamically omit or adjust values based on user interaction.
-   **Palette Provider**: The `XThresholdPaletteProvider` customizes the fill and stroke colours of the series when the x-value exceeds a certain threshold, with the colour and threshold being easily configurable.
-   **Chart Appearance**: Chart styles such as stroke colours, strokeThickness, zeroLineY, and gradient fills can be modified within the series configuration. Annotations also provide configurable options including label placement and text appearance.

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
