# Multiple Zoom Pan Modifiers Demo

## Overview

This example demonstrates how to enable and combine multiple zoom and pan behaviors on a single SciChart.JS chart. The demo shows interactive features such as rubber band zooming (using right mouse button), zooming with mouse wheel, pinch zoom on touch devices, zoom extents on double click, and panning. Implementations for React, Angular, and Vanilla JavaScript are provided.

## Technologies Used

-   SciChart.JS
-   TypeScript and JavaScript
-   Angular (standalone component)
-   React (using TSX)
-   Vanilla JavaScript
-   SciChart modifiers including RubberBandXyZoomModifier, ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier
-   SciChart easing functions

## Code Explanation

The core functionality is implemented in the `drawExample` function (provided in both JavaScript and TypeScript). This function creates a SciChartSurface with numeric X and Y axes, adds multiple line series with Fourier series data from the ExampleDataProvider, and configures point markers and stroke styles from the imported theme.

Key aspects of the code include:

-   **Chart Creation**: The SciChartSurface is created with X and Y NumericAxes having configurable growBy and label formatting options.
-   **Data Series**: Three line series are added to the chart, each displaying a Fourier series. Each series is styled with different colors and point markers.
-   **Zoom and Pan Modifiers**: Multiple modifiers are added to enable various interactive behaviors:
    -   _RubberBandXyZoomModifier_: Activated with the right mouse button and uses an elastic easing function for animated zooming.
    -   _ZoomPanModifier_: Enables standard panning and pinch zoom on touch devices.
    -   _MouseWheelZoomModifier_: Allows zooming using the mouse wheel.
    -   _ZoomExtentsModifier_: Zooms to the extents on double-click, also using an easing animation.
-   **Annotations**: Text and native text annotations are added to inform the user about the available interactions and to label the chart.
-   **Framework-Specific Files**:
    -   The Angular version (`angular.ts`) wraps the chart inside an Angular standalone component using the `scichart-angular` component.
    -   The React version (`index.tsx`) uses the `SciChartReact` component to initialize and render the chart.
    -   The Vanilla JavaScript/TypeScript versions (`vanilla.js` and `vanilla.ts`) demonstrate a plain implementation where the chart is created on a specified root element and provides a cleanup function.

## Customization

Key configurable options in this example include:

-   **Easing Functions**: The rubber band and zoom extents modifiers use an elastic easing function to animate the zooming process.
-   **Modifier Settings**: The ZoomPanModifier is configured with `enableZoom: true` to incorporate pinch zoom on touch devices. Additional settings for the modifiers can be adjusted to modify when and how the interactions are triggered.
-   **Chart and Axis Styling**: GrowBy, label format, and precision settings on the axes can be customized. Similarly, the series styling (stroke thickness, colors, and point markers) is derived from the application theme and may be modified as needed.

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
