This is an example of a Polar Line Chart which is provided by SciChart.js. The Polar Chart allows plotting data in a polar coordinate system (angle and radius) instead of the cartesian (X, Y) coordinate system.

This example demonstrates several features of SciChart.js, which are explained below.

### Documentation

For more information about the Polar Line Chart, please see the [SciChart.js Polar Line Renderable Series Documentation](https://scichart.com/documentation/js/v4/2d-charts/chart-types/polar-line-renderable-series/).

---

### Example Features

The [`drawExample.ts`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:1) file showcases various capabilities of SciChart's polar charts through a set of distinct initialization functions:

1.  **Simple Polar Lines (`line1`)**

    -   Demonstrates the basic setup of a [`SciChartPolarSurface`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:66).
    -   Configuration of [`PolarNumericAxis`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:72) for both radial and angular axes.
    -   The angular axis is configured in degrees, clockwise, with the 0-degree mark at the 12 o'clock position.
    -   Adds two [`PolarLineRenderableSeries`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:101) with simple data.
    -   Includes basic chart modifiers for interaction: [`PolarPanModifier`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:126), [`PolarZoomExtentsModifier`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:127), and [`PolarMouseWheelZoomModifier`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:128).

2.  **Line Function Traces (`line2`)**

    -   Plots complex mathematical shapes like the Rose and Butterfly curves.
    -   Uses a [`RadianLabelProvider`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:153) to display the angular axis labels in terms of π (pi).
    -   Data is generated programmatically to create smooth function traces.

3.  **Spiral Line (`line3`)**

    -   Shows how to create a spiral effect by manipulating the relationship between angle and radius data.
    -   Adds an [`EllipsePointMarker`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:271) to each data point on the line series for better visualization.

4.  **Palette Provider Polar Lines (`line4`)**

    -   Demonstrates advanced coloring using a custom `ThresholdLinePaletteProvider`. This class extends [`DefaultPaletteProvider`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:332) to apply a specific color to line segments that fall within a certain data value range.
    -   The chart is configured as a quarter-circle by setting the `totalAngle` property on the angular axis.

5.  **Line with Data Labels (`line5`)**

    -   Illustrates how to add and customize data labels directly on the series points using the `dataLabels` property.
    -   Customizes gridlines and point markers for a distinct visual style.

6.  **Palette Provider Spiral Line (`line6`)**
    -   Presents another custom palette provider (`XLinePaletteProvider`) that changes the stroke color of the line based on the index of the data point, creating a segmented color effect.
    -   Includes the [`PolarCursorModifier`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:539) to display tooltips as the user hovers over the chart.

### Core SciChart.js Concepts Demonstrated

-   **Polar Chart Creation**: Using [`SciChartPolarSurface.create()`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:66) to initialize a polar chart.
-   **Axis Configuration**: Customizing angular and radial axes with properties like `startAngle`, `flippedCoordinates`, `totalAngle`, and using specialized `labelProviders`.
-   **Renderable Series**: Using [`PolarLineRenderableSeries`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:101) to display line data.
-   **Data Series**: Populating charts with data using [`XyDataSeries`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:102).
-   **Animations**: Applying [`SweepAnimation`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:108) for an engaging initial rendering of the series.
-   **Interactivity**: Enabling zooming and panning with Chart Modifiers.
-   **Styling**: Customizing the appearance of series with `stroke`, `strokeThickness`, and [`pointMarkers`](src/components/Examples/Charts2D/PolarCharts/PolarLineChart/drawExample.ts:271).
-   **Advanced Coloring**: Implementing custom logic for dynamic series coloring via the `paletteProvider` API.
