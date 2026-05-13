import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata = {
    reactComponent: "PairedDashedPolylineAnnotation",
    id: "chart2D_createStockCharts_PairedDashedPolylineAnnotation",
    imagePath: "javascript-user-annotated-stock-chart.jpg",
    description:
        "A custom financial annotation extending PolyLineAnnotation with dashed peak connectors and a single point-1-to-last-point connector.",
    tips: [],
    frameworks: {
        javascript: {
            subtitle: "Extend PolyLineAnnotation with custom paired dash-line rendering.",
            title: "JavaScript Custom Paired Dashed Polyline Annotation",
            pageTitle: "JavaScript Custom Paired Dashed Polyline Annotation",
            metaDescription:
                "Create a custom JavaScript stock chart annotation by extending SciChart.js PolyLineAnnotation with paired dashed connectors.",
            markdownContent:
                "## Custom Paired Dashed Polyline Annotation\n\nThis example defines a `PairedDashedPolylineAnnotation` class that extends `PolyLineAnnotation`. It keeps native multipoint editing and placement behavior, then adds dashed connector lines between peak points such as point 2 to 4 and point 4 to 6, plus one point-1-to-last-point connector.",
        },
        react: {
            subtitle: "Extend PolyLineAnnotation with custom paired dash-line rendering in React.",
            title: "React Custom Paired Dashed Polyline Annotation",
            pageTitle: "React Custom Paired Dashed Polyline Annotation",
            metaDescription:
                "Create a custom React stock chart annotation by extending SciChart.js PolyLineAnnotation with paired dashed connectors.",
            markdownContent:
                "## React Custom Paired Dashed Polyline Annotation\n\nThis example registers a custom annotation type and uses `MultiPointAnnotationPlacementModifier` to place it interactively. The custom class inherits from `PolyLineAnnotation` and draws additional dashed peak connectors during `drawWithContext`, with center labels attached to the custom connector segments.",
        },
    },
    documentationLinks: [
        {
            href: "https://www.scichart.com/documentation/js/v5/2d-charts/annotations-api/custom-annotations/custom-annotations-overview/",
            title: "SciChart.js custom annotation documentation",
            linkTitle: "Custom Annotations",
        },
    ],
    path: "paired-dashed-polyline-annotation",
    metaKeywords: "custom annotation, polyline annotation, stock chart, trading annotation, dashed line",
    onWebsite: true,
    filepath: "Charts2D/CreateStockCharts/PairedDashedPolylineAnnotation",
    thumbnailImage: "javascript-user-annotated-stock-chart.jpg",
    sandboxConfig: {},
    markdownContent: null,
    pageLayout: "default",
    extraDependencies: {},
    isNew: true,
};

export default createExampleInfo(metaData);
