# High Precision Date Axis

## Overview

This example demonstrates the [DateTimeNumericAxis](https://www.scichart.com/documentation/js/current/DateTimeNumericAxis.html) with 64-bit precision, handling ranges from Nanoseconds to Billions of Years.

It renders a FastLineRenderableSeries with toggleable datasets across four precision levels and provides implementations for React, Angular, and Vanilla JavaScript.

## Technologies Used

-   SciChart.js – High performance charting library 
-   Angular – For Angular integration
-   React – For React integration with MUI controls
-   Vanilla JavaScript – For plain JavaScript implementation
-   TypeScript – Used across framework examples

## Code Explanation

The core `drawExample` function initializes a SciChartSurface with a DateTimeNumericAxis on X and NumericAxis on Y, using a customized SmartDateLabelProvider for high-precision date formatting.

It generates four datasets via `createDatasets` spanning 1 billion years (seconds), 70,000 years (milliseconds), 40 years (microseconds), and 50 days (nanoseconds), rendered as XyDataSeries with FastLineRenderableSeries and theme-based strokes.

Interactive controls allow dataset switching (updating datePrecision and stroke colors), precise zoom-in to clusters, and standard modifiers like RubberBandXyZoomModifier, ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier. Framework files include React TSX with MUI Select/Switch, Angular/TypeScript components, and vanilla wrappers, plus a thumbnail image `javascript-zoom-high-precision.jpg`.

## Customization

Custom overrides on SmartDateLabelProvider handle billion-year scales beyond standard JS Date limits, formatting wide dates as "Year 500M" using engineering notation and precise dates via modulo day extraction.

A performance-optimized `getYRange` on FastLineRenderableSeries uses `getIndicesRange` and `NumberUtil.MinMaxWithIndex` for efficient Y-range calculation on large datasets during zoom/pan.

The `zoomInPrecise` control animates to a 10-point cluster with exaggerated easing over 3 seconds, demonstrating sub-unit precision visualization.

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