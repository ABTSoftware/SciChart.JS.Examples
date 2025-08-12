# Polar Windrose Column Chart

## Overview

This example demonstrates how to create a **Polar Windrose Column Chart** using SciChart.js, visualizing directional data with stacked columns in a polar coordinate system. The chart features compass-direction labels and is commonly used for wind speed/direction analysis.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   Polar chart components (PolarSurface, PolarNumericAxis)
-   Custom label providers for compass directions
-   Stacked column series in polar coordinates

## Code Explanation

The example centers around the `drawExample` function which creates a polar chart surface with these key components:

1. **Axes Configuration**:

    - Radial Y-axis (`PolarNumericAxis`) configured for numeric values with custom styling
    - Angular X-axis (`PolarNumericAxis`) displaying compass directions via `CustomNESWLabelProvider`

2. **Data Generation**:

    - Uses `getBiasedRandomWalkInBounds` to create realistic wind patterns with angular bias
    - Generates multiple data series for stacked visualization

3. **Series Rendering**:

    - Creates a `PolarStackedColumnCollection` containing multiple `PolarStackedColumnRenderableSeries`
    - Each series has distinct colors and uses `WaveAnimation` for visual effect

4. **Interactivity**:
    - Includes `PolarPanModifier`, `PolarZoomExtentsModifier`, and `PolarMouseWheelZoomModifier`

## Customization

Key custom elements in this example include:

1. **Custom Label Provider**:

    ```typescript
    class CustomNESWLabelProvider extends NumericLabelProvider {
        public LABELS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

        public get formatLabel(): TFormatLabelFn {
            return (dataValue: number) => {
                if (dataValue % 45 === 0) {
                    return this.LABELS[dataValue / 45];
                }
                return dataValue.toFixed(0) + "°";
            };
        }
    }
    ```

    This provider displays compass directions at 45° intervals while showing degrees for other values.

2. **Angular Bias in Data Generation**:

    ```typescript
    const bias = 1 + 0.3 * Math.sin(2 * angleRad);
    ```

    Creates realistic wind patterns that peak at 0°/180° and dip at 90°/270°.

3. **Polar Chart Configuration**:
    - `flippedCoordinates: true` makes the chart display clockwise
    - `startAngle: Math.PI / 2` positions the 0° at 12 o'clock
    - `innerRadius: 0.05` creates a small hole in the chart center

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
