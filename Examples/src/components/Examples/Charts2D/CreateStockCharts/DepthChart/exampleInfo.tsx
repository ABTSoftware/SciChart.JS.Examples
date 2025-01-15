import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\createstockcharts\\depthchart",
        imagePath: "./javascript-depth-chart.jpg",
        description: "",
        path: "depth-chart",
        metaKeywords: "depth, orderbook, stock, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/CreateStockCharts/DepthChart",
        tips: ['""'],
        thumbnailImage: "javascript-depth-chart.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "How to create a Market Depth (Order Book) JavaScript Chart using Mountain Series and a Custom Modifier",
                title: "JavaScript Market Depth Chart",
                pageTitle: "JavaScript Market Depth Chart",
                metaDescription:
                    "Create a JavaScript Depth Chart, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "How to create a Market Depth (Order Book) React Chart using Mountain Series and a Custom Modifier",
                title: "React Market Depth Chart",
                pageTitle: "React Market Depth Chart",
                metaDescription:
                    "Create a React Depth Chart, using the high performance SciChart.js chart library. Get free demo now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "How to create a Market Depth (Order Book) Angular Chart using Mountain Series and a Custom Modifier",
                title: "Angular Market Depth Chart",
                pageTitle: "Angular Market Depth Chart",
                metaDescription:
                    "Create a Angular Depth Chart, using the high performance SciChart.js chart library. Get free demo now.",
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

export const depthChartExampleInfo = createExampleInfo(metaData);
