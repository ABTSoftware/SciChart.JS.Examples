import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "WaferAnalysis",
        id: "featuredApps_scientificCharts_WaferAnalysis",
        imagePath: "wafer-analysis.jpg",
        description:
            "Creates a **Wafer Analysis Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and crossfilter to enable live filtering.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **Wafer Analysis Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and crossfilter to enable live filtering.",
                title: "Wafer Analysis Chart",
                pageTitle: "Wafer Analysis Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "JavaScript **Wafer Analysis Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and crossfilter to enable live filtering.",
                markdownContent: null,
            },
            react: {
                subtitle:
                    "Creates a **React Wafer Analysis Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and crossfilter to enable live filtering.",
                title: "Wafer Analysis Chart",
                pageTitle: "React Wafer Analysis Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "React **Wafer Analysis Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and crossfilter to enable live filtering.",
                markdownContent: `## Wafer Analysis Dashboard - React\n\n### Overview\n\n#### Dashboard/Interface Layout\n\nThe Wafer Analysis dashboard presents a comprehensive semiconductor wafer testing interface organized in a two-panel layout:\n\n**Left Panel:**\n
- Main wafer visualization chart displaying the circular wafer map with individual dies\n
- Variable selection dropdown for switching between different measurement variables (DEFECT, MR, HR, MR2, HDI)\n
- Legend area showing defect type classifications\n\n**Right Panel:**\n
- Top section: Dual-variable scatter plot comparing MR vs MR2 and HR vs HDI relationships\n
- Bottom section: 2x2 grid of histogram charts with nested overview controls for each measurement variable (MR, HR, MR2, HDI)\n\n#### User Interactions\n\n**Wafer Chart Interactions:**\n
- **Drag Selection**: Users can drag to select rectangular regions on the wafer, which filters data by row/column position\n
- **Single Click**: Clears any active selection filters\n
- **Right-Click Zoom/Pan**: Navigate around the wafer visualization\n
- **Mouse Wheel**: Zoom in/out on the wafer\n
- **Variable Selection**: Dropdown allows switching color visualization between defect types and numeric variables\n\n**Measure Chart Interactions:**\n
- **Zoom/Pan Operations**: Each histogram chart supports independent zooming and panning\n
- **Range Selection**: Zooming on any histogram automatically applies range filters to that measurement variable\n
- **Overview Charts**: Miniature overview charts beneath each histogram show the full data range and current zoom level\n\n**Scatter Plot Interactions:**\n
- **Standard Navigation**: Zoom, pan, and mouse wheel operations\n
- **Legend**: Toggle visibility of MR vs MR2 and HR vs HDI data series\n\n#### Interactive Features\n\nThe dashboard implements a sophisticated cross-filtering workflow where interactions in any chart component immediately update all other visualizations:\n\n- **Wafer Selection → Measurement Filtering**: Selecting regions on the wafer filters all histogram and scatter plot data\n- **Histogram Zooming → Cross-Filter Updates**: Zooming on any measurement histogram applies range filters that update the wafer visualization and scatter plot\n- **Variable Switching → Dynamic Recoloring**: Changing the color variable dynamically updates the wafer chart's palette provider for real-time visualization changes\n- **Bidirectional Filtering**: All filters work in combination, allowing users to drill down through multiple dimensions simultaneously\n\n#### Primary Use Cases\n\nThis example demonstrates:\n
- **Semiconductor Manufacturing Analysis**: Visualizing die-level measurements across a wafer surface\n
- **Multi-Dimensional Data Exploration**: Cross-filtering capabilities for analyzing relationships between different measurement variables\n
- **Defect Pattern Recognition**: Color-coded visualization of defect types and measurement ranges\n
- **Real-time Data Analytics**: Live filtering and updating of large datasets using crossfilter technology\n\n### Technical Implementation\n\n#### Architecture Overview\n\nThe application leverages **SciChart React** integration through the [\`SciChartReact\`](index.tsx:265) component pattern, where each chart is initialized via factory functions and managed through React refs. The architecture separates concerns between:\n\n
- **Data Management**: [\`useDataStore\`](store.ts:37) Zustand store with crossfilter dimensions\n
- **Chart Factories**: Individual [\`createInit*\`](waferChart.ts:158) functions for each chart type\n
- **Communication Layer**: React callback patterns and ref-based method invocation\n\n#### Individual Chart/Component Analysis\n\n##### Wafer Chart Component\n\n**API Surface:**\n
- **Input Parameters**: [\`setRowFilter\`](waferChart.ts:160), [\`setColFilter\`](waferChart.ts:161), [\`selectedVariable\`](waferChart.ts:162), [\`variableRange\`](waferChart.ts:163)\n
- **Return Values**: [\`updateWaferData()\`](waferChart.ts:236), [\`updatePaletteProvider()\`](waferChart.ts:255) methods\n
- **Update Methods**: [\`updateWaferData(dataJSON: WaferData[])\`](waferChart.ts:236) for data refresh, [\`updatePaletteProvider(newVariable: string, newRange?: [number, number])\`](waferChart.ts:255) for color scheme updates\n\n**Key Technical Features:**\n
- **Custom Palette Provider**: [\`RectanglePaletteProvider\`](waferChart.ts:47) implements [\`IFillPaletteProvider\`](waferChart.ts:47) for dynamic coloring based on defect types or measurement ranges\n
- **Custom Selection Modifier**: [\`WaferRangeSelectionModifier\`](waferChart.ts:110) extends [\`DataPointSelectionModifier\`](waferChart.ts:110) to translate rectangle selections into row/column filter ranges\n
- **FastRectangleRenderableSeries**: Uses [\`FastRectangleRenderableSeries\`](waferChart.ts:189) with [\`XyzDataSeries\`](waferChart.ts:186) for efficient wafer die rendering\n
- **Color Interpolation**: Implements [\`uintArgbColorLerp()\`](waferChart.ts:103) for smooth color transitions between measurement value ranges\n\n##### Measure Chart Components\n\n**API Surface:**\n
- **Input Parameters**: [\`xValues: number[]\`](measureCharts.ts:51), [\`yValues: number[]\`](measureCharts.ts:51), [\`setFilter: Dispatch<[number, number]>\`](measureCharts.ts:51), [\`fill: string\`](measureCharts.ts:51)\n
- **Return Values**: [\`updateMeasureChartData(xValues: number[], yValues: number[])\`](measureCharts.ts:121) method\n
- **Callback Interfaces**: [\`setFilter\`](measureCharts.ts:51) callback triggered on [\`visibleRangeChanged\`](measureCharts.ts:112) events\n\n**Key Technical Features:**\n
- **Custom Delta Calculator**: [\`IntegerDeltaCalculator\`](measureCharts.ts:23) extends [\`NumericDeltaCalculator\`](measureCharts.ts:23) to ensure integer-only axis tick marks\n
- **Nested Overview Integration**: [\`overviewOptions\`](measureCharts.ts:31) configuration with [\`transformRenderableSeries\`](measureCharts.ts:35) for series cloning\n
- **Auto-Range Animation**: [\`autoRangeAnimation\`](measureCharts.ts:74) with [\`easing.outExpo\`](measureCharts.ts:78) for smooth transitions\n
- **Range-Based Filtering**: [\`visibleRangeChanged.subscribe()\`](measureCharts.ts:112) automatically updates filter state\n\n##### Scatter Plot Component\n\n**API Surface:**\n
- **Input Parameters**: No external parameters required\n
- **Return Values**: [\`updateScatterPlotData(values: readonly WaferData[])\`](scatterPlot.ts:101) method\n
- **Update Methods**: [\`updateScatterPlotData()\`](scatterPlot.ts:101) handles dual data series updates\n\n**Key Technical Features:**\n
- **Dual Data Series**: Manages two [\`XyDataSeries\`](scatterPlot.ts:54) for MR vs MR2 and HR vs HDI correlations\n
- **Custom Point Markers**: [\`EllipsePointMarker\`](scatterPlot.ts:64) with opacity settings for data density visualization\n
- **Legend Integration**: [\`LegendModifier\`](scatterPlot.ts:97) with [\`ELegendPlacement.TopRight\`](scatterPlot.ts:97)\n\n#### Component Communication\n\n**Cross-Filter Architecture:**\nThe communication system centers on crossfilter dimensions and groups managed by [\`useDataStore\`](store.ts:37):\n\n
- **Dimension Creation**: [\`dies.dimension()\`](store.ts:54) creates filterable dimensions for each measurement variable\n
- **Group Aggregation**: [\`dimension.group(Math.floor)\`](store.ts:66) creates histogram bins for each measurement\n
- **Filter Application**: Dimensions support [\`filter(range)\`](index.tsx:34) and [\`filterAll()\`](index.tsx:52) operations\n\n**Update Propagation:**\n
- **Filter State Changes**: React [\`useState\`](index.tsx:14) hooks trigger [\`useEffect\`](index.tsx:207) reactions\n
- **Data Flow**: [\`dies.allFiltered()\`](index.tsx:192) provides filtered data to all chart components\n
- **Method Invocation**: Chart refs expose [\`updateWaferData()\`](index.tsx:213), [\`updateScatterPlotData()\`](index.tsx:209), and [\`updateMeasureChartData()\`](index.tsx:244) methods\n\n**Callback Patterns:**\n
- **Range Filters**: Measure charts invoke [\`setFilter([min, max])\`](measureCharts.ts:114) on zoom operations\n
- **Spatial Filters**: Wafer selection calls [\`setRowFilter()\`](waferChart.ts:139) and [\`setColFilter()\`](waferChart.ts:140)\n
- **Variable Selection**: Dropdown changes trigger [\`updatePaletteProvider()\`](index.tsx:221) calls\n\n#### Performance Optimizations & Advanced Features\n\n**Memory Management:**\n
- **Memoized Calculations**: [\`useMemo()\`](index.tsx:73) for data transformations and factory function creation\n
- **Callback Stabilization**: [\`useCallback()\`](index.tsx:147) for chart initialization handlers\n
- **Efficient Updates**: [\`dataSeries.clear()\`](measureCharts.ts:122) and [\`appendRange()\`](measureCharts.ts:123) for minimal memory allocation\n\n**Data Processing Optimizations:**\n
- **Crossfilter Integration**: Leverages crossfilter's optimized filtering and grouping algorithms\n
- **Selective Filtering**: [\`dies.allFiltered([Row, Col])\`](index.tsx:201) excludes specific dimensions from wafer data filtering\n
- **Integer Grouping**: [\`Math.floor\`](store.ts:66) grouping functions for histogram binning\n\n**Rendering Performance:**\n
- **Fast Series Types**: [\`FastRectangleRenderableSeries\`](waferChart.ts:189), [\`FastColumnRenderableSeries\`](measureCharts.ts:95) for high-performance rendering\n
- **Efficient Data Series**: [\`dataIsSortedInX: true\`](measureCharts.ts:91) optimization hints\n
- **Palette Provider Caching**: [\`RectanglePaletteProvider\`](waferChart.ts:47) with cached color calculations\n\n**Advanced Features:**\n
- **Dynamic Theming**: Integration with [\`appTheme\`](waferChart.ts:28) for consistent color schemes\n
- **Seeded Data Generation**: [\`generateWaferDataByValues()\`](waferData.ts) from URL parameters for reproducible examples\n
- **Manual Legend**: [\`ManualLegend\`](waferChart.ts:223) with [\`placementDivId\`](waferChart.ts:229) for external legend positioning\n
- **Overview Charts**: [\`SciChartNestedOverview\`](index.tsx:304) components with automatic series transformation\n\nThe implementation demonstrates advanced SciChart.js capabilities including custom modifiers, palette providers, and sophisticated data binding patterns optimized for real-time multi-dimensional data analysis.`,
            },
            angular: {
                subtitle:
                    "Creates an **Angular Wafer Analysis Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and crossfilter to enable live filtering.",
                title: "Angular Wafer Analysis Chart",
                pageTitle: "Angular Wafer Analysis Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Angular **Wafer Analysis Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and crossfilter to enable live filtering.",
                markdownContent: null,
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the Wafer Analysis Chart documentation will help you to get started",
                linkTitle: "Wafer Analysis Chart Documentation",
            },
        ],
        path: "wafer-analysis",
        metaKeywords: "heatmap, wafer, crossfilter, semiconductors, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/ScientificCharts/WaferAnalysis",
        thumbnailImage: "wafer-analysis.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

const WaferAnalysisExampleInfo = createExampleInfo(metaData);
export default WaferAnalysisExampleInfo;
