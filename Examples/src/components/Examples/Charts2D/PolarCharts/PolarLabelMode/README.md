# Polar Label Modes Chart

## Overview

This example demonstrates how to create a **JavaScript Polar Label Modes Chart** using SciChart.js, which showcases the different label modes supported for Polar Axes. The implementation highlights various label orientation options for angular axes in polar charts.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   Polar Charts – For circular data visualization
-   WebAssembly – For high-performance rendering
-   Angular/React/JavaScript – Framework-specific implementations available

## Code Explanation

The example centers around the `SciChartPolarSurface` with key components:

1. **Axis Configuration**:

    - `PolarNumericAxis` for both angular and radial axes
    - Angular axis implements `EPolarLabelMode` with Horizontal, Perpendicular, and Parallel orientations
    - Radial axis configured with appropriate visible range and styling

2. **Data Visualization**:

    - `PolarLineRenderableSeries` for displaying data in polar coordinates
    - `EllipsePointMarker` for data point visualization

3. **Interactivity**:

    - `PolarPanModifier` for panning functionality
    - `PolarZoomExtentsModifier` for zoom-to-fit operations
    - `PolarMouseWheelZoomModifier` for mouse wheel zooming

4. **Dynamic Controls**:
    - `changePolarLabelMode` function for runtime label mode switching
    - `isInnerAxis` toggle for alternate axis positioning

## Customization

Key customization aspects in this example include:

1. **Label Mode Configuration**:

    - Three distinct `EPolarLabelMode` options:
        - `Horizontal`: Standard horizontal labels
        - `Perpendicular`: Labels perpendicular to axis
        - `Parallel`: Labels parallel to axis

2. **Axis Positioning**:

    - Inner/outer axis toggle via `isInnerAxis` property
    - Customizable axis styling and tick intervals

3. **Performance Considerations**:
    - WebAssembly context handling for optimal performance
    - Efficient polar chart layout management

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

For framework-specific implementations (React/Angular), refer to the corresponding component files in the repository. Additional documentation can be found at [JavaScript Polar Label Modes Documentation](https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html).
