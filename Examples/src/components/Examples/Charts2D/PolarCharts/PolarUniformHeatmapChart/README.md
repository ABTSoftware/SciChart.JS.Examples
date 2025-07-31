# Polar Uniform Heatmap Chart

## Overview

This example demonstrates a **Polar Uniform Heatmap Chart** using SciChart.js, visualizing intensity data in a circular coordinate system. The implementation features a heatmap with radial and angular axes, color gradients, and interactive modifiers.

## Technologies Used

- SciChart.js – High performance WebGL charting library
- WebAssembly – For accelerated computation
- TypeScript – Used for type safety
- Heatmap visualization – For intensity data representation

## Code Explanation

The example centers around two main functions: `drawExample` for the polar heatmap chart and `drawHeatmapLegend` for the accompanying legend. Key components include:

1. **Polar Surface Setup**: 
   - Created using `SciChartPolarSurface.create()` with custom padding
   - Configured with two axes: 
     - `PolarNumericAxis` in `EPolarAxisMode.Radial` mode for the radial dimension
     - `PolarNumericAxis` in `EPolarAxisMode.Angular` mode for the angular dimension

2. **Heatmap Series**:
   - Uses `PolarUniformHeatmapRenderableSeries` with a `UniformHeatmapDataSeries`
   - Data generated via `generateHeatmapData()` producing a 300x500 array of normalized values
   - Custom `HeatmapColorMap` with vivid gradient stops defines the color representation

3. **Interactive Modifiers**:
   - `PolarPanModifier` for panning
   - `PolarZoomExtentsModifier` for zoom-to-fit
   - `PolarMouseWheelZoomModifier` for zooming with mouse wheel

4. **Data Generation**:
   - Complex algorithm combining:
     - Random seeded features with radial influence
     - Wave patterns with periodic functions
     - Smoothing via neighborhood averaging
     - Value polarization using hyperbolic tangent

## Customization

Key customizations in this example include:

1. **Polar Layout Configuration**:
   - `innerRadius: 0.2` creates a donut-shaped heatmap
   - `totalAngle: Math.PI / 2` limits the chart to 90 degrees
   - `flippedCoordinates: true` reverses angular direction

2. **Advanced Data Processing**:
   - The `generateHeatmapData` function implements:
     - Seeded pseudo-random generation for reproducible patterns
     - Multiple influence layers (features + waves)
     - Smoothing pass with 3x3 neighborhood averaging
     - Value polarization using `Math.tanh` for enhanced contrast

3. **Shared Color Mapping**:
   - The `COLOR_MAP` instance is shared between chart and legend
   - Custom gradient stops create a vivid spectrum from pink to dark indigo

4. **Legend Styling**:
   - Transparent dark indigo background
   - Custom tick and label styling matching the theme
   - Right-aligned with inner axis placement

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

For more details, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md) and [Polar Heatmap Documentation](https://www.scichart.com/documentation/js/current/PolarUniformHeatmapSeriesType.html).