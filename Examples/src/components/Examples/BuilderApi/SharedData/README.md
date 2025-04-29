# Shared Data Example - Shared Data

## Overview

This example demonstrates how to create a SciChart chart using shared data. It shows how to define a chart via JSON templates that include multiple series (a column series, a line series, and a spline band series) as well as annotations. The example includes implementations for React as well as Vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS (Charting Library)
-   SciChart React (React component wrapper)
-   Vanilla JavaScript and TypeScript

## Code Explanation

The main chart rendering logic is implemented in the drawExample files (drawExample.js and drawExample.ts). These files use SciChart’s builder API to construct a 2D chart by defining a JSON template which specifies the chart surface theme, series definitions with data identifiers, and annotations. The sharedData object provides the data arrays (x, col, line) used to render all series. The index.tsx file contains a React component that integrates this chart logic using the SciChartReact component, while vanilla.js and vanilla.ts demonstrate how to create and dispose of the chart in a non-React environment using a cleanup function.

## Customization

The JSON template allows you to customize various chart aspects, including series styling (such as fill colors, stroke colors, and stroke thickness), data point widths, and annotation properties (text, opacity, font size, and anchors). The theme is applied via a custom appTheme, enabling you to unify the visual appearance across different chart elements.

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
