import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "featuredapps\\performancedemos\\load1millionpoints",
        imagePath: "./javascript-chart-performance-load-one-million-points.jpg",
        title: "Load 1 Million Points Performance Demo",
        description: "",
        path: "chart-performance-load-one-million-points",
        metaKeywords: "performance, loading, million, points, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/PerformanceDemos/Load1MillionPoints",
        tips: ['""'],
        thumbnailImage: "javascript-chart-performance-load-one-million-points.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Showcases how SciChart.js can load and display 1-Million Data-points in milliseconds. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 1 Million Points Performance Demo",
                pageTitle: "Load 1 Million Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our JavaScript Chart by loading a million points instantly.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Showcases how SciChart.js can load and display 1-Million Data-points in milliseconds. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 1 Million Points Performance Demo",
                pageTitle: "Load 1 Million Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our JavaScript Chart by loading a million points instantly.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Showcases how SciChart.js can load and display 1-Million Data-points in milliseconds. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 1 Million Points Performance Demo",
                pageTitle: "Load 1 Million Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our JavaScript Chart by loading a million points instantly.",
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

export const loadOneMillionPointsExampleInfo = createExampleInfo(metaData);
