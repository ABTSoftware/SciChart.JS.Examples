# Polar Pie Chart

## Overview

This example demonstrates how to create a **polar pie chart** in JavaScript using SciChart.js, simulating pie segments with [PolarColumnRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) on a [SciChartPolarSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html). The chart visualizes framework popularity data with colored segments.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   TypeScript – Used for type safety and better developer experience
-   WebGL – For high-performance rendering

## Code Explanation

The example centers around the `drawExample` function which creates a polar chart surface and configures it to display data as pie-like segments. Key components include:

1. **SciChartPolarSurface**: The base polar chart surface with a title "Most Popular JS Frameworks 2024"
2. **Axes Configuration**:
    - `PolarNumericAxis` in radial mode (Y-axis) with a fixed range of 0-1
    - `PolarNumericAxis` in angular mode (X-axis) starting at 90 degrees
3. **Data Series**:
    - Uses `XyxDataSeries` with metadata for coloring each segment
    - Implements custom `getXRange` to properly size the pie segments
4. **Rendering**:
    - `PolarColumnRenderableSeries` with `EColumnMode.StartWidth` to create pie-like segments
    - `MetadataPaletteProvider` to apply colors from metadata
5. **Interactivity**:
    - `PolarPanModifier` for panning
    - `PolarZoomExtentsModifier` for zoom-to-fit
    - `PolarMouseWheelZoomModifier` for mouse wheel zooming

## Customization

Key customization aspects in this example:

1. **Pie Segment Creation**:

    - The pie effect is achieved by using `EColumnMode.StartWidth` on the `PolarColumnRenderableSeries`
    - Custom `getXRange` implementation calculates proper segment widths based on data values

2. **Metadata Styling**:

    - Each data point includes metadata with custom colors
    - The `MetadataPaletteProvider` automatically applies these colors to segments

3. **Polar Chart Configuration**:
    - Angular axis starts at 90 degrees (`startAngleDegrees: 90`) for traditional pie chart orientation
    - Radial axis range is fixed to [0,1] to create consistent segment lengths
    - Axes are hidden (`isVisible: false`) to focus on the pie visualization

## Running the Example

To run this example from the SciChart.JS.Examples repository:

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
    ```

2. **Navigate to the Examples Directory**:

    ```bash
    cd SciChart.JS.Examples/Examples
    ```

3. **Install Dependencies**:

    ```bash
    npm install
    ```

4. **Run the Development Server**:
    ```bash
    npm run dev
    ```

For more detailed instructions, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
