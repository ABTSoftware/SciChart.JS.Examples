import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\axislabelcustomization\\multilinelabels",
        imagePath: "./javascript-multiline-labels.jpg",
        title: "Multi-line and Rotated Text labels",
        description: "",
        path: "multiline-labels",
        metaKeywords: "text, axis, label, wrap, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/AxisLabelCustomization/MultiLineLabels",
        tips: ['""'],
        thumbnailImage: "javascript-multiline-labels.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to use **Multi-Line Text** for axis labels using SciChart.js, High Performance JavaScript Charts",
                title: "Multi-line and Rotated Text labels",
                pageTitle: "Multi-line and Rotated Text labels",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to use **Multi-Line Text** for axis labels using SciChart.js, High Performance JavaScript Charts",
                title: "Multi-line and Rotated Text labels",
                pageTitle: "Multi-line and Rotated Text labels",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to use **Multi-Line Text** for axis labels using SciChart.js, High Performance JavaScript Charts",
                title: "Multi-line and Rotated Text labels",
                pageTitle: "Multi-line and Rotated Text labels",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#TextStringAxis.html",
                title: "This specific page in the JavaScript TextLabelProvider documentation will help you to get started",
                linkTitle: "Scichart.js TextlabelProvider Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const multiLineLabelsExampleInfo = createExampleInfo(metaData);
