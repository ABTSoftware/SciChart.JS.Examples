# Event Markers Example

## Overview

This example demonstrates how to render and interact with event markers on a SciChart chart. The event markers are implemented using a fast candlestick renderable series that displays boxes representing events. These markers can be selected and dragged interactively, behaving similarly to annotations. Implementations for Angular, React, and Vanilla JavaScript are provided in this example.

## Technologies Used

-   **SciChart.js** - High performance charting library
-   **Angular** - Example integration via an Angular component (angular.ts)
-   **React** - Example integration via a React component (index.tsx)
-   **Vanilla JavaScript/TypeScript** - Standalone implementation (vanilla.js / vanilla.ts)
-   **Custom Chart Modifiers** - Custom modifier to enable drag and selection of event markers
-   **Animation and Data Label Providers** - SweepAnimation is used for the line series and a custom DataLabelProvider annotates the event markers

## Code Explanation

-   **drawExample.js / drawExample.ts**: These files contain the core logic for building the chart. They create the SciChartSurface, add numeric axes, generate a random walk line series, and render event markers using a fast candlestick series. A custom modifier, `CandleDragModifier`, is implemented to enable interactive selection and vertical dragging of event markers. Custom hit testing and palette providers are also used to enhance interactivity and visual feedback.
-   **angular.ts**: Sets up a standalone Angular component that utilizes the SciChart Angular wrapper to initialize the chart by calling `drawExample`.
-   **index.tsx**: Demonstrates a React component that uses the `SciChartReact` component to initialize the chart, making it available within a React application.
-   **vanilla.js / vanilla.ts**: Provide a simple, framework agnostic entry point. They call `drawExample` and handle chart disposal via a destructor function.

## Customization

Key configuration options include:

-   **Animation Duration**: The line series animation uses a SweepAnimation with a duration of 500ms.
-   **Event Marker Styling**: The event markers have a fixed data point width of 30 pixels, and a custom DataLabelProvider is used to display the difference between open and close values.
-   **Custom Interaction**: The `CandleDragModifier` enables selection and dragging of event markers with real-time updates to the data series, ensuring that the close value remains controlled relative to the open value.
-   **Axis Configuration**: Hidden axes are used to map the event series, and modifiers are applied to prevent these axes from interfering with typical zooming and panning behaviors.

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
