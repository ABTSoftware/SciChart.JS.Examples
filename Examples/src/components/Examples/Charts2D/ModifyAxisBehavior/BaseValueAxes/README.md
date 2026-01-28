# BaseValue Axes Chart

## Overview

This example demonstrates how to create a JavaScript Chart with BaseValue axes using SciChart.js, High Performance JavaScript Charts to achieve various non-linear axes.

## Technologies Used

-   SciChart.js – High performance charting library
-   React – For React integration
-   Angular – For Angular integration
-   Vanilla JavaScript – For plain JavaScript implementation
-   TypeScript – Used across framework examples

## Code Explanation

The core implementation centers on the `BaseValueAxis` class, which extends `AxisBase2D` and uses explicit base values plotted by index for non-linear scaling. The `drawExample` function initializes a `SciChartSurface`, adds `BaseValueAxis` instances to both X and Y axes with custom `baseValues` arrays or data series, and renders a `FastLineRenderableSeries` with noisy sinewave data. Key features include a hidden `NumericAxis` for annotation positioning, interactive modifiers like `ZoomPanModifier` and `MouseWheelZoomModifier` restricted to the BaseValue X axis, and a draggable `VerticalLineAnnotation` that dynamically updates base values to "zoom" into specific regions by densifying points. Framework wrappers (React TSX, Angular TS, vanilla JS/TS) invoke `drawExample` with cleanup support.

## Customization

The `BaseValueAxis` supports non-uniform spacing via `baseValues` (IDataSeries or NumberArray), with `dataGap` controlling compression of gaps (0 for continuous mode). Custom tick providers override `getMajorTicks`/`getMinorTicks` for the Y-axis using a power-law generator (`generatePowerLawBaseValues`) that adapts to `visibleRange` changes, creating logarithmic-like scales with minors between majors. Dragging the annotation refines X-axis base values around the cursor (e.g., adding points every 0.1 from -0.5 to +0.5), compressing distant regions for variable-resolution visualization.

## Running the Example

To run any example from the SciChart.JS.Examples repository, follow these steps:

1. **Clone the Repository**: Download the entire repository to your local machine using Git:

```bash
git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
```

2. **Navigate to the Examples Directory**: Change into the `Examples` folder:

```bash
cd SciChart.JS.Examples/Examples
```

3. **Install Dependencies**: Install the necessary packages using npm:

```bash
npm install
```

4. **Run the Development Server**: Start the development server to view and interact with the examples:

```bash
npm run dev
```

This will launch the demo application, allowing you to explore various examples, including the one in question.

For more detailed instructions, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
