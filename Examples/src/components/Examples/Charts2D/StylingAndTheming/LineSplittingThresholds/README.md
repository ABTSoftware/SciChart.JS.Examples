# Line Splitting Thresholds

## Overview

This example demonstrates how to split a fast line series into separate segments based on defined threshold values using the SciChart.JS library. The example shows how to dynamically adjust the line segmentation and corresponding colors via interactive horizontal annotations, which can be dragged to modify the thresholds. Both Vanilla JavaScript and TypeScript (with React via the SciChartReact component) implementations are provided.

## Technologies Used

-   **SciChart.JS** – High performance charting library for JavaScript
-   **SciChartReact** – React wrapper for SciChart.JS (used in the provided TSX file)
-   **TypeScript and JavaScript** – Both language flavors are demonstrated
-   **HTML5 Canvas WebAssembly Support** – Through SciChart’s WASM context

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the core logic for creating the SciChart surface with numeric axes and a fast line renderable series. A custom render data transform (`ThresholdRenderDataTransform`) is implemented to split the line segments whenever the y-values cross one or more predefined thresholds. In addition, a custom palette provider (`ThresholdPaletteProvider`) is provided to change the stroke color of the line segments based on the threshold levels.
-   **ThresholdRenderDataTransform**: This class intercepts the rendering data, detects when the line crosses specified thresholds (initially set to [1.5, 3, 5]), and interpolates the intersection points. This allows the line to be rendered as multiple segments at the threshold boundaries.
-   **ThresholdPaletteProvider**: This class overrides the default stroke color assignment and applies different colors to each segmented part based on the current threshold level.
-   **Interactive Annotations**: HorizontalLineAnnotations are added for each threshold. These annotations are made editable and include drag event subscriptions so that when a user drags a horizontal line, the threshold values are updated dynamically. This demonstrates real-time interaction with the chart and refresh of the segmented line appearance.
-   **index.tsx**: This React component wraps the example using the SciChartReact component. It initializes the chart by calling the `drawExample` function, thus enabling a React-based implementation of the example.

## Customization

Key configuration options in this example include:

-   **Threshold Values**: The thresholds are initially defined as [1.5, 3, 5] in the code. Users can adjust these values by dragging the corresponding horizontal annotations.
-   **Line Appearance**: The line series is configured with properties such as stroke thickness, point markers, and a specific theme (SciChartJsNavyTheme) to style the chart.
-   **Interpolation for Splitting**: The custom render data transform calculates interpolated intersection points when the line crosses thresholds, ensuring the segments are accurately split.
-   **Palette Customization**: The colors for each segment are derived from an app theme and mapped to threshold levels within the palette provider.

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
