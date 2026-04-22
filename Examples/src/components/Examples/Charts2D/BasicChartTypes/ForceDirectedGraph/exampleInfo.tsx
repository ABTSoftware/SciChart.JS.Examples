import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "ForceDirectedGraph",
        id: "chart2D_basicCharts_ForceDirectedGraph",
        imagePath: "javascript-force-directed-graph.jpg",
        description:
            "Creates a **JavaScript Force Directed Graph** using SciChart.js, visualizing US airport flight routes with a physics-based force simulation.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Force Directed Graph** using SciChart.js, visualizing US airport flight routes with a physics-based force simulation.",
                title: "JavaScript Force Directed Graph",
                pageTitle: "JavaScript Force Directed Graph",
                metaDescription:
                    "JavaScript Force Directed Graph demo by SciChart.js. Visualize network graphs with physics simulation, interactive node dragging, and hover tooltips.",
                markdownContent:
                    "## Force Directed Graph (JavaScript)\n\n### Overview\nThis example demonstrates a **Force Directed Graph** built with SciChart.js, visualizing ~60 US airports connected by ~2300 flight routes. The graph uses a custom physics simulation to position nodes, with geographic anchoring that keeps airports near their real-world lat/lon positions.\n\n### Technical Implementation\nThe chart is initialized using `SciChartSurface.create()`. Edges are rendered using `FastLineSegmentRenderableSeries` with an `XyxyDataSeries` (two endpoints per segment). Airport nodes are rendered as `XyScatterRenderableSeries` with `EllipsePointMarker`. The physics loop uses `requestAnimationFrame` and applies repulsion, spring, and geographic anchor forces each tick.\n\n### Interactivity\nTwo custom `ChartModifierBase2D` subclasses provide interactivity: `NodeTooltipModifier` highlights connected routes and labels neighbours on hover, and `NodeDragModifier` allows dragging nodes to explore the graph structure. Standard `ZoomPanModifier` and `MouseWheelZoomModifier` are also included.",
            },
            react: {
                subtitle:
                    "Creates a **React Force Directed Graph** using SciChart.js, visualizing US airport flight routes with a physics-based force simulation.",
                title: "React Force Directed Graph",
                pageTitle: "React Force Directed Graph",
                metaDescription:
                    "React Force Directed Graph demo by SciChart.js. Visualize network graphs with physics simulation, interactive node dragging, and hover tooltips.",
                markdownContent:
                    "## Force Directed Graph (React)\n\n### Overview\nThis example demonstrates a **Force Directed Graph** built with SciChart.js in React, visualizing ~60 US airports connected by ~2300 flight routes. The graph uses a custom physics simulation to position nodes, with geographic anchoring that keeps airports near their real-world lat/lon positions.\n\n### Technical Implementation\nThe chart is initialized through the `<SciChartReact/>` component using an `initChart` prop pointing to the `drawExample` function. Edges are rendered using `FastLineSegmentRenderableSeries` with an `XyxyDataSeries`. Airport nodes are rendered as `XyScatterRenderableSeries` with `EllipsePointMarker`. The physics loop uses `requestAnimationFrame` and applies repulsion, spring, and geographic anchor forces each tick.\n\n### Interactivity\nTwo custom `ChartModifierBase2D` subclasses provide interactivity: `NodeTooltipModifier` highlights connected routes and labels neighbours on hover, and `NodeDragModifier` allows dragging nodes to explore the graph structure. Standard `ZoomPanModifier` and `MouseWheelZoomModifier` are also included.",
            },
            angular: {
                subtitle:
                    "Creates an **Angular Force Directed Graph** using SciChart.js, visualizing US airport flight routes with a physics-based force simulation.",
                title: "Angular Force Directed Graph",
                pageTitle: "Angular Force Directed Graph",
                metaDescription:
                    "Angular Force Directed Graph demo by SciChart.js. Visualize network graphs with physics simulation, interactive node dragging, and hover tooltips.",
                markdownContent:
                    "## Force Directed Graph (Angular)\n\n### Overview\nThis example demonstrates a **Force Directed Graph** built with SciChart.js in Angular, visualizing ~60 US airports connected by ~2300 flight routes. The graph uses a custom physics simulation to position nodes, with geographic anchoring that keeps airports near their real-world lat/lon positions.\n\n### Technical Implementation\nThe chart is initialized using the `[initChart]` property binding with the `drawExample` function. Edges are rendered using `FastLineSegmentRenderableSeries` with an `XyxyDataSeries`. Airport nodes are rendered as `XyScatterRenderableSeries` with `EllipsePointMarker`. The physics loop uses `requestAnimationFrame` and applies repulsion, spring, and geographic anchor forces each tick.\n\n### Interactivity\nTwo custom `ChartModifierBase2D` subclasses provide interactivity: `NodeTooltipModifier` highlights connected routes and labels neighbours on hover, and `NodeDragModifier` allows dragging nodes to explore the graph structure. Standard `ZoomPanModifier` and `MouseWheelZoomModifier` are also included.",
            },
        },
        documentationLinks: [],
        path: "force-directed-graph",
        metaKeywords: "force directed, graph, network, simulation, airports, routes, physics, javascript, webgl",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/ForceDirectedGraph",
        thumbnailImage: "javascript-force-directed-graph.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

const forceDirectedGraphExampleInfo = createExampleInfo(metaData);
export default forceDirectedGraphExampleInfo;
