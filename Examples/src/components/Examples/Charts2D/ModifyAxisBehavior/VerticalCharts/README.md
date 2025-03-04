# Vertical Charts Example

## Overview

This example demonstrates how to create a vertically rotated chart using SciChart.js. In this example the X axis is aligned to the left and the Y axis is aligned to the bottom, causing the entire chart and its series to be rendered vertically. The example is implemented using multiple framework integrations including React (with TSX), Angular (with TS), and Vanilla JavaScript/TypeScript.

## Technologies Used

-   **SciChart.js** – High performance JavaScript charting library
-   **Angular** – Uses a standalone Angular component
-   **React** – Utilizes the SciChartReact component
-   **Vanilla JavaScript/TypeScript** – Provides a plain JavaScript integration
-   **Theme and Example Data** – Custom themes and a random walk generator for sample data

## Code Explanation

-   **drawExample (drawExample.js/ts)**: This file contains the main chart creation logic. It creates a SciChartSurface with a specific theme, configures the axes (with the X axis aligned to the left and the Y axis aligned to the bottom), and adds a fast line series with an ellipse point marker. It also includes an annotation with usage instructions and interactivity modifiers such as zoom and pan.
-   **Angular Implementation (angular.ts)**: The Angular file defines a standalone component that imports the SciChartAngularComponent and passes the `drawExample` function to initialize the chart. This integration makes it easy to use within an Angular application.
-   **React Implementation (index.tsx)**: The React file defines a component that uses the SciChartReact component to initialize the chart by providing the `drawExample` function. The component is styled using imported module styles.
-   **Vanilla Implementation (vanilla.js/ts)**: These files provide a simple initialization of the chart for both JavaScript and TypeScript. The `create` function calls the `drawExample` function and returns a destructor to clean up the chart when necessary.
-   **Image File (javascript-vertical-charts.jpg)**: This image file is used to represent the example visually in documentation or galleries.

## Customization

Key configuration options demonstrated in this example include:

-   **Axis Configuration**: Setting the X axis alignment to Left and the Y axis alignment to Bottom rotates the chart vertically. The axis titles and growBy ranges are also configured to improve readability.
-   **Series Styling**: The fast line series is customized with a stroke thickness of 5, a vivid orange stroke color, and an ellipse point marker with specified width, height, fill, and stroke colors.
-   **Annotations and Interactivity**: A native text annotation explains how to achieve the vertical layout. Various chart modifiers (ZoomPan, ZoomExtents, MouseWheelZoom) are added to provide interactive capabilities.

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
