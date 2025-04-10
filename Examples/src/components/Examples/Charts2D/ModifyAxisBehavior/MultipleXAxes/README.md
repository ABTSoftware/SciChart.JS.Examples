# Multiple X Axes

## Overview

This example demonstrates how to create a SciChart.JS chart with multiple X and Y axes. In this example, two separate axis pairs are created: a primary pair (bottom and left) and a secondary pair (top and right). Two line series are rendered on the chart, with each series bound to its respective axis pair. The example includes implementations for React (TSX) as well as Vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS (using modules such as SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries, and various modifiers and annotations)
-   React (via the provided TSX component in index.tsx)
-   Vanilla JavaScript/TypeScript

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files define the main function that creates the chart. The function initializes a SciChartSurface with a selected theme and then adds two X axes and two Y axes (one pair for the primary blue series and one pair for the secondary orange series). It uses a random walk generator to produce data for two FastLineRenderableSeries, binding each series to its corresponding axes by using axis IDs. In addition, several interactive modifiers (e.g. zoom, pan, drag) and annotations are added for enhanced interactivity and clarity.
-   **index.tsx**: This file contains a React component which initializes the chart by invoking the drawExample function through the SciChartReact component. This allows the example to be embedded in a React application environment.
-   **vanilla.js / vanilla.ts**: These files provide a lightweight example for using the chart in a plain JavaScript or TypeScript environment. They call the drawExample function passing in the id of the container element and provide a cleanup mechanism via a destructor function.
-   **javascript-chart-with-multiple-x-axis.jpg**: This image file likely shows a preview or screenshot of the resulting chart.

## Customization

Key configuration options in this example include:

-   **Axis Styles**: Each axis pair is styled differently. The primary axes are styled with blue colors including custom title styles, label styles, background color, and borders. The secondary axes use orange colors with right-aligned labels and a specified numeric format.
-   **Data Series Configuration**: The line series are customized with properties such as stroke color, thickness, point markers, and are explicitly tied to the corresponding axes via axis IDs.
-   **Modifiers and Annotations**: Interactive chart modifiers (including zoom, pan, and drag modifiers) are added for user interactivity. Text annotations provide guidance on which series is bound to which axis pair.

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
