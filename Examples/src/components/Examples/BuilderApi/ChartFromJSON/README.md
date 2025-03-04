# Chart From JSON

## Overview

This example demonstrates how to create SciChart charts entirely from JSON configuration. The example provides a React implementation (using TypeScript) that allows users to switch between different JSON-based chart configurations. Users can select a simple chart, a detailed chart, or a chart with central axes through an interactive UI. The chart is built dynamically using the SciChart builder API based on the JSON definitions.

## Technologies Used

-   **SciChart.JS**: For rendering high-performance 2D charts using JSON definitions.
-   **React with TypeScript**: The main framework used to build the interactive example.
-   **Material UI**: For UI components such as buttons, text fields, button groups, and alerts.
-   **SciChartReact**: A React component that integrates SciChart functionality into a React application.

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the logic to construct a SciChartSurface using the builder API. They export the `drawExample` function which takes a target div element, a JSON string, and an error callback to build a chart from the given JSON configuration. They also include multiple JSON configuration templates (default, detailed, and central layout) that define the surface theme, axes, series, annotations, and interactive modifiers.
-   **index.tsx**: This is the main React component for the example. It uses the `SciChartReact` component to render the chart based on the current JSON configuration. The component provides an interactive UI where users can choose between different JSON definitions via buttons (Simple Example, Full Example, Central Axes) and also modify the JSON directly in a text field. When the user clicks the "Apply" button, the chart is rebuilt with the updated configuration and any errors are displayed using a Material UI Alert.
-   **javascript-chart-from-json.jpg**: This image resource provides a visual preview of the chart produced from one of the JSON configurations.

## Customization

This example allows you to customize many aspects of a SciChart chart by editing the JSON configuration. Key customization options include:

-   **Surface and Theme**: Modify the overall appearance using themes (e.g., Navy) and layout managers (e.g., Central Axes).
-   **Series Configuration**: Change the type of series (SplineLineSeries, SplineMountainSeries, BubbleSeries, ScatterSeries), adjust styling options like stroke colors, gradients, and point markers, and provide data arrays for the series.
-   **Axes Settings**: Configure numeric and category axes with options such as axis titles, alignment, visible range, and precision.
-   **Annotations**: Add text annotations with configurable properties such as text, font size, opacity, and positioning.
-   **Modifiers**: Enable interactive features like mouse wheel zoom, zoom extents, cursor, and zoom/pan modifiers for enhanced user interaction.

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
