# Image Labels Example

## Overview

This example demonstrates how to create a SciChart.JS chart with custom image labels on the X-Axis. It displays market share data for mobile phone manufacturers with each column using an image from a supplied URL array as its label. The example is implemented for both Angular and React frameworks.

## Technologies Used

-   SciChart.JS for high performance charting
-   Angular (using scichart-angular)
-   React (using scichart-react)
-   TypeScript and JavaScript
-   SciChart utilities such as createImagesArrayAsync, PaletteFactory, and WaveAnimation

## Code Explanation

-   The Angular implementation (angular.ts) defines a standalone component that initializes the chart by calling the drawExample function with an array of image URLs. It uses the SciChartAngularComponent to embed the SciChart chart.
-   The React implementation (index.tsx) imports a set of image assets and passes them to the drawExample function used by the SciChartReact component.
-   The drawExample files (drawExample.js and drawExample.ts) contain the main chart setup logic. They create a SciChartSurface, set up a NumericAxis for both X and Y, and configure a custom labelProvider on the X-Axis to replace numeric labels with image textures. A FastColumnRenderableSeries with a gradient fill and a wave animation is added along with a text annotation for the chart title.
-   Additional classes such as EmojiPaletteProvider are provided to demonstrate how to customize palette colors for the columns, although this is optional.

## Customization

-   Change the array of image URLs to use different images for the labels.
-   Adjust the animation settings (e.g., duration in the WaveAnimation) to customize the series animation.
-   Modify the gradient fill palette and other axis or chart style settings via the appTheme configuration.

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
