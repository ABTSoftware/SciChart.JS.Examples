# OverviewForSubCharts

## Overview

This example demonstrates how to create multiple synchronized subcharts with an interactive overview using SciChart.js. It features vertically stacked subcharts displaying phase-shifted sine waves, synchronized X-axis zooming/panning, and a dynamic bottom overview panel for range selection across all charts. [Subchart Docs](https://www.scichart.com/documentation/js/current/WhatIsTheSubChartsAPI.html)

## Technologies Used

-   SciChart.js – High performance charting library
-   Angular – For Angular integration
-   React – For React integration
-   Vanilla JavaScript – For plain JavaScript implementation
-   TypeScript – Used in Angular and Vanilla examples

## Code Explanation

The core logic centers on the `drawExample` function, which initializes a single `SciChartSurface` and dynamically creates `SciChartSubSurface` instances positioned relatively within it. Each subchart gets independent `NumericAxis` pairs, `XyDataSeries` with generated sine wave data via `createLineData`, and `FastLineRenderableSeries` styled with theme colors and opacity. An `AxisSynchroniser` ensures all subchart X-axes share the same visible range for synchronized interactions. [github](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Examples/src/components/Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts/drawExample.ts)

Interaction modifiers like `ZoomPanModifier`, `MouseWheelZoomModifier` (X-direction only), `ZoomExtentsModifier`, and `RolloverModifier` are added per subchart. A custom `SubChartsOverviewModifier` creates a bottom overview subsurface (20% height) aggregating all subchart series, enabling unified range selection. The `SubChartManager` interface exposes methods (`updateSubCharts`, `addSubChart`, `removeSubChart`) for runtime management, using `suspendUpdates()` and `removeSubChart()` to prevent MouseManager issues during recreation. [Subchart Positioning Docs](https://www.scichart.com/documentation/js/current/SubChartPositioning.html)

Framework wrappers include:
- **index.tsx**: React component with state-managed `subCharts` array, refs for surface/manager, and floating UI controls for add/remove/color updates.
- **angular.ts / vanilla.js**: Similar initialization calling `drawExample`, with cleanup on destroy.
- **overview-for-subcharts.jpg**: Preview thumbnail image.
- Custom utils: `SubChartsOverviewModifier`, `AxisSynchroniser` for overview and sync logic.

## Customization

Distinct features include the `recreateSubChartsWithLayout` approach for safe dynamic subchart management: it suspends updates, removes existing subcharts via `sciChartSurface.removeSubChart()`, recalculates relative `Rect` positions based on config count (each taking `(1/count)*0.8` height from top), and recreates everything to avoid overlapping or interaction glitches. The `SubChartsOverviewModifier` is a non-standard custom class that clones series into an overview subsurface with `OverviewRangeSelectionModifier` for aggregated navigation, unlike basic `SciChartOverview`. Theme-based `colorsArr` and phase-shifted data enable visual distinction across panes. [github](https://github.com/ABTSoftware/SciChart.JS.Examples/activity)

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

For more detailed instructions, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md). [github](https://github.com/ABTSoftware/SciChart.JS.Examples/activity)