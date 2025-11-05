import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "Semiconductors",
        id: "featuredApps_scientificCharts_Semiconductors",
        imagePath: "semiconductors-dashboard.jpg",
        description:
            "Creates a **Semiconductors Dashboard** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **Semiconductors Dashboard** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
                title: "Semiconductors Dashboard",
                pageTitle: "Semiconductors Dashboard | JavaScript Charts | SciChart.js",
                metaDescription:
                    "JavaScript **Semiconductors Dashboard** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
                markdownContent: null,
            },
            react: {
                subtitle:
                    "Creates a **React Semiconductors Dashboard** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
                title: "Semiconductors Dashboard",
                pageTitle: "React Semiconductors Dashboard | JavaScript Charts | SciChart.js",
                metaDescription:
                    "React **Semiconductors Dashboard** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
                markdownContent:
                    `
## Semiconductors Dashboard Example - React

#### Overview

The **Semiconductors Dashboard** demonstrates a sophisticated semiconductor manufacturing quality control interface that enables users to analyze wafer production data across multiple dimensions and hierarchical levels.

#### Dashboard Layout

**Main Components**

\n-- **Yield Trend Chart (Top Panel):** Line chart showing quality trends over time with clickable data points.  
\n-- **Batch Analysis (Bottom Left):** Switchable view between Column Chart and Pareto Chart for batch-level analysis.  
\n-- **Wafer Maps (Bottom Right):** Grid of 12 sub-charts displaying detailed wafer defect maps.  


#### User Interactions

**Primary Workflow:**

\n-- Click any point on the yield trend line chart to drill down into batch data for that specific day.
\n-- Toggle between *Column Chart* and *Pareto Chart* views using header buttons to analyze batch data differently.
\n-- Select individual batches from either chart view to examine corresponding wafer defect patterns.
\n-- All charts are synchronized — selections automatically propagate across all dashboard views.

**Interactive Features:**

\n-- **Point Selection:** Navigate through hierarchical data levels (Day → Batch → Wafer).
\n-- **Chart Switching:** Seamless toggle between analytical views without losing context.
\n-- **Synchronized Navigation:** Selection state maintained across all chart components.
\n-- **Responsive Tooltips:** Custom SVG tooltips showing detailed batch quality summaries.
\n-- **Zoom and Pan:** Standard chart navigation controls where appropriate.


#### Technical Implementation

### Architecture Overview:

The dashboard is implemented as a React component (\`index.tsx\`) utilizing **SciChart React** for multi-chart coordination.

**SciChart React Integration**

\n-- \`SciChartReact\` components manage chart instance creation and lifecycle automatically.
\n-- Each chart exposes initialization functions that accept callback handlers for inter-chart communication.
\n-- React refs maintain references to chart instances and their APIs for programmatic control.
\n-- Lifecycle handled by SciChart React ensures proper cleanup and memory management.


### Data Structure

Data is generated semi-randomly in \`waferData.ts\` using a hierarchical structure.

**Interfaces**

\n-- **\`WaferDayData\`:** Contains daily summary metrics (\`Mean1\`, \`Mean2\`) and an array of \`WaferLotData\` batches.
\n-- **\`WaferLotData\`:** Batch-level data with quality categorization (*Good*, *Marginal*, *Fail*), input variables (\`Input1\`, \`Input2\`), output measurements (\`Measure1\`, \`Measure2\`, \`Measure3\`), and selection state tracking.


#### Custom Chart Implementations

### 1. Line Chart (\`lineChart.ts\`)

**API Surface:**

\n-- **Inputs:** \`waferData\` array, \`onPointSelected\` callback
\n-- **Returns:** Chart surface, WebAssembly context
\n-- **Callback:** \`onPointSelected(point: WaferDayData, index: number)\`

**Key Features:**

\n-- \`FastLineRenderableSeries\` with point markers for trend visualization.
\n-- Custom metadata interface \`IWaferPointMetadata\` extends point data with selection state.
\n-- \`DataPointSelectionPaletteProvider\` for visual selection feedback.
\n-- Custom tooltip and \`DataLabelProvider\` showing \`Input1\` values above points.


### 2. Column Chart (\`columnChart.ts\`)

**API Surface:**

\n-- **Inputs:** \`waferData\` batch array, \`onBatchSelected\` callback
\n-- **Returns:** Chart surface, \`updateData\` method, selection modifier
\n-- **Callback:** \`onBatchSelected(point: WaferLotData, isColumnChart: boolean)\`
\n-- **Update:** \`updateData(batchData, fireSelectionChanged)\`

**Key Features:**

\n-- \`StackedColumnRenderableSeries\` displaying three measures as stacked components.
\n-- \`XyNDataSeries\` with \`arrayCount: 3\` for multi-dimensional data.
\n-- Selection annotation via \`BoxAnnotation\`.
\n-- Dynamic column width calculation and coordinate mapping.


### 3. Pareto Chart (\`paretoChart.ts\`)

**API Surface:**

\n-- **Inputs:** \`waferData\` batch array, \`onBatchSelected\` callback
\n-- **Returns:** Chart surface, \`updateData\` method, selection modifier
\n-- **Callback:** \`onBatchSelected(point: WaferLotData, isColumnChart: boolean)\`
\n-- **Update:** \`updateData(waferData, fireSelectionChanged)\`

**Key Custom Component:**

* \`CumulativePercentageFilter\` extends \`XyFilterBase\` for real-time cumulative percentage calculations.
* Combines \`FastColumnRenderableSeries\` (primary) and \`FastLineRenderableSeries\` (cumulative).
* Dual Y-axis configuration with different scales.
* Automatic data sorting by quality in descending order.


### 4. Wafer Grid (\`waferGrid.ts\`)

**API Surface:**

\n-- **Input:** \`selectedPoint\` — single \`WaferLotData\` seed for wafer defect patterns.
\n-- **Returns:** Main chart surface, \`generateSubcharts\` method.
\n-- **Update:** \`generateSubcharts(selectedPoint)\` regenerates all 12 sub-charts.

**Advanced Features:**

\n-- \`SciChartSubSurface\` API for creating 12 independent sub-charts.
\n-- \`FastRectangleRenderableSeries\` for wafer die representation.
\n-- \`RectanglePaletteProvider\` implementing \`IFillPaletteProvider\` for defect-based coloring.
\n-- Seeded random generation in \`generateGridOfPoints\` for reproducible wafer patterns.


#### Cross-Chart Synchronization

**Communication Flow**

### 1. **Line Chart → Column/Pareto:**

\n-- \`handlePointSelected\` provides selected day data.
\n-- \`updateData()\` methods receive new batch arrays and manage state.

### 2. **Column/Pareto → Wafer Grid:**

\n--\`handleBatchSelected\` provides selected batch and chart type.
\n--\`generateSubcharts()\` regenerates all wafer sub-charts.

### 3. **Selection Management:**

\n--Column chart uses \`DataPointSelectionModifier\`.
\n--Pareto chart uses metadata-based selection.
\n--Manual synchronization ensures consistent state between both views.


#### Performance Optimizations

**Efficient Rendering**

\n-- \`freezeWhenOutOfView: true\` prevents unnecessary updates.
\n-- Chart toggling uses CSS display properties instead of unmounting.
\n-- Sub-chart regeneration only when required.

**Memory Management**

\n-- Automatic cleanup via SciChart disposal mechanisms.
\n-- Ref-based chart management prevents leaks.
\n-- Efficient data handling for large datasets.


#### Styling and Theming

Centralized theme system (\`appTheme\`) ensures consistent:

\n-- Color palettes for categories
\n-- Typography and spacing
\n-- Visual feedback for selections
\n-- Responsive layout behavior

The **Semiconductors Dashboard** showcases advanced SciChart.js capabilities — including multi-chart coordination, hierarchical data exploration, sub-chart architectures, and synchronized user interactions — making it ideal for industrial and scientific analytics.`,
            },
            angular: {
                subtitle:
                    "Creates an **Angular Semiconductors Dashboard** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
                title: "Angular Semiconductors Dashboard",
                pageTitle: "Angular Semiconductors Dashboard | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Angular **Semiconductors Dashboard** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
                markdownContent: null,
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the Semiconductors Dashboard documentation will help you to get started",
                linkTitle: "Semiconductors Dashboard Documentation",
            },
        ],
        path: "semiconductors-dashboard",
        metaKeywords: "semiconductor, wafer, yield, heatmap, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/ScientificCharts/Semiconductors",
        thumbnailImage: "semiconductors-dashboard.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

const SemiconductorsDashboard2ExampleInfo = createExampleInfo(metaData);
export default SemiconductorsDashboard2ExampleInfo;
