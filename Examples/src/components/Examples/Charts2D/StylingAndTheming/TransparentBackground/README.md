# Transparent Background Example

## Overview

This example demonstrates how to create a SciChart.JS chart with a transparent background so that an underlying DOM element (in this case, a background gradient image) is visible. The example includes implementations for both Vanilla JavaScript and React using TypeScript.

## Technologies Used

-   SciChart.JS
-   scichart-react
-   React
-   TypeScript
-   Vanilla JavaScript

## Code Explanation

The main chart is created in the file **drawExample.js** (with a corresponding TypeScript version in **drawExample.ts**). In these files the SciChartSurface is created using the SciChartJSLightTheme and its background property is explicitly set to "Transparent". The example sets up numeric X and Y axes with common styling options such as grid line styles, label styles, and axis title styling. It also demonstrates adding multiple series including a spline line series with a sweep animation, a bubble series with an ellipse point marker and a sweep animation (with a fade effect), and a column series with a wave animation. In addition, several interactivity modifiers are added: MouseWheelZoomModifier, ZoomPanModifier, and ZoomExtentsModifier.

The **index.tsx** file provides the React component which uses the SciChartReact component from the scichart-react package. This component applies an external background image (imported from _BackgroundGradient.jpg_) to the chart container by setting it in the style, so that the transparent chart background allows the underlying image to show through.

## Customization

Key configuration options include:

-   Setting the chart background by assigning `sciChartSurface.background = "Transparent"` to allow underlying content to be visible.
-   Customizable axis options (grid line colors, axis bands fill, label styles, etc.) through the common options object.
-   Various series options such as stroke color, stroke thickness, point marker size, corner radius, and animation effects (e.g. SweepAnimation and WaveAnimation) for each series.

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
