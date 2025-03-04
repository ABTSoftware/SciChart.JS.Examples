# Dynamic Layout Example

## Overview

This example demonstrates how to dynamically switch between a single chart view and a grid layout (one chart per series) using SciChart.JS. The functionality is implemented in a React application using hooks, and it features animated transitions between the two layouts.

## Technologies Used

-   SciChart.JS (2D charting library)
-   React with TypeScript (TSX)
-   Material UI (ToggleButton and ToggleButtonGroup for the toolbar)
-   SciChart React Components and Context API

## Code Explanation

The example consists of two main source files:

**GridLayoutModifier.ts**: This file defines a custom chart modifier that extends SciChart.JS’s ChartModifierBase2D. It provides methods for dynamically creating a grid layout of sub-charts (one per series) via the `makeGridLayout` method, as well as reverting back to a single chart view using `makeSingleChart`. Animated transitions for chart panels are handled using animation utilities like `GenericAnimation` and easing functions.

**index.tsx**: This is the main React component. It initializes a SciChartSurface, adds numeric axes, and generates several series using a random walk generator. In addition to standard chart modifiers (ZoomExtents, MouseWheelZoom, ZoomPan, and Rollover), it adds the custom GridLayoutModifier. A toolbar implemented with Material UI’s ToggleButtonGroup allows the user to switch between the “Single Chart” and “Chart Per Series” layouts. The component utilizes React hooks and the SciChartSurfaceContext to manage and update the chart dynamically.

A preview image file (`javascript-dynamic-layout.jpg`) is also included in the directory.

## Customization

Key configuration options include:

-   The number of columns for the grid layout (default is 2).
-   Animation duration (set to 500ms) and easing functions for smooth animated transitions.
-   Styling options such as sub-chart title styles and border settings, which are configured using a custom theme (appTheme).

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
