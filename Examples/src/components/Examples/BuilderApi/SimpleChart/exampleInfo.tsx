import { createExampleInfo } from "../../exampleInfoUtils";
import { IExampleMetadata } from "../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "builderapi\\simplechart",
        imagePath: "./javascript-builder-simple.jpg",
        description: "",
        path: "builder-simple",
        metaKeywords: "definition, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "BuilderApi/SimpleChart",
        tips: ['""'],
        thumbnailImage: "javascript-builder-simple.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Simple Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Simple Chart using Builder API",
                pageTitle: "Simple Chart using Builder API",
                metaDescription:
                    "Demonstrates how to use the Builder Api to create a simple chart using a definition object. The builder api is designed to make it easier to discover the types and options available in SciChart JS.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Simple Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Simple Chart using Builder API",
                pageTitle: "Simple Chart using Builder API",
                metaDescription:
                    "Demonstrates how to use the Builder Api to create a simple chart using a definition object. The builder api is designed to make it easier to discover the types and options available in SciChart JS.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Simple Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Simple Chart using Builder API",
                pageTitle: "Simple Chart using Builder API",
                metaDescription:
                    "Demonstrates how to use the Builder Api to create a simple chart using a definition object. The builder api is designed to make it easier to discover the types and options available in SciChart JS.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Intro%20to%20the%20Builder%20API.html",
                title: "This specific page in the JavaScript Builder API documentation will help you to get started",
                linkTitle: "JavaScript Builder API Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const simpleChartExampleInfo = createExampleInfo(metaData);
