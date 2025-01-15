import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "featuredapps\\featuredemos\\axistypes",
        imagePath: "./javascript-axis-types.jpg",
        description: "",
        path: "axis-types",
        metaKeywords: "text, axis, date, logarithmic, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/FeatureDemos/AxisTypes",
        tips: ['""'],
        thumbnailImage: "javascript-axis-types.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates the Numeric, Category, Date and Logarithmic axis types available SciChart.js, High Performance JavaScript Charts",
                title: "Axis Types",
                pageTitle: "Axis Types",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates the Numeric, Category, Date and Logarithmic axis types available SciChart.js, High Performance JavaScript Charts",
                title: "Axis Types",
                pageTitle: "Axis Types",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates the Numeric, Category, Date and Logarithmic axis types available SciChart.js, High Performance JavaScript Charts",
                title: "Axis Types",
                pageTitle: "Axis Types",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#StartHere-AxisOverview.html",
                title: "SciChart.js Axis Documentation",
                linkTitle: "Scichart.js Axis Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const axisTypesExampleInfo = createExampleInfo(metaData);
