# Treemap Chart

## Overview

This example demonstrates how to create a **Treemap Chart** using SciChart.js, visualizing hierarchical data with rectangles sized by value. The implementation leverages [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) and integrates with D3.js for layout calculations.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   D3-hierarchy – For treemap layout computations
-   TypeScript – Used in the example
-   React/Angular/Vanilla JS – Framework-specific implementations available

## Code Explanation

The example centers around the `drawExample` function which:

1. **Initializes the SciChartSurface** with hidden axes (since coordinates are managed by D3's layout)
2. **Processes hierarchical data** using D3's `stratify()` and `treemap()` functions to compute rectangle positions
3. **Creates a FastRectangleRenderableSeries** with:
   - `XyxyDataSeries` defining rectangle bounds (x0,y0,x1,y1)
   - Custom `StockTreemapPaletteProvider` for color-coding based on percentage change
   - Dynamic `TreemapDataLabelProvider` that adjusts labels based on rectangle size
4. **Adds interactivity** with ZoomPanModifier and MouseWheelZoomModifier

Key components include:

- **StockTreemapPaletteProvider**: Implements color interpolation between gray (neutral), green (positive change) and red (negative change) based on percentage values
- **TreemapDataLabelProvider**: Dynamically shows more/less text based on available rectangle space
- **D3 Integration**: Uses `d3-hierarchy` for the treemap layout algorithm

## Customization

Notable customization points:

1. **Color Interpolation**: The palette provider implements a custom interpolation algorithm that:
   - Handles neutral (0%) cases explicitly
   - Brightens stroke colors by 60% for better visibility
   - Uses ARGB component-wise interpolation for smooth gradients

2. **Dynamic Labeling**: The data label provider shows:
   - Full name + percentage for large rectangles (>30k area)
   - Short name + percentage for medium rectangles (>15k)
   - Initials only for small rectangles (>1.5k)
   - Nothing for very small items

3. **D3 Layout Configuration**: 
   ```typescript
   treemap().size([WIDTH, HEIGHT]).padding(0.1)(root);
   ```
   Controls the overall dimensions and spacing between rectangles

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

For framework-specific implementations, refer to the corresponding React, Angular or Vanilla JS files in the example directory.