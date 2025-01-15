import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\basiccharttypes\\columnchart",
        imagePath: "./javascript-column-chart.jpg",
        description: "",
        path: "column-chart",
        metaKeywords: "column, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/ColumnChart",
        tips: ['""'],
        thumbnailImage: "javascript-column-chart.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Creates a **JavaScript, Column Chart** using SciChart.js, with the following features: DataLabels, Rounded corners, Gradient-palette fill, startup animations.",
                title: "JavaScript Column Chart",
                pageTitle: "JavaScript Column Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "JavaScript Column Chart demo by SciChart supports gradient fill and paletteproviders for more custom coloring options. Get your free demo now.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Creates a **React, Column Chart** using SciChart.js, with the following features: DataLabels, Rounded corners, Gradient-palette fill, startup animations.",
                title: "React Column Chart",
                pageTitle: "React Column Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "React Column Chart demo by SciChart supports gradient fill and paletteproviders for more custom coloring options. Get your free demo now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Creates a **Angular, Column Chart** using SciChart.js, with the following features: DataLabels, Rounded corners, Gradient-palette fill, startup animations.",
                title: "Angular Column Chart",
                pageTitle: "Angular Column Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Angular Column Chart demo by SciChart supports gradient fill and paletteproviders for more custom coloring options. Get your free demo now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Column Chart documentation will help you to get started",
                linkTitle: "JavaScript Column Chart Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const columnChartExampleInfo = createExampleInfo(metaData);
