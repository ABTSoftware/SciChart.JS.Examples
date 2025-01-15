import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\createstockcharts\\subchartstockcharts",
        imagePath: "./javascript-subcharts-multi-pane-stock-charts.jpg",
        description: "",
        path: "multi-pane-stock-charts",
        metaKeywords: "multi-pane, stock, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/CreateStockCharts/SubChartStockCharts",
        tips: ['""'],
        thumbnailImage: "javascript-subcharts-multi-pane-stock-charts.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Using the new Sub-Charts API, create a multi-pane stock chart example with indicator panels on a single WebGL chart surface. This allows for higher-performance since the WebGL context is shared. Zooming, panning, cursors are synchronised between the charts. ",
                title: "JavaScript Multi-Pane Stock Charts using Subcharts",
                pageTitle: "JavaScript Multi-Pane Stock Chart using Subcharts | View JavaScript Charts",
                metaDescription:
                    "Create a JavaScript Multi-Pane Candlestick / Stock Chart with indicator panels, synchronized zooming, panning and cursors. Get your free trial of SciChart.js now.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Using the new Sub-Charts API, create a multi-pane stock chart example with indicator panels on a single WebGL chart surface. This allows for higher-performance since the WebGL context is shared. Zooming, panning, cursors are synchronised between the charts. ",
                title: "React Multi-Pane Stock Charts using Subcharts",
                pageTitle: "React Multi-Pane Stock Chart using Subcharts | View JavaScript Charts",
                metaDescription:
                    "Create a React Multi-Pane Candlestick / Stock Chart with indicator panels, synchronized zooming, panning and cursors. Get your free trial of SciChart.js now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Using the new Sub-Charts API, create a multi-pane stock chart example with indicator panels on a single WebGL chart surface. This allows for higher-performance since the WebGL context is shared. Zooming, panning, cursors are synchronised between the charts. ",
                title: "Angular Multi-Pane Stock Charts using Subcharts",
                pageTitle: "Angular Multi-Pane Stock Chart using Subcharts | View JavaScript Charts",
                metaDescription:
                    "Create a Angular Multi-Pane Candlestick / Stock Chart with indicator panels, synchronized zooming, panning and cursors. Get your free trial of SciChart.js now.",
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

export const subChartStockChartsExampleInfo = createExampleInfo(metaData);
