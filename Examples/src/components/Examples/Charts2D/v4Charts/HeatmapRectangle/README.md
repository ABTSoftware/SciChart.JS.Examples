# Heatmap Rectangle Chart

## Overview

This example demonstrates how to create a JavaScript Heatmap Chart using SciChart.js by leveraging the **FastRectangleRenderableSeries** and its `customTextureOptions` property to apply a custom tiling texture fill. The heatmap visualizes data in a grid format where each cell's color represents a value, with smooth gradients or discrete color steps.

## Technologies Used

- SciChart.js – High performance WebGL charting library
- TypeScript – For type-safe implementation
- WebGL – For GPU-accelerated rendering

## Code Explanation

The example centers around the `drawExample` function which:

1. **Generates Sample Data**: The `generateExampleData` function creates a 2D array of values with a circular pattern that animates over time, simulating dynamic heatmap data.

2. **Color Mapping**: 
   - `noGradientColor` provides discrete color steps without interpolation
   - `getGradientColor` implements smooth color transitions between defined stops
   - `interpolateColors` handles the actual color interpolation calculations

3. **Custom Palette Provider**: 
   - The `HeatmapPaletteProvider` class extends `DefaultPaletteProvider` to implement custom coloring logic
   - It supports both gradient and discrete coloring modes through the `isRangeIndependant` property

4. **Data Transformation**: 
   - The `transformData` function converts the 2D array into flat arrays of x, y coordinates
   - Uses `XyzDataSeries` to store the heatmap values

5. **Rendering**:
   - Creates a `FastRectangleRenderableSeries` with the custom palette provider
   - Supports toggling between gradient and discrete coloring via `setChart`

6. **Interactivity**:
   - Includes zoom/pan modifiers for navigation
   - Features a custom tooltip showing x, y, and value information

## Customization

Key customization aspects include:

1. **Color Gradient Configuration**: The example defines a 7-stop color gradient from DarkIndigo to VividPink, which can be easily modified by changing the gradient steps array.

2. **Discrete vs Gradient Mode**: The `setChart` function allows switching between smooth gradient coloring and discrete color bands by toggling the `gradient` parameter.

3. **Data Generation**: The `generateExampleData` function creates a circular pattern that can be adjusted by changing the frequency and amplitude parameters to create different heatmap patterns.

4. **Custom Tooltip**: The `tooltipDataTemplate` provides a custom formatted tooltip showing precise x, y coordinates and the heatmap value at each point.

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