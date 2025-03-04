# Styling In Code (Styling In Code)

## Overview

This example demonstrates how to apply custom styling to various parts of a SciChart.js chart directly in code. It shows how to set colors and styles for the chart background, axes (including their grid lines, band fills, title styles, and label styles), annotations, and interactivity modifiers. This example provides implementations in Angular, Vanilla JavaScript/TypeScript, and React (TSX).

## Technologies Used

-   **SciChart.js** for high performance charting
-   **Angular** (standalone component using scichart-angular)
-   **React** using the SciChartReact component
-   **Vanilla JavaScript/TypeScript** for a plain JS version

## Code Explanation

-   **drawExample.js / drawExample.ts**: Contains the main chart initialization and styling logic. In these files, a SciChartSurface is created, and numeric axes (both X and two Y axes) are added with custom styling. Styling properties are defined with clear constants (e.g. chart background color, grid line colors, axis title and label styles) and applied via the options on each axis. In addition, a title annotation is added and some interactivity modifiers (ZoomPanModifier and MouseWheelZoomModifier) are configured.
-   **angular.ts**: Implements an Angular standalone component that uses the SciChartAngularComponent with an `initChart` property bound to the `drawExample` function.
-   **index.tsx**: Provides a React component that wraps the chart using the SciChartReact component and initializes the chart with the same `drawExample` function.
-   **vanilla.js / vanilla.ts**: These files show how to create the chart in a Vanilla JavaScript/TypeScript environment on a provided DOM element (with an id of "chart") and return a destructor to clean up resources.
-   **javascript-chart-styling-theming-in-code.jpg**: A screenshot image that likely demonstrates the end result of the chart styling applied by the example.

## Customization

The example directly specifies several key configuration options in code:

-   **Chart Background**: Set to a custom color (e.g. `#E4F5FC`).
-   **Axis Styling**: Custom colors for axis bands, grid lines (major and minor), tick lines, axis borders, and background fills. Text styling for axis titles and labels is defined (font size, family, weight, style, and color).
-   **Annotation**: A title annotation is added with customizable text, font properties, positioning, and opacity.
-   **Modifiers**: Interactivity modifiers such as zoom pan and mouse wheel zoom are added to enhance user interaction.

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
