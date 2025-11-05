# Semiconductors Dashboard Example - Functional Summary

## Overview

The Semiconductors Dashboard demonstrates a sophisticated semiconductor manufacturing quality control interface that enables users to analyze wafer production data across multiple dimensions and hierarchical levels.

### Dashboard Layout

**Main Components:**

1. **Yield Trend Chart (Top Panel)**: Line chart showing quality trends over time with clickable data points
2. **Batch Analysis (Bottom Left)**: Switchable view between Column Chart and Pareto Chart for batch-level analysis
3. **Wafer Maps (Bottom Right)**: Grid of 12 sub-charts displaying detailed wafer defect maps

### User Interactions

**Primary Workflow:**

-   Click any point on the yield trend line chart to drill down into batch data for that specific day
-   Toggle between "Column Chart" and "Pareto Chart" views using header buttons to analyze batch data differently
-   Select individual batches from either chart view to examine corresponding wafer defect patterns
-   All charts are synchronized - selections automatically propagate across all dashboard views

**Interactive Features:**

-   **Point Selection**: Click data points to navigate through hierarchical data levels (Day → Batch → Wafer)
-   **Chart Switching**: Seamless toggle between analytical views without losing context
-   **Synchronized Navigation**: Selection state maintained across all chart components
-   **Responsive Tooltips**: Custom SVG tooltips showing detailed batch quality summaries
-   **Zoom and Pan**: Standard chart navigation controls where appropriate

## Technical Implementation

### Architecture Overview

The dashboard is implemented as a React component ([`index.tsx`](index.tsx)) utilizing SciChart React for sophisticated multi-chart coordination:

**SciChart React Integration:**

-   [`SciChartReact`](index.tsx:116) components manage chart instance creation and lifecycle automatically
-   Each chart exposes initialization functions that accept callback handlers for inter-chart communication
-   React refs maintain references to chart instances and their exposed APIs for programmatic control
-   Chart lifecycle is handled by SciChart React, ensuring proper cleanup and memory management

### Data Structure

Data is generated semi-randomly for demonstration purposes in [`waferData.ts`](waferData.ts:87-138) using a hierarchical structure:

**WaferDayData Interface:**

-   Contains daily summary metrics (`Mean1`, `Mean2`)
-   Includes array of `WaferLotData` batches for that day

**WaferLotData Interface:**

-   Batch-level data with quality categorization ("Good", "Marginal", "Fail")
-   Process input variables (`Input1`, `Input2`)
-   Output measurements (`Measure1`, `Measure2`, `Measure3`)
-   Selection state tracking

### Custom Chart Implementations

#### 1. Line Chart ([`lineChart.ts`](lineChart.ts))

**API Surface:**

-   **Input Parameters**: `waferData` array, `onPointSelected` callback function
-   **Return Value**: Chart surface and WebAssembly context for lifecycle management
-   **Callback Interface**: `onPointSelected(point: WaferDayData, index: number)` - triggered when user selects a data point

**Key Features:**

-   [`FastLineRenderableSeries`](lineChart.ts:136) with point markers for trend visualization
-   Custom metadata interface [`IWaferPointMetadata`](lineChart.ts:28-32) extends point data with selection state
-   [`DataPointSelectionPaletteProvider`](lineChart.ts:147) for visual selection feedback
-   Custom tooltip template with responsive sizing based on viewport dimensions
-   [`DataLabelProvider`](lineChart.ts:164) showing Input1 values above data points

#### 2. Column Chart ([`columnChart.ts`](columnChart.ts))

**API Surface:**

-   **Input Parameters**: `waferData` batch array, `onBatchSelected` callback function
-   **Return Value**: Chart surface, `updateData` method, and selection modifier for external control
-   **Callback Interface**: `onBatchSelected(point: WaferLotData, isColumnChart: boolean)` - triggered when user selects a batch
-   **Update Method**: `updateData(batchData: WaferLotData[], fireSelectionChanged: boolean)` - programmatically update chart data and selection state

**Key Features:**

