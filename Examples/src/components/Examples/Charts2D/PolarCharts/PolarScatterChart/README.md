# Polar Scatter Chart

## Overview

This example demonstrates how to render a high-performance **Polar Scatter Chart** using SciChart.js. It creates a circular XY scatter by calling `SciChartPolarSurface.create`, configuring radial and angular axes, and plotting multiple series with custom point markers and animations.

## Technologies Used

- SciChart.js – High performance WebGL charting library
- WebAssembly – For optimized performance
- SVG – For custom legend markers
- TypeScript – Used in the implementation

## Code Explanation

The example centers around the `drawExample` function which initializes a polar chart surface with radial and angular axes. Key components include:

1. **Surface Initialization**: 
   - The `SciChartPolarSurface.create` method initializes the chart with a WebAssembly context and theme
   - Returns both the surface and wasmContext for further configuration

2. **Axes Configuration**:
   - **Radial Axis** (Y-axis): 
     - Uses `EPolarAxisMode.Radial` 
     - Configured with a `NumberRange` of 0-1400
     - Starts at π/2 radians (12 o'clock position)
   - **Angular Axis** (X-axis):
     - Uses `EPolarAxisMode.Angular`
     - Range of 0-360 degrees
     - Flips coordinates for clockwise direction
     - Custom label styling with degree symbols

3. **Data Series**:
   - Two scatter series are generated with different point markers:
     - Circle markers (Ellipse type)
     - Triangle markers (Triangle type)
   - Each uses `PolarXyScatterRenderableSeries` with:
     - Custom RGBA fill colors (note the "88" alpha channel suffix)
     - Stroke colors matching the fill
     - `SweepAnimation` for smooth entry effects

4. **Custom Legend**:
   - Overrides `getLegendItemHTML` to render SVG shapes
   - Dynamically switches between circle and triangle SVG elements
   - Includes interactive checkboxes for series visibility

5. **Interactivity**:
   - `PolarPanModifier` for dragging/panning
   - `PolarZoomExtentsModifier` for resetting view
   - `PolarMouseWheelZoomModifier` for radial zooming

## Customization

Key customization points in this example include:

1. **Point Marker Configuration**:
   - Custom width/height (10px)
   - Stroke thickness (1px)
   - RGBA fill colors using hex+alpha notation ("...88" for ~50% opacity)
   - Different marker types per series (Ellipse vs Triangle)

2. **Polar Axis Setup**:
   - Unconventional start angle (π/2) for 12 o'clock position
   - Flipped coordinates for clockwise rotation
   - Custom degree labels with "°" suffix
   - Radial grid lines styled with `DarkIndigo` color

3. **Legend Customization**:
   - Full SVG markup generation in `getLegendItemHTML`
   - Dynamic shape selection based on series name
   - Semi-transparent fills matching the series styling
   - Flexbox layout for responsive item positioning

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

For more details, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).