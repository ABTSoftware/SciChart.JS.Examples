import { IExampleMetadata } from "../../../IExampleMetadata";

export const metaData: IExampleMetadata =
    //// this file is generated, do not edit it!  JSON DATA >>>>>

    {
        exampleId: "contourchart",
        imagePath: "./javascript-heatmap-chart-with-contours.jpg",
        title: "contourChart",
        description:
            "Our Heatmap is highly dynamic and enables display of Sonar, MRI/medical imagery, Spectrograms or Audio/Radio analysis in JavaScript.\r\n    The entire heatmap is represented by a 2D array and is color-mapped to a numeric value.\r\n    Contour lines are calculated at a specified step value and drawn over the chart automatically.",
        path: "contourchart",
        metaKeywords: "contour, contours, heatmap, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/ContoursChart",
        tips: [
            "Contours are calculated using GPU Shader programs so are very fast, but require some tweaking of properties\r\non UniformContoursRenderableSeries to get a good visual.",
        ],
        thumbnailImage: 'getExampleImage("javascript-heatmap-chart-with-contours.jpg")',
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React contourChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React contourChart",
                pageTitle: "React contourChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React contourChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular contourChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular contourChart",
                pageTitle: "Angular contourChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular contourChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript contourChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript contourChart",
                pageTitle: "JavaScript contourChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript contourChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "JavaScript Contours Chart Documentation",
            },
        ],
    };
