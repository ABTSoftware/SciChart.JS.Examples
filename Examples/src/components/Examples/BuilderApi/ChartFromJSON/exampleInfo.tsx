import { createExampleInfo } from "../../exampleInfoUtils";
import { IExampleMetadata } from "../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "builderapi\\chartfromjson",
        imagePath: "./javascript-chart-from-json.jpg",
        description: "",
        path: "chart-from-json",
        metaKeywords: "json, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "BuilderApi/ChartFromJSON",
        tips: ['""'],
        thumbnailImage: "javascript-chart-from-json.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Chart from JSON** using SciChart.js. Adjust the JSON in the window below and the chart will re-build. Choose from pre-selected defaults to learn more about the Builder API.",
                title: "Chart from JSON",
                pageTitle: "Chart from JSON",
                metaDescription: "Demonstrates how to create a JavaScript Chart from JSON using the builder API. ",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Chart from JSON** using SciChart.js. Adjust the JSON in the window below and the chart will re-build. Choose from pre-selected defaults to learn more about the Builder API.",
                title: "Chart from JSON",
                pageTitle: "Chart from JSON",
                metaDescription: "Demonstrates how to create a React Chart from JSON using the builder API. ",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Chart from JSON** using SciChart.js. Adjust the JSON in the window below and the chart will re-build. Choose from pre-selected defaults to learn more about the Builder API.",
                title: "Chart from JSON",
                pageTitle: "Chart from JSON",
                metaDescription: "Demonstrates how to create a Angular Chart from JSON using the builder API. ",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Intro%20to%20the%20Builder%20API.html",
                title: "This specific page in the JavaScript Builder API documentation will help you to get started",
                linkTitle: "JavaScript Builder API Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const chartFromJSONExampleInfo = createExampleInfo(metaData);
