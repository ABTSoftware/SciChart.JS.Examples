# Heatmap Over Map Example

## Overview

This example demonstrates how to create a **heatmap visualization of earthquake data overlaid on a world map** using SciChart.js. The visualization displays earthquake magnitudes using a color gradient, with country/continent outlines rendered as line series beneath the heatmap.

## Features

- **Earthquake Heatmap**: Visualizes ~23,000 earthquake data points as a heatmap
- **World Map Overlay**: Country/continent outlines rendered using `FastLineRenderableSeries`
- **Color-Coded Magnitudes**: Richter scale magnitudes (0-10) mapped to a gradient from black (no activity) through green, yellow, orange to red (highest magnitude)
- **Interactive Navigation**: Zoom, pan, and mouse wheel zoom support
- **Heatmap Legend**: Separate legend component showing the magnitude color scale
- **Smoothed Visualization**: 3x3 averaging filter applied for smoother heatmap appearance

## Key Components

### Main Chart ([`drawExample()`](drawExample.ts:38))

Creates the primary visualization with:

- **Hidden Axes**: X-axis (-180° to 180° longitude) and Y-axis (-90° to 90° latitude) configured but hidden for clean map appearance
- **Heatmap Resolution**: 600×400 grid cells
- **Semi-transparent Overlay**: Heatmap rendered at 50% opacity over map outlines

### Heatmap Legend ([`drawHeatmapLegend()`](drawExample.ts:159))

Creates a standalone legend showing the magnitude color scale with:

- Custom themed background
- Inner axis with tick marks
- Same color gradient as the main heatmap

## Data Sources

| File | Description |
|------|-------------|
| `earthquakes-23k.csv` | CSV file containing earthquake data (Date, Latitude, Longitude, Magnitude) |
| `worldConverted.json` | JSON file containing world map outline coordinates |

## Color Mapping

The heatmap uses a gradient color map for earthquake magnitudes:

| Magnitude Range | Color |
|-----------------|-------|
| 0 (No activity) | Black (`#000000`) |
| ~2 | Light Green (`#90EE90`) |
| ~4 | Yellow (`#FFFF00`) |
| ~6 | Orange (`#FFA500`) |
| ~8 | Orange-Red (`#FF4500`) |
| 10 (Maximum) | Red (`#FF0000`) |

## Technical Implementation

### Coordinate System

The chart uses standard geographic coordinates:
- **X-axis**: Longitude (-180° to 180°)
- **Y-axis**: Latitude (-90° to 90°)

### Heatmap Generation

1. **Grid Initialization**: Creates a 600×400 grid filled with zeros
2. **Data Mapping**: Each earthquake is mapped to a grid cell based on lat/lon
3. **Magnitude Assignment**: Uses maximum magnitude when multiple earthquakes fall in the same cell
4. **Smoothing**: Applies a 3x3 averaging filter for visual smoothness

### Chart Modifiers

- [`ZoomPanModifier`](drawExample.ts:149): Enables drag-to-pan and zoom functionality
- [`ZoomExtentsModifier`](drawExample.ts:150): Double-click to reset view
- [`MouseWheelZoomModifier`](drawExample.ts:151): Scroll wheel zooming

## Usage

```typescript
import { drawExample, drawHeatmapLegend } from "./drawExample";

// Create main chart
const { sciChartSurface } = await drawExample("chart-root-element");

// Create legend (optional)
const { sciChartSurface: legendSurface } = await drawHeatmapLegend("legend-root-element");
```

## Dependencies

- `scichart` - SciChart.js library
- Theme configuration from `../../../theme`

## SciChart.js Components Used

- [`SciChartSurface`](drawExample.ts:8) - Main chart surface
- [`NumericAxis`](drawExample.ts:7) - Axis configuration
- [`UniformHeatmapRenderableSeries`](drawExample.ts:10) - Heatmap rendering
- [`UniformHeatmapDataSeries`](drawExample.ts:9) - Heatmap data container
- [`FastLineRenderableSeries`](drawExample.ts:2) - Map outline rendering
- [`XyDataSeries`](drawExample.ts:11) - Line series data
- [`HeatmapColorMap`](drawExample.ts:3) - Color gradient configuration
- [`HeatmapLegend`](drawExample.ts:4) - Legend component
