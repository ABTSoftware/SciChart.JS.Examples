# Hit Test API Example

## Overview

This example demonstrates the use of the SciChart.js Hit Test API by allowing users to click on the chart to determine if a data point or a segment of a series is hit. Users can switch between three hit test methods: testing the nearest data-point (hitTestDataPoint), testing using an X-slice (hitTestXSlice), and performing a full two-dimensional hit test (hitTest). The example includes implementations in both Vanilla JavaScript/TypeScript and React.

## Technologies Used

-   SciChart.js for high performance real-time charting
-   SciChart React for React integration (TSX implementation)
-   Material-UI for toggle buttons in the React component
-   JavaScript and TypeScript

## Code Explanation

-   The files `drawExample.js` and `drawExample.ts` are responsible for creating the SciChartSurface, configuring axes, adding a line series with sample data, and registering a mouse event to trigger hit tests based on the selected method.
-   The file `index.tsx` contains the React component which integrates the SciChartSurface with a toggle button group. This allows for dynamic switching between hit test methods during runtime.
-   The files `visualizeHitTest.js` and `visualizeHitTest.ts` provide helper functions to visualize the hit test results through animations and annotations, such as temporary scatter series markers, line annotations, and text annotations indicating a hit or a miss.

## Customization

-   The hit test method can be changed at runtime via toggle buttons in the React component, enabling the demonstration of three different hit test approaches.
-   Chart properties such as animation duration, stroke thickness, and point marker styles are configurable using parameters such as theme colors from `appTheme`, animation settings, and annotation styles.
-   A watermark annotation displays the current hit test method being used for clarity during interactions.

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
