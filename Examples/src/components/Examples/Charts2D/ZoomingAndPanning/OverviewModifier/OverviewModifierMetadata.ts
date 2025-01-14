import { IExampleMetadata } from "../../../IExampleMetadata";

export const metaData: IExampleMetadata =
    //// this file is generated, do not edit it!  JSON DATA >>>>>
    {
        exampleId: "overview",
        imagePath: "./javascript-overview-chart.jpg",
        title: "overview",
        description:
            "Drag the box to pan the main chart, and drag the handles of the box to resize it and zoom the main chart.\r\nRight click and drag on the main chart to zoom.",
        path: "overview",
        metaKeywords: "drag, axis, scale, overview, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ZoomingAndPanning/OverviewModifier",
        tips: [
            "The overview is a normal sciChartSurface so you can add annotations to it, or customise it any way you want.",
            "You can easily customise which series appear in the overview, and how they are rendered, with the transformRenderableSeries option.",
            "You can also apply the overview to vertical charts.",
        ],
        thumbnailImage: "javascript-overview-chart.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React overview** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React overview",
                pageTitle: "React overview | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React overview with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular overview** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular overview",
                pageTitle: "Angular overview | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular overview with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript overview** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript overview",
                pageTitle: "JavaScript overview | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript overview with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "SciChart.js Overview Documentation",
            },
        ],
    };
