# Polar Partial Chart

A partial polar chart (or polar sector chart) is a variation of a polar chart where only a segment (or sector) of the full 360° circle is displayed. This is useful when you want to focus on a specific angular range (e.g., 0°–180° instead of the full circle).

## Common Use Cases for Partial Polar Charts

1. Directional Data Visualization
    - Example: Wind direction analysis (e.g., only showing 90°–270° to emphasize prevailing winds).
    - Radar charts for performance metrics (e.g., displaying only the top 180° for a focused comparison).
2. Circular Gauges & Dashboards
    - Example: A speedometer or progress meter that covers only a semicircle (0°–180°).
3. Comparative Radial Analysis
    - Example: Highlighting a specific time range in a 24-hour clock (e.g., 6 AM to 6 PM).
4. Minimizing Clutter
    - If data is concentrated in a specific angular range, a partial polar chart avoids empty space.

## Creating a polar chart with SciChart.js

In order to draw a partial polar chart you will need to set `totalAngle` in radians or `totalAngleDegrees` in degrees on the angular axes to a value less than 2π or 360 degrees.

```typescript
const angularXAxis = new PolarNumericAxis(wasmContext, {
    totalAngleDegrees: 180,
    startAngleDegrees: 90,
    polarAxisMode: EPolarAxisMode.Angular,
    axisAlignment: EAxisAlignment.Top,
    visibleRange: new NumberRange(0, 10)
});
```

In addition you can set the startAngle on the angular axis to define the rotation and on the radial axis to define the radial axis position.

```typescript
const radialYAxis = new PolarNumericAxis(wasmContext, {
    startAngleDegrees,
    polarAxisMode: EPolarAxisMode.Radial,
    axisAlignment: EAxisAlignment.Right,
    visibleRange: new NumberRange(0, 7)
});
```

Here you will find the full editable example.

## Flipped Angular axis

If there is need for angular axis to go clock-wise use `flippedCoordinates`

```typescript
const angularXAxis = new PolarNumericAxis(wasmContext, {
    ...
    flippedCoordinates: true
});
```

The way it works it just flips the angular axis coordinates, therefore `startAngle` property works the same way, it calculates the start angle from not-flipped angular axis.
