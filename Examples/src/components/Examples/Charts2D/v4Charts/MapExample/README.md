# Map Example - Choropleth Map of Australia

## Overview

This example demonstrates how to create an interactive **Choropleth map** of Australia using SciChart.js. It visualizes geographic data with color-coded regions based on population metrics using `FastTriangleRenderableSeries` for terrain coloring and `FastLineRenderableSeries` for state outlines.

This example fetches **australiaConverted.json** from server. **australiaConverted.json** is array of objects and each object contains "name", "outline" and "areaData".

-   `name` is string that contains name of the location
-   `outline` is array of arrays that represent longitude and latitude of points that represent outline of area
-   `areaData` is array of arrays that represent series of coordinate points that form triangles used by SciChart's `FastTriangleRenderableSeries` to create shapes that represent area

**areaData** is generated using poly2tri - https://github.com/r3mi/poly2tri.js, a 2D constrained Delaunay triangulation library from `GeoJSON` representation of Australia map

Here is example of data from **australiaConverted.json**:

```
   [
   {
      "name": "New South Wales",
      "outline": [
         [159.10542, -31.563994],
         [159.09775, -31.564275],
         [159.099634, -31.573372],
         [159.094217, -31.57097],
         ...
      ],
      "areaData": [
         [159.03796, -31.512156],
         [159.056995, -31.519772],
         [159.064657, -31.509666],
         [159.03796, -31.512156],
      ...
      ]
   }
   ...
   [
```

## Technologies Used

-   SciChart.js - High performance WebGL charting library
-   Geographic data processing - For map coordinates and triangulation
-   Color interpolation - For dynamic choropleth coloring
-   Aspect ratio preservation - For correct map proportions during resizing

## Code Explanation

The implementation centers around the `drawExample` function which:

1. **Creates the SciChartSurface** with X and Y axes configured for geographic coordinates
2. **Processes map data** through `setMapJson` which:
    - Stores polygon outlines for borders
    - Calculates polygon centers for labeling
    - Prepares triangulated area data for coloring
3. **Renders three main series types**:
    - `FastTriangleRenderableSeries` in `ETriangleSeriesDrawMode.List` mode for filled regions
    - `FastLineRenderableSeries` for state/territory borders
    - `FastBubbleRenderableSeries` with `EllipsePointMarker` for city markers
4. **Implements dynamic recoloring** through the `setMap` function which:
    - Recalculates color scales based on selected metric (population, area, or density)
    - Uses `interpolateColor` for smooth color gradients between values
5. **Preserves aspect ratio** with custom logic in `preserveAspectRatio` that maintains correct map proportions during resizing

## Customization

Key customization aspects in this example include:

1. **Color Interpolation**:

    - The `interpolateColor` function creates a smooth gradient between two hex colors (#5dc0c0 to #1e3489)
    - Values are normalized between min/max ranges of the selected metric
    - Uses RGB color space interpolation for accurate color transitions

2. **Aspect Ratio Handling**:

    - The `preserveAspectRatio` function dynamically adjusts axis ranges
    - Uses container dimensions vs. visible range calculations
    - Maintains geographic accuracy during resize operations

3. **Data Label Placement**:

    - City markers use custom metadata for labels
    - Text positioning is controlled via `EVerticalTextPosition` and `EHorizontalTextPosition`
    - Includes padding and font styling for readability

4. **Performance Considerations**:
    - Triangulation is pre-processed for optimal rendering
    - Console logs triangle count for performance monitoring
    - Uses WebGL-optimized series types throughout

## Running the Example

To run this example from the SciChart.JS.Examples repository:

1. Clone the repository:

```bash
git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
```

2. Navigate to the Examples folder:

```bash
cd SciChart.JS.Examples/Examples
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

For more details, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
