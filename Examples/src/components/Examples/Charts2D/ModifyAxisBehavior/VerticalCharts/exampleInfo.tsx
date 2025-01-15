import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "verticalcharts",
        imagePath: "./javascript-vertical-charts.jpg",
        title: "verticalCharts",
        description:
            "Demonstrates a vertical chart with XAxis on the Left and YAxis on the Top. SciChart.js supports unlimited X\r\nand Y axis and allows placement of any axis on the Left, Right, Top, Bottom of the chart.",
        path: "verticalcharts",
        metaKeywords: "vertical, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ModifyAxisBehavior/VerticalCharts",
        tips: [
            "The vertical chart, popular in Oil & Gas, Geo-surveying, is created by setting xAxis.axisAlignment =\r\nLeft, and yAxis.axisAlignment = top.",
            "Try dragging an axis or the chart to zoom and pan around. Double clicking the chart resets the zoom!",
        ],
        thumbnailImage: "javascript-vertical-charts.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React verticalCharts** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React verticalCharts",
                pageTitle: "React verticalCharts | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React verticalCharts with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular verticalCharts** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular verticalCharts",
                pageTitle: "Angular verticalCharts | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular verticalCharts with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript verticalCharts** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript verticalCharts",
                pageTitle: "JavaScript verticalCharts | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript verticalCharts with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
    };
//// End of computer generated metadata

export const verticalChartsExampleInfo = createExampleInfo(metaData);
