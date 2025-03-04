# Trade Markers Example

## Overview

This example demonstrates how to build a financial trading chart using SciChart.js. The chart displays candlestick series based on multi-pane trading data and overlays custom annotations to indicate random trading events. Buy and sell markers are rendered as custom SVG annotations with hover interactions that reveal additional trade details. This example includes implementations for Angular, React, and Vanilla JavaScript.

## Technologies Used

-   **SciChart.js** - Core charting library
-   **SciChart Angular Component** - Used in the Angular implementation
-   **SciChart React Component** - Used in the React implementation
-   **Vanilla JavaScript/TypeScript** - Direct usage for standalone examples
-   **Custom Annotations and Hover Modifiers** - For displaying trade markers and tooltips
-   **Example Data Provider and Theme Files** - Used to load sample trading data and apply consistent styling

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the main chart creation logic. They create the SciChartSurface, add a category X-Axis with a smart date label provider, and a numeric Y-Axis. A candlestick series is added along with two additional series (a digital line series for position and a mountain series for balance) that are updated via a simulated random trading algorithm. Custom annotations are added to represent trade markers (buys and sells) and news bullet annotations. The `TradeAnnotation` class defines the SVG content for buy and sell markers, and sets up hover callbacks to display additional trade information.
-   **angular.ts**: Implements an Angular component that imports the `ScichartAngularComponent` and sets its `initChart` property to the `drawExample` function, enabling Angular users to render the chart.
-   **index.tsx**: Contains a React component that leverages the `SciChartReact` component with the `drawExample` function to initialize the chart in a React environment.
-   **vanilla.js / vanilla.ts**: These files demonstrate how to instantiate the chart in a Vanilla JavaScript or TypeScript environment. They call the `drawExample` function using a target DOM element (with id "chart") and provide a cleanup mechanism by returning a destructor function.

## Customization

Key configuration options in this example include:

-   **Data Range Selection**: The example fetches multi-pane data and selects a subset of data points (using parameters like start index and maximum points) to render on the chart.
-   **Chart Styling**: The chart applies a theme (using `appTheme.SciChartJsTheme`) and sets specific colors for candlestick series (using `appTheme.VividSkyBlue`), as well as colors for buy and sell SVG markers (`appTheme.VividGreen` for buys and `appTheme.VividRed` for sells).
-   **Annotation Details**: Custom annotations include extra details such as quantity, price, average price, or profit and loss (PnL) which are calculated during the simulated trading algorithm. Hover modifiers are attached to these annotations to display tooltip information with configurable text, padding, and font size.

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
