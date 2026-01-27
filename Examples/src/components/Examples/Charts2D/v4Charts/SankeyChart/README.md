# Sankey Chart Example

This example demonstrates how to create a **Sankey Diagram** using SciChart.js by combining:

- **FastBandRenderableSeries** for smooth flow links (bezier curves)
- **FastRectangleRenderableSeries** for nodes
- **d3-sankey** for layout calculations

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        d3-sankey                                │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │ Input Data  │───▶│ sankey()     │───▶│ Node positions   │   │
│  │             │    │ generator    │    │ Link paths       │   │
│  └─────────────┘    └──────────────┘    └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SciChart.js                              │
│  ┌──────────────────────┐    ┌──────────────────────────────┐  │
│  │ FastRectangleSeries  │    │ FastBandRenderableSeries     │  │
│  │ (Nodes)              │    │ (Flow Links)                 │  │
│  └──────────────────────┘    └──────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│                    ┌──────────────────┐                        │
│                    │ Sankey Diagram   │                        │
│                    │ (WebGL rendered) │                        │
│                    └──────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

1. **High Performance**: WebGL-accelerated rendering via SciChart.js
2. **Smooth Curves**: Bezier-interpolated flow links using FastBandRenderableSeries
3. **Category Coloring**: Nodes colored by category (source, conversion, consumption)
4. **Interactive**: Zoom, pan, and mouse wheel support
5. **Data Labels**: Node names displayed alongside rectangles

## Dependencies

This example requires the `d3-sankey` package:

```bash
npm install d3-sankey @types/d3-sankey
```

## Data Structure

The Sankey data consists of:

- **Nodes**: Objects with `name` and `category` properties
- **Links**: Objects with `source`, `target`, and `value` properties

```typescript
const SANKEY_DATA = {
    nodes: [
        { name: "Coal", category: "source" },
        { name: "Electricity", category: "conversion" },
        { name: "Residential", category: "consumption" },
        // ...
    ],
    links: [
        { source: 0, target: 4, value: 25 }, // Coal -> Electricity
        // ...
    ],
};
```

## How It Works

1. **Layout Calculation**: d3-sankey computes node positions (x0, y0, x1, y1) and link paths (y0, y1, width)

2. **Node Rendering**: FastRectangleRenderableSeries with XyxyDataSeries renders nodes as rectangles

3. **Link Rendering**: FastBandRenderableSeries with XyyDataSeries renders links as bands with bezier-interpolated curves

4. **Coordinate Transformation**: Y-coordinates are flipped since SciChart uses Cartesian coordinates (Y increases upward) while d3-sankey uses screen coordinates (Y increases downward)

## Customization

- **Colors**: Modify `CATEGORY_COLORS` and `LINK_COLORS` for different color schemes
- **Layout**: Adjust `nodeWidth`, `nodePadding`, and `extent` in the sankey generator
- **Curves**: Modify the `cubicBezier` function or `numPoints` for different curve smoothness
