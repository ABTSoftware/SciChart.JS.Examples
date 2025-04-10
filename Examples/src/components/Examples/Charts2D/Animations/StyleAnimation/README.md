# Style Animation Example

## Overview

This example demonstrates how to animate both data updates and style changes on a band series chart using SciChart.js. It toggles between two different style presets, updating stroke thickness, colors, and fill gradients. The example includes implementations for Angular and React, along with a Vanilla JavaScript version.

## Technologies Used

-   SciChart.js (including FastBandRenderableSeries, NumericAxis, SciChartSurface, and animation modifiers)
-   Angular (via scichart-angular)
-   React (using scichart-react and Material UI for UI controls)
-   Material UI (for the toggle button group in the React version)

## Code Explanation

-   **angular.ts**: The Angular component initializes a SciChart chart using the scichart-angular component. It passes a reference to the `drawExample` function that sets up the chart.
-   **drawExample.js / drawExample.ts**: These files contain the core logic for the example. They create a SciChartSurface with numeric X and Y axes, generate sample sine and cosine data, and create a band series with initial stroke and fill styles. The `animateChartStyle` function is defined to switch between two style presets, updating both the data and the visual style using the BandAnimation. Interactivity is added via zoom, pan, and mouse wheel modifiers.
-   **index.tsx**: This React component renders the chart using the SciChartReact component. It includes a toggle button group (from Material UI) that allows users to choose between the two animation styles. When a toggle button is pressed, the component calls the chart's `animateChartStyle` control function to update the styles.
-   **javascript-style-animation.jpg**: A screenshot image of the example is provided to show how the animated chart appears.

## Customization

Key configurations in this example include:

-   **Animation Duration**: Set to 1000 milliseconds within the BandAnimation configuration.
-   **Style Settings**: The chart toggles between two presets; for example, one style uses a stroke thickness of 4 while the alternate uses 8, with corresponding changes to stroke and fill colors.
-   **Data Generation**: The sine and cosine data strings are adjusted slightly based on the selected style for visual effect.

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
