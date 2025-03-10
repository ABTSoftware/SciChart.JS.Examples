# Annotation Layers Example

## Overview

This example demonstrates the use of multiple annotation layers in SciChart.JS. It shows how to add various annotation types—including box and text annotations—and how to assign them to different layers (Background, Below Chart, and Above Chart) to control their rendering order. The example includes implementations for Angular, React, and vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS
-   Angular (using scichart-angular)
-   React (using scichart-react)
-   JavaScript and TypeScript

## Code Explanation

-   **angular.ts**: Defines an Angular standalone component that integrates with SciChart.JS via the scichart-angular component. It imports and assigns the main chart drawing function (`drawExample`) to the Angular component template.
-   **drawExample.js / drawExample.ts**: These files contain the main chart initialization code. They create a SciChartSurface, add numeric axes with custom grid styles, and define a line series with data and point markers. The code then adds multiple annotations (box and text, including native text annotations) to different layers (Background, BelowChart, and AboveChart). Chart modifiers such as zoom pan, zoom extents, and mouse wheel zoom are also added to enhance interactivity.
-   **index.tsx**: Implements a React component that utilizes the `SciChartReact` component to initialize the chart using the same `drawExample` function. This allows the example to be run within a React environment.
-   **javascript-chart-annotation-layers.jpg**: An image file included in the example directory, likely providing a visual preview of the chart rendered by the example.

## Customization

The example code demonstrates several key configuration options including:

-   Custom grid line styles and axis growBy settings
-   Chart modifiers for zooming and panning (ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier)
-   Annotation properties such as stroke colors, stroke thickness, fill colors, and editability settings
-   Usage of both SVG and native text annotations to display text on the chart

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