-   [`StackedColumnRenderableSeries`](columnChart.ts:76) displaying three measures as stacked components
-   [`XyNDataSeries`](columnChart.ts:72) with `arrayCount: 3` for multi-dimensional data
-   Custom selection annotation ([`BoxAnnotation`](columnChart.ts:110)) that highlights selected columns
-   Dynamic column width calculation and coordinate mapping

#### 3. Pareto Chart ([`paretoChart.ts`](paretoChart.ts))

**API Surface:**

-   **Input Parameters**: `waferData` batch array, `onBatchSelected` callback function
-   **Return Value**: Chart surface, `updateData` method, and selection modifier for external control
-   **Callback Interface**: `onBatchSelected(point: WaferLotData, isColumnChart: boolean)` - triggered when user selects a batch
-   **Update Method**: `updateData(waferData: WaferLotData[], fireSelectionChanged: boolean)` - updates chart with sorted data and manages selection state

**Key Custom Component:**

-   [`CumulativePercentageFilter`](paretoChart.ts:35-75) extends [`XyFilterBase`](paretoChart.ts:35) to create real-time cumulative percentage calculations
-   Combines [`FastColumnRenderableSeries`](paretoChart.ts:143) for primary data with [`FastLineRenderableSeries`](paretoChart.ts:161) for cumulative percentage
-   Dual Y-axis configuration with different scales and alignments
-   Automatic data sorting by quality values in descending order

#### 4. Wafer Grid ([`waferGrid.ts`](waferGrid.ts))

**API Surface:**

-   **Input Parameters**: `selectedPoint` - single WaferLotData used as seed for generating wafer defect patterns
-   **Return Value**: Main chart surface and `generateSubcharts` method for dynamic updates
-   **Update Method**: `generateSubcharts(selectedPoint: WaferLotData)` - regenerates all 12 sub-charts based on new selection

**Advanced Features:**

-   [`SciChartSubSurface`](waferGrid.ts:234) API for creating 12 independent sub-charts within main surface
-   [`FastRectangleRenderableSeries`](waferGrid.ts:284) for wafer die representation
-   Custom [`RectanglePaletteProvider`](waferGrid.ts:79) implementing [`IFillPaletteProvider`](waferGrid.ts:79) for defect-type-based coloring
-   Seeded random number generation in [`generateGridOfPoints`](waferData.ts:162) for reproducible wafer patterns

### Cross-Chart Synchronization

The dashboard implements sophisticated selection synchronization between charts:

**Chart Communication API:**
Each chart exposes specific methods that enable seamless inter-chart coordination:

1. **Line Chart → Column/Pareto Charts**:

    - `handlePointSelected` callback provides selected day data
    - Column and Pareto charts both expose `updateData()` methods to receive new batch arrays
    - Selection state is automatically managed through the update process

2. **Column/Pareto Charts → Wafer Grid**:

    - `handleBatchSelected` callback provides selected batch with chart type identifier
    - Wafer grid exposes `generateSubcharts()` method to regenerate all sub-charts
    - Different selection mechanisms require manual synchronization between column and Pareto views

3. **Cross-Chart Selection Management**:
    - Column chart uses `DataPointSelectionModifier` for selection tracking
    - Pareto chart uses metadata-based selection through shared data objects
    - Manual synchronization ensures consistent selection state across both chart types when toggling views

### Performance Optimizations

**Efficient Rendering:**

-   [`freezeWhenOutOfView: true`](columnChart.ts:36) prevents unnecessary updates when charts are not visible
-   Chart toggling uses CSS display properties rather than component unmounting
-   Sub-chart regeneration only occurs when necessary through the `generateSubcharts` method

**Memory Management:**

-   Proper cleanup through SciChart's built-in disposal mechanisms
-   Ref-based chart management prevents memory leaks
-   Efficient data structures for large datasets

### Styling and Theming

Uses centralized theme system ([`appTheme`](columnChart.ts:21)) providing consistent:

-   Color palettes for different data categories
-   Typography and spacing standards
-   Visual feedback for selections and interactions
-   Responsive design considerations

The dashboard showcases advanced SciChart.js capabilities including multi-chart coordination, custom data filters, sub-chart architectures, and sophisticated user interaction patterns suitable for industrial and scientific applications.
