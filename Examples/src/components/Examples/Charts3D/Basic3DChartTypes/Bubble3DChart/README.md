# Bubble 3D Chart Example

## Overview

This example demonstrates a 3D bubble chart that visualizes population data in a three-dimensional space using SciChart.JS. The chart plots life expectancy, GDP per capita, and year data, with additional metadata displayed in tooltips. Implementations are provided for Angular, React, and Vanilla JavaScript/TypeScript.

## Technologies Used

-   **SciChart.JS**: High performance, WebAssembly-powered charting library for 3D charts
-   **Angular**: Uses a standalone component to initialize the chart
-   **React**: Utilizes a React component to create and display the 3D chart
-   **Vanilla JavaScript/TypeScript**: Provides a plain JS approach with a cleanup function
-   **TypeScript**: Used in select example files for type safety

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the core logic for creating the 3D bubble chart. They initialize the SciChart 3D surface, set up numeric axes (Life Expectancy, GDP Per Capita, and Year), configure camera positioning, and add chart modifiers such as mouse wheel zoom, orbit, reset camera, and tooltips. The tooltip template shows country information along with the key data points. A scatter renderable series using a sphere point marker is added to represent each data point in the bubble chart.
-   **angular.ts**: Defines a standalone Angular component that embeds the SciChartAngular component and passes the chart drawing function to initialize the chart.
-   **index.tsx**: Provides the React component implementation which utilizes the SciChartReact component to initialize and render the chart.
-   **vanilla.js / vanilla.ts**: These files handle the Vanilla JavaScript/TypeScript implementation. They call the same `drawExample` function to set up the chart on a given HTML element and return a destructor function to clean up the chart resources when necessary.
-   **javascript-3d-bubble-chart.jpg**: An image file likely used as a preview or thumbnail for this example.

## Customization

The example exposes several configuration options:

-   **Camera Configuration**: Customize the initial camera position and target by modifying the `CameraController` settings.
-   **Axis Settings**: Modify axis titles, visible ranges, and label precision in the numeric axes setup.
-   **Renderable Series**: Adjust the point marker (sphere size, opacity) and customize the scatter series properties.
-   **Tooltip Customization**: The tooltip modifier is set up with custom templates to change the background color and text styling based on the metadata of each data point. Adjust these templates to change how the data is presented in the tooltips.
-   **Theme**: The chart uses `appTheme.SciChartJsTheme` from the theme provider. Changing the theme will update the chart style accordingly.

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
