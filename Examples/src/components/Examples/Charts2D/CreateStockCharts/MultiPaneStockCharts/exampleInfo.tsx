import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "multipanestockcharts",
        imagePath: "./javascript-multi-pane-stock-charts.jpg",
        title: "multiPaneStockCharts",
        description:
            "All charts are synchronized together by using the mouseEventGroup property on chart modifiers and the\r\nSciChartVerticalGroup type. Technical indicators are for demo purposes only. We recommend using TA-Lib to add more complex indicators to SciChart.js",
        path: "multipanestockcharts",
        metaKeywords: "multi-pane, stock, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/CreateStockCharts/MultiPaneStockCharts",
        tips: [
            "SciChart.js supports all the features you need to create rich, interactive, realtime JavaScript Stock Chart applications. Including Candlestick/OHLC charts, Band Series for bollinger bands, multi-panes, plus incredible real-time performance.",
        ],
        thumbnailImage: "javascript-multi-pane-stock-charts.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React multiPaneStockCharts** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React multiPaneStockCharts",
                pageTitle: "React multiPaneStockCharts | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React multiPaneStockCharts with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular multiPaneStockCharts** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular multiPaneStockCharts",
                pageTitle: "Angular multiPaneStockCharts | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular multiPaneStockCharts with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript multiPaneStockCharts** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript multiPaneStockCharts",
                pageTitle: "JavaScript multiPaneStockCharts | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript multiPaneStockCharts with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
    };
//// End of computer generated metadata

export const multiPaneStockChartsExampleInfo = createExampleInfo(metaData);
