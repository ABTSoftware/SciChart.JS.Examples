# Error Bars Chart

## Overview

This example demonstrates how to create a chart with error bars using SciChart.JS. The chart displays a mountain renderable series alongside two error bar series (one horizontal and one vertical) that show absolute errors on both the X and Y values. Implementations for Angular, React, and Vanilla JavaScript/TypeScript are included, illustrating how the same chart functionality can be used across multiple frameworks.

## Technologies Used

-   SciChart.JS for high performance charting
-   Angular (standalone component)
-   React (using SciChartReact component)
-   Vanilla JavaScript and TypeScript
-   WebAssembly (via the SciChartSurface creation)

## Code Explanation

The core functionality is encapsulated in the `drawExample` function present in both JavaScript and TypeScript files. This function initializes the SciChart surface, creates numeric X and Y axes, and sets up the data series with sample X and Y values. It then adds a spline mountain renderable series and two error bar series (one with horizontal error bars and one with vertical error bars, including an optional point marker). Additionally, interactive chart modifiers such as ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier are added to enable user interaction.

Framework-specific files:

-   **Angular (angular.ts):** Contains an Angular standalone component that uses the `ScichartAngularComponent` to initialize the chart with the provided `drawExample` function.
-   **React (index.tsx):** Uses the `SciChartReact` component to initialize the chart within a React environment, linking to the common `drawExample` function.
-   **Vanilla (vanilla.js / vanilla.ts):** Provides a simple implementation which calls `drawExample` with a root element identifier and returns a destructor function to clean up the chart instance.

## Customization

Users can customize the following key configuration options:

-   **Data and Error Values:** The example uses fixed arrays for X and Y values with random error values generated by a helper function. Adjust the arrays or random error function for different error bar magnitudes.
-   **Animation:** Both the mountain series and error bar series are animated using a scale animation with a duration of 500 milliseconds. The animation type and options can be customized.
-   **Styling:** Colors and gradients for the series are set using theme variables (e.g., `appTheme.VividSkyBlue` and `appTheme.VividOrange`). Modify these values to change the chart appearance.
-   **Interactive Modifiers:** Chart modifiers such as zoom and pan can be configured or extended to suit different interaction requirements.

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
