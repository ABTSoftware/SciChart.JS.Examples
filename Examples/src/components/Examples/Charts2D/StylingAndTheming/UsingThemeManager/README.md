# Using Theme Manager Example

## Overview

This example demonstrates how to create SciChart.JS charts with different visual themes using the SciChart.JS Theme Manager. It shows how to apply built-in themes such as Navy, Light, and Dark, as well as a custom theme that modifies the default Light theme. The example includes implementations for both React (using TSX) and Vanilla JavaScript/TypeScript.

## Technologies Used

-   SciChart.JS
-   React (with SciChart.React for chart integration)
-   TypeScript
-   Vanilla JavaScript
-   tss-react/mui (for React styling)

## Code Explanation

-   **data.ts**: Provides static arrays of numerical data (dates, open, high, low, close values) used for charting.
-   **drawExample.js / drawExample.ts**: Contains the core chart initialization API. The functions in these files create SciChart surfaces with a specified theme, add numeric X and Y axes, add a text annotation to display the theme title, and render three animated line series using Fourier series data. A custom theme is defined by extending the Light theme with modified properties (such as axisBandsFill, axisBorder, grid brushes, stroke and fill palettes).
-   **index.html**: Defines a simple HTML layout with a 2x2 grid of div elements that act as host containers for the charts in the Vanilla JavaScript implementation.
-   **index.tsx**: Implements the React component that renders the four charts using the `SciChartReact` component. It uses custom styling (via tss-react/mui) to layout the charts in a responsive 2x2 grid and loads the chart initialization API from the drawExample module.
-   **vanilla.js / vanilla.ts**: Provide a Vanilla JavaScript and a TypeScript example for initializing and rendering the four themed charts in the specified div elements. These scripts call the same API functions from the drawExample module and include cleanup functionality to delete the charts when needed.

## Customization

Key configuration options include:

-   **Theme Selection**: Choose between built-in themes (Navy, Light, Dark) and a custom theme that modifies the Light theme with custom colors for axis bands, borders, grid lines, and palettes.
-   **Animation Settings**: Each line series is animated using a Sweep animation with a duration of 500ms, providing a smooth drawing effect.
-   **Chart Elements**: Numeric axes are configured with label precision, maximum auto ticks, and growBy options. Additionally, a text annotation is added to each chart to display the current theme title with customized font size and opacity.

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
