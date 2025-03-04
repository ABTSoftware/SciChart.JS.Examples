# Data Labels

## Overview

This example demonstrates how to add and customize data labels on different series within SciChart.JS. The example shows how to render a column series, a spline line series, and two fast line series with data labels that are either automatically formatted, metadata driven, or custom-generated based on peak detection. Implementations for Angular, React, and Vanilla JavaScript are provided.

## Technologies Used

-   **SciChart.JS**: Core charting library
-   **Angular**: Uses the ScichartAngularComponent to initialize the chart via the `drawExample` function
-   **React**: Uses the SciChartReact component to initialize the chart in a TSX file
-   **Vanilla JavaScript/TypeScript**: Standalone implementations calling the same `drawExample` function
-   **TypeScript** and **JavaScript**: Both languages are demonstrated in the examples

## Code Explanation

-   **drawExample.js / drawExample.ts**: This file contains the main logic for creating and rendering the chart. It sets up a SciChartSurface with numeric X and Y axes. It then adds multiple renderable series:
    -   A FastColumnRenderableSeries with data labels that are styled (font family, font size, padding) and custom colored based on the y-value (high or low).
    -   A SplineLineRenderableSeries that uses metadata from the data series to drive data label text, showing how labels can be sourced directly from data values.
    -   A FastLineRenderableSeries that uses a custom `getText` function to display labels only for peaks, formatting the x and y values with specific numeric formats.
    -   An additional FastLineRenderableSeries is configured to show labels when zoomed in, using a `pointGapThreshold` to manage when labels are rendered.
-   **angular.ts**: Bootstraps the chart in an Angular standalone component by referencing the `drawExample` function and embedding the ScichartAngularComponent in its template.
-   **index.tsx**: Provides a React component that initializes the chart by passing `drawExample` to the SciChartReact component, along with a wrapper style.
-   **vanilla.js and vanilla.ts**: These files demonstrate how to create the chart using plain JavaScript or TypeScript. They call the `drawExample` function on a DOM element with the id `chart` and return a destructor function to clean up the chart when needed.

## Customization

The example highlights several key customization options:

-   **Data Label Styling**: Data labels are customized using properties such as `fontFamily`, `fontSize`, `color`, and `padding` (using the Thickness class).
-   **Conditional Formatting**: The FastColumnRenderableSeries uses a custom `getColor` function to choose different label colors based on the data point’s y-value.
-   **Metadata Driven Labels**: The SplineLineRenderableSeries demonstrates how to pull in label text directly from metadata associated with each data point.
-   **Custom Label Text**: The FastLineRenderableSeries defines a `getText` method that only returns text for data points that are local peaks, formatting the x and y values using the provided numeric formats.
-   **Zoom-Dependent Label Rendering**: For one of the FastLineRenderableSeries, a `pointGapThreshold` is set so that data labels only render when there is enough space (typically when zoomed in).

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
