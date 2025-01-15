import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\filters\\percentagechange",
        imagePath: "./javascript-percentage-change.jpg",
        title: "Realtime Percentage Change using Filter",
        description: "",
        path: "percentage-change",
        metaKeywords: "real-time, updating, percentage, transform, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/Filters/PercentageChange",
        tips: ['""'],
        thumbnailImage: "javascript-percentage-change.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to use a ScaleOffsetFilter to convert data to a **Percentage Change** with realtime updates, using SciChart.js, High Performance JavaScript Charts",
                title: "Realtime Percentage Change using Filter",
                pageTitle: "Realtime Percentage Change using Filter",
                metaDescription:
                    "How to use a ScaleOffsetFilter to convert data to a percentage change, with realtime updates, rescale on pan",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to use a ScaleOffsetFilter to convert data to a **Percentage Change** with realtime updates, using SciChart.js, High Performance JavaScript Charts",
                title: "Realtime Percentage Change using Filter",
                pageTitle: "Realtime Percentage Change using Filter",
                metaDescription:
                    "How to use a ScaleOffsetFilter to convert data to a percentage change, with realtime updates, rescale on pan",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to use a ScaleOffsetFilter to convert data to a **Percentage Change** with realtime updates, using SciChart.js, High Performance JavaScript Charts",
                title: "Realtime Percentage Change using Filter",
                pageTitle: "Realtime Percentage Change using Filter",
                metaDescription:
                    "How to use a ScaleOffsetFilter to convert data to a percentage change, with realtime updates, rescale on pan",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Scale%20Offset%20Filters.html",
                title: "This specific page in the JavaScript Filters API documentation will help you to get started",
                linkTitle: "SciChart.js ScaleOffsetFilter Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const percentageChangeExampleInfo = createExampleInfo(metaData);
