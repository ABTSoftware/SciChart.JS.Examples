import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "featuredapps\\performancedemos\\load500by500",
        imagePath: "./javascript-chart-load-500-series-by-500-points.jpg",
        title: "Load 500 Series x 500 Points Performance Demo",
        description: "",
        path: "load-500-series-x-500-points-performance-demo",
        metaKeywords: "performance, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/PerformanceDemos/Load500By500",
        tips: ['""'],
        thumbnailImage: "javascript-chart-load-500-series-by-500-points.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates loading **500 series, each with 500 points (250k points total) instantly**. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 500 Series x 500 Points Performance Demo",
                pageTitle: "Load 500 Series x 500 Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our JavaScript Chart by loading 500 series with 500 points (250k points) instantly!",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates loading **500 series, each with 500 points (250k points total) instantly**. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 500 Series x 500 Points Performance Demo",
                pageTitle: "Load 500 Series x 500 Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our React Chart by loading 500 series with 500 points (250k points) instantly!",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates loading **500 series, each with 500 points (250k points total) instantly**. Click the **Reload** button at the bottom of the demo to see the chart draw again.",
                title: "Load 500 Series x 500 Points Performance Demo",
                pageTitle: "Load 500 Series x 500 Points Performance Demo",
                metaDescription:
                    "This demo showcases the incredible performance of our Angular Chart by loading 500 series with 500 points (250k points) instantly!",
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

export const load500By500ExampleInfo = createExampleInfo(metaData);
