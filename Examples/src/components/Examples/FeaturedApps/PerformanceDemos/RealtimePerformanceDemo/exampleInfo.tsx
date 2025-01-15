import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "featuredapps\\performancedemos\\realtimeperformancedemo",
        imagePath: "./javascript-chart-realtime-performance-demo.jpg",
        description: "",
        path: "chart-realtime-performance-demo",
        metaKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/PerformanceDemos/RealtimePerformanceDemo",
        tips: ['""'],
        thumbnailImage: "javascript-chart-realtime-performance-demo.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates appending **millions of points** to a line chart with SciChart.js, High Performance JavaScript Charts",
                title: "Realtime JavaScript Chart Performance Demo",
                pageTitle: "Realtime JavaScript Chart Performance Demo",
                metaDescription:
                    "This demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates appending **millions of points** to a line chart with SciChart.js, High Performance JavaScript Charts",
                title: "Realtime React Chart Performance Demo",
                pageTitle: "Realtime React Chart Performance Demo",
                metaDescription:
                    "This demo showcases the incredible realtime performance of our React charts by updating the series with millions of data-points!",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates appending **millions of points** to a line chart with SciChart.js, High Performance JavaScript Charts",
                title: "Realtime Angular Chart Performance Demo",
                pageTitle: "Realtime Angular Chart Performance Demo",
                metaDescription:
                    "This demo showcases the incredible realtime performance of our Angular charts by updating the series with millions of data-points!",
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

export const realtimePerformanceDemoExampleInfo = createExampleInfo(metaData);
