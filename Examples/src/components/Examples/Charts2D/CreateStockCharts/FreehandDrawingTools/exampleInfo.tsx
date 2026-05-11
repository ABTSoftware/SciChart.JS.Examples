import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata = {
    reactComponent: "FreehandDrawingTools",
    id: "chart2D_createStockCharts_FreehandDrawingTools",
    imagePath: "javascript-freehand-drawing-tools.jpg",
    description:
        "An example of using FreehandDrawingModifier for arbitrary drawing on trading and financial charts. Can be used for drawing trends, arrow, markers, text, etc.",
    tips: [],
    frameworks: {
        javascript: {
            subtitle: "JavaScript Freehand Drawing Demo for trading and financial charts using SciChart.js.",
            title: "JavaScript Freehand Drawing Tools",
            pageTitle: "JavaScript Freehand Drawing Tools",
            metaDescription:
                "An example of using JavaScript FreehandDrawingModifier for arbitrary drawing on trading and financial charts. Can be used for drawing trends, arrow, markers, text, etc.",
            markdownContent:
                "## JavaScript Freehand Drawing Tools\n\nThis example demonstrates `FreehandDrawingModifier` and `FreehandDrawingAnnotation`. Select color, switch between drawing and edit modes, delete annotations using backspace button and delete icon. This tool can be used for drawing trend lines, event markers, text or any arbitrary drawing for financial and trading charts.",
        },
        react: {
            subtitle: "React Freehand Drawing Demo for trading and financial charts using SciChart.js.",
            title: "React Freehand Drawing Tools",
            pageTitle: "React Freehand Drawing Tools",
            metaDescription:
                "An example of using React FreehandDrawingModifier for arbitrary drawing on trading and financial charts. Can be used for drawing trends, arrow, markers, text, etc.",
            markdownContent:
                "## React Freehand Drawing Tools\n\nThis example demonstrates `FreehandDrawingModifier` and `FreehandDrawingAnnotation`. Select color, switch between drawing and edit modes, delete annotations using backspace button and delete icon. This tool can be used for drawing trend lines, event markers, text or any arbitrary drawing for financial and trading charts.",
        },
    },
    documentationLinks: [
        {
            href: "https://www.scichart.com/documentation/js/v5/2d-charts/annotations-api/annotations-overview/",
            title: "SciChart.js annotation documentation",
            linkTitle: "Annotations API",
        },
    ],
    path: "freehand-drawing-tools",
    metaKeywords: "arbitrary drawing, freehand drawing, stock chart, drawing modifier, annotations, react chart",
    onWebsite: true,
    filepath: "Charts2D/CreateStockCharts/FreehandDrawingTools",
    thumbnailImage: "javascript-freehand-drawing-tools.jpg",
    sandboxConfig: {},
    markdownContent: null,
    pageLayout: "default",
    extraDependencies: {},
    isNew: true,
};

export default createExampleInfo(metaData);
