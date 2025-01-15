import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\basiccharttypes\\candlestickchart",
        imagePath: "./javascript-candlestick-chart.jpg",
        description: "",
        path: "candlestick-chart",
        metaKeywords: "candlestick, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/CandlestickChart",
        tips: ['""'],
        thumbnailImage: "javascript-candlestick-chart.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "This demo shows you how to create a **JavaScript, Candlestick Chart** or Stock Chart using SciChart.js. Data is fetched from Binance and placed on the chart. Two moving averages are added. Zooming, panning and tooltips as well. Switch between Candlestick or Ohlc, or see the **Realtime Ticking Stock Charts** demo which shows how to add live updates.",
                title: "JavaScript Candlestick Chart",
                pageTitle: "JavaScript Candlestick Chart | Chart Examples | SciChart.js",
                metaDescription:
                    "Discover how to create a JavaScript Candlestick Chart or Stock Chart using SciChart.js. For high Performance JavaScript Charts, get your free demo now.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "This demo shows you how to create a **React, Candlestick Chart** or Stock Chart using SciChart.js. Data is fetched from Binance and placed on the chart. Two moving averages are added. Zooming, panning and tooltips as well. Switch between Candlestick or Ohlc, or see the **Realtime Ticking Stock Charts** demo which shows how to add live updates.",
                title: "React Candlestick Chart",
                pageTitle: "React Candlestick Chart | Chart Examples | SciChart.js",
                metaDescription:
                    "Discover how to create a React Candlestick Chart or Stock Chart using SciChart.js. For high Performance JavaScript Charts, get your free demo now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "This demo shows you how to create a **Angular, Candlestick Chart** or Stock Chart using SciChart.js. Data is fetched from Binance and placed on the chart. Two moving averages are added. Zooming, panning and tooltips as well. Switch between Candlestick or Ohlc, or see the **Realtime Ticking Stock Charts** demo which shows how to add live updates.",
                title: "Angular Candlestick Chart",
                pageTitle: "Angular Candlestick Chart | Chart Examples | SciChart.js",
                metaDescription:
                    "Discover how to create a Angular Candlestick Chart or Stock Chart using SciChart.js. For high Performance JavaScript Charts, get your free demo now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Candlestick%20Series%20type.html",
                title: "This specific page in the JavaScript Candlestick Chart documentation will help you to get started",
                linkTitle: "JavaScript Candlestick Chart Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const candlestickChartExampleInfo = createExampleInfo(metaData);
