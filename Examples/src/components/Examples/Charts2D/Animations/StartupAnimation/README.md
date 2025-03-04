# Startup Animation Example

## Overview

This example demonstrates how to apply a sequence of series startup animations to a chart using SciChart.JS. The animations—Wave, Sweep, Scale, and Fade—are applied sequentially to both a bubble series and a line series. This example has implementations for both React (using TypeScript in the index.tsx file) and Vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS
-   React (via SciChartReact in the index.tsx file)
-   Vanilla JavaScript and TypeScript
-   SciChart surface, axes, renderable series, and annotations

## Code Explanation

-   **drawExample.js/ts**: This file sets up the SciChart chart by creating a SciChartSurface, adding two numeric axes, and creating sample data. It initializes two series—a bubble series and a line series—and applies four different animations (wave, sweep, scale, and fade) in a continuous loop. A typewriter effect is implemented to update a watermark annotation with the current animation name.
-   **index.tsx**: This React component imports the drawExample function and uses the SciChartReact component to initialize the chart within a React application.
-   **vanilla.js/ts**: These files provide a vanilla JavaScript/TypeScript implementation to create and render the chart on a specified root element. They also return a destructor function to properly clean up the chart instance when needed.
-   **javascript-startup-animations.jpg**: An image asset included in the example directory (typically used for preview purposes in documentation or galleries).

## Customization

Key configuration options include:

-   **Animation Duration**: Each animation (wave, sweep, scale, fade) is set to a duration of 1000 milliseconds.
-   **Animation Effects**: The wave animation includes a fade effect, and a generic typewriter animation is used to update the watermark annotation text dynamically.
-   **Chart Appearance**: The chart uses a custom theme from the provided appTheme, numeric axes, and includes interactive chart modifiers such as zoom, pan, and mouse wheel zoom.

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
