export const metaData =
    //// this file is generated, do not edit it!  JSON DATA >>>>>
    {
        exampleId: "annotationlayers",
        imagePath: "./javascript-chart-annotation-layers.jpg",
        title: "annotationLayers",
        description:
            'The chart contains three types of annotations and a line series with data labels.\r\nIt demonstrates how they are stacked on each other depending on their type and "annotationLayer" option.',
        path: "annotationlayers",
        metaKeywords: "annotations, chart, api, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ChartAnnotations/AnnotationLayers",
        tips: [
            "There are specifics of rendering for each type: TextAnnotation, as well as CustomAnnotation are examples of SVG Annotations (derived from SvgAnnotationBase).",
            '"annotationLayer" property allows to control the placement an annotation relatively to Renderable Series and Grid Lines.',
            "SVG Annotations are rendered on an SVG Canvas. SciChart currently provides only two of them - foreground and background SVG layer elements (EAnnotationLayer.AboveChart, EAnnotationLayer.Background correspondingly).",
            "Other types of annotations, inherited from RenderContextAnnotationBase (e.g. BoxAnnotation, NativeTextAnnotation, LineAnnotation), are rendered natively with WebGl on the HTMLCanvas, which is placed between SVG ones.",
            "Relative placement between annotations of the same type are defined by their order within the collection.",
        ],
        thumbnailImage: 'getExampleImage("javascript-chart-annotation-layers.jpg")',
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React annotationLayers** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React annotationLayers",
                pageTitle: "React annotationLayers | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React annotationLayers with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular annotationLayers** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular annotationLayers",
                pageTitle: "Angular annotationLayers | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular annotationLayers with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript annotationLayers** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript annotationLayers",
                pageTitle: "JavaScript annotationLayers | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript annotationLayers with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "Annotations API Documentation",
            },
        ],
    };
