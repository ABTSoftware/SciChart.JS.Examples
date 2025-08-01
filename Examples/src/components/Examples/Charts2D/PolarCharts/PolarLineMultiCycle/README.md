# Polar Line Temperature Average Chart

## Overview

This example demonstrates how to create a **JavaScript Polar Line Temperature Average** chart using SciChart.js. It visualizes 30 years of monthly temperature data in a circular layout with the last 5 years highlighted using gradient coloring. The chart uses `PolarLineRenderableSeries` on a `PolarCategoryAxis` for months and `PolarNumericAxis` for temperature values.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   Polar Chart Components – Specialized polar chart axes and series
-   Gradient Palette Provider – For highlighting recent years
-   Animation – Sweep animation for smooth transitions

## Code Explanation

The example centers around the `drawExample` function which creates a `SciChartPolarSurface` with:

1. **Axes Configuration**:

    - `PolarNumericAxis` (radial/Y-axis) configured for temperature range (12-17°C)
    - `PolarCategoryAxis` (angular/X-axis) for months with labels at 12 o'clock position

2. **Data Series**:

    - 30 `PolarLineRenderableSeries` instances (one per year)
    - Data loaded from `TEMPERATURE_DATA` constant array
    - Recent years (2019-2024) highlighted with gradient strokes

3. **Special Features**:

    - Dual `PolarLegendModifier` instances to split legend items
    - `SweepAnimation` with staggered delays for visual effect
    - Interactive modifiers (`PolarZoomExtentsModifier`, `PolarPanModifier`)

4. **Custom Styling**:
    - Gradient palette provider for highlighted years
    - Custom start angle (π/2) to position January at top
    - Flipped coordinates for clockwise month progression

## Customization

Key customization points in this example include:

1. **Gradient Highlighting**:

    ```typescript
    const highlightedPalette = PaletteFactory.createYGradient(
        wasmContext,
        new GradientParams(new Point(0, 0), new Point(0, 1), [
            { offset: 0, color: appTheme.VividBlue },
            { offset: 1, color: appTheme.VividPink },
        ]),
        new NumberRange(13, 17)
    );
    ```

    Applied only to the last 5 years (2019-2024) with thicker strokes

2. **Legend Splitting**:

    ```typescript
    sciChartSurface.renderableSeries.asArray().forEach((rs, i) => {
        if (i < TEMPERATURE_DATA.length / 2) {
            leftLegend.includeSeries(rs, true);
        } else {
            rightLegend.includeSeries(rs, true);
        }
    });
    ```

    Automatically divides series between two legend modifiers

3. **Circular Layout**:
    ```typescript
    startAngle: Math.PI / 2, // start "Jan" at 12 o'clock
    flippedCoordinates: true, // grow clockwise
    innerRadius: 0.05 // center gap size
    ```
    Controls the polar chart's circular appearance

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

For more details, see the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
