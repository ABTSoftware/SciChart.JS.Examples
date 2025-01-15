import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\basiccharttypes\\textserieschart",
        imagePath: "./javascript-text-chart.jpg",
        description: "",
        path: "text-chart",
        metaKeywords: "text, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/TextSeriesChart",
        tips: ['""'],
        thumbnailImage: "javascript-text-chart.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "This example demonstrates **FastTextRenderableSeries** using SciChart.js. The dataset is an AI analysis of 2100 tweets, extracting the organisations mentioned and the sentiment of the tweet.",
                title: "JavaScript Text Chart",
                pageTitle: "JavaScript Text Chart",
                metaDescription: "Create JavaScript Text Chart with high performance SciChart.js.  ",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "This example demonstrates **FastTextRenderableSeries** using SciChart.js. The dataset is an AI analysis of 2100 tweets, extracting the organisations mentioned and the sentiment of the tweet.",
                title: "React Text Chart",
                pageTitle: "React Text Chart",
                metaDescription: "Create React Text Chart with high performance SciChart.js.  ",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "This example demonstrates **FastTextRenderableSeries** using SciChart.js. The dataset is an AI analysis of 2100 tweets, extracting the organisations mentioned and the sentiment of the tweet.",
                title: "Angular Text Chart",
                pageTitle: "Angular Text Chart",
                metaDescription: "Create Angular Text Chart with high performance SciChart.js.  ",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#TheTextSeriesType.html",
                title: "The documentation page for the TextSeries in SciChart.js",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
    };
//// End of computer generated metadata

export const textChartExampleInfo = createExampleInfo(metaData);
