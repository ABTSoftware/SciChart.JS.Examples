import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\basiccharttypes\\scatterchart",
        imagePath: "./javascript-scatter-chart.jpg",
        description: "",
        path: "scatter-chart",
        metaKeywords: "scatter, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/ScatterChart",
        tips: ['""'],
        thumbnailImage: "javascript-scatter-chart.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "We have created an example that demonstrates how to create a **JavaScript, Scatter Chart** using SciChart.js",
                title: "JavaScript Scatter Chart",
                pageTitle: "JavaScript Scatter Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Create JavaScript Scatter Chart with high performance SciChart.js. Easily render pre-defined point types. Supports custom shapes. Get your free trial now. ",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "We have created an example that demonstrates how to create a **React, Scatter Chart** using SciChart.js",
                title: "React Scatter Chart",
                pageTitle: "React Scatter Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Create React Scatter Chart with high performance SciChart.js. Easily render pre-defined point types. Supports custom shapes. Get your free trial now. ",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "We have created an example that demonstrates how to create a **Angular, Scatter Chart** using SciChart.js",
                title: "Angular Scatter Chart",
                pageTitle: "Angular Scatter Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Create Angular Scatter Chart with high performance SciChart.js. Easily render pre-defined point types. Supports custom shapes. Get your free trial now. ",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Scatter%20Series%20Type.html",
                title: "This specific page in the JavaScript Scatter Chart documentation will help you to get started",
                linkTitle: "JavaScript Scatter Chart Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const scatterChartExampleInfo = createExampleInfo(metaData);
