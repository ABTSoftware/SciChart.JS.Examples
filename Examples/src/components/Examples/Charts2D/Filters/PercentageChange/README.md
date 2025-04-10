## Percentage Change

### Overview

This example demonstrates how to display a chart that toggles between showing the original data and a percentage change view using SciChart.JS. The example includes implementations in both Vanilla JavaScript/TypeScript and React, where the React component integrates the chart using the SciChartReact component along with Material UI toggle buttons to switch between the two views.

### Technologies Used

-   SciChart.JS
-   React
-   TypeScript
-   Material UI (MUI)

### Code Explanation

-   **drawExample.js / drawExample.ts**: These files initialize the SciChart surface by creating X and Y numeric axes and adding two line series populated with random walk data. A custom transformation is applied using XyScaleOffsetFilter along with a customized renderable series class (TransformedSeries) that provides additional series info for the percentage change view. Chart modifiers such as ZoomPanModifier, ZoomExtentsModifier, and RolloverModifier are added for interactivity, and text annotations are used to display instructions and a watermark indicating the current view mode.
-   **index.tsx**: This is the main React component for the example. It renders a Material UI ToggleButtonGroup that lets the user switch between 'Percentage Change' and 'Original Data'. Changing the toggle updates a state variable that is passed to the drawExample function, effectively re-initializing the chart with the selected mode. The component leverages the SciChartReact component for rendering the chart in a React environment.

### Customization

Key configuration options include:

-   **Toggle Mode (usePercentage)**: A boolean option passed to the drawExample function that determines whether the chart displays the transformed (percentage) data or the original data.
-   **Y-Axis Settings**: The Y-axis auto-range, label postfix, and label precision are configured conditionally depending on the selected mode.
-   **Chart Modifiers and Annotations**: Interactivity is enhanced with zoom, pan, and rollover modifiers, and annotations are added to provide user instructions and indicate the current data view (either 'Percentage Changed' or 'Original Data').

### Running the Example

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
