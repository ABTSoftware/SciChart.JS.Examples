# Stacked Column Chart Example

## Overview

This example demonstrates a stacked column chart using SciChart.JS. It visualizes sales data (in billions of USD) over multiple years by stacking column series that represent different regions (EU, Asia, USA, UK, Latam). The example provides implementations for Angular (using scichart-angular) and React (using scichart-react) as well as a Vanilla JavaScript version. Interactive controls allow the user to toggle between a standard stacked mode and a 100% stacked mode and to show or hide data labels.

## Technologies Used

-   SciChart.JS
-   Angular and scichart-angular (Angular Material for UI controls)
-   React and scichart-react (with Material-UI components)
-   Vanilla JavaScript
-   TypeScript

## Code Explanation

-   **angular.ts**: This is the main Angular component that imports necessary Angular Material modules and the SciChartAngularComponent. It initializes the chart by calling the asynchronous `drawExample` function and provides UI controls (using button toggles and switches) to interactively change between stacked and 100% stacked modes as well as toggling data label visibility.
-   **drawExample.js / drawExample.ts**: These files contain the core chart creation code. They create a SciChartSurface, configure numeric axes (with custom label formats and titles for Year and Sales USD), and set up five stacked column series representing different regions. Each series uses a shared stacked group to ensure they are stacked together. The collection of series is animated using a WaveAnimation and interactive modifiers (ZoomExtentsModifier, ZoomPanModifier, MouseWheelZoomModifier) are added to the chart. Two control functions are defined: one to toggle between normal and 100% stacked modes (by updating the `isOneHundredPercent` property of the collection) and another to toggle the visibility of data labels by adjusting their font size.
-   **index.tsx**: This React component uses the SciChartReact wrapper to initialize the chart. It manages the state for 100% stacked mode and data label visibility, passing these values to the chart via callbacks. UI components from Material-UI (Switch, ToggleButton, FormControlLabel) are used to provide interactivity in the React version.
-   **Additional assets**: Other files (such as the provided JPEG image) serve as supplementary resources for display or documentation purposes.

## Customization

Key configuration options in this example include:

-   **Stack Mode Toggle**: Switching between normal stacked mode and 100% stacked mode by setting the `isOneHundredPercent` property on the StackedColumnCollection.
-   **Data Labels Visibility**: Toggling data labels by dynamically adjusting the font size in the data label provider styles.
-   **Chart Animation**: The stacked columns animate using a WaveAnimation with a duration set to 1000ms and a fade effect enabled.
-   **Axis Configuration**: The x-axis is configured with a numeric format displaying years without decimals and the y-axis is set up to show sales in billions of USD with a growBy factor to add padding.

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
