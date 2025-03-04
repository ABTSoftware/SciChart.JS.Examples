# Real Time Mountain Chart

## Overview

This example demonstrates a real-time updating mountain chart using SciChart.JS. The chart displays a mountain series based on a random walk data series that is updated every second with animated transitions. The example is implemented for multiple frameworks including Angular and React, and it also provides a vanilla JavaScript version.

## Technologies Used

-   **SciChart.JS**: High performance charting library
-   **Angular**: Uses the ScichartAngularComponent for Angular integration
-   **React**: Uses the SciChartReact component for React integration
-   **Vanilla JavaScript/TypeScript**: Core chart rendering and animation logic implemented in drawExample.js and drawExample.ts
-   **Animation Utilities**: Utilizes DoubleAnimator and easing functions for animating data updates
-   **Custom Annotations**: Renders an animated pulsing dot using SVG annotations

## Code Explanation

-   **angular.ts**: Defines an Angular component that wraps the SciChartAngularComponent. It provides initialization and deletion handlers to start and stop the real-time updates using the drawExample function.
-   **drawExample.js / drawExample.ts**: Contains the main logic for creating the SciChartSurface, configuring numeric axes, creating a mountain renderable series with a gradient fill, and animating the addition of new data points. The code also defines a custom annotation (an animated pulsing dot) that tracks the latest data point as it animates to a new position.
-   **index.tsx**: Implements the React version of the example by wrapping the chart creation logic in the SciChartReact component. Similar to the Angular implementation, it starts the data updates upon initialization and stops them on deletion.
-   **javascript-realtime-mountain-chart.jpg**: A preview image for the example.

## Customization

-   **Animation Duration & Easing**: The animation for updating the chart is configured with a 250ms duration and uses an easing function (`easing.outExpo`).
-   **Chart Styles**: The mountain series is styled with a gradient fill (from a vivid sky blue to transparent) and a stroke color/thickness for a clear visual effect.
-   **Data Generation**: The example uses a random walk generator to simulate real-time data, which can be adjusted by modifying the generator settings.

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
