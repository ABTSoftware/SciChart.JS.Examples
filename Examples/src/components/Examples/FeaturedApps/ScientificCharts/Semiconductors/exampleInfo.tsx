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
                    '## Semiconductors Dashboard Example - React\n\n### Overview\n\nThe Semiconductors Dashboard demonstrates a sophisticated semiconductor manufacturing quality control interface that enables users to analyze wafer production data across multiple dimensions and hierarchical levels.\n\n#### Dashboard Layout\n\n**Main Components:**\n1. **Yield Trend Chart (Top Panel)**: Line chart showing quality trends over time with clickable data points\n2. **Batch Analysis (Bottom Left)**: Switchable view between Column Chart and Pareto Chart for batch-level analysis\n3. **Wafer Maps (Bottom Right)**: Grid of 12 sub-charts displaying detailed wafer defect maps\n\n#### User Interactions\n\n**Primary Workflow:**\n- Click any point on the yield trend line chart to drill down into batch data for that specific day\n- Toggle between "Column Chart" and "Pareto Chart" views using header buttons to analyze batch data differently\n- Select individual batches from either chart view to examine corresponding wafer defect patterns\n- All charts are synchronized - selections automatically propagate across all dashboard views\n\n**Interactive Features:**\n- **Point Selection**: Click data points to navigate through hierarchical data levels (Day → Batch → Wafer)\n- **Chart Switching**: Seamless toggle between analytical views without losing context\n- **Synchronized Navigation**: Selection state maintained across all chart components\n- **Responsive Tooltips**: Custom SVG tooltips showing detailed batch quality summaries\n- **Zoom and Pan**: Standard chart navigation controls where appropriate\n\n### Technical Implementation\n\n#### Architecture Overview\n\nThe dashboard is implemented as a React component ([`index.tsx`](index.tsx)) utilizing SciChart React for sophisticated multi-chart coordination:\n\n**SciChart React Integration:**\n- [`SciChartReact`](index.tsx:116) components manage chart instance creation and lifecycle automatically\n- Each chart exposes initialization functions that accept callback handlers for inter-chart communication\n- React refs maintain references to chart instances and their exposed APIs for programmatic control\n- Chart lifecycle is handled by SciChart React, ensuring proper cleanup and memory management\n\n#### Data Structure\n\nData is generated semi-randomly for demonstration purposes in [`waferData.ts`](waferData.ts:87-138) using a hierarchical structure:\n\n**WaferDayData Interface:**\n- Contains daily summary metrics (`Mean1`, `Mean2`)\n- Includes array of `WaferLotData` batches for that day\n\n**WaferLotData Interface:**  \n- Batch-level data with quality categorization ("Good", "Marginal", "Fail")\n- Process input variables (`Input1`, `Input2`)  \n- Output measurements (`Measure1`, `Measure2`, `Measure3`)\n- Selection state tracking\n\n#### Custom Chart Implementations\n\n##### 1. Line Chart ([`lineChart.ts`](lineChart.ts))\n\n**API Surface:**\n- **Input Parameters**: `waferData` array, `onPointSelected` callback function\n- **Return Value**: Chart surface and WebAssembly context for lifecycle management\n- **Callback Interface**: `onPointSelected(point: WaferDayData, index: number)` - triggered when user selects a data point\n\n**Key Features:**\n- [`FastLineRenderableSeries`](lineChart.ts:136) with point markers for trend visualization\n- Custom metadata interface [`IWaferPointMetadata`](lineChart.ts:28-32) extends point data with selection state\n- [`DataPointSelectionPaletteProvider`](lineChart.ts:147) for visual selection feedback\n- Custom tooltip template with responsive sizing based on viewport dimensions\n- [`DataLabelProvider`](lineChart.ts:164) showing Input1 values above data points\n\n##### 2. Column Chart ([`columnChart.ts`](columnChart.ts))\n\n**API Surface:**\n- **Input Parameters**: `waferData` batch array, `onBatchSelected` callback function\n- **Return Value**: Chart surface, `updateData` method, and selection modifier for external control\n- **Callback Interface**: `onBatchSelected(point: WaferLotData, isColumnChart: boolean)` - triggered when user selects a batch\n- **Update Method**: `updateData(batchData: WaferLotData[], fireSelectionChanged: boolean)` - programmatically update chart data and selection state\n\n**Key Features:**\n- [`StackedColumnRenderableSeries`](columnChart.ts:76) displaying three measures as stacked components\n- [`XyNDataSeries`](columnChart.ts:72) with `arrayCount: 3` for multi-dimensional data\n- Custom selection annotation ([`BoxAnnotation`](columnChart.ts:110)) that highlights selected columns\n- Dynamic column width calculation and coordinate mapping\n\n##### 3. Pareto Chart ([`paretoChart.ts`](paretoChart.ts))\n\n**API Surface:**\n- **Input Parameters**: `waferData` batch array, `onBatchSelected` callback function\n- **Return Value**: Chart surface, `updateData` method, and selection modifier for external control\n- **Callback Interface**: `onBatchSelected(point: WaferLotData, isColumnChart: boolean)` - triggered when user selects a batch\n- **Update Method**: `updateData(waferData: WaferLotData[], fireSelectionChanged: boolean)` - updates chart with sorted data and manages selection state\n\n**Key Custom Component:**\n- [`CumulativePercentageFilter`](paretoChart.ts:35-75) extends [`XyFilterBase`](paretoChart.ts:35) to create real-time cumulative percentage calculations\n- Combines [`FastColumnRenderableSeries`](paretoChart.ts:143) for primary data with [`FastLineRenderableSeries`](paretoChart.ts:161) for cumulative percentage\n- Dual Y-axis configuration with different scales and alignments\n- Automatic data sorting by quality values in descending order\n\n##### 4. Wafer Grid ([`waferGrid.ts`](waferGrid.ts))\n\n**API Surface:**\n- **Input Parameters**: `selectedPoint` - single WaferLotData used as seed for generating wafer defect patterns\n- **Return Value**: Main chart surface and `generateSubcharts` method for dynamic updates\n- **Update Method**: `generateSubcharts(selectedPoint: WaferLotData)` - regenerates all 12 sub-charts based on new selection\n\n**Advanced Features:**\n- [`SciChartSubSurface`](waferGrid.ts:234) API for creating 12 independent sub-charts within main surface\n- [`FastRectangleRenderableSeries`](waferGrid.ts:284) for wafer die representation\n- Custom [`RectanglePaletteProvider`](waferGrid.ts:79) implementing [`IFillPaletteProvider`](waferGrid.ts:79) for defect-type-based coloring\n- Seeded random number generation in [`generateGridOfPoints`](waferData.ts:162) for reproducible wafer patterns\n\n#### Cross-Chart Synchronization\n\nThe dashboard implements sophisticated selection synchronization between charts:\n\n**Chart Communication API:**\nEach chart exposes specific methods that enable seamless inter-chart coordination:\n\n1. **Line Chart → Column/Pareto Charts**:\n   - `handlePointSelected` callback provides selected day data\n   - Column and Pareto charts both expose `updateData()` methods to receive new batch arrays\n   - Selection state is automatically managed through the update process\n\n2. **Column/Pareto Charts → Wafer Grid**:\n   - `handleBatchSelected` callback provides selected batch with chart type identifier\n   - Wafer grid exposes `generateSubcharts()` method to regenerate all sub-charts\n   - Different selection mechanisms require manual synchronization between column and Pareto views\n\n3. **Cross-Chart Selection Management**:\n   - Column chart uses `DataPointSelectionModifier` for selection tracking\n   - Pareto chart uses metadata-based selection through shared data objects\n   - Manual synchronization ensures consistent selection state across both chart types when toggling views\n\n#### Performance Optimizations\n\n**Efficient Rendering:**\n- [`freezeWhenOutOfView: true`](columnChart.ts:36) prevents unnecessary updates when charts are not visible\n- Chart toggling uses CSS display properties rather than component unmounting\n- Sub-chart regeneration only occurs when necessary through the `generateSubcharts` method\n\n**Memory Management:**\n- Proper cleanup through SciChart\'s built-in disposal mechanisms\n- Ref-based chart management prevents memory leaks\n- Efficient data structures for large datasets\n\n#### Styling and Theming\n\nUses centralized theme system ([`appTheme`](columnChart.ts:21)) providing consistent:\n- Color palettes for different data categories\n- Typography and spacing standards  \n- Visual feedback for selections and interactions\n- Responsive design considerations\n\nThe dashboard showcases advanced SciChart.js capabilities including multi-chart coordination, custom data filters, sub-chart architectures, and sophisticated user interaction patterns suitable for industrial and scientific applications.',
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
