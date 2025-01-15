import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "centralaxes",
        imagePath: "./javascript-central-axes.jpg",
        title: "centralAxes",
        description:
            "Demonstrates a chart with axes being placed centrally.\r\nSciChart supports customization of axes placement. This example shows how to use inner axes and set a layout strategy.",
        path: "centralaxes",
        metaKeywords: "multiple, axis, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ModifyAxisBehavior/CentralAxes",
        tips: ["You can create a custom Axis Layout Strategy!"],
        thumbnailImage: "javascript-central-axes.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React centralAxes** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React centralAxes",
                pageTitle: "React centralAxes | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React centralAxes with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular centralAxes** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular centralAxes",
                pageTitle: "Angular centralAxes | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular centralAxes with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript centralAxes** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript centralAxes",
                pageTitle: "JavaScript centralAxes | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript centralAxes with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "Central Axis documentation",
            },
        ],
    };
//// End of computer generated metadata

export const centralAxesExampleInfo = createExampleInfo(metaData);
