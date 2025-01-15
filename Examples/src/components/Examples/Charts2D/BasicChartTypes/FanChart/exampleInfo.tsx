import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "fanchart",
        imagePath: "./javascript-fan-chart.jpg",
        title: "fanChart",
        description:
            "Fan charts can be used for visualizing, forecasting\r\nor estimation figures and can be achieved in SciChart.js using several Band Series overlaid with varying\r\nopacity.",
        path: "fanchart",
        metaKeywords: "fan, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/FanChart",
        tips: [
            "As well as stroke, you can set strokeThickness, isVisible properties to change how the series is rendered.",
        ],
        thumbnailImage: "javascript-fan-chart.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React fanChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React fanChart",
                pageTitle: "React fanChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React fanChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular fanChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular fanChart",
                pageTitle: "Angular fanChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular fanChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript fanChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript fanChart",
                pageTitle: "JavaScript fanChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript fanChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "JavaScript Fan Chart Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const fanChartExampleInfo = createExampleInfo(metaData);
