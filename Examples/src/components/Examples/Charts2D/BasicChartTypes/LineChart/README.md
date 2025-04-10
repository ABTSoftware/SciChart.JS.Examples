# Line Chart Example

## Overview

This example demonstrates nine variations of line charts using SciChart.JS. It showcases multiple approaches including a simple line chart, digital (step) line charts, tooltips on line charts, dashed line charts, gradient line charts, hover/select line charts, gaps in line charts, vertical line charts, and thresholded line charts. The example provides implementations for both Angular and React, with shared chart initialization logic available in JavaScript/TypeScript files.

## Technologies Used

-   SciChart.JS for high performance charting
-   SciChartSurface, NumericAxis, and various renderable series (e.g. FastLineRenderableSeries)
-   SciChart modifiers such as RolloverModifier, VerticalSliceModifier, and SeriesSelectionModifier
-   Angular (using scichart-angular)
-   React (using scichart-react and tss-react/mui for styling)
-   TypeScript and JavaScript

## Code Explanation

The example is organized around a shared chart initialization API defined in the files `drawExample.js` and `drawExample.ts`. These files export a function `getChartsInitializationAPI` which returns asynchronous initialization functions for various line chart configurations. Each function creates a SciChartSurface, sets up numeric axes (with options like invisible axes and custom growBy settings), and adds one or more FastLineRenderableSeries with different properties including stroke color, stroke thickness, animation effects (e.g. Sweep, Wave, Fade), digital line settings, custom point markers, and palette providers for gradient or thresholded coloring.

The Angular implementation is contained in `angular.ts`. It defines an Angular component which lays out a 3x3 grid of charts using the `<scichart-angular>` component. In its `ngOnInit` method the component assigns each chart initialization function from the shared API (for example, `initJustLineCharts`, `initDigitalLineCharts`, etc.) to corresponding properties in the component, ensuring that each chart variant is rendered.

The React implementation is provided in `index.tsx`. This file defines a React component that uses `SciChartReact` along with custom styling (via tss-react/mui and custom CSS classes) to render the same nine chart variations in a responsive 3x3 grid layout. The component retrieves the initialization API and passes the appropriate chart initializer to each instance of the `SciChartReact` component.

Additionally, a JPEG image file (`javascript-line-chart.jpg`) is included which likely demonstrates the visual output of the chart, serving as an illustrative preview for the example.

## Customization

Key configuration options in this example include:

-   **Animation Duration and Type**: Different charts use animations such as Sweep, Wave, and Fade. The duration and delay can be adjusted in the animation options.
-   **Chart Styles**: Properties such as stroke color, stroke thickness, opacity, and dash arrays are configurable. Point markers (e.g. ellipse markers) and data labels can be customized.
-   **Axis and Padding Settings**: The charts are configured with invisible axes and custom padding/growBy settings. The vertical line charts, for instance, adjust axis alignments to rotate the chart layout.
-   **Palette Providers**: For gradient and thresholded line charts, palette providers are used to apply per-point coloring based on data conditions.

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
