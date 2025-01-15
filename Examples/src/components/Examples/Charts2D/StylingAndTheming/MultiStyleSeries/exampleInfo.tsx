import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\stylingandtheming\\multistyleseries",
        imagePath: "./javascript-chart-multi-style-series.jpg",
        description: "",
        path: "multi-style-series",
        metaKeywords: "multiple styles, api, chart, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "Charts2D/StylingAndTheming/MultiStyleSeries",
        tips: ['""'],
        thumbnailImage: "javascript-chart-multi-style-series.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to use multiple styles on a single series on **JavaScript, Charts** using SciChart.js, High Performance JavaScript Charts. This uses a RenderDataTransform to split the data so that we can draw the selected points using additional customised drawingProviders. This means that modifiers still see a single series with the original data.",
                title: "JavaScript Chart with Multi-Style Series",
                pageTitle: "JavaScript Chart with Multi-Style Series",
                metaDescription:
                    "Demonstrates how to apply multiple different styles to a single series using RenderDataTransform",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to use multiple styles on a single series on **React, Charts** using SciChart.js, High Performance JavaScript Charts. This uses a RenderDataTransform to split the data so that we can draw the selected points using additional customised drawingProviders. This means that modifiers still see a single series with the original data.",
                title: "React Chart with Multi-Style Series",
                pageTitle: "React Chart with Multi-Style Series",
                metaDescription:
                    "Demonstrates how to apply multiple different styles to a single series using RenderDataTransform",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to use multiple styles on a single series on **Angular, Charts** using SciChart.js, High Performance JavaScript Charts. This uses a RenderDataTransform to split the data so that we can draw the selected points using additional customised drawingProviders. This means that modifiers still see a single series with the original data.",
                title: "Angular Chart with Multi-Style Series",
                pageTitle: "Angular Chart with Multi-Style Series",
                metaDescription:
                    "Demonstrates how to apply multiple different styles to a single series using RenderDataTransform",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20PaletteProvider%20API.html",
                title: "The PaletteProvider API documentation",
                linkTitle: "SciChart.js PaletteProvider documentation",
            },
        ],
    };
//// End of computer generated metadata

export const multiplePointMarkersExampleInfo = createExampleInfo(metaData);
