import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\zoomingandpanning\\realtimezoompan",
        imagePath: "./zoom-and-pan-a-realtime-javascript-chart.jpg",
        description: "",
        path: "zoom-pan-realtime-javascript-chart",
        metaKeywords: "drag, axis, scale, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ZoomingAndPanning/RealtimeZoomPan",
        tips: ['""'],
        thumbnailImage: "zoom-and-pan-a-realtime-javascript-chart.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Zoom the real-time chart below by dragging on the surface. Right click and drag to pan. Then double-click to reset zoom and start automatically scrolling again.",
                title: "Zoom and Pan a Realtime JavaScript Chart",
                pageTitle: "Zoom and Pan a Realtime JavaScript Chart",
                metaDescription:
                    "Demonstrates how to zoom and pan a realtime JavaScript Chart while it is updating, with SciChart.js ZoomState API",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Zoom the real-time chart below by dragging on the surface. Right click and drag to pan. Then double-click to reset zoom and start automatically scrolling again.",
                title: "Zoom and Pan a Realtime React Chart",
                pageTitle: "Zoom and Pan a Realtime React Chart",
                metaDescription:
                    "Demonstrates how to zoom and pan a realtime React Chart while it is updating, with SciChart.js ZoomState API",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Zoom the real-time chart below by dragging on the surface. Right click and drag to pan. Then double-click to reset zoom and start automatically scrolling again.",
                title: "Zoom and Pan a Realtime Angular Chart",
                pageTitle: "Zoom and Pan a Realtime Angular Chart",
                metaDescription:
                    "Demonstrates how to zoom and pan a realtime Angular Chart while it is updating, with SciChart.js ZoomState API",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#ZoomPanModifier.html",
                title: "Zoom and Pan Modifier Documentation",
                linkTitle: "SciChart.js Zooming and Panning Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const realtimeZoomPanExampleInfo = createExampleInfo(metaData);
