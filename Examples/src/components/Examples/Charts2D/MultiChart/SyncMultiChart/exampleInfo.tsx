import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "syncmultichart",
        imagePath: "./javascript-sync-multi-chart.jpg",
        title: "syncMultiChart",
        description: "",
        path: "syncmultichart",
        metaKeywords: "axis, synchronise, multiple, charts, overview, zoom, pan, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/MultiChart/SyncMultiChart",
        tips: [],
        thumbnailImage: "javascript-sync-multi-chart.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React syncMultiChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React syncMultiChart",
                pageTitle: "React syncMultiChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React syncMultiChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular syncMultiChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular syncMultiChart",
                pageTitle: "Angular syncMultiChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular syncMultiChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript syncMultiChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript syncMultiChart",
                pageTitle: "JavaScript syncMultiChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript syncMultiChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: '"This is a tutorial for how to synchronise the axis and modifiers for multiple charts"',
                linkTitle: "SciChart.js Synchronise Charts Tutorial",
            },
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "SciChart.js Overview Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const syncMultiChartExampleInfo = createExampleInfo(metaData);
