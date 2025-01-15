import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "featuredapps\\performancedemos\\realtimeghostedtraces",
        imagePath: "./javascript-realtime-ghosted-traces-oscilloscope-chart.jpg",
        title: "Realtime Ghosted Traces",
        description: "",
        path: "realtime-ghosted-traces-chart",
        metaKeywords: "realtime, ghosted, traces, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/PerformanceDemos/RealtimeGhostedTraces",
        tips: ['""'],
        thumbnailImage: "javascript-realtime-ghosted-traces-oscilloscope-chart.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates real-time oscilloscope style effects with SciChart.js, High Performance JavaScript Charts",
                title: "Realtime Ghosted Traces",
                pageTitle: "Realtime Ghosted Traces",
                metaDescription:
                    "This demo showcases the realtime performance of our JavaScript Chart by animating several series with thousands of data-points at 60 FPS",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates real-time oscilloscope style effects with SciChart.js, High Performance JavaScript Charts",
                title: "Realtime Ghosted Traces",
                pageTitle: "Realtime Ghosted Traces",
                metaDescription:
                    "This demo showcases the realtime performance of our React Chart by animating several series with thousands of data-points at 60 FPS",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates real-time oscilloscope style effects with SciChart.js, High Performance JavaScript Charts",
                title: "Realtime Ghosted Traces",
                pageTitle: "Realtime Ghosted Traces",
                metaDescription:
                    "This demo showcases the realtime performance of our Angular Chart by animating several series with thousands of data-points at 60 FPS",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Common%20RenderableSeries%20Features.html",
                title: "Go to the Performance Tips and Tricks page in the SciChart.js Documentation",
                linkTitle: "SciChart.js Performance Tips and Tricks",
            },
        ],
    };
//// End of computer generated metadata

export const realtimeGhostedTracesExampleInfo = createExampleInfo(metaData);
