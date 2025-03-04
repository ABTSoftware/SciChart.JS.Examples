# Population Pyramid

## Overview

This example demonstrates how to create a population pyramid chart using SciChart.JS. It renders a stacked column chart that visualizes population data for both male and female populations, divided by regions (Africa and Europe) and grouped by age ranges. The example is implemented for Angular, React, and Vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS
-   Angular (standalone component using scichart-angular)
-   React (using SciChartReact)
-   Vanilla JavaScript and TypeScript
-   TypeScript for type safety

## Code Explanation

-   **Angular.ts**: Contains the Angular component that wraps the SciChart chart using the scichart-angular component. It assigns the chart initialization function (drawExample) to the Angular template.
-   **drawExample.js/ts**: The core file where the chart is defined and rendered. In this file, the SciChartSurface is created, along with a numeric X-axis representing age and two synchronized Y-axes for male and female data. Population data for Africa and Europe is split into male and female series and then rendered as stacked columns. A custom data label manager is implemented to avoid overlapping labels. Wave animations are applied to the series and legends with series exclusions are configured to distinguish between male and female series in the two legends.
-   **index.tsx**: Provides a React implementation of the example, initializing the chart via the SciChartReact component by passing the drawExample function.
-   **vanilla.js/ts**: Show how to create and dispose of the chart using plain JavaScript or TypeScript by calling the drawExample function and then calling the returned destructor to delete the chart when no longer needed.

## Customization

Key configuration options include:

-   **Animation Duration**: WaveAnimation is set with a duration of 1000 milliseconds for the series.
-   **Axis Configuration**: The X-axis is configured with a fixed visible range and customized tick generation, while the two Y-axes are synchronized to always display the full range of data.
-   **Data Labels**: Data labels are styled with custom fonts, margins, and a custom layout manager is used to prevent overlapping labels.
-   **Legends**: Separate legends for male and female series are set up with checkboxes and series markers. Specific series are excluded from each legend for clarity.

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
