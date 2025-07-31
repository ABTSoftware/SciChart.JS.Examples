# Polar Stacked Radial Column Chart

## Overview

This example demonstrates how to create a **Polar Stacked Radial Column Chart** using SciChart.js, visualizing Winter Olympic medals per country with stacked columns in a polar coordinate system. The chart uses `PolarStackedColumnCollection` to display medal counts as radial columns grouped by country.

## Technologies Used

- SciChart.js – High performance WebGL charting library
- Polar chart components – `SciChartPolarSurface`, `PolarCategoryAxis`, `PolarNumericAxis`
- Stacked column series – `PolarStackedColumnCollection`, `PolarStackedColumnRenderableSeries`
- Interactive modifiers – `PolarZoomExtentsModifier`, `PolarMouseWheelZoomModifier`, `PolarLegendModifier`
- Animation – `WaveAnimation` for smooth series initialization

## Code Explanation

The example centers around the `drawExample` function which creates a polar chart surface with radial columns. Key components include:

1. **Polar Surface Setup**:
   - Creates a `SciChartPolarSurface` with themed styling
   - Configures a title "Winter Olympic medals per country"

2. **Axes Configuration**:
   - Radial X-axis (`PolarCategoryAxis`) with country labels using `TextLabelProvider`
   - Angular Y-axis (`PolarNumericAxis`) for medal counts with custom angle range (270 degrees)
   - Both axes use `flippedCoordinates: true` to position Norway outermost

3. **Data Series**:
   - Three `PolarStackedColumnRenderableSeries` for gold, silver, and bronze medals
   - Each series uses gradient fills and is added to a `PolarStackedColumnCollection`
   - Data comes from the `DATA` constant mapping countries to medal counts

4. **Interactivity**:
   - `PolarPanModifier` for dragging/panning
   - `PolarZoomExtentsModifier` for resetting zoom
   - `PolarMouseWheelZoomModifier` for zooming
   - `PolarLegendModifier` with checkboxes to toggle series visibility

5. **Visual Enhancements**:
   - `WaveAnimation` applied to the collection for smooth initial rendering
   - Gradient fills with darker colors at column bases
   - Custom start angle (π radians) to begin columns at the left

## Customization

Key non-obvious customizations in this example:

1. **Polar Layout**:
   - `innerRadius: 0.1` creates a donut hole effect
   - `totalAngle: Math.PI * 3 / 2` limits the chart to 270 degrees instead of full circle
   - `startAngle: Math.PI` begins columns at the left side (9 o'clock position)

2. **Axis Configuration**:
   - `zoomExtentsToInitialRange: true` prevents automatic axis range adjustment
   - `useNativeText: true` improves label rendering quality
   - `majorDelta` manually set instead of using auto-ticks

3. **Gradient Fills**:
   - While each series has a base `fill` color, they're overridden by `fillLinearGradient`
   - The gradient goes from solid color at top to dark gray at bottom for 3D effect
   - Base `fill` is still needed for legend marker colors

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

For framework-specific implementations (React, Angular), refer to the corresponding component files in the repository. The core chart logic remains consistent across all frameworks.