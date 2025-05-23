# Interactive Waterfall Chart Example

## Overview

This example demonstrates an interactive waterfall chart built using SciChart.JS. In this example a waterfall chart is created by stacking 50 spectral line series, each generated by performing a Fourier transform on artificially generated time domain data. The main chart displays the waterfall series while two additional cross-section charts display detailed views based on the current series selection and a drag-enabled annotation. The example is implemented for multiple frameworks, including React and Angular, and includes TypeScript/JavaScript implementations.

## Technologies Used

-   SciChart.JS – High performance JavaScript charting library
-   SciChartJsNavyTheme – A predefined chart theme
-   Angular – For the Angular implementation (found in angular.ts)
-   React – For the React implementation (found in index.tsx)
-   TypeScript/JavaScript – Core example logic is implemented in drawExample.ts and drawExample.js

## Code Explanation

-   **angular.ts**: Sets up an Angular component which uses the SciChartAngularComponent. It initializes three SciChart surfaces (main, left section, right section) via the API provided by the helper function `getChartsInitializationAPI` (imported from drawExample). Once all three charts are initialized, the configuration is applied to link interactions across the charts.
-   **drawExample.js / drawExample.ts**: Contains the core functionality of the example. This file generates synthetic spectral data by combining sine wave components and performing a Fourier transform on the generated time data. It then creates 50 individual series with separate X and Y axes that are offset to produce the waterfall effect. A custom palette provider is implemented to highlight the data points near the index selected by a draggable annotation. Additionally, chart modifiers are set up for zooming, panning, and selection. Two cross-section charts are created: one updates to reflect selected or hovered series and the other shows a cross-section slice based on the drag annotation position.
-   **index.tsx**: Implements a React component that loads the example charts using the SciChartReact component and a ChartGroupLoader. The React component initializes the charts using the same `getChartsInitializationAPI` and applies post-initialization configuration to link interactive behavior across the main and cross-section charts.
-   **javascript-interactive-waterfall-chart.jpg**: A sample image preview of the interactive waterfall chart demonstrating its appearance.

## Customization

Key configuration options for this example include:

-   **Series and Axes Configuration**: The number of series (set to 50) and their individual X/Y axis offsets are configurable. Adjusting these values will change the density and appearance of the waterfall chart.
-   **Data Generation**: The synthetic spectral data is generated using configurable sine wave frequencies and amplitudes. Modifying these parameters affects the spectral shape.
-   **Annotations and Interaction Modifiers**: The drag annotation (with custom SVG) allows the user to select a particular data slice. The example also uses selection and hover modifiers to update styles (stroke color and thickness) for interactivity.
-   **Styling and Themes**: The example makes use of the SciChartJsNavyTheme, but this can be replaced or tweaked for different visual styles.

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
