# Use Point Markers Example

## Overview

This example demonstrates how to use different point marker types with SciChart.JS. The example shows five different point marker implementations – Ellipse, Square, Triangle, Cross, and a Custom Image Marker – applied to line and scatter series. Implementations for Angular, React, and plain JavaScript/TypeScript are provided in this example.

## Technologies Used

-   SciChart.JS
-   Angular (using scichart-angular)
-   React (using scichart-react)
-   JavaScript/TypeScript

## Code Explanation

The main chart logic is encapsulated in the `drawExample` function provided in both JavaScript (`drawExample.js`) and TypeScript (`drawExample.ts`) versions. This function sets up the SciChartSurface, defines numeric X and Y axes, and creates five data series. Each data series is rendered with a different point marker: an EllipsePointMarker, SquarePointMarker, TrianglePointMarker, CrossPointMarker, and a custom marker using SpritePointMarker (loading an image asynchronously). The example also adds common chart modifiers like ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier, and a LegendModifier.

The Angular implementation is provided in the `angular.ts` file which configures the SciChartAngularComponent by passing the `drawExample` function as its initializer. The React implementation is contained in the `index.tsx` file, where the `SciChartReact` component is used to initialize the chart with the same `drawExample` function, along with importing the custom marker image asset.

## Customization

Key configurations in the example include marker size, fill and stroke colors as defined by the `appTheme` settings, and the stroke thickness for both the line series and the point markers. The chart modifiers allow interactive zooming and panning, and the LegendModifier enables a legend display with a horizontal orientation at the top left of the chart.

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
