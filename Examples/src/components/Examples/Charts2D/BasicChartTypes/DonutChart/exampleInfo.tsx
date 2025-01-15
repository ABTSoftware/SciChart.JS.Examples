import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\basiccharttypes\\donutchart",
        imagePath: "./javascript-donut-chart.jpg",
        description: "",
        path: "donut-chart",
        metaKeywords: "donut, chart, javascript, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/DonutChart",
        tips: ['""'],
        thumbnailImage: "javascript-donut-chart.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "This demo demonstrates how create a **JavaScript, Donut Chart** with our powerful JavaScript library, SciChart.js.",
                title: "JavaScript Donut Chart",
                pageTitle: "JavaScript Donut Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Create JavaScript Donut Chart with 5-star rated SciChart.js chart library. Supports legends, text labels, animated updates and more. Get free trial now.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "This demo demonstrates how create a **React, Donut Chart** with our powerful JavaScript library, SciChart.js.",
                title: "React Donut Chart",
                pageTitle: "React Donut Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Create React Donut Chart with 5-star rated SciChart.js chart library. Supports legends, text labels, animated updates and more. Get free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "This demo demonstrates how create a **Angular, Donut Chart** with our powerful JavaScript library, SciChart.js.",
                title: "Angular Donut Chart",
                pageTitle: "Angular Donut Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Create Angular Donut Chart with 5-star rated SciChart.js chart library. Supports legends, text labels, animated updates and more. Get free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Donut%20Chart%20Type.html",
                title: "Donut Chart",
                linkTitle: "JavaScript Donut Chart Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const donutChartExampleInfo = createExampleInfo(metaData);
