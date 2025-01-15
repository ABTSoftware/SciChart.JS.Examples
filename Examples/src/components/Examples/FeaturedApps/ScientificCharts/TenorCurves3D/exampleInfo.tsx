import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "tenorcurves",
        imagePath: "./javascript-2d-3d-chart-tenor-curves-example.jpg",
        title: "tenorCurves",
        description:
            "Demonstrating the capability of SciChart.js to create a composite 2D &amp; 3D Chart application. An example\r\nlike this could be used to visualize Tenor curves in a financial setting, or other 2D/3D data combined on a\r\nsingle screen.",
        path: "tenorcurves",
        metaKeywords: "tenor, curves, 3d, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/ScientificCharts/TenorCurves3D",
        tips: [
            "This example uses a SurfaceMeshRenderable Series3D to render a 2-dimensional array as a heightmap. Line\r\ncharts are shown on the same example to show that 2D & 3D charts can be combined.",
            "You can also overlay contours if you use the SurfaceMeshRenderable Series3D and enable contours by setting the DrawMeshAs property.",
        ],
        thumbnailImage: "javascript-2d-3d-chart-tenor-curves-example.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React tenorCurves** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React tenorCurves",
                pageTitle: "React tenorCurves | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React tenorCurves with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular tenorCurves** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular tenorCurves",
                pageTitle: "Angular tenorCurves | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular tenorCurves with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript tenorCurves** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript tenorCurves",
                pageTitle: "JavaScript tenorCurves | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript tenorCurves with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "JavaScript 3D Surface Mesh Chart Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const tenorCurvesExampleInfo = createExampleInfo(metaData);
