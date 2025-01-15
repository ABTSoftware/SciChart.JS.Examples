import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\modifyaxisbehavior\\drawbehindaxes",
        imagePath: "./javascript-draw-behind-axes.jpg",
        description: "",
        path: "draw-behind-axes",
        metaKeywords: "multiple, axis, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ModifyAxisBehavior/DrawBehindAxes",
        tips: ['""'],
        thumbnailImage: "javascript-draw-behind-axes.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript, Chart with transparent axes** using SciChart.js, High Performance JavaScript Charts",
                title: "Draw JavaScript Chart Behind Axis",
                pageTitle: "Draw JavaScript Chart Behind Axis",
                metaDescription:
                    "Demonstrates the option of the transparent Axes customization on a JavaScript Chart using SciChart.js.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React, Chart with transparent axes** using SciChart.js, High Performance JavaScript Charts",
                title: "Draw React Chart Behind Axis",
                pageTitle: "Draw React Chart Behind Axis",
                metaDescription:
                    "Demonstrates the option of the transparent Axes customization on a React Chart using SciChart.js.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular, Chart with transparent axes** using SciChart.js, High Performance JavaScript Charts",
                title: "Draw Angular Chart Behind Axis",
                pageTitle: "Draw Angular Chart Behind Axis",
                metaDescription:
                    "Demonstrates the option of the transparent Axes customization on a Angular Chart using SciChart.js.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Axis%20Layout%20-%20Inside%20and%20Central%20Axis.html",
                title: "SciChart.js Draw Behind Axes Documentation page",
                linkTitle: "Central Axis documentation",
            },
        ],
    };
//// End of computer generated metadata

export const drawBehindAxesExampleInfo = createExampleInfo(metaData);
