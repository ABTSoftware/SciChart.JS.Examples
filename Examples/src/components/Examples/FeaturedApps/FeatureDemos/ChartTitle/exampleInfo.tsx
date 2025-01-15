import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "featuredapps\\featuredemos\\charttitle",
        imagePath: "./javascript-chart-title.jpg",
        description: "",
        path: "chart-title",
        metaKeywords: "title, text, alignment, multiline, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/FeatureDemos/ChartTitle",
        tips: ['""'],
        thumbnailImage: "javascript-chart-title.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "A Chart Title can be placed above, below, or either side of the chart, and be left, center or right aligned.",
                title: "JavaScript Chart Title",
                pageTitle: "JavaScript Chart Title",
                metaDescription: "Demonstrates chart title with different position and alignment options",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "A Chart Title can be placed above, below, or either side of the chart, and be left, center or right aligned.",
                title: "React Chart Title",
                pageTitle: "React Chart Title",
                metaDescription: "Demonstrates chart title with different position and alignment options",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "A Chart Title can be placed above, below, or either side of the chart, and be left, center or right aligned.",
                title: "Angular Chart Title",
                pageTitle: "Angular Chart Title",
                metaDescription: "Demonstrates chart title with different position and alignment options",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
    };
//// End of computer generated metadata

export const chartTitleExampleInfo = createExampleInfo(metaData);
