# Simple Chart

## Overview

This example demonstrates how to create a simple two-dimensional chart using SciChart.JS. The chart is built with the Builder API, which allows chart configuration with JavaScript objects or JSON. The example shows implementations for multiple frameworks including React (using TSX) and Vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS
-   Builder API for chart creation
-   React (for the React implementation)
-   Vanilla JavaScript and TypeScript

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the main chart drawing logic using the Builder API. They configure the chart surface, add numeric x and y axes with a growBy parameter, configure a Spline Line Series with animation options (Scale with a duration of 500ms), and add SVG text annotations. The chart is built by passing a JavaScript object configuration to the Builder API.
-   **index.tsx**: This React component imports the SciChartReact component and initializes the chart by calling the drawExample function. It integrates the chart into a React application.
-   **vanilla.js / vanilla.ts**: These files demonstrate a Vanilla implementation where the chart is created on an element with the id "chart". They also include logic to dispose of the chart by calling the delete() method on the sciChartSurface.
-   **javascript-builder-simple.jpg**: This is an image file included in the directory, likely serving as a visual preview or a placeholder for the example.

## Customization

The example allows customization of key chart properties:

-   **Axes**: Numeric axes are used with a configurable growBy parameter (0.1 on both sides).
-   **Series**: A Spline Line Series is utilized, with options like stroke thickness, interpolation points, and a vivid teal stroke color. Animation settings are applied with a Scale animation over 500ms.
-   **Annotations**: Two SVG text annotations are added. One annotation displays "Builder API Demo" while the other explains the usage of JSON objects for SciChart chart creation. Both annotations include options for text size, opacity, and coordinate mode set to Relative.

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
