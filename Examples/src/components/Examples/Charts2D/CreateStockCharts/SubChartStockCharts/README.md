# Sub Chart Stock Charts

## Overview

This example demonstrates how to build a complex, multi-pane stock chart using SciChart.JS. The chart is comprised of several sub-charts that display a candlestick series with moving averages and volume in the main pane, MACD and divergence in a second pane, and RSI in a third pane. In addition, the example shows how to integrate custom annotations and chart modifiers such as a legend tooltip that tracks the mouse position over the chart. The example is implemented using React with TypeScript (TSX) and utilizes the SciChart chart builder API.

## Technologies Used

-   **SciChart.JS**: The high performance charting library powering the example.
-   **React**: The example is implemented as a React component.
-   **TypeScript**: Used for type safety and improved development experience.
-   **SciChart ChartBuilder API**: Used to construct and configure the multi-pane chart with axes, series, and annotations.

## Code Explanation

-   **FinChartLegendAnnotation.ts**: Implements a custom SVG tooltip annotation for financial charts. It generates an SVG string based on financial data (OHLC and Xyy data series) and displays text elements showing key values for the series at the current mouse position. The template function provided in this file is used to format the legend content.

-   **FinChartLegendModifier.ts**: Provides a custom chart modifier that adds crosshair line annotations as well as the custom legend annotation from FinChartLegendAnnotation. This modifier updates its annotations based on the mouse position over the chart and synchronizes across the sub-charts. It also registers its custom type so that it can be referenced when building the chart.

-   **index.tsx**: Serves as the main React component for the example. It uses the SciChart chartBuilder to create a multi-pane chart layout comprising three sub-charts:

    -   The first sub-chart contains a candlestick series with two moving average lines and a volume column series with a custom palette provider.
    -   The second sub-chart displays a MACD band series along with a divergence column series.
    -   The third sub-chart shows a line series representing RSI.

    The file also demonstrates how to calculate technical indicator data (MACD, signal, divergence, and RSI) from the provided financial data and how to add buy and sell marker annotations using custom SVG annotations. Additionally, it includes logic for interactive resizing of the sub-chart panes via draggable divider elements.

## Customization

The example includes several key configuration options:

-   **Legend Template**: In the `FinChartLegendAnnotation`, a default template constructs an SVG tooltip with dynamic text based on the financial series data at the current mouse index.
-   **Legend Offset**: Both the legend annotation and modifier expose properties (`legendOffsetX` and `legendOffsetY`) to control the tooltip position.
-   **Crosshair Styling**: The custom modifier (`FinChartLegendModifier`) provides options such as `crosshairStroke`, `crosshairStrokeThickness`, and `crosshairStrokeDashArray` to style the crosshair lines.
-   **Chart Appearance**: Sub-chart specific options (such as axis alignment, auto-ranging, and padding) as well as series styling (candlestick up/down colors, line series stroke, palette providers for volume and MACD histogram) can be customized.

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
