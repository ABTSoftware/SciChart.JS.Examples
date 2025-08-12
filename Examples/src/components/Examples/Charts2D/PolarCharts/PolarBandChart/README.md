# Polar Band Chart

## Overview

This example demonstrates how to create a **JavaScript Polar Band Chart** using SciChart.js, our feature-rich JavaScript Chart Library. The chart visualizes data in polar coordinates with two band series (regular and interpolated) between radial and angular axes.

## Technologies Used

-   SciChart.js - High performance WebGL charting library
-   TypeScript - For type-safe implementation
-   WebGL - For high-performance rendering

## Code Explanation

The example creates a polar chart surface with two distinct band series using `SciChartPolarSurface`. Key components include:

1. **Axes Configuration**:

    - `PolarNumericAxis` with `EPolarAxisMode.Radial` for the radial (Y) axis
    - `PolarNumericAxis` with `EPolarAxisMode.Angular` for the angular (X) axis
    - Special configuration includes `startAngle: Math.PI / 2` to begin at 12 o'clock and `flippedCoordinates: true` for clockwise direction

2. **Band Series**:

    - Two `PolarBandRenderableSeries` instances using `XyyDataSeries`:
        - First series with `interpolateLine=false` showing discrete segments
        - Second series with `interpolateLine=true` showing smooth interpolation
    - Each series has distinct styling for upper/lower bands (`stroke`, `strokeY1`, `fill`, `fillY1`)

3. **Interactivity**:

    - `PolarZoomExtentsModifier` for resetting zoom
    - `PolarPanModifier` for panning
    - `PolarMouseWheelZoomModifier` for zooming
    - `PolarLegendModifier` with checkboxes to toggle series visibility

4. **Animations**:
    - `SweepAnimation` applied to both series for smooth transitions

## Customization

Key customization points in this example:

1. **Polar Coordinate System**:

    - `innerRadius: 0.1` creates a donut hole effect
    - `polarLabelMode: EPolarLabelMode.Parallel` ensures angular labels remain parallel to the axis

2. **Band Series Styling**:

    - Transparent fills using hex color + "88" (e.g., `appTheme.VividOrange + "88"`)
    - Different interpolation modes showing both discrete (`interpolateLine=false`) and smooth (`interpolateLine=true`) rendering

3. **Axis Behavior**:
    - `zoomExtentsToInitialRange: true` ensures zoom extents returns to original range
    - `autoTicks: false` with `majorDelta: 1` for precise control over angular ticks

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

For more details on polar charts, see the [Polar Chart documentation](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html).
