# Heatmap Interactions

## Overview

This example demonstrates interactive heatmap interactions using SciChart.JS. It features a 2D wave simulation rendered as a heatmap with integrated cross section, input, and output charts. The example is implemented using three different frameworks: Vanilla JavaScript, Angular (TypeScript), and React (TypeScript/TSX). Users can interact with the simulation by adding inputs and outputs through custom annotations and dragging points to update the data series in real‑time.

## Technologies Used

-   SciChart.JS library (including SciChartSurface, NumericAxis, UniformHeatmapDataSeries, UniformHeatmapRenderableSeries, HeatmapColorMap, and more)
-   Custom modifiers and annotations (AddIOModifier, DiscreteAxisMarker, PointDragModifier)
-   Framework integrations: Vanilla JavaScript, Angular (TypeScript), and React (TSX)

## Code Explanation

-   **AddIOModifier.js/ts**: Implements a custom chart modifier that listens for mouse events on the heatmap. It displays two annotations—one for adding an input and one for adding an output—based on where the user clicks. When the mouse is released, the modifier calculates the corresponding data value on the axes and triggers callbacks (`onAddInput` or `onAddOutput`) to integrate new interactive elements into the simulation.

-   **DiscreteAxisMarker.js/ts**: Defines a discrete axis marker that snaps to a specified step size. This marker is used on the input chart to define frequency locations in a discrete manner, ensuring that values align to specific intervals.

-   **PointDragModifier.js/ts**: Enables interactivity by allowing users to drag points directly on a renderable series. It uses hit-testing to determine which series is selected and then updates data values as the mouse is moved.

-   **drawExample.js/ts**: Contains the main chart initialization logic and the 2D wave simulation algorithm. This file sets up multiple SciChart surfaces:

    -   A main heatmap chart for displaying the 2D wave
    -   A cross section chart for analyzing waveforms along horizontal and vertical lines
    -   An input chart where driving signal series are generated and modified using axis markers
    -   A history chart for tracking point outputs over time

    It integrates the custom modifiers and annotations to allow users to add new inputs/outputs and interact with the simulation. The simulation updates heatmap data on a timer, applying damping and velocity adjustments across the grid.

-   **angular.ts**: Implements an Angular component that initializes the SciChart surfaces using an API defined in `drawExample`. It provides a toolbar with buttons to start or stop the simulation, load preset configurations (such as a basic two-point setup or a double slit interference example), and display help information.

-   **index.tsx**: Provides the React version of the example. It creates a React component that uses SciChartGroup and SciChartReact components to render the main heatmap, cross section, input, and history charts. A toolbar is included to control simulation execution and switch between example configurations.

## Customization

Key configurable options include:

-   **Wave Simulation Parameters**: Options such as the damping factor, timestep, and how the simulation calculates new heatmap values. These determine the decay and propagation behavior of the 2D wave.
-   **Annotation and Marker Settings**: The AddIOModifier and DiscreteAxisMarker are customizable through properties like stepSize and text styling, allowing you to adjust the snapping behavior and appearance of added annotations.
-   **Chart Appearance**: The example utilizes the SciChartJS theme along with various axis and gridline configurations to control the overall look and feel of each chart. The heatmap’s color map is also defined via custom gradient stops.

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
