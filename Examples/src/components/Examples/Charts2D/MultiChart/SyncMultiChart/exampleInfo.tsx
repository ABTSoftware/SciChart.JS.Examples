import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\multichart\\syncmultichart",
        imagePath: "./javascript-sync-multi-chart.jpg",
        description: "",
        path: "sync-multi-chart",
        metaKeywords: "axis, synchronise, multiple, charts, overview, zoom, pan, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "Charts2D/MultiChart/SyncMultiChart",
        tips: ['""'],
        thumbnailImage: "javascript-sync-multi-chart.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "This example demonstrates how to synchronise layout and visible range across multiple dynamic charts, and how to synchronise series with an overview chart.using SciChart.js, High Performance JavaScript Charts",
                title: "Synchronise Multiple Charts",
                pageTitle: "Synchronise Multiple Charts",
                metaDescription: "Synchronise multiple dynamic charts and overview",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "This example demonstrates how to synchronise layout and visible range across multiple dynamic charts, and how to synchronise series with an overview chart.using SciChart.js, High Performance JavaScript Charts",
                title: "Synchronise Multiple Charts",
                pageTitle: "Synchronise Multiple Charts",
                metaDescription: "Synchronise multiple dynamic charts and overview",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "This example demonstrates how to synchronise layout and visible range across multiple dynamic charts, and how to synchronise series with an overview chart.using SciChart.js, High Performance JavaScript Charts",
                title: "Synchronise Multiple Charts",
                pageTitle: "Synchronise Multiple Charts",
                metaDescription: "Synchronise multiple dynamic charts and overview",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Tutorial%2009%20-%20Linking%20Multiple%20Charts.html",
                title: "This is a tutorial for how to synchronise the axis and modifiers for multiple charts",
                linkTitle: "SciChart.js Synchronise Charts Tutorial",
            },
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#SciChartOverview.html",
                title: "This specific page in the JavaScript SciChartOverview Api documentation will help you to get started",
                linkTitle: "SciChart.js Overview Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const syncMultiChartExampleInfo = createExampleInfo(metaData);
