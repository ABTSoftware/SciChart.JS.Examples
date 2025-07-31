# Waterfall Chart

## Overview

This example demonstrates how to create a **JavaScript Waterfall Chart** using SciChart.js's new **FastRectangleRenderableSeries** with the following features: a custom Treemap-like DataLabelProvider for rectangle labels and custom Fill PaletteProvider.

## Technologies Used

- SciChart.js – High performance WebGL charting library
- React/Angular/Vanilla JavaScript – Framework integrations
- TypeScript – Used in core implementation
- WebAssembly – For high-performance rendering

## Code Explanation

The example centers around the `drawExample` function which creates a SciChartSurface with a waterfall chart visualization. Key components include:

1. **Data Transformation**: 
   - The `waterfall()` function processes raw profit data into cumulative waterfall format (prior/accu values)
   - Generates metadata containing profit values for conditional styling

2. **Custom Providers**:
   - `CustomFillProvider`: Implements `IFillPaletteProvider` to color rectangles based on profit (teal for positive, pink for negative)
   - `TreemapDataLabelProvider`: Extends `RectangleSeriesDataLabelProvider` to show both cumulative and delta values in engineering notation

3. **Core Chart Elements**:
   - `FastRectangleRenderableSeries`: Uses `XyxyDataSeries` with `EColumnYMode.TopBottom` to define rectangle positions
   - `TextLabelProvider`: Maps numeric indices to month labels on the X-axis
   - Interactive modifiers (`ZoomPanModifier`, `MouseWheelZoomModifier`) for user control

## Customization

Key customizations in this example:

1. **Dynamic Coloring**:
   - The `CustomFillProvider` overrides `overrideFillArgb()` to apply different colors based on profit values in metadata
   - Uses theme colors (`VividTeal`, `VividPink`) with full opacity for clear visual distinction

2. **Multi-line Data Labels**:
   - The `TreemapDataLabelProvider` formats labels to show both cumulative total and delta values
   - Implements conditional formatting (shows "+" for positive values, omits zero deltas)

3. **Engineering Notation**:
   - Applies `ENumericFormat.Engineering` format consistently across Y-axis and data labels
   - Uses 2 decimal places precision for clean display of large numbers

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

For framework-specific implementations (React, Angular), refer to the corresponding component files in the example directory. The core chart logic remains consistent across all frameworks.