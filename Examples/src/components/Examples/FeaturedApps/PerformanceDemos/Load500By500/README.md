# Load 500 by 500 (Load Five Hundred by Five Hundred)

## Overview

This example demonstrates how to efficiently load and render 500 data series with 500 points per series (a total of 250k data points) in SciChart.JS. The example is implemented with both Angular and React frameworks. It showcases the dynamic updating of large datasets using randomly generated data and measures performance durations for data generation, data appending, and frame rendering.

## Technologies Used

-   **SciChart.JS** for high-performance charting
-   **Angular** with standalone components and Angular Material UI
-   **React** with Material UI components and SciChartReact integration
-   **TypeScript** and **JavaScript** for implementation

## Code Explanation

-   **Angular Implementation (angular.ts):**

    -   Defines a standalone Angular component that imports various Angular Material modules and the `ScichartAngularComponent`.
    -   Uses the `drawExample` function to initialize the SciChartSurface and sets up event handlers for chart initialization and deletion.
    -   Provides a toolbar with a reload button and displays performance results for data generation, appending, and rendering.

-   **React Implementation (index.tsx):**

    -   Uses the `SciChartReact` component from SciChart.JS along with Material UI components to build the UI.
    -   Implements controls for starting, pausing, and reloading the performance test.
    -   Updates performance results in an alert notification based on time measurements captured during data load and render events.

-   **Chart Setup and Data Generation (drawExample.ts and drawExample.js):**

    -   Both files contain the core logic to create the SciChartSurface, add numeric X and Y axes, and create 500 empty line series.
    -   Random walk data is generated for each series, and the data is appended in batches. Performance durations for data generation, appending, and the rendering of the first frame are measured and reported.
    -   Interactivity is added by including modifiers such as ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier.

-   **Supporting Files:**
    -   An image file is included as a screenshot reference for the performance demo.

## Customization

-   **Series and Points Count:** The number of series (500) and points per series (500) are defined as constants. Adjust these values to alter the data load.
-   **Animation and Update Options:** The example uses a timer (setInterval with 200ms interval) to reload data points continuously. This behavior can be modified by changing the interval or using the available control functions (`startUpdate`, `stopUpdate`, and `reloadOnce`).
-   **Chart Orientation:** The chart supports an optional vertical layout via a parameter (`useVerticalChart`), which adjusts axis alignment and flipped coordinates.

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
