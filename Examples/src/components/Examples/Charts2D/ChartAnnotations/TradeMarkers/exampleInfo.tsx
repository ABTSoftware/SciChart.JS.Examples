import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "trademarkerannotations",
        imagePath: "./javascript-stock-chart-buy-sell-markers.jpg",
        title: "tradeMarkerAnnotations",
        description:
            "The CustomAnnotations are created and added using SVG to the sciChartSurface.annotations collection. They\r\nmay be placed above or below candles with our helpful API.",
        path: "trademarkerannotations",
        metaKeywords: "trade, markers, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ChartAnnotations/TradeMarkers",
        tips: [
            'News/Event bullet annotations use AnnotationBase.${" "}yCoordinateMode = ECoordinateMode.${" "}RelativeY to always place\r\nthe event bullet at the bottom of the chart.',
        ],
        thumbnailImage: "javascript-stock-chart-buy-sell-markers.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React tradeMarkerAnnotations** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React tradeMarkerAnnotations",
                pageTitle: "React tradeMarkerAnnotations | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React tradeMarkerAnnotations with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular tradeMarkerAnnotations** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular tradeMarkerAnnotations",
                pageTitle: "Angular tradeMarkerAnnotations | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular tradeMarkerAnnotations with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript tradeMarkerAnnotations** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript tradeMarkerAnnotations",
                pageTitle: "JavaScript tradeMarkerAnnotations | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript tradeMarkerAnnotations with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "Annotations API Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const tradeMarkerAnnotationsExampleInfo = createExampleInfo(metaData);
