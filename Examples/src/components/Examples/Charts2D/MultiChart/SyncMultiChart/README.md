# Synchronize Multiple Charts

## Overview

This example demonstrates how to synchronize multiple chart surfaces using SciChart.JS within a React (TSX) application. The sample shows a dynamic grid of charts with one overview chart and several detail charts that share a common X-axis visible range. The example highlights the use of a custom axis synchronizer to propagate changes across the charts and allows users to add or remove charts dynamically, as well as toggle synchronization on and off.

## Technologies Used

-   **React**: The example is implemented as a React component using TSX.
-   **SciChart.JS**: Utilized for creating and managing high-performance charts.
-   **Material-UI (MUI)**: Used for components such as buttons, checkboxes, and typography.
-   **tss-react/mui**: For custom styling.

## Code Explanation

-   **index.tsx**: This is the main component file. It defines a React functional component named `SyncMultiChart` which manages the creation, synchronization, and cleanup of multiple SciChart surfaces.
    -   The component sets up a fixed grid layout with an overview pane and several chart panes. It uses React state to store the chart pane objects including references to their `SciChartSurface` instances and synchronization state.
    -   The helper class **AxisSynchroniser** is defined to manage a common visible range which is propagated to all registered X-axes. It subscribes to visible range changes and updates every connected chart accordingly.
    -   The functions `createChart` and `createOverview` handle the initialization of individual charts using SciChart.JS APIs. The overview chart implements a custom range selection modifier to update the visible range of the synchronized charts.
    -   Chart modifiers like `RolloverModifier`, `RubberBandXyZoomModifier`, `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` are added to provide interactive functionality.
    -   The charts are grouped using a `SciChartVerticalGroup` so that interactions such as zooming and panning are visually consistent across all charts.

## Customization

-   **Dynamic Chart Management**: Users can add a new chart pane or remove an existing one. When a new chart is added, its renderable series is also cloned into the overview chart for context.
-   **Synchronization Toggle**: Each detail chart has a checkbox labeled "Sync?" that allows the user to enable or disable synchronization with the shared X-axis visible range.
-   **Modifier Configuration**: Various chart modifiers are attached, such as a right-mouse-button rubber band zoom and a rollover tooltip modifier, which can be further customized by adjusting properties like stroke thickness and color.

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
