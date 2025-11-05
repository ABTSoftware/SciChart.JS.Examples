# Wafer Analysis Dashboard - React

## Overview

### Dashboard/Interface Layout

The Wafer Analysis dashboard presents a comprehensive semiconductor wafer testing interface organized in a two-panel layout:

**Left Panel:**

-   Main wafer visualization chart displaying the circular wafer map with individual dies
-   Variable selection dropdown for switching between different measurement variables (DEFECT, MR, HR, MR2, HDI)
-   Legend area showing defect type classifications

**Right Panel:**

-   Top section: Dual-variable scatter plot comparing MR vs MR2 and HR vs HDI relationships
-   Bottom section: 2x2 grid of histogram charts with nested overview controls for each measurement variable (MR, HR, MR2, HDI)

### User Interactions

**Wafer Chart Interactions:**

-   **Drag Selection**: Users can drag to select rectangular regions on the wafer, which filters data by row/column position
-   **Single Click**: Clears any active selection filters
-   **Right-Click Zoom/Pan**: Navigate around the wafer visualization
-   **Mouse Wheel**: Zoom in/out on the wafer
-   **Variable Selection**: Dropdown allows switching color visualization between defect types and numeric variables

**Measure Chart Interactions:**

-   **Zoom/Pan Operations**: Each histogram chart supports independent zooming and panning
-   **Range Selection**: Zooming on any histogram automatically applies range filters to that measurement variable
-   **Overview Charts**: Miniature overview charts beneath each histogram show the full data range and current zoom level

**Scatter Plot Interactions:**

-   **Standard Navigation**: Zoom, pan, and mouse wheel operations
-   **Legend**: Toggle visibility of MR vs MR2 and HR vs HDI data series

### Interactive Features

The dashboard implements a sophisticated cross-filtering workflow where interactions in any chart component immediately update all other visualizations:

1. **Wafer Selection → Measurement Filtering**: Selecting regions on the wafer filters all histogram and scatter plot data
2. **Histogram Zooming → Cross-Filter Updates**: Zooming on any measurement histogram applies range filters that update the wafer visualization and scatter plot
3. **Variable Switching → Dynamic Recoloring**: Changing the color variable dynamically updates the wafer chart's palette provider for real-time visualization changes
4. **Bidirectional Filtering**: All filters work in combination, allowing users to drill down through multiple dimensions simultaneously

### Primary Use Cases

This example demonstrates:

-   **Semiconductor Manufacturing Analysis**: Visualizing die-level measurements across a wafer surface
-   **Multi-Dimensional Data Exploration**: Cross-filtering capabilities for analyzing relationships between different measurement variables
-   **Defect Pattern Recognition**: Color-coded visualization of defect types and measurement ranges
-   **Real-time Data Analytics**: Live filtering and updating of large datasets using crossfilter technology

## Technical Implementation

### Architecture Overview

The application leverages **SciChart React** integration through the [`SciChartReact`](index.tsx:265) component pattern, where each chart is initialized via factory functions and managed through React refs. The architecture separates concerns between:

-   **Data Management**: [`useDataStore`](store.ts:37) Zustand store with crossfilter dimensions
-   **Chart Factories**: Individual [`createInit*`](waferChart.ts:158) functions for each chart type
-   **Communication Layer**: React callback patterns and ref-based method invocation

### Individual Chart/Component Analysis

#### Wafer Chart Component

**API Surface:**

-   **Input Parameters**: [`setRowFilter`](waferChart.ts:160), [`setColFilter`](waferChart.ts:161), [`selectedVariable`](waferChart.ts:162), [`variableRange`](waferChart.ts:163)
-   **Return Values**: [`updateWaferData()`](waferChart.ts:236), [`updatePaletteProvider()`](waferChart.ts:255) methods
-   **Update Methods**: [`updateWaferData(dataJSON: WaferData[])`](waferChart.ts:236) for data refresh, [`updatePaletteProvider(newVariable: string, newRange?: [number, number])`](waferChart.ts:255) for color scheme updates

**Key Technical Features:**

-   **Custom Palette Provider**: [`RectanglePaletteProvider`](waferChart.ts:47) implements [`IFillPaletteProvider`](waferChart.ts:47) for dynamic coloring based on defect types or measurement ranges
-   **Custom Selection Modifier**: [`WaferRangeSelectionModifier`](waferChart.ts:110) extends [`DataPointSelectionModifier`](waferChart.ts:110) to translate rectangle selections into row/column filter ranges
-   **FastRectangleRenderableSeries**: Uses [`FastRectangleRenderableSeries`](waferChart.ts:189) with [`XyzDataSeries`](waferChart.ts:186) for efficient wafer die rendering
-   **Color Interpolation**: Implements [`uintArgbColorLerp()`](waferChart.ts:103) for smooth color transitions between measurement value ranges

#### Measure Chart Components

**API Surface:**

-   **Input Parameters**: [`xValues: number[]`](measureCharts.ts:51), [`yValues: number[]`](measureCharts.ts:51), [`setFilter: Dispatch<[number, number]>`](measureCharts.ts:51), [`fill: string`](measureCharts.ts:51)
-   **Return Values**: [`updateMeasureChartData(xValues: number[], yValues: number[])`](measureCharts.ts:121) method
-   **Callback Interfaces**: [`setFilter`](measureCharts.ts:51) callback triggered on [`visibleRangeChanged`](measureCharts.ts:112) events

