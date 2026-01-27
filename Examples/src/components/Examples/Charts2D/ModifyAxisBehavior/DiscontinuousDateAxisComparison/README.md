# DiscontinuousDateAxis Comparison

## Overview

Compares the features of the new [DiscontinuousDateAxis](https://www.scichart.com/documentation/win/current/SciChart.Charting~SciChart.Charting.Visuals.Axes.DiscontinuousAxis.DiscontinuousDateTimeAxis.html) to Numeric and Category Axis in SciChart.js, High Performance JavaScript Charts. This axis can collapse gaps like a category axis, but still allow varying point counts and multiple points at the same x value.

## Technologies Used

-   SciChart.js – High performance charting library
-   JavaScript – For core implementation
-   TypeScript – Used in example metadata
-   WebGL – For hardware-accelerated rendering

## Code Explanation

The example defines three chart creation functions: createDiscontinuousDateChart, createNumericChart, and createCategoryChart, each demonstrating a different X-axis type with identical financial-style data. Shared helper functions createDataSeries generates OHLC, scatter, and line data with intentional gaps (e.g., weekends) using timestamps from January 2024, while addSeriesToChart adds FastCandlestickRenderableSeries, XyScatterRenderableSeries, and FastLineRenderableSeries with theme-based styling. A custom DayOfWeekLabelProvider extends NumericLabelProvider to format labels as day-of-week plus date, applied optionally for custom tick settings. Chart modifiers like MouseWheelZoomModifier, ZoomPanModifier, RolloverModifier, and ZoomExtentsModifier provide interactivity across all charts.

## Customization

The [DiscontinuousDateAxis](https://www.scichart.com/documentation/win/current/SciChart.Charting~SciChart.Charting.Visuals.Axes.DiscontinuousAxis.DiscontinuousDateTimeAxis.html) uses a fixed dataGap of 24 hours (86400 seconds) to collapse gaps between baseXValues from the first series, preventing visual distortion from weekends or holidays while preserving numeric accuracy for dates. Custom tick control via autoTicks=false, majorDelta=24h, and minorDelta=4h enables precise day/hour labeling. CategoryAxis hides gaps by plotting via index (majorDelta=1) but limits multiple points per X; NumericAxis shows all gaps proportionally.

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

For more detailed instructions, refer to the [github](https://github.com/abtsoftware/scichart.js.examples) repo.

For more information, see the [DiscontinuousDateAxis documentation](https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/axis-types/discontinuous-date-axis/). 