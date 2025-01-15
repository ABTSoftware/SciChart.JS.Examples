import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\chartannotations\\draghorizontalthreshold",
        imagePath: "./javascript-chart-drag-horizontal-threshold.jpg",
        description: "",
        path: "chart-drag-horizontal-threshold",
        metaKeywords: "trade, markers, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ChartAnnotations/DragHorizontalThreshold",
        tips: ['""'],
        thumbnailImage: "javascript-chart-drag-horizontal-threshold.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates interaction by dragging vertical and horizontal line thresholds on a mountain chart. As the thresholds move, the chart colour updates. The vertical mountain fill is done using a separate renderableSeries and a dataFilter which reshapes the data to draw only the portion above the threshold.",
                title: "JavaScript Mountain Chart Draggable Thresholds",
                pageTitle: "JavaScript Mountain Chart Draggable Thresholds",
                metaDescription:
                    "Demonstrates how to add draggable thresholds which change the series color in the chart in SciChart.js",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates interaction by dragging vertical and horizontal line thresholds on a mountain chart. As the thresholds move, the chart colour updates. The vertical mountain fill is done using a separate renderableSeries and a dataFilter which reshapes the data to draw only the portion above the threshold.",
                title: "React Mountain Chart Draggable Thresholds",
                pageTitle: "React Mountain Chart Draggable Thresholds",
                metaDescription:
                    "Demonstrates how to add draggable thresholds which change the series color in the chart in SciChart.js",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates interaction by dragging vertical and horizontal line thresholds on a mountain chart. As the thresholds move, the chart colour updates. The vertical mountain fill is done using a separate renderableSeries and a dataFilter which reshapes the data to draw only the portion above the threshold.",
                title: "Angular Mountain Chart Draggable Thresholds",
                pageTitle: "Angular Mountain Chart Draggable Thresholds",
                metaDescription:
                    "Demonstrates how to add draggable thresholds which change the series color in the chart in SciChart.js",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Annotations%20API%20Overview.html",
                title: "The specific page for the SciChart.js Annotations documentation will help you to get started",
                linkTitle: "Annotations API Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const dragHorizontalThresholdExampleInfo = createExampleInfo(metaData);
