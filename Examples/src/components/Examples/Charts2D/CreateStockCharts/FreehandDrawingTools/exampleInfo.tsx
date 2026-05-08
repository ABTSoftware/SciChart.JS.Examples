import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata = {
    reactComponent: "FreehandDrawingTools",
    id: "chart2D_createStockCharts_FreehandDrawingTools",
    imagePath: "javascript-freehand-drawing-tools.jpg",
    description:
        "A focused stock-chart example for FreehandDrawingModifier with selectable annotation variants and value-based sampling controls.",
    tips: [],
    frameworks: {
        javascript: {
            subtitle: "Freehand drawing variants for stock charts using SciChart.js.",
            title: "JavaScript Freehand Drawing Tools",
            pageTitle: "JavaScript Freehand Drawing Tools",
            metaDescription:
                "Create JavaScript stock chart freehand drawings with editable, locked, noneditable line and thick highlight variants.",
            markdownContent:
                "## Freehand Drawing Tools\n\nThis example demonstrates `FreehandDrawingModifier` and `FreehandDrawingAnnotation` variants. Select editable outline, noneditable line, thick highlight or locked resize behavior, then tune point spacing and simplification directly.",
        },
        react: {
            subtitle: "Freehand drawing variants for React stock charts using SciChart.js.",
            title: "React Freehand Drawing Tools",
            pageTitle: "React Freehand Drawing Tools",
            metaDescription:
                "Create React stock chart freehand drawings with editable, locked, noneditable line and thick highlight variants.",
            markdownContent:
                "## React Freehand Drawing Tools\n\nThis example keeps the UI small and focused on the drawing workflow. The selected variant is passed to `FreehandDrawingModifier.startDrawing`, while toolbar controls change repeated drawing and sampling/simplification behavior.",
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
    metaKeywords: "freehand drawing, stock chart, drawing modifier, annotations, react chart",
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
