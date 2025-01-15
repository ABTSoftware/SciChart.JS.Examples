import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\animations\\genericanimation",
        imagePath: "./javascript-generic-animation.jpg",
        description: "",
        path: "generic-animation",
        metaKeywords: "generic, animation, javascript",
        onWebsite: true,
        filepath: "Charts2D/Animations/GenericAnimation",
        tips: ['""'],
        thumbnailImage: "javascript-generic-animation.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to run **Generic Animation** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Generic Animation",
                pageTitle: "JavaScript Generic Animation",
                metaDescription: "Demonstrates how to run Generic Animation with JavaScript.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to run **Generic Animation** using SciChart.js, High Performance JavaScript Charts",
                title: "React Generic Animation",
                pageTitle: "React Generic Animation",
                metaDescription: "Demonstrates how to run Generic Animation with JavaScript.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to run **Generic Animation** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Generic Animation",
                pageTitle: "Angular Generic Animation",
                metaDescription: "Demonstrates how to run Generic Animation with JavaScript.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Generic%20Animations.html",
                title: "The specific page for the JavaScript Generic Animation documentation will help you to get started",
                linkTitle: "Generic Animation Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const genericAnimationExampleInfo = createExampleInfo(metaData);
