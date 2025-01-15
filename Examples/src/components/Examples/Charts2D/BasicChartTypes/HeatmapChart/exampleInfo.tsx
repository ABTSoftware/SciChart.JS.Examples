import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "heatmapchart",
        imagePath: "./javascript-heatmap-chart.jpg",
        title: "heatmapChart",
        description:
            "Our Heatmap is highly dynamic and enables display of Sonar, MRI/medical imagery, Spectrograms or Audio/Radio analysis in JavaScript.\r\n    The entire heatmap is represented by a 2D array and is color-mapped to a numeric value.\r\n    Massive heatmaps (1000x1000 or more) can be achieved in SciChart.js!",
        path: "heatmapchart",
        metaKeywords: "heatmap, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/HeatmapChart",
        tips: [],
        thumbnailImage: "javascript-heatmap-chart.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React heatmapChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React heatmapChart",
                pageTitle: "React heatmapChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React heatmapChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular heatmapChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular heatmapChart",
                pageTitle: "Angular heatmapChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular heatmapChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript heatmapChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript heatmapChart",
                pageTitle: "JavaScript heatmapChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript heatmapChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "JavaScript Heatmap Chart Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const heatmapChartExampleInfo = createExampleInfo(metaData);
