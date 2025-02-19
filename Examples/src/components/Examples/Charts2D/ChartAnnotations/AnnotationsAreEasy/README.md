# Annotations Are Easy

## Overview

This example demonstrates the powerful annotation capabilities of SciChart.js. The example shows how to add various types of annotations such as text annotations, line annotations, box annotations, custom SVG annotations (including a rocket icon and buy/sell marker arrows), image annotations, and even watermark annotations. It also showcases how to animate these annotations using SciChart’s GenericAnimation. This example is implemented with multiple frameworks including Vanilla JavaScript, React (TSX), and Angular (TS).

## Technologies Used

-   SciChart.js library
-   Vanilla JavaScript
-   React
-   Angular
-   TypeScript

## Code Explanation

-   **416398_exploration_fuel_nasa_rocket_space_icon.js / .ts**: These files export an SVG string representing a rocket icon used later as a custom SVG annotation.
-   **drawExample.js / drawExample.ts**: These are the core files that create the SciChartSurface, add numeric X and Y axes, and configure chart modifiers like zoom and pan. They then create a range of annotations including text, native text with wrapping and rotation, line annotations, box annotations, vertical and horizontal threshold annotations, custom annotations using SVG content (buy/sell markers), and image annotations. The code also defines several animation functions (fade effect, typewriter effect, rotate effect) to animate the annotations on the chart.
-   **angular.ts**: This is a standalone Angular component that imports the SciChartAngularComponent and the drawExample function to render the chart using Angular.
-   **index.tsx**: This React component leverages the SciChartReact component to initialize and render the chart. It passes the drawExample function (configured with a custom image) as the initializer.
-   **scichart-logo-white.png**: An image asset used for the image annotation within the chart.
-   **javascript-chart-annotations.jpg**: A screenshot image (likely for documentation purposes) showing the rendered chart example.

## Customization

You can customize various aspects of the example including:

-   **Annotation Properties**: Customize text content, font size, colors, alignment, and coordinate modes (absolute or relative) directly in the annotation constructors.
-   **Animation Effects**: Modify durations, delays, and effect parameters in the GenericAnimation functions (such as fade, typewriter, and rotate effects) to suit your needs.
-   **Chart Modifiers and Axes**: Adjust the visible ranges on the axes or enable additional chart modifiers as required.

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
