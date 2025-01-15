import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\legends\\chartlegendsapi",
        imagePath: "./javascript-chart-legends.jpg",
        description: "",
        path: "chart-legends",
        metaKeywords: "legend, api, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/Legends/ChartLegendsAPI",
        tips: ['""'],
        thumbnailImage: "javascript-chart-legends.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to add a legend to a **JavaScript, Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Chart Legends API",
                pageTitle: "Chart Legends API",
                metaDescription:
                    "Demonstrates how to add a Legends to a JavaScript Line Chart using SciChart.js. The legend is created when you add a LegendModifier type to the sciChartSurface.chartModifiers collection.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to add a legend to a **React, Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Chart Legends API",
                pageTitle: "Chart Legends API",
                metaDescription:
                    "Demonstrates how to add a Legends to a JavaScript Line Chart using SciChart.js. The legend is created when you add a LegendModifier type to the sciChartSurface.chartModifiers collection.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to add a legend to a **Angular, Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Chart Legends API",
                pageTitle: "Chart Legends API",
                metaDescription:
                    "Demonstrates how to add a Legends to a JavaScript Line Chart using SciChart.js. The legend is created when you add a LegendModifier type to the sciChartSurface.chartModifiers collection.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#LegendModifier.html",
                title: "The specific page for the SciChart.js Legends documentation will help you to get started",
                linkTitle: "Legend API Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const chartLegendsAPIExampleInfo = createExampleInfo(metaData);
