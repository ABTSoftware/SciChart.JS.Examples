# Axis Types Example

## Overview

This example demonstrates how to create a SciChart surface featuring a variety of axis types including a Category Axis with custom text labels, a Numeric Axis with prefix/postfix formatting, a Date Time Numeric Axis that auto-formats based on the date range, and a Logarithmic Axis with a base of 2. In addition, the example showcases how to render different series types (column and line series) on these axes. The implementation is provided in both JavaScript and TypeScript and includes a React component wrapper demonstrating integration with React.

## Technologies Used

-   SciChart.JS library
-   SciChartSurface, CategoryAxis, NumericAxis, DateTimeNumericAxis, LogarithmicAxis
-   FastColumnRenderableSeries and FastLineRenderableSeries
-   Custom palette provider for series coloring
-   React (via TSX) for rendering the chart component
-   Vanilla JavaScript and TypeScript

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain nearly identical implementations that create a SciChartSurface and add multiple axes to the chart. The Category Axis is set up with a custom TextLabelProvider to display coin names, while the Numeric Axis displays market cap values with custom formatting. A DateTimeNumericAxis is added and positioned along the top, and a LogarithmicAxis is added for displaying logarithmic price scales. A FastColumnRenderableSeries uses a custom palette provider (AxisTypesPaletteProvider) to assign fill colors based on the x-value index. Additionally, multiple FastLineRenderableSeries are added to display cryptocurrency data, which is fetched asynchronously from an API endpoint. Chart modifiers such as ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier are also added to enable interactive zooming and panning.
-   **AxisTypesPaletteProvider**: This custom palette provider overrides the fill color for the column series by mapping a set of predefined colors to indices of the data points.
-   **index.tsx**: This React component initializes the SciChart chart using the SciChartReact component and the `drawExample` function. It serves as the entry point for rendering the example within a React application context.

## Customization

Key configuration options include:

-   Font sizes, alignment, and padding settings on the Category Axis using the TextLabelProvider.
-   Axis titles provided as arrays to allow for multiline titles.
-   Numeric formatting on the Numeric and Logarithmic Axes including prefixes, postfixes, and precision settings.
-   Custom fill colors through the AxisTypesPaletteProvider that applies a semi-transparent tint to the column series based on the data point index.
-   Interactive chart modifiers such as ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier for enhanced user interaction.

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
