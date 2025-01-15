import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "multilinelabels",
        imagePath: "./javascript-multiline-labels.jpg",
        title: "multiLineLabels",
        description:
            "TextLabelProvider provides an easy way to map tick values to text.  It can also do word wrapping.  Rotation is now available on all LabelProviders.",
        path: "multilinelabels",
        metaKeywords: "text, axis, label, wrap, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/AxisLabelCustomization/MultiLineLabels",
        tips: [
            "If some labels are not appearing, it is probably because there is not enough space for them.  Sometimes adjusting the padding in the labelStyle can help.",
            "To see how padding affects label placement try setting sciChartSurface.debugRendering = true;",
        ],
        thumbnailImage: "javascript-multiline-labels.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React multiLineLabels** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React multiLineLabels",
                pageTitle: "React multiLineLabels | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React multiLineLabels with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular multiLineLabels** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular multiLineLabels",
                pageTitle: "Angular multiLineLabels | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular multiLineLabels with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript multiLineLabels** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript multiLineLabels",
                pageTitle: "JavaScript multiLineLabels | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript multiLineLabels with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "Scichart.js TextlabelProvider Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const multiLineLabelsExampleInfo = createExampleInfo(metaData);
