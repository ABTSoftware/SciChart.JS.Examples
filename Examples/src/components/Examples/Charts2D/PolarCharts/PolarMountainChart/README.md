# Polar Mountain Chart

## Overview

This example demonstrates how to create a **JavaScript Polar Mountain Chart** using SciChart.js, with both regular & interpolated mountain modes, via **PolarMountainRenderableSeries**. It showcases three mountain series in polar coordinates with gradient fills and optional line interpolation.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   Polar chart components (PolarSurface, PolarNumericAxis)
-   Polar-specific renderable series (PolarMountainRenderableSeries)
-   Polar chart modifiers (PolarZoomExtentsModifier, PolarLegendModifier)
-   Animation effects (WaveAnimation)

## Code Explanation

The example centers around the `drawExample` function which creates a polar chart surface with radial and angular axes. Key components include:

1. **Polar Surface Initialization**:

```javascript
const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
    theme: appTheme.SciChartJsTheme,
});
```

2. **Radial Y-Axis Configuration**:

```javascript
const radialYAxis = new PolarNumericAxis(wasmContext, {
    polarAxisMode: EPolarAxisMode.Radial,
    axisAlignment: EAxisAlignment.Right,
    visibleRange: new NumberRange(0, 6),
    startAngle: Math.PI / 2, // Starts at 12 o'clock position
});
```

3. **Angular X-Axis Configuration**:

```javascript
const polarXAxis = new PolarNumericAxis(wasmContext, {
    polarAxisMode: EPolarAxisMode.Angular,
    flippedCoordinates: true, // Renders clockwise
    startAngle: Math.PI / 2,
});
```

4. **Mountain Series Creation**:

```javascript
const polarMountain = new PolarMountainRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
        xValues: [...xValues, xValues[xValues.length - 1] + 1], // Close loop
        yValues: [...yValues, yValues[0]], // Close loop
    }),
    interpolateLine: true, // Enables curved interpolation
    fillLinearGradient: new GradientParams(...),
    animation: new WaveAnimation({ duration: 800 })
});
```

5. **Polar Chart Modifiers**:

```javascript
sciChartSurface.chartModifiers.add(
    new PolarPanModifier(),
    new PolarZoomExtentsModifier(),
    new PolarMouseWheelZoomModifier(),
    new PolarLegendModifier({ showCheckboxes: true })
);
```

## Customization

Key customization features in this example include:

1. **Closed-Loop Mountain Series**: The example demonstrates how to create continuous polar mountain charts by duplicating the first point at the end of the data series:

```javascript
xValues: [...xValues, xValues[xValues.length - 1] + 1],
yValues: [...yValues, yValues[0]]
```

2. **Line Interpolation**: The `interpolateLine` property allows switching between straight line segments and curved interpolation:

```javascript
interpolateLine: true; // Creates smooth curves between points
```

3. **Polar Gradient Fills**: Custom gradient fills are applied with transparency:

```javascript
fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
    { color: fillColor + "AA", offset: 0 },
    { color: fillColor + "33", offset: 0.3 },
]);
```

4. **Clockwise Coordinate System**: The polar chart is configured to render clockwise with:

```javascript
flippedCoordinates: true;
```

5. **Polar-Specific Modifiers**: The example includes polar-optimized versions of common modifiers like `PolarZoomExtentsModifier` and `PolarLegendModifier`.

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

For more information on polar charts, refer to the [SciChart.js Polar Charts Documentation](https://www.scichart.com/documentation/js/v4/2d-charts/polar-charts.html).
