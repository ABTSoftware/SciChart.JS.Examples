import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "candlestickchart",
        imagePath: "./javascript-candlestick-chart.jpg",
        title: "candlestickChart",
        description:
            "Candlestick charts can be animated, dynamically updated for real trading apps or combined with other series types to draw technical indicators or shapes.",
        path: "candlestickchart",
        metaKeywords: "candlestick, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/CandlestickChart",
        tips: [
            "Try dragging on the chart to pan or zoom it. Use the mousewheel to zoom and double-click to zoom to fit.",
        ],
        thumbnailImage: "javascript-candlestick-chart.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React candlestickChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React candlestickChart",
                pageTitle: "React candlestickChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React candlestickChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular candlestickChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular candlestickChart",
                pageTitle: "Angular candlestickChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular candlestickChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript candlestickChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript candlestickChart",
                pageTitle: "JavaScript candlestickChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript candlestickChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "JavaScript Candlestick Chart Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const candlestickChartExampleInfo = createExampleInfo(metaData);
