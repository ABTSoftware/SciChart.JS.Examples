# Sub Charts API Example

## Overview

This example demonstrates how to create and manage a large grid of subcharts on a main chart surface using SciChart.js. The example builds an 8x8 grid (a total of 64 subcharts) where each subchart is configured with its own axes and renderable series. Real-time data updates are streamed into each subchart, showcasing how to efficiently handle multiple sub-surfaces with dynamic data. The example includes implementations in both JavaScript/TypeScript and React.

## Technologies Used

-   SciChart.js – High performance charting library
-   JavaScript and TypeScript for core implementation
-   React (with TSX) for the UI integration
-   Material UI for toolbar and control components

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the main logic that creates a SciChartSurface, adds two main axes, and then iterates to generate a grid of 64 subcharts. Each subchart is positioned using a calculated relative coordinate, assigned its own set of axes, and populated with a renderable series. Custom theming adjustments are applied to provide unique stroke and fill colors. Real-time updates are implemented by appending new data points at specified intervals.
-   **helpers.js / helpers.ts**: These files include utility functions for generating random data, pre-populating data series, computing sub-chart grid positions, and creating renderable series objects based on a given series type. They encapsulate repetitive tasks and help streamline the creation of subcharts within the grid.
-   **index.tsx**: This is the React component that serves as the main entry point for the example when running in a React environment. It integrates the SciChartReact component, manages control actions (such as start and stop of real-time streaming and toggling axis labels), and displays update information. The component demonstrates how to use the provided API within a React application.

## Customization

Key configuration options include:

-   **Grid Configuration**: The number of subcharts is set to 64, arranged in 8 columns and 8 rows, with the position of each subchart calculated relative to the main surface dimensions.
-   **Data Settings**: Configurations such as the number of series per subchart, the initial number of data points, update frequency (sendEvery), and the total points on the chart are defined and can be adjusted.
-   **Theming and Appearance**: Custom theming is applied via the SciChartTheme. Options such as subchart padding, viewport border styling, axis visibility, and other axis-related properties are configured to achieve the desired appearance.
-   **Real-Time Updates**: The example shows how to start and stop real-time data streaming and calculate rendering performance metrics (like average render time and FPS).
-   **Axis Labels**: Users can toggle the visibility of axis labels across all subcharts using a control in the React component.

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
