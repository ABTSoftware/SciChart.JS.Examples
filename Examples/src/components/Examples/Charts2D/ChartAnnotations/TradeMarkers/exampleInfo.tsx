import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\chartannotations\\trademarkers",
        imagePath: "./javascript-stock-chart-buy-sell-markers.jpg",
        description: "",
        path: "stock-chart-buy-sell-markers",
        metaKeywords: "trade, markers, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ChartAnnotations/TradeMarkers",
        tips: ['""'],
        thumbnailImage: "javascript-stock-chart-buy-sell-markers.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to add Hoverable Buy/Sell Markers (annotations) and News/Dividend bullets to a **JavaScript, Stock Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Chart Hoverable Buy Sell Marker Annotations",
                pageTitle: "JavaScript Chart Hoverable Buy Sell Marker Annotations",
                metaDescription:
                    "Demonstrates how to place Buy/Sell arrow markers on a JavaScript Stock Chart using SciChart.js - Annotations API",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to add Hoverable Buy/Sell Markers (annotations) and News/Dividend bullets to a **React, Stock Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "React Chart Hoverable Buy Sell Marker Annotations",
                pageTitle: "React Chart Hoverable Buy Sell Marker Annotations",
                metaDescription:
                    "Demonstrates how to place Buy/Sell arrow markers on a React Stock Chart using SciChart.js - Annotations API",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to add Hoverable Buy/Sell Markers (annotations) and News/Dividend bullets to a **Angular, Stock Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Chart Hoverable Buy Sell Marker Annotations",
                pageTitle: "Angular Chart Hoverable Buy Sell Marker Annotations",
                metaDescription:
                    "Demonstrates how to place Buy/Sell arrow markers on a Angular Stock Chart using SciChart.js - Annotations API",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Annotations%20API%20Overview.html",
                title: "The specific page for the SciChart.js Annotations documentation will help you to get started",
                linkTitle: "Annotations API Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const tradeMarkerAnnotationsExampleInfo = createExampleInfo(metaData);
