import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "scatterchart",
        imagePath: "./javascript-scatter-chart.jpg",
        title: "scatterChart",
        description:
            "Each Scatter-chart point can have varying color using our PaletteProvider API. Varying sizes are also possible with the Bubble Chart type.",
        path: "scatterchart",
        metaKeywords: "scatter, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/ScatterChart",
        tips: [
            "Perhaps you wanted a scatter point with a line? If so, you can do this using the Line Series type and by setting the pointMarker property.",
        ],
        thumbnailImage: "javascript-scatter-chart.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React scatterChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React scatterChart",
                pageTitle: "React scatterChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React scatterChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular scatterChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular scatterChart",
                pageTitle: "Angular scatterChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular scatterChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript scatterChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript scatterChart",
                pageTitle: "JavaScript scatterChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript scatterChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "JavaScript Scatter Chart Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const scatterChartExampleInfo = createExampleInfo(metaData);
