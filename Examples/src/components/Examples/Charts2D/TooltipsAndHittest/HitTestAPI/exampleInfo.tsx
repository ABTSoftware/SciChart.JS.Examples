import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "hittestapi",
        imagePath: "./javascript-chart-hit-test-on-click.jpg",
        title: "hitTestApi",
        description:
            "Click anywhere on the chart to call BaseRenderableSeries.hitTestProvider. hitTest. The HitTest function\r\naccepts a mouse-point and returns the nearest data-point, plus its location in X,Y coordinate space.",
        path: "hittestapi",
        metaKeywords: "hit, test, api, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/TooltipsAndHittest/HitTestAPI",
        tips: [
            "The hitTest function accepts parameters to control the hit-test logic. See the documentation on Hit-Testing for more info!",
        ],
        thumbnailImage: "javascript-chart-hit-test-on-click.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React hitTestApi** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React hitTestApi",
                pageTitle: "React hitTestApi | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React hitTestApi with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular hitTestApi** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular hitTestApi",
                pageTitle: "Angular hitTestApi | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular hitTestApi with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript hitTestApi** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript hitTestApi",
                pageTitle: "JavaScript hitTestApi | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript hitTestApi with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "Hit-Test API documentation",
            },
        ],
    };
//// End of computer generated metadata

export const hitTestApiExampleInfo = createExampleInfo(metaData);
