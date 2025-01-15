import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\animations\\startupanimation",
        imagePath: "./javascript-startup-animations.jpg",
        description: "",
        path: "startup-animation",
        metaKeywords: "startup, on-start, animation, javascript",
        onWebsite: true,
        filepath: "Charts2D/Animations/StartupAnimation",
        tips: ['""'],
        thumbnailImage: "javascript-startup-animations.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to run **Startup Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Startup Animation",
                pageTitle: "JavaScript Startup Animation",
                metaDescription: "Demonstrates how to run Startup Animations with JavaScript.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to run **Startup Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "React Startup Animation",
                pageTitle: "React Startup Animation",
                metaDescription: "Demonstrates how to run Startup Animations with JavaScript.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to run **Startup Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Startup Animation",
                pageTitle: "Angular Startup Animation",
                metaDescription: "Demonstrates how to run Startup Animations with JavaScript.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Series%20Startup%20Animations.html",
                title: "The specific page for the JavaScript Startup Animation documentation will help you to get started",
                linkTitle: "JavaScript Startup Animation Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const startupAnimationExampleInfo = createExampleInfo(metaData);
