import { IExampleMetadata } from "../../IExampleMetadata";

export const metaData: IExampleMetadata =
    //// this file is generated, do not edit it!  JSON DATA >>>>>

    {
        exampleId: "customtypes",
        imagePath: "./javascript-custom-types.jpg",
        title: "customTypes",
        description:
            "To use a custom type, you just need to register it using chartBuilder.registerType, with a name, and a function that will create an instance of your type.\r\nThis example also shows how you can call methods within the builder api to get references to the objects being built, so you can update them later.",
        path: "customtypes",
        metaKeywords: "custom, chart, javascript, builder, paletteprovider",
        onWebsite: true,
        filepath: "BuilderApi/CustomTypes",
        tips: [
            "Custom types can have options which will be passed to the registered function.",
            "Add a toJSON method to your custom type if you want it to be serialized",
        ],
        thumbnailImage: 'getExampleImage("javascript-custom-types.jpg")',
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React customTypes** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React customTypes",
                pageTitle: "React customTypes | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React customTypes with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular customTypes** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular customTypes",
                pageTitle: "Angular customTypes | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular customTypes with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript customTypes** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript customTypes",
                pageTitle: "JavaScript customTypes | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript customTypes with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
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
