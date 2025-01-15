import { createExampleInfo } from "../../exampleInfoUtils";
import { IExampleMetadata } from "../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "simplechart",
        imagePath: "./javascript-builder-simple.jpg",
        title: "simpleChart",
        description:
            "The builder api is designed to make it easier to discover the types and options available in SciChart JS.",
        path: "simplechart",
        metaKeywords: "definition, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "BuilderApi/SimpleChart",
        tips: [
            "Everything in the definition is optional. SciChart will add numeric axes by default.",
            "The builder api supports all SciChart 2D features.",
            "You can combine the builder api and normal api to utilize the strengths of each",
        ],
        thumbnailImage: "javascript-builder-simple.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React simpleChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React simpleChart",
                pageTitle: "React simpleChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React simpleChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular simpleChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular simpleChart",
                pageTitle: "Angular simpleChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular simpleChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript simpleChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript simpleChart",
                pageTitle: "JavaScript simpleChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript simpleChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "JavaScript Builder API Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const simpleChartExampleInfo = createExampleInfo(metaData);
