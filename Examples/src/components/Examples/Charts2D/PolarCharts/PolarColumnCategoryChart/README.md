# Polar Column Category Chart

## Overview

This example demonstrates how to create a **Polar Column Category Chart** using SciChart.js, visualizing UK consumer price changes as radial columns with custom positive/negative threshold coloring. The chart effectively displays percentage changes across various food categories in a circular layout.

## Technologies Used

-   SciChart.js - High performance WebGL charting library
-   WebAssembly - For optimal rendering performance
-   TypeScript - Used for type safety and maintainability
-   Custom PaletteProvider - For conditional styling of columns

## Code Explanation

The example centers around the `drawExample` function which creates a polar chart surface with:

1. **Axes Configuration**:

    - `PolarNumericAxis` for radial values (percentage changes)
    - `PolarCategoryAxis` for angular categories (food items)
    - Custom start angle (π/2) to position the first category at the top

2. **Data Series**:

    - `XyDataSeries` containing UK consumer price data
    - `PolarColumnRenderableSeries` for radial column visualization
    - Custom `ColumnPaletteProvider` for threshold-based coloring

3. **Interactivity**:

    - `PolarZoomExtentsModifier` for resetting the view
    - `PolarPanModifier` for dragging the chart
    - `PolarMouseWheelZoomModifier` for zooming

4. **Visual Enhancements**:
    - `WaveAnimation` for smooth initial rendering
    - Data labels showing exact percentage values
    - Custom padding and styling for optimal label placement

## Customization

Key customizations in this example include:

1. **ColumnPaletteProvider**:

    - A custom palette provider that changes column colors based on a threshold value (0% in this case)
    - Columns below threshold are red (negative change)
    - Columns above threshold are blue (positive change)
    - Custom opacity settings (127/255) for fill colors

2. **Radial Axis Configuration**:

    - Automatic range calculation with padding to ensure labels fit
    - Percentage formatting via `labelPostfix`
    - Custom inner radius (0.15) to create space in the center

3. **Angular Axis**:
    - Category labels positioned parallel to the axis
    - Custom start angle (π/2) for top-aligned first category
    - Flipped coordinates for correct label orientation

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
