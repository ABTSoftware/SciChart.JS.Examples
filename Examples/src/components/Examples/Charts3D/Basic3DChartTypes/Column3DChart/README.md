# 3D Column Chart Example

## Overview

This example demonstrates how to create an interactive 3D Column Chart using SciChart.JS. The chart showcases 3D column series with configurable column shapes and color modes. The example provides interactive controls for switching between different column shapes (Cylinder, Cube, Pyramid, Sphere) and color modes (X, XZ, Height, Series), as well as a slider to adjust the width of the individual data points. This example is implemented using TypeScript and React.

## Technologies Used

-   SciChart.JS – for high performance 3D charting
-   SciChart3DSurface and related 3D components from the SciChart library
-   React with TypeScript – for creating the interactive component
-   Material UI – for form controls and slider components
-   WASM – for high performance WebAssembly back-end context

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the core logic to set up the SciChart3DSurface. They create a 3D chart surface with a defined camera, watermarks, and chart modifiers (mouse wheel zoom and orbit). Numeric 3D axes are added along the X, Y, and Z directions. The code creates a ColumnRenderableSeries3D using an XyzDataSeries3D and a configurable point marker. Utility functions such as `createPointMarker3D` help choose between different column shapes, while the `colorInterpolation` function calculates vertex colors based on data values. A helper function is also defined to update the data and colors of the series dynamically.
-   **index.tsx**: This React component integrates the 3D chart into a React application using the SciChartReact component. It initializes the chart using the `drawExample` function and provides UI controls (dropdowns and slider) that allow users to change the column shape, adjust the color mode, and modify the data-point width in real time. The component demonstrates how to interact with the underlying SciChart 3D surface from a React context.
-   **javascript-3d-column-chart.jpg**: This image asset is provided as part of the example to illustrate the 3D column chart output.

## Customization

The example is highly configurable:

-   **Column Shape**: Change the visual appearance of the columns by choosing from Cylinder, Cube, Pyramid, or Sphere point markers using the provided dropdown.
-   **Color Mode**: Switch between different color interpolation modes (X, XZ, Height, Series) to see how colors change based on column data.
-   **Data-Point Width**: Use the slider control to adjust the width of each column along the X and Z dimensions.

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