**Key Technical Features:**

-   **Custom Delta Calculator**: [`IntegerDeltaCalculator`](measureCharts.ts:23) extends [`NumericDeltaCalculator`](measureCharts.ts:23) to ensure integer-only axis tick marks
-   **Nested Overview Integration**: [`overviewOptions`](measureCharts.ts:31) configuration with [`transformRenderableSeries`](measureCharts.ts:35) for series cloning
-   **Auto-Range Animation**: [`autoRangeAnimation`](measureCharts.ts:74) with [`easing.outExpo`](measureCharts.ts:78) for smooth transitions
-   **Range-Based Filtering**: [`visibleRangeChanged.subscribe()`](measureCharts.ts:112) automatically updates filter state

#### Scatter Plot Component

**API Surface:**

-   **Input Parameters**: No external parameters required
-   **Return Values**: [`updateScatterPlotData(values: readonly WaferData[])`](scatterPlot.ts:101) method
-   **Update Methods**: [`updateScatterPlotData()`](scatterPlot.ts:101) handles dual data series updates

**Key Technical Features:**

-   **Dual Data Series**: Manages two [`XyDataSeries`](scatterPlot.ts:54) for MR vs MR2 and HR vs HDI correlations
-   **Custom Point Markers**: [`EllipsePointMarker`](scatterPlot.ts:64) with opacity settings for data density visualization
-   **Legend Integration**: [`LegendModifier`](scatterPlot.ts:97) with [`ELegendPlacement.TopRight`](scatterPlot.ts:97)

### Component Communication

**Cross-Filter Architecture:**
The communication system centers on crossfilter dimensions and groups managed by [`useDataStore`](store.ts:37):

-   **Dimension Creation**: [`dies.dimension()`](store.ts:54) creates filterable dimensions for each measurement variable
-   **Group Aggregation**: [`dimension.group(Math.floor)`](store.ts:66) creates histogram bins for each measurement
-   **Filter Application**: Dimensions support [`filter(range)`](index.tsx:34) and [`filterAll()`](index.tsx:52) operations

**Update Propagation:**

-   **Filter State Changes**: React [`useState`](index.tsx:14) hooks trigger [`useEffect`](index.tsx:207) reactions
-   **Data Flow**: [`dies.allFiltered()`](index.tsx:192) provides filtered data to all chart components
-   **Method Invocation**: Chart refs expose [`updateWaferData()`](index.tsx:213), [`updateScatterPlotData()`](index.tsx:209), and [`updateMeasureChartData()`](index.tsx:244) methods

**Callback Patterns:**

-   **Range Filters**: Measure charts invoke [`setFilter([min, max])`](measureCharts.ts:114) on zoom operations
-   **Spatial Filters**: Wafer selection calls [`setRowFilter()`](waferChart.ts:139) and [`setColFilter()`](waferChart.ts:140)
-   **Variable Selection**: Dropdown changes trigger [`updatePaletteProvider()`](index.tsx:221) calls

### Performance Optimizations & Advanced Features

**Memory Management:**

-   **Memoized Calculations**: [`useMemo()`](index.tsx:73) for data transformations and factory function creation
-   **Callback Stabilization**: [`useCallback()`](index.tsx:147) for chart initialization handlers
-   **Efficient Updates**: [`dataSeries.clear()`](measureCharts.ts:122) and [`appendRange()`](measureCharts.ts:123) for minimal memory allocation

**Data Processing Optimizations:**

-   **Crossfilter Integration**: Leverages crossfilter's optimized filtering and grouping algorithms
-   **Selective Filtering**: [`dies.allFiltered([Row, Col])`](index.tsx:201) excludes specific dimensions from wafer data filtering
-   **Integer Grouping**: [`Math.floor`](store.ts:66) grouping functions for histogram binning

**Rendering Performance:**

-   **Fast Series Types**: [`FastRectangleRenderableSeries`](waferChart.ts:189), [`FastColumnRenderableSeries`](measureCharts.ts:95) for high-performance rendering
-   **Efficient Data Series**: [`dataIsSortedInX: true`](measureCharts.ts:91) optimization hints
-   **Palette Provider Caching**: [`RectanglePaletteProvider`](waferChart.ts:47) with cached color calculations

**Advanced Features:**

-   **Dynamic Theming**: Integration with [`appTheme`](waferChart.ts:28) for consistent color schemes
-   **Seeded Data Generation**: [`generateWaferDataByValues()`](waferData.ts) from URL parameters for reproducible examples
-   **Manual Legend**: [`ManualLegend`](waferChart.ts:223) with [`placementDivId`](waferChart.ts:229) for external legend positioning
-   **Overview Charts**: [`SciChartNestedOverview`](index.tsx:304) components with automatic series transformation

The implementation demonstrates advanced SciChart.js capabilities including custom modifiers, palette providers, and sophisticated data binding patterns optimized for real-time multi-dimensional data analysis.
