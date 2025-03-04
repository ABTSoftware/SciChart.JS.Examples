# Series Selection Example

## Overview

This example demonstrates how to implement interactivity with chart series in SciChart.JS. The example shows how to customize series appearance on hover and selection by animating opacity and changing line stroke colors. Both React (using a TSX component) and Vanilla JavaScript (with JS and TS versions) implementations are provided.

## Technologies Used

-   **SciChart.JS** – Core charting library
-   **SciChartSurface**, **NumericAxis**, **XyDataSeries**, **SplineLineRenderableSeries** – For building and rendering the chart
-   **SeriesSelectionModifier** – For enabling hover and select interactions on series
-   **GenericAnimation** – For smooth animation of series style changes
-   **React** – Provided via a React component (`index.tsx`) using the `SciChartReact` wrapper

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the main chart initialization logic. They generate sample data, create a SciChartSurface with numeric axes, and add multiple spline renderable series. Custom event handlers (`onHoveredChanged` and `onSelectedChanged`) are attached to each series to animate opacity changes and adjust stroke colors when a series is hovered or selected. The chart also includes an annotation that displays a title and a legend modifier.
-   **index.tsx**: This is the React component that wraps the chart initialization. It imports `drawExample` and passes it to the `SciChartReact` component, making it easy to integrate the chart into a React application.
-   **vanilla.js / vanilla.ts**: These files demonstrate how to create the chart in a non-framework (vanilla JavaScript) environment. They call the same `drawExample` function using an HTML element identified by the id "chart", and they also provide a mechanism to clean up the chart using a returned destructor function.

## Customization

Key configuration options in this example include:

-   **Animation Duration**: The animations for opacity changes are set to 100ms using the `GenericAnimation` class.
-   **Series Styling**: Spline lines and point markers are configured with properties like stroke thickness, auto color options, and dimensions to enhance visual clarity.
-   **Interactivity**: Custom event handlers adjust the opacity of the hovered series (to full opacity) and dim the other series when interacting with the chart. When a series is selected, its stroke (and point marker stroke) is updated to the theme’s foreground color.

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
