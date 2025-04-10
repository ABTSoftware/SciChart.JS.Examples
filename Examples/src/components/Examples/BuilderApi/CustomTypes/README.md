# Custom Types Example

## Overview

This example demonstrates how to create a 2D chart in SciChart.JS using the builder API along with a custom palette provider. The custom palette provider, implemented as the Example Mountain Palette Provider, is used to override the fill and stroke colors of a Mountain Series when the data values meet defined criteria. The example includes implementations for Angular, React, and Vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS (chartBuilder, 2D charting, and theming)
-   Angular (standalone component with scichart-angular component)
-   React (functional component using SciChartReact)
-   Vanilla JavaScript/TypeScript

## Code Explanation

-   **angular.ts**: Defines an Angular standalone component that renders the SciChart surface by passing the drawExample function to the scichart-angular component.
-   **drawExample.js / drawExample.ts**: Contains the core chart configuration and rendering logic. It builds the SciChart surface, adds a Numeric Y-axis, and configures annotations. The Mountain Series is created with a custom palette provider that highlights parts of the data (when y-values fall between 0.5 and 0.75) using specific stroke and fill colors. The custom palette provider is registered with the chartBuilder for serialization and reuse.
-   **index.tsx**: Implements a React component that initializes the chart using the drawExample function with the SciChartReact component. This shows how SciChart.JS can be integrated into a React application.
-   **vanilla.js / vanilla.ts**: Provide standalone scripts that invoke the drawExample function and manage the cleanup of the chart via a destructor function.
-   **javascript-custom-types.jpg**: An image asset included in the directory (likely a placeholder or demonstration image related to custom types).

## Customization

This example is highly configurable. Key configuration options include:

-   **Animation**: The Mountain Series uses a Scale animation with a cubic ease.
-   **Series Styling**: The series features a linear gradient fill and a solid stroke with configurable thickness.
-   **Custom Palette Provider**: The custom palette provider applies specific stroke and fill colors based on the y-value, highlighting data in a particular range. The colors used are derived from the app theme (e.g., MutedRed, VividOrange, VividBlue, PaleSkyBlue).
-   **Annotations**: Two SVG text annotations are added to the chart, demonstrating how annotations can be configured using relative positioning and style options.

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
