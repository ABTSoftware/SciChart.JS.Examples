# Using Vertical Slice Modifier Example

## Overview

This example demonstrates how to create interactive SciChart.JS charts with vertical slice modifiers. The vertical slice modifiers allow you to display draggable vertical lines with customized rollover tooltips and linked annotations. The example includes implementations for Angular, React, and Vanilla JavaScript/TypeScript.

## Technologies Used

-   **SciChart.JS** for high performance interactive charting
-   **Angular** using the SciChart Angular component
-   **React** using the SciChartReact component
-   **Vanilla JavaScript/TypeScript** for standalone implementations
-   Various SciChart modifiers including VerticalSliceModifier, ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier

## Code Explanation

The core chart creation logic is encapsulated in the `drawExample` function (provided in both JavaScript and TypeScript versions). This function creates a SciChartSurface, configures numeric X and Y axes, and adds three line series with Fourier series data. It then sets up two vertical slice modifiers with different configurations:

-   One modifier uses a data value coordinate mode and is linked to an annotation that moves with the data. It also uses custom tooltip legend and data templates.
-   The other modifier uses a relative coordinate mode with a fixed position.

Additional customizations include per-series tooltip property modifications and the addition of zooming and panning modifiers. Framework-specific files wrap the `drawExample` function:

-   **Angular (angular.ts):** Registers a standalone Angular component that embeds the `scichart-angular` component and passes the `drawExample` function.
-   **React (index.tsx):** Exports a React component that uses the `SciChartReact` component to initialize the chart through `drawExample`.
-   **Vanilla (vanilla.js and vanilla.ts):** Call the `drawExample` function directly and provide a cleanup function to delete the chart when necessary.

## Customization

Key configuration options in this example include:

-   **VerticalSliceModifier Options:** Initial X value, coordinate mode (data value or relative), draggable flag, and display options for rollover lines and tooltips.
-   **Custom Tooltip Templates:** The example overrides default tooltips by supplying custom legend and data templates.
-   **Per-Series Customization:** Individual renderable series rollover properties are modified to customize tooltip text and background colors.
-   **Additional Modifiers:** ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier are added to enhance user interaction with the chart.

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
