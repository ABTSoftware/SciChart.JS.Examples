import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata = {
    reactComponent: "TradingDrawingTools",
    id: "chart2D_createStockCharts_TradingDrawingTools",
    imagePath: "javascript-trading-drawing-tools.jpg",
    description:
        "Trading drawing tools is a scichart-financial-tools npm package, which shows how to use Polylines, Extended Lines, Rays, Channels, Pitchforks, Pitchfans, Fibonnaci Retracements, Measure, Stop Loss and Take Profit chart drawing tools for Technical Analysis",
    tips: [],
    frameworks: {
        javascript: {
            subtitle:
                "Trading Drawing Tools Demo, which shows how to use Polylines, Extended Lines, Rays, Channels, Pitchforks, Pitchfans, Fibonnaci Retracements, Measure, Stop Loss and Take Profit chart drawing tools for Technical Analysis.",
            title: "JavaScript Trading Drawing Tools",
            pageTitle: "JavaScript Trading Drawing Tools",
            metaDescription:
                "Create an interactive JavaScript trading charts for technical analysis. Trading Drawing Tools Demo, which shows how to use Polylines, Extended Lines, Rays, Channels, Pitchforks, Pitchfans, Fibonnaci Retracements, Measure, Stop Loss and Take Profit chart drawing tools for Technical Analysis.",
            markdownContent:
                "## JavaScript Trading Drawing Tools\n\nThis example demonstrates a full drawing toolbar for financial and trading charts. It uses `scichart-financial-tools` for Polylines, Extended Lines, Channels, Rays, Pitchforks, Pitchfans, Fibonacci Retracements, Measure Tools and Stop-loss/Take-profit regions, with `MultiPointAnnotationPlacementModifier` for click-to-place workflows.",
        },
        react: {
            subtitle:
                "SciChart’s React Trading Drawing Tools demo shows how to use polylines, extended lines, rays, channels, pitchforks, pitchfans, Fibonacci retracements, stop loss, and Take Profit chart drawing tools for technical analysis.",
            title: "React Trading Drawing Tools Demo",
            pageTitle: "React Trading Drawing Tools for Devs | Try SciChart Demo",
            metaDescription:
                "Build high-performance financial apps with React trading drawing tools. Try SciChart’s demo to see the advanced drawing tools for trading apps in action.",
            markdownContent:
                "## React Trading Drawing Tools\n\nThis example demonstrates a full drawing toolbar for financial and trading charts. It uses `scichart-financial-tools` for Polylines, Extended Lines, Channels, Rays, Pitchforks, Pitchfans, Fibonacci Retracements, Measure Tools and Stop-loss/Take-profit regions, with `MultiPointAnnotationPlacementModifier` for click-to-place workflows.",
        },
    },
    documentationLinks: [
        {
            href: "https://www.scichart.com/documentation/js/v5/2d-charts/annotations-api/annotations-overview/",
            title: "SciChart.js annotation documentation",
            linkTitle: "Annotations API",
        },
    ],
    path: "trading-drawing-tools",
    metaKeywords: "React trading drawing tools, drawing tools for trading",
    onWebsite: true,
    filepath: "Charts2D/CreateStockCharts/TradingDrawingTools",
    thumbnailImage: "javascript-trading-drawing-tools.jpg",
    sandboxConfig: {},
    markdownContent: null,
    pageLayout: "max-width",
    extraDependencies: {},
    isNew: true,
};

export default createExampleInfo(metaData);
