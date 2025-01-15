import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\stylingandtheming\\datalabels",
        imagePath: "./javascript-datalabels-chart.jpg",
        description: "",
        path: "datalabels",
        metaKeywords: "data labels, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/StylingAndTheming/DataLabels",
        tips: ['""'],
        thumbnailImage: "javascript-datalabels-chart.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle: "Shows how you can add **Data Labels** to a chart using SciChart.js",
                title: "Data Labels",
                pageTitle: "Data Labels",
                metaDescription: "Show data labels on JavaScript Chart. Get your free demo now.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle: "Shows how you can add **Data Labels** to a chart using SciChart.js",
                title: "Data Labels",
                pageTitle: "Data Labels",
                metaDescription: "Show data labels on React Chart. Get your free demo now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle: "Shows how you can add **Data Labels** to a chart using SciChart.js",
                title: "Data Labels",
                pageTitle: "Data Labels",
                metaDescription: "Show data labels on Angular Chart. Get your free demo now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#AddingDataLabels.html",
                title: "SciChart.js DataLabels API Documentation",
                linkTitle: "Common RenderableSeries Properties",
            },
        ],
    };
//// End of computer generated metadata

export const datalabelsExampleInfo = createExampleInfo(metaData);
