import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\animations\\styleanimation",
        imagePath: "./javascript-style-animation.jpg",
        description: "",
        path: "style-animation",
        metaKeywords: "style, animation, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/Animations/StyleAnimation",
        tips: ['""'],
        thumbnailImage: "javascript-style-animation.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to run **Style Transition Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Style Animation",
                pageTitle: "JavaScript Style Animation",
                metaDescription: "Demonstrates how to run Style Transition Animations with JavaScript.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to run **Style Transition Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "React Style Animation",
                pageTitle: "React Style Animation",
                metaDescription: "Demonstrates how to run Style Transition Animations with JavaScript.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to run **Style Transition Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Style Animation",
                pageTitle: "Angular Style Animation",
                metaDescription: "Demonstrates how to run Style Transition Animations with JavaScript.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Series%20Style%20Animations.html",
                title: "The specific page for the JavaScript Style Transition Animation documentation will help you to get started",
                linkTitle: "JavaScript Style Transition Animation Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const styleAnimationExampleInfo = createExampleInfo(metaData);
