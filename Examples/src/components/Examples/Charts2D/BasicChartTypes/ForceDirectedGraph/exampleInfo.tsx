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
                markdownContent: null,
            },
            react: {
                subtitle:
                    "Creates a **React Force Directed Graph** using SciChart.js, visualizing US airport flight routes with a physics-based force simulation.",
                title: "React Force Directed Graph",
                pageTitle: "React Force Directed Graph",
                metaDescription:
                    "React Force Directed Graph demo by SciChart.js. Visualize network graphs with physics simulation, interactive node dragging, and hover tooltips.",
                markdownContent: null,
            },
            angular: {
                subtitle:
                    "Creates an **Angular Force Directed Graph** using SciChart.js, visualizing US airport flight routes with a physics-based force simulation.",
                title: "Angular Force Directed Graph",
                pageTitle: "Angular Force Directed Graph",
                metaDescription:
                    "Angular Force Directed Graph demo by SciChart.js. Visualize network graphs with physics simulation, interactive node dragging, and hover tooltips.",
                markdownContent: null,
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/",
                title: "SciChart.js Chart Types documentation",
                linkTitle: "SciChart.js Chart Types Documentation",
            },
        ],
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
