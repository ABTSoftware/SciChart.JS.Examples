import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\chartannotations\\annotationlayers",
        imagePath: "./javascript-chart-annotation-layers.jpg",
        description: "",
        path: "annotation-layers",
        metaKeywords: "annotations, chart, api, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ChartAnnotations/AnnotationLayers",
        tips: ['""'],
        thumbnailImage: "javascript-chart-annotation-layers.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how Annotation layering a **JavaScript, Chart** using SciChart.js, High Performance JavaScript ChartsNotice the difference between annotations rendered to SVG and Canvas, as well as annotationLayer property effect.",
                title: "JavaScript Chart Annotation Layers",
                pageTitle: "JavaScript Chart Annotation Layers",
                metaDescription: "Demonstrates how layering works a JavaScript Chart using SciChart.js Annotations API",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how Annotation layering a **React, Chart** using SciChart.js, High Performance JavaScript ChartsNotice the difference between annotations rendered to SVG and Canvas, as well as annotationLayer property effect.",
                title: "React Chart Annotation Layers",
                pageTitle: "React Chart Annotation Layers",
                metaDescription: "Demonstrates how layering works a React Chart using SciChart.js Annotations API",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how Annotation layering a **Angular, Chart** using SciChart.js, High Performance JavaScript ChartsNotice the difference between annotations rendered to SVG and Canvas, as well as annotationLayer property effect.",
                title: "Angular Chart Annotation Layers",
                pageTitle: "Angular Chart Annotation Layers",
                metaDescription: "Demonstrates how layering works a Angular Chart using SciChart.js Annotations API",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Annotations%20API%20Overview.html",
                title: "The specific page for the SciChart.js Annotations documentation will help you to get started",
                linkTitle: "Annotations API Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const annotationLayersExampleInfo = createExampleInfo(metaData);
