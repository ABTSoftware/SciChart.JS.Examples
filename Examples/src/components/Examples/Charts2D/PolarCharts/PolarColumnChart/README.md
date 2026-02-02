# Polar Column Chart

## Overview

This example demonstrates how to create a **JavaScript Polar Column Chart** using the **PolarColumnRenderableSeries**, with the following features: DataLabels, Gradient fill, and startup animations. The chart visualizes data as vertical bars in a polar coordinate system, ideal for cyclic or angular data patterns.

## Technologies Used

- SciChart.js – High performance WebGL charting library
- TypeScript – For type-safe implementation
- WebGL – For hardware-accelerated rendering

## Code Explanation

The example is built around the `drawExample` function which initializes a `SciChartPolarSurface` and configures it with polar axes and a column series:

1. **Surface Initialization**: 
   - Creates a polar chart surface with `SciChartPolarSurface.create()`
   - Sets theme and drawing options (`drawSeriesBehindAxis: true`)

2. **Axes Configuration**:
   - **Radial Y-Axis**: 
     - Uses `PolarNumericAxis` in `EPolarAxisMode.Radial`
     - Customized with no tick lines, grid styling, and inner radius for donut effect
   - **Angular X-Axis**:
     - Uses `PolarNumericAxis` in `EPolarAxisMode.Angular`
     - Configured with parallel labels, clockwise orientation, and custom styling

3. **Data Series**:
   - Uses `XyDataSeries` to provide x,y values for the columns
   - Rendered via `PolarColumnRenderableSeries` with:
     - Gradient fill using `GradientParams`
     - White borders and custom width
     - Parallel data labels
     - WaveAnimation for smooth entry

4. **Interactivity**:
   - Adds polar-specific modifiers:
     - `PolarPanModifier` for panning
     - `PolarZoomExtentsModifier` for zoom-to-fit
     - `PolarMouseWheelZoomModifier` for zooming

## Customization

Key customization points in this example include:

1. **Gradient Styling**:
   - The columns use a multi-stop linear gradient from `DarkIndigo` to `MutedBlue`
   - Gradient direction is horizontal (can be made vertical with `new Point(0, 1)`)

2. **Polar Layout**:
   - `startAngle: Math.PI / 2` begins the chart at 12 o'clock
   - `flippedCoordinates: true` makes values progress clockwise
   - `innerRadius: 0.1` creates a donut hole effect

3. **Animation**:
   - `WaveAnimation` with 800ms duration and fade effect
   - Animates columns growing from the center outward

4. **Label Positioning**:
   - `EPolarLabelMode.Parallel` keeps data labels aligned with columns
   - Custom font styling for improved readability

## Running the Example

To run this example from the SciChart.JS.Examples repository:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
   ```

2. **Navigate to Examples**:
   ```bash
   cd SciChart.JS.Examples/Examples
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

For more details, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md) and [Polar Chart Documentation](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-chart).