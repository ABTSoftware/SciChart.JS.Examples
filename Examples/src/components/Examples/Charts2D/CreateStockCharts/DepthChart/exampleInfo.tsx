import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "depthchart",
        imagePath: "./javascript-depth-chart.jpg",
        title: "depthChart",
        description: "",
        path: "depthchart",
        metaKeywords: "depth, orderbook, stock, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/CreateStockCharts/DepthChart",
        tips: ['""'],
        thumbnailImage: "javascript-depth-chart.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React depthChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React depthChart",
                pageTitle: "React depthChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React depthChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular depthChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular depthChart",
                pageTitle: "Angular depthChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular depthChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript depthChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript depthChart",
                pageTitle: "JavaScript depthChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript depthChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
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

export const depthChartExampleInfo = createExampleInfo(metaData);
