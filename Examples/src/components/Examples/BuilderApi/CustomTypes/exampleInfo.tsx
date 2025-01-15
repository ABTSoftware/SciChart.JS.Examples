import { createExampleInfo } from "../../exampleInfoUtils";
import { IExampleMetadata } from "../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "builderapi\\customtypes",
        imagePath: "./javascript-custom-types.jpg",
        title: "Custom Types with Builder API",
        description: "",
        path: "custom-types",
        metaKeywords: "custom, chart, javascript, builder, paletteprovider",
        onWebsite: true,
        filepath: "BuilderApi/CustomTypes",
        tips: ['""'],
        thumbnailImage: "javascript-custom-types.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to use the Builder Api with **Custom Types** using SciChart.js, High Performance JavaScript Charts",
                title: "Custom Types with Builder API",
                pageTitle: "Custom Types with Builder API",
                metaDescription:
                    "Demonstrates how to make a custom type such as a PaletteProvider available for use with the Builder Api.You can call methods within the builder api to get references to the objects being built, so you can update them later.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to use the Builder Api with **Custom Types** using SciChart.js, High Performance JavaScript Charts",
                title: "Custom Types with Builder API",
                pageTitle: "Custom Types with Builder API",
                metaDescription:
                    "Demonstrates how to make a custom type such as a PaletteProvider available for use with the Builder Api.You can call methods within the builder api to get references to the objects being built, so you can update them later.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to use the Builder Api with **Custom Types** using SciChart.js, High Performance JavaScript Charts",
                title: "Custom Types with Builder API",
                pageTitle: "Custom Types with Builder API",
                metaDescription:
                    "Demonstrates how to make a custom type such as a PaletteProvider available for use with the Builder Api.You can call methods within the builder api to get references to the objects being built, so you can update them later.",
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

export const customTypesExampleInfo = createExampleInfo(metaData);
