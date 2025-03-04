# User Annotated Stock Chart Example

## Overview

This example demonstrates a fully interactive stock chart using SciChart.JS. It shows how users can annotate a candlestick stock chart by drawing line annotations and placing trade markers (buy and sell markers). In addition, it includes a vertical ruler modifier that enables dynamic measurement on the chart. There are implementations for Angular and React, as well as Vanilla JavaScript, making it versatile for different frameworks.

## Technologies Used

-   **SciChart.JS** – High-performance charting library used for rendering financial charts.
-   **Angular** – Implementation using Angular components and Angular Material for the UI toolbar.
-   **React** – Implementation using TSX with SciChartReact and Material-UI components.
-   **Vanilla JavaScript** – Example files written in plain JavaScript (ES Modules) for chart configuration and interactivity.

## Code Explanation

-   **Angular Component (angular.ts):** Implements a standalone Angular component that initializes the SciChartSurface using the provided `drawExample` function. It includes a toolbar with toggle buttons to switch between pan, line, and marker modes. It also provides functionality to save, load, and reset the chart state using local storage.
-   **React Component (index.tsx):** Provides a React implementation of the example. It utilizes SciChartReact to initialize the chart and Material-UI components for the interactive toolbar allowing users to switch chart modes and save/load chart definitions.
-   **Chart Initialization (drawExample.js/ts):** These files set up the SciChartSurface, add a candlestick series for displaying OHLC data along with moving average lines. They also add interactivity modifiers: Zoom Extents, Mouse Wheel Zoom, Zoom Pan, and the custom modifiers for creating trade markers and line annotations. The function returns a set of control methods (getDefinition, applyDefinition, resetChart, setChartMode) that are used by the UI to manage chart state.
-   **Custom Annotation Modifiers:**
    -   _CreateLineAnnotationModifier.js/ts_: Handles the drawing of editable line annotations. It listens for mouse events to begin, update, and complete drawing a line annotation, which can be deleted via Ctrl+click.
    -   _CreateTradeMarkerModifier.js/ts_: Manages the placement of buy and sell markers on the chart. It responds to left and right mouse clicks to place corresponding marker annotations with custom SVG content.
    -   _RulerModifier.js/ts_: Implements a vertical ruler modifier that adds a resizable box annotation representing a measurement ruler. It customizes the layout of an inner axis based on the ruler’s dimensions, allowing users to dynamically measure values on the chart.

## Customization

Key configuration options in this example include:

-   **Chart Modes:** You can switch between pan, line drawing, and marker modes using the toggle buttons. Each mode enables/disables the corresponding modifier.
-   **Annotations:** The line and trade marker annotations are configurable. The line annotation modifier sets properties such as stroke thickness and editability, while the trade marker modifier uses custom SVG strings for buy (green) and sell (red) markers.
-   **Vertical Ruler:** The ruler modifier adjusts the inner y-axis layout based on the bounds of a box annotation. Its properties (such as size, offset, and visible range) are automatically recalculated based on user interaction.
-   **Local Storage:** You can save the current chart state (including annotations and visible range) to local storage and reload it later, making it easy to preserve user work.

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
