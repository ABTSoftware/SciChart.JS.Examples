# Central Axes (Central Axes Layout Example)

## Overview

This example demonstrates how to customize the axes layout in SciChart.js by placing the axes in the center of the chart. The example creates a chart with central axes that cross at the data value (0,0) (oscilloscope style) and includes implementations for React, Vanilla JavaScript/TypeScript, and Angular.

## Technologies Used

-   SciChart.js (core charting library)
-   SciChart Angular Component
-   SciChart React Component
-   TypeScript and JavaScript

## Code Explanation

The heart of the example is the `drawExample` function (provided in both JavaScript and TypeScript versions). This function creates a SciChart Surface and configures a custom layout manager (CentralAxesLayoutManager) to display the x- and y-axes centrally. Key points include:

-   **Chart Creation:** A SciChart Surface is created with a specified theme.
-   **Custom Axis Layout:** The `CentralAxesLayoutManager` is instantiated with options to position the horizontal and vertical axes at data value 0, ensuring that the axes pan with the chart.
-   **Axis Configuration:** The x-axis and y-axis are configured as inner axes by setting `isInnerAxis` to true. This positions them in the center of the chart. Additional styling (like label color and axis borders) is applied.
-   **Data Series and Annotation:** A fast line renderable series is added that draws a butterfly curve generated by a helper function. Furthermore, a text annotation is added to describe the chart’s functionality.
-   **Interaction Modifiers:** Standard chart interaction modifiers (zoom pan, mouse wheel zoom, and zoom extents) are included to allow users to interact with the chart.

The example also includes framework-specific files:

-   **Angular:** The `angular.ts` file sets up a standalone Angular component that uses the SciChart Angular component and binds its `drawExample` function.
-   **React:** The `index.tsx` file presents a React component which uses the SciChart React wrapper to initialize the chart with the `drawExample` function.
-   **Vanilla:** The `vanilla.js` and `vanilla.ts` files demonstrate how to create and dispose of the chart in a plain JavaScript/TypeScript environment.

## Customization

Key configuration options in this example include:

-   **Axis Positioning:** You can modify the options passed to the `CentralAxesLayoutManager` to change the axis alignment. By default, the axes are set to cross at (0,0) using the data value coordinate mode, but commented code shows how to use relative coordinate modes as well.
-   **Animation:** The fast line renderable series uses a fade animation with a duration of 500ms, which can be adjusted as needed.
-   **Styling:** Colors for axis labels, axis borders, and the renderable series stroke are set based on a theme. These can be customized to match your desired appearance.

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
