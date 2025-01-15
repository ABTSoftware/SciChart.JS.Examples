import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\basiccharttypes\\linechart",
        imagePath: "./javascript-line-chart.jpg",
        description: "",
        path: "line-chart",
        metaKeywords: "line, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/LineChart",
        tips: ['""'],
        thumbnailImage: "javascript-line-chart.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates all the permutations of JavaScript Line Chart using SciChart.js, including Digital Line chart, Tooltips, Dashed lines, Gradient lines, Hovering/selecting lines, vertical lines and paletted lines.",
                title: "JavaScript Line Chart",
                pageTitle: "JavaScript Line Chart | JavaScript Chart Examples | SciChart",
                metaDescription:
                    "Discover how to create a high performance JavaScript Line Chart with SciChart - the leading JavaScript library. Get your free demo now.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates all the permutations of JavaScript Line Chart using SciChart.js, including Digital Line chart, Tooltips, Dashed lines, Gradient lines, Hovering/selecting lines, vertical lines and paletted lines.",
                title: "React Line Chart",
                pageTitle: "React Line Chart | JavaScript Chart Examples | SciChart",
                metaDescription:
                    "Discover how to create a high performance React Line Chart with SciChart - the leading JavaScript library. Get your free demo now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates all the permutations of JavaScript Line Chart using SciChart.js, including Digital Line chart, Tooltips, Dashed lines, Gradient lines, Hovering/selecting lines, vertical lines and paletted lines.",
                title: "Angular Line Chart",
                pageTitle: "Angular Line Chart | JavaScript Chart Examples | SciChart",
                metaDescription:
                    "Discover how to create a high performance Angular Line Chart with SciChart - the leading JavaScript library. Get your free demo now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Line%20Series%20Type.html",
                title: "The specific page for the JavaScript Line Chart documentation will help you to get started",
                linkTitle: "JavaScript Line Chart Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const lineChartExampleInfo = createExampleInfo(metaData);
