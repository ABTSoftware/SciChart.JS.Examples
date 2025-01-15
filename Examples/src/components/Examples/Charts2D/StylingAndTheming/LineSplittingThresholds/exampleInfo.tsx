import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\stylingandtheming\\linesplittingthresholds",
        imagePath: "./javascript-chart-line-splitting-thresholds.jpg",
        description: "",
        path: "line-splitting-thresholds",
        metaKeywords: "thresholds, coloring, chart, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "Charts2D/StylingAndTheming/LineSplittingThresholds",
        tips: ['""'],
        thumbnailImage: "javascript-chart-line-splitting-thresholds.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to split lines into multiple segments so they can be individually colored according to thresholds, using SciChart.js, High Performance JavaScript Charts. This uses a RenderDataTransform to calculate the intersections between the data and the thresholds and add additional points.",
                title: "JavaScript Chart with lines split by thresholds",
                pageTitle: "JavaScript Chart with lines split by thresholds",
                metaDescription:
                    "Demonstrates how to use a RenderDataTransform to split lines into multiple segments so they can be individually colored according to thresholds",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to split lines into multiple segments so they can be individually colored according to thresholds, using SciChart.js, High Performance JavaScript Charts. This uses a RenderDataTransform to calculate the intersections between the data and the thresholds and add additional points.",
                title: "React Chart with lines split by thresholds",
                pageTitle: "React Chart with lines split by thresholds",
                metaDescription:
                    "Demonstrates how to use a RenderDataTransform to split lines into multiple segments so they can be individually colored according to thresholds",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to split lines into multiple segments so they can be individually colored according to thresholds, using SciChart.js, High Performance JavaScript Charts. This uses a RenderDataTransform to calculate the intersections between the data and the thresholds and add additional points.",
                title: "Angular Chart with lines split by thresholds",
                pageTitle: "Angular Chart with lines split by thresholds",
                metaDescription:
                    "Demonstrates how to use a RenderDataTransform to split lines into multiple segments so they can be individually colored according to thresholds",
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

export const lineSplittingThresholdsExampleInfo = createExampleInfo(metaData);
