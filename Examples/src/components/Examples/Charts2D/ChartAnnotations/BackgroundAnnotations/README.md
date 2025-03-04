# Background Annotations Example

## Overview

This example demonstrates how to add background annotations to a SciChart.JS chart along with a bubble chart that plots Happiness versus GDP. The chart displays a set of background box annotations that dynamically fill the chart area and a bubble series where each bubble’s color is determined by the continent of the underlying data point. The example is implemented using three different approaches: React (TSX), Vanilla JavaScript/TypeScript, and Angular.

## Technologies Used

-   SciChart.JS
-   Angular with the scichart-angular component
-   React using scichart-react
-   Vanilla JavaScript/TypeScript

## Code Explanation

-   **drawExample.js/ts**: Contains the main function that sets up the SciChartSurface. It creates logarithmic and numeric axes (for GDP per Capita and Happiness respectively), adds several interactivity modifiers (ZoomPanModifier, MouseWheelZoomModifier, ZoomExtentsModifier, and CursorModifier), and configures four background box annotations which dynamically adjust to the visible data range. It also builds a bubble series using an XyzDataSeries built from a provided happiness dataset. A custom palette provider is implemented to color the bubbles according to their continent, and a sweep animation is applied to the series. Additionally, a manual legend is added to explain the bubble size and color coding.
-   **data.js/ts**: Provides the dataset containing values such as GDP, Happiness, Population, and Continent for various entities. This data is used to drive the bubble chart.
-   **angular.ts**: Sets up an Angular component which utilizes the SciChartAngularComponent to initialize the chart by calling the drawExample function.
-   **index.tsx**: Implements the React component that uses the SciChartReact wrapper to render the chart on a React page.
-   **vanilla.js/ts**: Provide a simple entry point for initializing the chart in a non-framework (vanilla) environment. They call the drawExample function and handle disposal of the chart when needed.

## Customization

The example offers several key configuration options:

-   **Background Annotations**: Four BoxAnnotations are used with different pale fill colors to create a dynamic background that adjusts with the axis visible range.
-   **Axes Configuration**: The x-axis is a logarithmic axis (configured with a label prefix of "$" and significant figure formatting) while the y-axis is a numeric axis with custom title styling.
-   **Bubble Series**: A FastBubbleRenderableSeries is created using custom computed bubble sizes (based on a logarithmic transformation of the population) and a custom palette provider that assigns colors based on the continent.
-   **Animation**: A SweepAnimation is applied to the bubble series with a duration of 2000ms.
-   **Interactivity**: Chart modifiers including zooming, panning, mouse wheel zoom, and a cursor tooltip (with a custom tooltip data template) enhance user interaction.

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
