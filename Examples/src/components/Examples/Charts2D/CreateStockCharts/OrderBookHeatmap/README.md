# Order Book Heatmap Example

This example demonstrates how to create an **Order Book Heatmap** chart with a candlestick overlay using SciChart.JS. It combines [`UniformHeatmapRenderableSeries`](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type) with [`FastCandlestickRenderableSeries`](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/fast-candlestick-renderable-series/) to visualize order book depth alongside price action.

## Overview

Order book heatmaps are commonly used in cryptocurrency and stock trading to visualize market depth and liquidity at different price levels over time. This visualization helps traders identify:

-   **Support and resistance levels** - Areas with high order concentration
-   **Liquidity gaps** - Price levels with low order volume
-   **Market sentiment** - How order book depth changes over time

## Features

-   **Heatmap visualization** of order book depth data
-   **Candlestick overlay** showing OHLC price data
-   **Custom color mapping** from dark background → white (low values) → red (high values)
-   **Interactive modifiers** including zoom, pan, and cursor tooltips
-   **Custom tooltip template** displaying OHLC values and order counts
-   **Overview/Navigator component** with mountain series transformation

## Data Sources

The example loads data from two CSV files:

1. **`LTCUSDT_OHLC.csv`** - OHLCV candlestick data with columns:

    - Timestamp (Unix)
    - Open, High, Low, Close prices
    - Volume

2. **`orderbook_levels.csv`** - Order book depth data:
    - First row: Unix timestamps for each time column
    - Subsequent rows: Price level followed by order values at each timestamp

## Key Components

### Chart Setup

```typescript
const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
    theme: new SciChartJsNavyTheme(),
});
```

### Axes Configuration

-   **X-Axis**: [`DateTimeNumericAxis`](drawExample.ts:219) for continuous time data with HH:MM:SS cursor labels
-   **Y-Axis**: [`NumericAxis`](drawExample.ts:225) with decimal formatting and `$` prefix for price display

### Heatmap Series

The heatmap uses [`UniformHeatmapDataSeries`](drawExample.ts:269) with:

-   Calculated average X and Y step sizes for uniform cell spacing
-   [`HeatmapColorMap`](drawExample.ts:244) with custom gradient stops
-   Semi-transparency (`opacity: 0.4`) to show candlesticks through the heatmap
-   Disabled linear texture filtering for crisp cell boundaries

### Candlestick Series

[`FastCandlestickRenderableSeries`](drawExample.ts:319) configured with:

-   Custom up/down colors (green for bullish, red for bearish)
-   Semi-transparent brush fills
-   0.8 data point width

### Chart Modifiers

-   [`ZoomExtentsModifier`](drawExample.ts:337) - Double-click to zoom to fit
-   [`ZoomPanModifier`](drawExample.ts:338) - Drag to pan (X-direction only)
-   [`MouseWheelZoomModifier`](drawExample.ts:344) - Scroll to zoom (X-direction only)
-   [`CursorModifier`](drawExample.ts:345) - Crosshair with custom tooltip template

## Custom Tooltip Template

The [`getTooltipLegendTemplate`](drawExample.ts:390) function provides formatted tooltips:

-   **Candlestick series**: Displays `Open=X High=X Low=X Close=X`
-   **Heatmap series**: Displays `Price Orders: Count`

## Overview Component

The [`sciChartOverview`](drawExample.ts:378) configuration transforms the candlestick series into a [`FastMountainRenderableSeries`](drawExample.ts:364) for cleaner visualization in the navigator, while hiding the heatmap.

## Usage

```typescript
import { drawExample, sciChartOverview } from "./drawExample";

// Create the chart
const { sciChartSurface, candlestickSeries } = await drawExample("chart-root-element");

// Optional: Use with SciChartOverview component
// Pass sciChartOverview configuration to the overview component
```

## API Reference

### `drawExample(rootElement: string | HTMLDivElement)`

Creates the Order Book Heatmap chart.

**Parameters:**

-   `rootElement` - HTML element ID or HTMLDivElement to render the chart into

**Returns:**

-   `sciChartSurface` - The main chart surface instance
-   `candlestickSeries` - The candlestick renderable series

### `sciChartOverview`

Configuration object for the SciChart overview/navigator component.

**Properties:**

-   `theme` - The chart theme
-   `transformRenderableSeries` - Function to transform series for overview display

## Dependencies

-   `scichart` - SciChart.JS library
-   Theme configuration from `../../../theme`
