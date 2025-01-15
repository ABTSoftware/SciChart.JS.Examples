import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\stylingandtheming\\usepointmarkers",
        imagePath: "./javascript-chart-custom-pointmarkers.jpg",
        description: "",
        path: "chart-custom-pointmarkers",
        metaKeywords: "data, point, marker, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/StylingAndTheming/UsePointMarkers",
        tips: ['""'],
        thumbnailImage: "javascript-chart-custom-pointmarkers.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create **custom data-point markers** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Point-Markers Chart",
                pageTitle: "JavaScript Point-Markers Chart",
                metaDescription:
                    "Demonstrates the different point-marker types for JavaScript Scatter charts (Square, Circle, Triangle and Custom image point-marker)",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create **custom data-point markers** using SciChart.js, High Performance JavaScript Charts",
                title: "React Point-Markers Chart",
                pageTitle: "React Point-Markers Chart",
                metaDescription:
                    "Demonstrates the different point-marker types for React Scatter charts (Square, Circle, Triangle and Custom image point-marker)",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create **custom data-point markers** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Point-Markers Chart",
                pageTitle: "Angular Point-Markers Chart",
                metaDescription:
                    "Demonstrates the different point-marker types for Angular Scatter charts (Square, Circle, Triangle and Custom image point-marker)",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#DrawingPointMarkersOnSeries.html",
                title: "SciChart.js PointMarkers Documentation",
                linkTitle: "Point-Markers API documentation",
            },
        ],
    };
//// End of computer generated metadata

export const usePointMarkersExampleInfo = createExampleInfo(metaData);
