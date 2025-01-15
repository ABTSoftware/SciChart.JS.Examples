import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "featuredapps\\showcases\\populationpyramid",
        imagePath: "./javascript-population-pyramid.jpg",
        description: "",
        path: "population-pyramid",
        metaKeywords:
            "population, react, column, stacked, animation, labels, engineering, pyramid, europe, africa, javascript, chart, webgl, canvas",
        onWebsite: false,
        filepath: "FeaturedApps/ShowCases/PopulationPyramid",
        tips: ['""'],
        thumbnailImage: "javascript-population-pyramid.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Population Pyramid of Europe and Africa using SciChart.js High Performance JavaScript Charts. This also demonstrates the use of DataLabelLayoutManager to Modify the positions of data labels from different series to prevent overlap",
                title: "JavaScript Population Pyramid",
                pageTitle: "JavaScript Population Pyramid",
                metaDescription: "Population Pyramid of Europe and Africa",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Population Pyramid of Europe and Africa using SciChart.js High Performance JavaScript Charts. This also demonstrates the use of DataLabelLayoutManager to Modify the positions of data labels from different series to prevent overlap",
                title: "React Population Pyramid",
                pageTitle: "React Population Pyramid",
                metaDescription: "Population Pyramid of Europe and Africa",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Population Pyramid of Europe and Africa using SciChart.js High Performance JavaScript Charts. This also demonstrates the use of DataLabelLayoutManager to Modify the positions of data labels from different series to prevent overlap",
                title: "Angular Population Pyramid",
                pageTitle: "Angular Population Pyramid",
                metaDescription: "Population Pyramid of Europe and Africa",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
    };
//// End of computer generated metadata

export const populationPyramidExampleInfo = createExampleInfo(metaData);
