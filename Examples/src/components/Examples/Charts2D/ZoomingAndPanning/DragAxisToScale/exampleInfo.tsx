import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\zoomingandpanning\\dragaxistoscale",
        imagePath: "./drag-axis-on-javascript-charts-to-scale-or-pan.jpg",
        description: "",
        path: "chart-drag-axis-to-scale-pan",
        metaKeywords: "drag, axis, scale, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "Charts2D/ZoomingAndPanning/DragAxisToScale",
        tips: ['""'],
        thumbnailImage: "drag-axis-on-javascript-charts-to-scale-or-pan.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to **scale or pan the Axis on a ,JavaScript, Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Drag JavaScript Chart Axis to Scale or Pan",
                pageTitle: "Drag JavaScript Chart Axis to Scale or Pan",
                metaDescription:
                    "Demonstrates how to Zoom, Scale or Pan individual Axis on a JavaScript Chart with SciChart.js AxisDragModifiers",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to **scale or pan the Axis on a ,React, Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Drag React Chart Axis to Scale or Pan",
                pageTitle: "Drag React Chart Axis to Scale or Pan",
                metaDescription:
                    "Demonstrates how to Zoom, Scale or Pan individual Axis on a React Chart with SciChart.js AxisDragModifiers",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to **scale or pan the Axis on a ,Angular, Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Drag Angular Chart Axis to Scale or Pan",
                pageTitle: "Drag Angular Chart Axis to Scale or Pan",
                metaDescription:
                    "Demonstrates how to Zoom, Scale or Pan individual Axis on a Angular Chart with SciChart.js AxisDragModifiers",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#YAxisDragModifier.html",
                title: "SciChart.js Drag Axis to Scale Documentation page",
                linkTitle: "SciChart.js Axis Drag documentation",
            },
        ],
    };
//// End of computer generated metadata

export const dragAxisToScaleExampleInfo = createExampleInfo(metaData);
