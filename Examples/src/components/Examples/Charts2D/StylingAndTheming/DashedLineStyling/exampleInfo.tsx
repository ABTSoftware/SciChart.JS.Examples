import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\stylingandtheming\\dashedlinestyling",
        imagePath: "./javascript-dashed-line-chart.jpg",
        title: "Dashed Line Styling",
        description: "",
        path: "dashed-line-chart",
        metaKeywords: "dash, dashed, dotted, line, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/StylingAndTheming/DashedLineStyling",
        tips: ['""'],
        thumbnailImage: "javascript-dashed-line-chart.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how create **JavaScript, Charts with dashed lines** using SciChart.js, High Performance JavaScript Charts",
                title: "Dashed Line Styling",
                pageTitle: "Dashed Line Styling",
                metaDescription: "Demonstrates dashed line series in JavaScript Charts with SciChart.js",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how create **React, Charts with dashed lines** using SciChart.js, High Performance JavaScript Charts",
                title: "Dashed Line Styling",
                pageTitle: "Dashed Line Styling",
                metaDescription: "Demonstrates dashed line series in React Charts with SciChart.js",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how create **Angular, Charts with dashed lines** using SciChart.js, High Performance JavaScript Charts",
                title: "Dashed Line Styling",
                pageTitle: "Dashed Line Styling",
                metaDescription: "Demonstrates dashed line series in Angular Charts with SciChart.js",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Series%20Styling%20-%20Dash%20Line%20Patterns.html",
                title: "SciChart.js Dash Line Styling Documentation page",
                linkTitle: "The Dashed Line Styling Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const dashedLineStylingExampleInfo = createExampleInfo(metaData);
