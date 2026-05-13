import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata = {
    reactComponent: "DynamicAnnotationLabels",
    id: "chart2D_createStockCharts_DynamicAnnotationLabels",
    imagePath: "javascript-user-annotated-stock-chart.jpg",
    description:
        "Dynamic multipoint annotation labels on a financial chart, including channel and Fibonacci retracement labels.",
    tips: [],
    frameworks: {
        javascript: {
            subtitle: "Dynamic label text and styling for multipoint trading annotations.",
            title: "JavaScript Dynamic Trading Annotation Labels",
            pageTitle: "JavaScript Dynamic Trading Annotation Labels",
            metaDescription:
                "Create dynamic labels for JavaScript trading annotations including channels and Fibonacci retracements.",
            markdownContent:
                "## Dynamic Trading Annotation Labels\n\nThis example focuses on `formatLabel` and `formatLabelStyle` for multipoint annotations. Labels calculate channel width, Fibonacci ranges and axis labels from the live annotation points, so moving the grips changes the displayed text and styling.",
        },
        react: {
            subtitle: "Dynamic label text and styling for React multipoint trading annotations.",
            title: "React Dynamic Trading Annotation Labels",
            pageTitle: "React Dynamic Trading Annotation Labels",
            metaDescription:
                "Create dynamic labels for React trading annotations including channels and Fibonacci retracements.",
            markdownContent:
                "## React Dynamic Trading Annotation Labels\n\nThis example shows hardcoded financial annotations with dynamic multipoint labels. `formatLabel` produces context-aware text and `formatLabelStyle` changes label color, size and weight based on channel width and Fibonacci impulse size.",
        },
    },
    documentationLinks: [
        {
            href: "https://www.scichart.com/documentation/js/v5/2d-charts/annotations-api/annotations-overview/",
            title: "SciChart.js annotation documentation",
            linkTitle: "Annotations API",
        },
    ],
    path: "dynamic-trading-annotation-labels",
    metaKeywords: "stock chart, multipoint annotation labels, dynamic labels, fibonacci, channel",
    onWebsite: true,
    filepath: "Charts2D/CreateStockCharts/DynamicAnnotationLabels",
    thumbnailImage: "javascript-user-annotated-stock-chart.jpg",
    sandboxConfig: {},
    markdownContent: null,
    pageLayout: "default",
    extraDependencies: {},
};

export default createExampleInfo(metaData);
