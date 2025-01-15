import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\modifyaxisbehavior\\staticaxis",
        imagePath: "./javascript-static-axis.jpg",
        description: "",
        path: "static-x-axis",
        metaKeywords: "multiple, axis, static, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ModifyAxisBehavior/StaticAxis",
        tips: ['""'],
        thumbnailImage: "javascript-static-axis.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates a realtime **JavaScript, static axis chart** - where the ticks and gridlines are fixed, but the labels change.With SciChart.js High Performance JavaScript Charts you can achieve this simply by setting isStaticAxis property to true on the X axis.",
                title: "JavaScript Chart with Static X Axis",
                pageTitle: "JavaScript Chart with Static X Axis",
                metaDescription: "Demonstrates isStaticAxis on a JavaScript Chart using SciChart.js.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates a realtime **React, static axis chart** - where the ticks and gridlines are fixed, but the labels change.With SciChart.js High Performance JavaScript Charts you can achieve this simply by setting isStaticAxis property to true on the X axis.",
                title: "React Chart with Static X Axis",
                pageTitle: "React Chart with Static X Axis",
                metaDescription: "Demonstrates isStaticAxis on a React Chart using SciChart.js.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates a realtime **Angular, static axis chart** - where the ticks and gridlines are fixed, but the labels change.With SciChart.js High Performance JavaScript Charts you can achieve this simply by setting isStaticAxis property to true on the X axis.",
                title: "Angular Chart with Static X Axis",
                pageTitle: "Angular Chart with Static X Axis",
                metaDescription: "Demonstrates isStaticAxis on a Angular Chart using SciChart.js.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Static%20Axis.html",
                title: "SciChart.js Static xAxis Documentation page",
                linkTitle: "Static Axis",
            },
        ],
    };
//// End of computer generated metadata

export const staticAxisExampleInfo = createExampleInfo(metaData);
