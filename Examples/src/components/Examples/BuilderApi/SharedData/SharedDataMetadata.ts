import { IExampleMetadata } from "../../IExampleMetadata";

export const metaData: IExampleMetadata =
    //// this file is generated, do not edit it!  JSON DATA >>>>>
    {
        exampleId: "shareddata",
        imagePath: "./javascript-shared-data.jpg",
        title: "sharedData",
        description:
            "This allows data to be reused in the chart, but more importantly allows the data and the chart definition to be built separately and then combined with ease.",
        path: "shareddata",
        metaKeywords: "template, chart, javascript, data, reuse",
        onWebsite: true,
        filepath: "BuilderApi/SharedData",
        tips: [
            "To deserialize a definition before adding data, use JSON.parse(jsonString, chartBuilder.chartReviver)",
            "To convert a chart to a definition without data, use sciChartSurface.toJSON(true)",
            "Data will be serialized to the individual series if the resulting chart is serialized",
        ],
        thumbnailImage: "javascript-shared-data.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React sharedData** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React sharedData",
                pageTitle: "React sharedData | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React sharedData with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular sharedData** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular sharedData",
                pageTitle: "Angular sharedData | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular sharedData with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript sharedData** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript sharedData",
                pageTitle: "JavaScript sharedData | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript sharedData with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
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
