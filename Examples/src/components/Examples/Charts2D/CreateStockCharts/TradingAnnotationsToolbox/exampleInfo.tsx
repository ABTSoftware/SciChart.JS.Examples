import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata = {
    reactComponent: "TradingAnnotationsToolbox",
    id: "chart2D_createStockCharts_TradingAnnotationsToolbox",
    imagePath: "javascript-trading-annotations-toolbox.jpg",
    description:
        "A polished stock-chart drawing toolbox using scichart-financial-tools, MultiPointAnnotationPlacementModifier, dynamic labels, snapping and freehand drawing.",
    tips: [],
    frameworks: {
        javascript: {
            subtitle: "Interactive financial drawing tools for stock charts using SciChart.js.",
            title: "JavaScript Trading Annotations Toolbox",
            pageTitle: "JavaScript Trading Annotations Toolbox",
            metaDescription:
                "Create an interactive JavaScript stock chart with financial drawing tools, annotation placement, labels, snapping and freehand drawing.",
            markdownContent:
                "## Trading Annotations Toolbox\n\nThis example demonstrates a full drawing toolbar for financial charts. It uses `scichart-financial-tools` for channels, rays, pitchforks, Fibonacci retracements, measure tools and stop-loss/take-profit regions, with `MultiPointAnnotationPlacementModifier` for click-to-place workflows and SciChart.js freehand drawing for sketch annotations.",
        },
        react: {
            subtitle: "Interactive financial drawing tools for React stock charts using SciChart.js.",
            title: "React Trading Annotations Toolbox",
            pageTitle: "React Trading Annotations Toolbox",
            metaDescription:
                "Create an interactive React stock chart with financial drawing tools, annotation placement, labels, snapping and freehand drawing.",
            markdownContent:
                "## React Trading Annotations Toolbox\n\nThis example wires a React toolbar to `MultiPointAnnotationPlacementModifier` and `FreehandDrawingModifier`. The annotation type is selected from a compact dropdown with SVG icons, while drawing, repeated placement, duplication, deletion and reset remain explicit toolbar actions.",
        },
    },
    documentationLinks: [
        {
            href: "https://www.scichart.com/documentation/js/v5/2d-charts/annotations-api/annotations-overview/",
            title: "SciChart.js annotation documentation",
            linkTitle: "Annotations API",
        },
    ],
    path: "trading-annotations-toolbox",
    metaKeywords: "stock chart, trading annotations, financial drawing tools, fibonacci, pitchfork, channel",
    onWebsite: true,
    filepath: "Charts2D/CreateStockCharts/TradingAnnotationsToolbox",
    thumbnailImage: "javascript-trading-annotations-toolbox.jpg",
    sandboxConfig: {},
    markdownContent: null,
    pageLayout: "default",
    extraDependencies: {},
    isNew: true,
};

export default createExampleInfo(metaData);
