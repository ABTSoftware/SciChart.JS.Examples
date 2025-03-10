# Editable Chart Annotations Example

## Overview

This example demonstrates how to build an interactive chart with editable annotations using SciChart.js. Multiple annotation types are showcased including text, line, horizontal line, vertical line, box, custom image, and native text annotations. Users can click, drag, and resize these annotations. The example includes implementations for Angular and React as well as plain JavaScript/TypeScript via the drawExample module.

## Technologies Used

-   **SciChart.js** – High performance, real-time charting library for JavaScript
-   **Angular** – The Angular component wraps the SciChartSurface via the ScichartAngularComponent
-   **React** – A React component that initializes the chart using SciChartReact
-   **TypeScript/JavaScript** – The drawExample module is provided in both JS and TS versions

## Code Explanation

-   **angular.ts**: Defines an Angular standalone component that imports the SciChartAngularComponent. It uses the `drawExample` function to initialize and render the chart in an Angular environment.

-   **drawExample.js / drawExample.ts**: These files contain the main chart initialization function. They create a SciChartSurface, add numeric X and Y axes, and add various annotations with properties such as stroke, label, and editability. The code demonstrates how to configure each annotation type (e.g. text annotations, line annotations, box annotations, image annotations) and how to enable interactive editing via modifiers such as ZoomPanModifier, MouseWheelZoomModifier, ZoomExtentsModifier, and AnnotationHoverModifier. The tooltip functionality is implemented using animations and mouse hover events.

-   **index.tsx**: Implements the React version of the example. This file imports the `drawExample` function and the SciChartReact component to display the chart in a React application.

-   **scichart-logo-white.png**: An asset used by the custom image annotation displayed on the chart.

-   **javascript-chart-editable-annotations.jpg**: A preview image for the example.

## Customization

The example allows customization of key settings including:

-   Annotation properties (e.g. stroke, strokeThickness, fontSize, textColor, label placement)
-   Editable flags (using the `isEditable` property) to control which annotations can be manipulated by the user
-   Tooltip behavior and animation settings via the GenericAnimation and easing functions
-   Chart modifiers (such as ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier, and AnnotationHoverModifier) that control the interactive experience

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
