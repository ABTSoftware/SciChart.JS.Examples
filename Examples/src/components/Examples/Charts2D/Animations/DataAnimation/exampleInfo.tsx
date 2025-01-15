import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "charts2d\\animations\\dataanimation",
        imagePath: "./javascript-data-animation.jpg",
        description: "",
        path: "data-animation",
        metaKeywords: "data, dataset, animation, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/Animations/DataAnimation",
        tips: ['""'],
        thumbnailImage: "javascript-data-animation.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to run **Dataset Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Chart Data Animation",
                pageTitle: "JavaScript Chart Data Animation",
                metaDescription: "Demonstrates how to run Dataset Animations with JavaScript.",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to run **Dataset Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "React Chart Data Animation",
                pageTitle: "React Chart Data Animation",
                metaDescription: "Demonstrates how to run Dataset Animations with JavaScript.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to run **Dataset Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Chart Data Animation",
                pageTitle: "Angular Chart Data Animation",
                metaDescription: "Demonstrates how to run Dataset Animations with JavaScript.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Dataset%20Animations.html",
                title: "The specific page for the JavaScript Dataset Animation documentation will help you to get started",
                linkTitle: "JavaScript Data Animation Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const dataAnimationExampleInfo = createExampleInfo(metaData);
