# Digital Mountain Chart

## Overview

This example demonstrates how to create a digital mountain chart using SciChart.JS. It showcases implementations for multiple frameworks including React, Angular, and Vanilla JavaScript/TypeScript. The chart displays a digital mountain renderable series based on a random walk data set, featuring a gradient fill, digital line style, and wave animation.

## Technologies Used

-   **SciChart.JS** – Core charting library
-   **Angular** – Example implemented in Angular (using scichart-angular)
-   **React** – Example implemented in React (using scichart-react)
-   **Vanilla JavaScript/TypeScript** – Standalone example

## Code Explanation

-   **drawExample.ts / drawExample.js**: Contains the main function that sets up the SciChartSurface, configures the numeric X and Y axes, and creates a Fast Mountain Renderable Series. A random walk generator is used to produce 200 data points. The mountain series is configured with a digital line style, gradient fill (using both solid color and fillLinearGradient), and a wave animation effect with a duration of 1000 ms. Chart modifiers for zoom extents, rubberband zoom, and mouse wheel zoom are added for interactivity.
-   **angular.ts**: Defines an Angular standalone component that integrates the SciChartAngularComponent and passes the drawExample function to initialize the chart.
-   **index.tsx**: A React component that uses SciChartReact to initialize the chart by calling drawExample. It demonstrates how SciChart can be used with React.
-   **vanilla.js / vanilla.ts**: Standalone scripts that call drawExample on an HTML element (with id "chart") and provide a cleanup (destructor) function to delete the SciChartSurface when needed.

## Customization

Key configuration options in this example include:

-   **Animation**: The mountain series is animated with a WaveAnimation configured for a 1000 ms duration and a fade effect.
-   **Chart Styling**: The stroke is set to a vivid orange color with a thickness of 3, and the fill uses a gradient that transitions from a muted orange to transparent.
-   **Digital Line Style**: The property `isDigitalLine` is set to true ensuring the mountain series renders with a digital look.
-   **Interactivity**: Zoom modifiers (Zoom Extents, Rubber Band XY Zoom, and Mouse Wheel Zoom) are added to allow interactive exploration of the chart.

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
