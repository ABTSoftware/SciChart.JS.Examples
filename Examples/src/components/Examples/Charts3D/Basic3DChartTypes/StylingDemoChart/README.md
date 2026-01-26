# 3D Styling Demo Chart

## Overview

This example demonstrates advanced 3D chart styling capabilities using the SciChart.JS library. The example showcases a 3D scatter plot with various point markers, custom fonts, axis styling, and interactive controls for customizing the chart appearance. It visualizes life expectancy vs GDP per capita over time using different 3D point markers and styling options.

## Technologies Used

-   SciChart.JS (including [`SciChart3DSurface`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:56), [`NumericAxis3D`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:89), and [`ScatterRenderableSeries3D`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:376))
-   Multiple 3D point markers: [`EllipsePointMarker3D`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:345), [`SpherePointMarker3D`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:349), [`CubePointMarker3D`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:350), and more
-   Custom font loading and registration
-   Angular (standalone components via scichart-angular)
-   React (using SciChartReact)
-   TypeScript and JavaScript

## Code Explanation

-   **[`drawExample.ts`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:1)**: Contains the core logic for creating the 3D styling demo chart. It sets up a [`SciChart3DSurface`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:56) with custom world dimensions, camera positioning, and three [`NumericAxis3D`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:89) axes (X: Life Expectancy, Y: GDP per Capita, Z: Year). The example demonstrates:
    - Custom font registration from Google Fonts ([`fonts array`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:31))
    - Eight different 3D point markers ([`pointMarkers array`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:344))
    - Individual [`ScatterRenderableSeries3D`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:376) for each data point with unique styling
    - Comprehensive styling controls for axes, labels, grid lines, and visual appearance
-   **index.tsx**: React component that wraps the SciChartReact components to display the 3D styling demo chart.

## Customization

Key configuration options in this example include:

-   **World Dimensions and Camera Settings**: The [`SciChart3DSurface`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:69) is configured with custom world dimensions (300x200x300) and specific camera positioning for optimal data visualization.
-   **Axis Configuration**: Each axis (X: Life Expectancy 25-110, Y: GDP per Capita 0-50000, Z: Year 1965-2010) features customizable properties including titles, grid lines, bands, and label styling with [`titleOffset`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:325) and [`tickLabelsOffset`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:331) controls.
-   **Point Marker Variety**: Eight different 3D point markers including [`EllipsePointMarker3D`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:345), [`SpherePointMarker3D`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:349), [`CubePointMarker3D`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:350), and [`PyramidPointMarker3D`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:352), each with unique colors and scaling.
-   **Font Customization**: Dynamic font loading from Google Fonts with the ability to apply different fonts to axis labels and titles using the [`updateFont`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:429) function.
-   **Axis Plane Styling**: Comprehensive control over axis plane visibility, label drawing modes, and background colors with functions like [`setPlaneBackground`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:133) and [`setVisibilityMode`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:279).
-   **Interactive Controls**: The example returns a [`controls`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:468) object with functions for runtime customization of styling properties.
-   **Chart Modifiers**: Standard 3D navigation modifiers including [`MouseWheelZoomModifier3D`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:85), [`OrbitModifier3D`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:86), and [`ResetCamera3DModifier`](Examples/src/components/Examples/Charts3D/Basic3DChartTypes/StylingDemoChart/drawExample.ts:87).

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
