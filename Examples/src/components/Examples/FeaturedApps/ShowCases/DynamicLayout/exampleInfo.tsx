import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "featuredapps\\showcases\\dynamiclayout",
        imagePath: "./javascript-dynamic-layout.jpg",
        description: "",
        path: "dynamic-layout",
        metaKeywords: "subcharts, layout, demo, chart, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "FeaturedApps/ShowCases/DynamicLayout",
        tips: ['""'],
        thumbnailImage: "javascript-dynamic-layout.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates a custom modifier which can convert from single chart to grid layout and back using SciChart.js, High Performance JavaScript Charts",
                title: "Dynamic Layout Showcase",
                pageTitle: "Dynamic Layout Showcase",
                metaDescription:
                    "Demonstrates a custom modifier which can convert from single chart to grid layout and back.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates a custom modifier which can convert from single chart to grid layout and back using SciChart.js, High Performance JavaScript Charts",
                title: "Dynamic Layout Showcase",
                pageTitle: "Dynamic Layout Showcase",
                metaDescription:
                    "Demonstrates a custom modifier which can convert from single chart to grid layout and back.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates a custom modifier which can convert from single chart to grid layout and back using SciChart.js, High Performance JavaScript Charts",
                title: "Dynamic Layout Showcase",
                pageTitle: "Dynamic Layout Showcase",
                metaDescription:
                    "Demonstrates a custom modifier which can convert from single chart to grid layout and back.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
    };
//// End of computer generated metadata

export const dynamicLayoutExampleInfo = createExampleInfo(metaData);
