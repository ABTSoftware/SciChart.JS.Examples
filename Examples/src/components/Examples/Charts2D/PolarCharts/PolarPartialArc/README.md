# Polar Partial Arc Chart

## Overview

This example demonstrates how to create a **JavaScript Polar Partial Arc** using SciChart.js, which can bend from a full Polar Circle, all the way to a cartesian-like arc. The chart showcases how polar coordinates can be configured to display only a small arc segment while maintaining high performance WebGL rendering.

## Technologies Used

- SciChart.js - High performance WebGL charting library
- TypeScript - For type-safe implementation
- WebGL - For GPU-accelerated rendering

## Code Explanation

The core implementation revolves around the `drawExample` function which creates a polar chart surface with customizable parameters:

1. **Polar Surface Initialization**:
   - Uses `SciChartPolarSurface.create()` to initialize the chart with radial and angular axes
   - Configures theme using `appTheme.SciChartJsTheme`

2. **Axis Configuration**:
   - Radial Y-axis (`PolarNumericAxis`) with `EPolarAxisMode.Radial`
   - Angular X-axis (`PolarNumericAxis`) with `EPolarAxisMode.Angular`
   - Customizable `innerRadius` and `totalAngle` parameters that transform the polar chart

3. **Data Series**:
   - Uses `PolarLineRenderableSeries` with `XyDataSeries` to display petal-shaped data
   - Implements `EllipsePointMarker` for data point visualization

4. **Interactivity**:
   - Includes `PolarMouseWheelZoomModifier`, `PolarPanModifier`, and `PolarZoomExtentsModifier`
   - Custom zoom extents behavior that updates the chart parameters via callback

5. **Animation System**:
   - Uses `GenericAnimation` to smoothly transition between partial and full polar views
   - Complex animation logic in `animateAll` function handles the transformation

## Customization

Key customization aspects in this example include:

1. **Partial Arc Calculation**:
   - The `calcRadiusFromAngleFraction` function mathematically determines the inner radius needed to fit the arc segment properly into the canvas
   - This ensures the partial arc maintains proper proportions at different angles

2. **Animation Logic**:
   - The `animateAll` function contains sophisticated logic to handle the transition between different states:
     - Manages the interpolation between partial and full polar views
     - Handles different animation paths for increasing vs decreasing angle fractions
     - Maintains proper axis alignment throughout the animation

3. **Axis Configuration**:
   - The `startAngle` property is set to π/2 (90 degrees) to make the chart start from the top
   - `flippedCoordinates: true` on the angular axis creates a clockwise coordinate system
   - `isInnerAxis: true` on the radial axis affects the grid line rendering

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