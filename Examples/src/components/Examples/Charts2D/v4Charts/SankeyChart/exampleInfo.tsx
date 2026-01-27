import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "SankeyChart",
        id: "chart2D_v4Charts_SankeyChart",
        imagePath: "javascript-sankey-chart.jpg",
        description:
            "Creates a **JavaScript Sankey Chart** using SciChart.js, combining FastBandRenderableSeries for flow links and FastRectangleRenderableSeries for nodes, with d3-sankey for layout calculations",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Sankey Chart** using SciChart.js with d3-sankey layout engine for high-performance flow visualization",
                title: "JavaScript Sankey Chart Example",
                pageTitle: "JavaScript Sankey Chart",
                metaDescription:
                    "Build a JavaScript Sankey Chart with SciChart.js and d3-sankey. View the demo for energy flow visualization with smooth bezier curves and interactive nodes.",
                markdownContent:
                    "## JavaScript Sankey Chart Example\n\n### Overview\nThis example demonstrates how to create a **Sankey Diagram** using SciChart.js in vanilla JavaScript. The implementation combines [FastBandRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastbandrenderableseries.html) for smooth flow links and [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastrectanglerenderableseries.html) for nodes, with d3-sankey handling the layout calculations.\n\n### Technical Implementation\nThe chart uses d3-sankey to compute node positions and link paths, then renders them using SciChart's WebGL-accelerated series. Links are drawn as band series with bezier-interpolated curves, while nodes are rendered as rectangles with category-based coloring through a custom [PaletteProvider](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipaletteprovider.html).\n\n### Features and Capabilities\nInteractive features include zoom/pan via [ZoomPanModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/zoompanmodifier.html) and data labels showing node names. The implementation supports custom node alignment by category and smooth flow visualization with configurable colors.\n\n### Integration and Best Practices\nThe example demonstrates how to integrate third-party layout libraries (d3-sankey) with SciChart's high-performance rendering. This hybrid approach leverages the best of both worlds: proven layout algorithms and WebGL-accelerated visualization.",
            },
            react: {
                subtitle:
                    "Creates a **React Sankey Chart** using SciChart.js with d3-sankey layout engine for high-performance flow visualization",
                title: "React Sankey Chart Example",
                pageTitle: "React Sankey Chart",
                metaDescription:
                    "Build a React Sankey Chart with SciChart.js and d3-sankey. View the demo for energy flow visualization with smooth bezier curves and interactive nodes.",
                markdownContent:
                    "## React Sankey Chart Example\n\n### Overview\nThis React implementation showcases a **Sankey Diagram** using SciChart.js through the [SciChartReact](https://www.scichart.com/documentation/js/v4/typedoc/globals.html) component. It visualizes energy flow with smooth bezier curves in a performant WebGL-rendered chart.\n\n### Technical Implementation\nThe chart is initialized via the `initChart` prop which creates a [SciChartSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) with configured axes and series. The d3-sankey library computes the layout, while SciChart renders the visualization using [FastBandRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastbandrenderableseries.html) for links and [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastrectanglerenderableseries.html) for nodes.\n\n### Features and Capabilities\nThe component features interactive zooming, node labels via custom [RectangleSeriesDataLabelProvider](https://www.scichart.com/documentation/js/v4/typedoc/classes/rectangleseriesdatalabelprovider.html), and category-based coloring through a [PaletteProvider](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipaletteprovider.html).\n\n### Integration and Best Practices\nThe example demonstrates proper React integration by encapsulating chart logic in a separate module. Developers can easily extend this by adding tooltips, selection, or connecting to real-time data sources.",
            },
            angular: {
                subtitle:
                    "Creates an **Angular Sankey Chart** using SciChart.js with d3-sankey layout engine for high-performance flow visualization",
                title: "Angular Sankey Chart Example",
                pageTitle: "Angular Sankey Chart",
                metaDescription:
                    "Build an Angular Sankey Chart with SciChart.js and d3-sankey. View the demo for energy flow visualization with smooth bezier curves and interactive nodes.",
                markdownContent:
                    "## Angular Sankey Chart Example\n\n### Overview\nThis Angular example creates a **Sankey Diagram** using the [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular) to visualize energy flow. The standalone component approach demonstrates clean integration with Angular's architecture.\n\n### Technical Implementation\nThe chart configuration is delegated to the `drawExample` function which sets up the [SciChartSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsurface.html) with hidden axes and multiple series. The d3-sankey library handles layout calculations while SciChart provides WebGL-accelerated rendering.\n\n### Features and Capabilities\nThe implementation includes smooth bezier curves for flow links, category-based node coloring, and interactive zoom/pan. The use of [FastBandRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastbandrenderableseries.html) ensures smooth flow visualization.\n\n### Integration and Best Practices\nThe example follows Angular best practices by using standalone components and property binding. Developers can extend this by adding @Input properties for dynamic data or implementing Angular services for data management.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/fast-band-renderable-series/",
                title: "The Band Series documentation will help you understand how flow links are rendered",
                linkTitle: "JavaScript Band Series Documentation",
            },
            {
                href: "https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/fast-rectangle-renderable-series/",
                title: "The Rectangle Series documentation will help you understand how nodes are rendered",
                linkTitle: "JavaScript Rectangle Series Documentation",
            },
        ],
        path: "sankey-chart",
        metaKeywords: "sankey, chart, javascript, webgl, canvas, flow, diagram, d3-sankey",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/SankeyChart",
        thumbnailImage: "javascript-sankey-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {
            "d3-sankey": "^0.12.3",
            "@types/d3-sankey": "^0.12.4",
        },
        isNew: true,
    };
//// End of computer generated metadata

const SankeyChartExampleInfo = createExampleInfo(metaData);
export default SankeyChartExampleInfo;
