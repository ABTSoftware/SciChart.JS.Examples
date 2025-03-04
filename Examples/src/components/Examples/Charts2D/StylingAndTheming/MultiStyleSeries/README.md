# Multi Style Series

## Overview

This example demonstrates how to apply multiple rendering styles to the same series in SciChart.JS. It shows how to style selected points differently by using a custom render data transform and multiple drawing providers. In this example the column series and line series are enhanced so that when a data point is "selected" (as indicated by metadata), different visual styles are applied (different gradient fills for columns, different point markers and dashed lines for line segments). The example includes both plain JavaScript and React (TSX) implementations.

## Technologies Used

-   **SciChart.JS**: Including core classes such as SciChartSurface, NumericAxis, XyDataSeries, FastColumnRenderableSeries, FastLineRenderableSeries, GradientParams, and various drawing providers and modifiers.
-   **JavaScript / TypeScript**: The example is provided in both JavaScript and TypeScript versions.
-   **React**: The React version uses the SciChartReact component to initialize the chart.

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the main implementation. They create a SciChartSurface with X and Y numeric axes and add two types of renderable series – a column series and a line series. A custom render data transform, named `SplitRenderDataTransform`, is defined in both files. This transform adjusts the data points based on a custom metadata property (`isSelected`), populating different fields (such as lowValues and highValues) to allow for different styles on selected points.

    For the **column series**, two drawing providers are used. The first provider shows the default gradient fill, while an additional `ColumnSeriesDrawingProvider` is added to draw selected columns with an alternate gradient fill.

    For the **line series**, the example applies a primary line series along with additional drawing providers. One drawing provider renders selected segments with a dashed line style, and another adds a different point marker (a triangle) to selected points.

    Interactivity is enabled through the `DataPointSelectionModifier`, which allows users to click and drag to change the selection state of points, causing the chart to reapply the custom transform and update the visual styles.

-   **index.tsx**: This is the React component that initializes the example using the SciChartReact component. It imports and invokes the `drawExample` function to render the chart within a React application.

## Customization

Key configuration options include:

-   The **custom transform (`SplitRenderDataTransform`)**: This transforms the data series so that unselected points use one set of values (e.g. y-values for the default style) while selected points populate alternate fields (lowValues for point markers and highValues for adjacent points for line drawing).
-   **Gradient Fill Configurations**: The column series uses two different gradient fills – one for the default style and one for selected columns, defined using `GradientParams`.
-   **Drawing Providers**: The line series drawing providers are configured with different properties such as dashed strokes and alternative point markers, allowing selected segments and points to be styled differently.
-   **Interactivity**: The `DataPointSelectionModifier` is used to allow users to interactively select data points, triggering the re-transformation of the render data.

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
