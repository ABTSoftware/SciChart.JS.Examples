import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\tooltipsandhittest\\seriesselection",
        imagePath: "./javascript-chart-series-selection.jpg",
        description: "",
        path: "chart-series-selection",
        metaKeywords: "hit, test, api, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/TooltipsAndHittest/SeriesSelection",
        tips: ['""'],
        thumbnailImage: "javascript-chart-series-selection.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to add **Series Selection** to a chart using SciChart.js, High Performance JavaScript Charts",
                title: "Using Series Selection",
                pageTitle: "Using Series Selection",
                metaDescription:
                    "Demonstrates Hit-Testing a JavaScript Chart - point and click on the chart and get feedback about what data-points were clicked",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to add **Series Selection** to a chart using SciChart.js, High Performance JavaScript Charts",
                title: "Using Series Selection",
                pageTitle: "Using Series Selection",
                metaDescription:
                    "Demonstrates Hit-Testing a React Chart - point and click on the chart and get feedback about what data-points were clicked",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to add **Series Selection** to a chart using SciChart.js, High Performance JavaScript Charts",
                title: "Using Series Selection",
                pageTitle: "Using Series Selection",
                metaDescription:
                    "Demonstrates Hit-Testing a Angular Chart - point and click on the chart and get feedback about what data-points were clicked",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#SeriesSelection.html",
                title: "SciChart.js Series Selection Documentation",
                linkTitle: "SciChart.js Series Selection Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const seriesSelectionExampleInfo = createExampleInfo(metaData);
