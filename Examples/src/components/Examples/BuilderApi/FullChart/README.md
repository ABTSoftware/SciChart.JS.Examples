# Full Chart Example

## Overview

This example demonstrates how to create a fully featured 2D chart using SciChart.JS. It showcases a chart built with the Builder API and includes multiple axes, various series types (a Spline Mountain Series and a Bubble Series), custom annotations, and interactive modifiers such as rollover, mouse wheel zoom, and zoom extents. The example provides implementations for both React (using TypeScript and TSX) and Vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS (including the Builder API for chart construction)
-   React (via the SciChartReact component)
-   Vanilla JavaScript and TypeScript

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the core chart configuration using the Builder API. They define the theme, axes (a category xAxis with custom labels and two numeric yAxes), series (a Spline Mountain Series with gradient fill and a Bubble Series with ellipse point markers), annotations (various SVG text annotations positioned in both data and relative coordinate modes), and interaction modifiers (rollover, mouse wheel zoom, and zoom extents). They serve as the primary function to build the chart.
-   **index.tsx**: This React component imports the SciChartReact component and initializes the chart by calling the drawExample function. It demonstrates how to integrate the SciChart.JS chart into a React application.
-   **vanilla.js / vanilla.ts**: These files illustrate a Vanilla implementation where the drawExample function is called on a specified DOM element (with id "chart") and return a destructor function to clean up the chart when necessary.
-   **javascript-builder-full.jpg**: Although not code, this image appears to be an asset (likely a preview or illustration) related to the example.

## Customization

Key configuration options include:

-   **Axes and Labels**: The xAxis uses a category axis with a custom text label provider mapping numeric values to textual labels (one, two, three, etc.). The two yAxes are configured with specific visible ranges and distinct alignments (left and right).
-   **Series Styling**: The Spline Mountain Series is customized with a vivid sky blue stroke, thick line width, and a gradient fill. The Bubble Series uses ellipse markers styled with specific dimensions, stroke thickness, and fill colors.
-   **Annotations**: Multiple SVG text annotations are positioned both in data and relative coordinate systems. They include styling (opacity, font size, font weight) and anchoring options to annotate the chart clearly.
-   **Interactive Modifiers**: The chart supports user interactions with rollover details (custom stroke color), mouse wheel zoom, and zoom extents modifiers.

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
