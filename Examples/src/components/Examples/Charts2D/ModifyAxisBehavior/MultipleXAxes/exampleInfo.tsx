import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\modifyaxisbehavior\\multiplexaxes",
        imagePath: "./javascript-chart-with-multiple-x-axis.jpg",
        description: "",
        path: "chart-with-multiple-x-axis",
        metaKeywords: "multiple, axis, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ModifyAxisBehavior/MultipleXAxes",
        tips: ['""'],
        thumbnailImage: "javascript-chart-with-multiple-x-axis.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript, Chart with multiple X,Y axis** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Chart with Multiple X Axes",
                pageTitle: "JavaScript Chart with Multiple X Axes",
                metaDescription:
                    "Demonstrates Multiple X & Y Axis on a JavaScript Chart using SciChart.js. SciChart supports unlimited left, right, top, bottom X, Y axis with configurable alignment and individual zooming, panning",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React, Chart with multiple X,Y axis** using SciChart.js, High Performance JavaScript Charts",
                title: "React Chart with Multiple X Axes",
                pageTitle: "React Chart with Multiple X Axes",
                metaDescription:
                    "Demonstrates Multiple X & Y Axis on a React Chart using SciChart.js. SciChart supports unlimited left, right, top, bottom X, Y axis with configurable alignment and individual zooming, panning",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular, Chart with multiple X,Y axis** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Chart with Multiple X Axes",
                pageTitle: "Angular Chart with Multiple X Axes",
                metaDescription:
                    "Demonstrates Multiple X & Y Axis on a Angular Chart using SciChart.js. SciChart supports unlimited left, right, top, bottom X, Y axis with configurable alignment and individual zooming, panning",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Axis%20Alignment%20-%20Setting%20Axis%20Alignment.html",
                title: "SciChart.js Multiple XAxis Documentation",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
    };
//// End of computer generated metadata

export const multipleXAxesExampleInfo = createExampleInfo(metaData);
