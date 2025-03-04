# Generic Animation Example

## Overview

This example demonstrates how to create rich animated charts using SciChart.js. It illustrates a bubble chart with animated transitions including a typewriter effect on the chart title, annotations fading in and out, and a smooth data series swap. Implementations are provided for React (TSX), Angular (TypeScript), and Vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.js core library
-   SciChart Angular components (scichart-angular)
-   SciChart React components (scichart-react)
-   Vanilla JavaScript and TypeScript
-   GenericAnimation for custom animations

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the main logic. They set up a SciChartSurface with numeric axes and renderable bubble series. The code adds several annotations and uses multiple instances of GenericAnimation to animate the chart title (using a typewriter effect), then fade in annotations and gradually swap data series along with relabeling and zooming the axis range.
-   **angular.ts**: This Angular component imports the SciChart Angular component and uses the drawExample function to initialize the chart. It demonstrates how to integrate the chart into an Angular application.
-   **index.tsx**: This React component initializes the chart using the SciChart React component. It shows how to incorporate the example into a React-based project.
-   **vanilla.js / vanilla.ts**: These files provide a simple Vanilla JavaScript/TypeScript implementation that calls the drawExample function to create the chart on a specified DOM element, along with a cleanup function to dispose of the chart when needed.

## Customization

The key configuration options in the example include:

-   **Animation Durations and Delays**: The typewriter effect is set to run for 2000ms with no delay, while subsequent animations (such as fading annotations and swapping data series) have durations of 2000ms to 3000ms and specific delays (e.g., 2000ms, 5000ms, and 7000ms) to sequence the animations.
-   **Chart Styles**: The example customizes the SciChartSurface title (font size, color, and placement), axis titles, and point marker styles (fill color, opacity, size).
-   **Data Transformation**: The bubble series are created by normalizing the z-values (GDP per capita and population) to control the bubble sizes, and the animation also changes the visibility and opacity of the series to transition between datasets.

## Running the Example

To run any example from the SciChart.JS.Examples repository, follow these steps:

1. **Clone the Repository**: Download the entire repository to your local machine using Git:

    git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git

2. **Navigate to the Examples Directory**: Change into the `Examples` folder:

    cd SciChart.JS.Examples/Examples

3. **Install Dependencies**: Install the necessary packages using npm:

    npm install

4. **Run the Development Server**: Start the development server to view and interact with the examples:

    npm run dev

    This will launch the demo application, allowing you to explore various examples, including the one in question.

For more detailed instructions, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
