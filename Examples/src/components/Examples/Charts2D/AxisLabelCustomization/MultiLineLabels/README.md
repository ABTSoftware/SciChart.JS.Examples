# Multi-Line Labels Example

## Overview

This example demonstrates how to create a SciChart.js chart with multi-line and rotated axis labels. The example uses a column series with gradient fills, data labels, animations, and a custom text label provider. It is implemented in both JavaScript and TypeScript and is integrated into a React component using SciChartReact. A toggle button group is provided to adjust label rotation and maximum label length in real time.

## Technologies Used

-   SciChart.js for high performance charting
-   React for the UI (using TypeScript with TSX)
-   Material-UI (MUI) for the toggle button group
-   tss-react for styling
-   WaveAnimation and PaletteFactory from SciChart.js for animations and gradient effects

## Code Explanation

The example directory contains several key files:

-   **drawExample.js / drawExample.ts**: These files initialize the SciChartSurface with a numeric X-Axis and Y-Axis. A custom TextLabelProvider is used to create multi-line labels with rotation. The column series is configured with a gradient fill, data labels, corner radius, and a wave animation. A text annotation is also added to display the chart title.

-   **index.tsx**: This React component sets up the UI for the example. It renders the SciChartReact component and includes a toggle button group that lets the user choose between multi-line, single-line rotated, and multi-line rotated label presets. The toggle buttons modify properties such as the label rotation and maximum label length via React hooks.

## Customization

Key configuration options that can be modified include:

-   **Label Rotation**: Controlled by the toggle buttons, with available rotations of 0°, 20°, and 30°.
-   **Max Label Length**: Adjusted along with the rotation to either trim or show the full text label.
-   **Animation Duration**: Configured in the `WaveAnimation` (set to 1000ms in the example).
-   **Gradient Fill and Corner Radius**: These visual properties are set via the `PaletteFactory` and series configuration.

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
