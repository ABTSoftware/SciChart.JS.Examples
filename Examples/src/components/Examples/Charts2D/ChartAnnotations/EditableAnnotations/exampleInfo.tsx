import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "editableannotations",
        imagePath: "./javascript-chart-editable-annotations.jpg",
        title: "editableAnnotations",
        description:
            "SciChart annotations are available for drag and drop, such as LineAnnotation, BoxAnnotation, TextAnnotation,\r\nHorizontalLineAnnotation, VerticalLineAnnotation, CustomAnnotation",
        path: "editableannotations",
        metaKeywords: "annotations, chart, api, javascript, webgl, canvas, drag and drop",
        onWebsite: true,
        filepath: "Charts2D/ChartAnnotations/EditableAnnotations",
        tips: ["Setting only one property isEditable give you access to change annotation"],
        thumbnailImage: "javascript-chart-editable-annotations.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React editableAnnotations** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React editableAnnotations",
                pageTitle: "React editableAnnotations | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React editableAnnotations with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular editableAnnotations** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular editableAnnotations",
                pageTitle: "Angular editableAnnotations | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular editableAnnotations with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript editableAnnotations** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript editableAnnotations",
                pageTitle: "JavaScript editableAnnotations | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript editableAnnotations with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "Annotations API Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const editableAnnotationsExampleInfo = createExampleInfo(metaData);
