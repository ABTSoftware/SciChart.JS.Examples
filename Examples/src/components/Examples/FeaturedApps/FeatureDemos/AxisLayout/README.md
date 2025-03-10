# Axis Layout Example

## Overview

This example demonstrates advanced axis layout techniques using SciChart.js. It showcases the creation and customization of multiple numeric axes with various configurations including flipped, stacked, and inner axes. The example is implemented for Angular, React, and Vanilla JavaScript/TypeScript, illustrating how the same chart can be rendered using different frameworks.

## Technologies Used

-   **SciChart.js** – High-performance, real-time charting library
-   **scichart-angular** – Angular component for SciChart.js integration
-   **scichart-react** – React component for SciChart.js integration
-   **Vanilla JavaScript/TypeScript** – Direct integration without any framework wrappers

## Code Explanation

-   **drawExample (JS/TS)**: This is the core file that creates a SciChartSurface along with several numeric axes. It configures different axis properties such as major tick lines, grid lines, axis borders, label styles, and visible ranges. The example also demonstrates how to flip coordinates, place axes inside the chart area (inner axes), and use a right aligned outer vertically stacked axis layout strategy.
-   **Angular Component (angular.ts)**: An Angular component that imports the SciChartAngularComponent and calls the drawExample function to render the chart.
-   **React Component (index.tsx)**: A React component that uses the SciChartReact component to initialize the chart by passing the drawExample function as a prop.
-   **Vanilla Implementation (vanilla.js / vanilla.ts)**: Simple scripts that invoke the drawExample function on a DOM element with the id 'chart' and provide a cleanup mechanism via a destructor function.
-   **Supporting Assets**: An image file (javascript-axis-layout.jpg) is provided, which likely acts as a visual reference or screenshot of the resulting chart.

## Customization

Key configuration options in this example include:

-   **Axis Styling**: Customization of major tick line styles, axis borders, label styles, and grid lines.
-   **Axis Positioning**: Use of different axis alignments (e.g. top, left, right) and internal placements by setting properties such as `isInnerAxis`.
-   **Axis Layout Strategies**: Application of the `RightAlignedOuterVerticallyStackedAxisLayoutStrategy` for outer axes and customized inner axes coordinate modes and positions.
-   **Data Series**: Generation of sample data using sine functions and appending these to renderable series with matching axis assignments.
-   **Chart Modifiers**: Integration of zoom, pan, and axis drag modifiers to enable interactive manipulation of the chart.

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
