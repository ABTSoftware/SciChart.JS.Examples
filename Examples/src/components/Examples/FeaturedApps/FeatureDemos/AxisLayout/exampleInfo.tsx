import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "featuredapps\\featuredemos\\axislayout",
        imagePath: "./javascript-axis-layout.jpg",
        description: "",
        path: "chart-axis-layout-options",
        metaKeywords: "stacked, axis, layout, alignment, vertical, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "FeaturedApps/FeatureDemos/AxisLayout",
        tips: ['""'],
        thumbnailImage: "javascript-axis-layout.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "The same data is rendered many to show the Axis Layout options in SciChart.js. Charts support outer, inner, central and stacked axes, and use of axis alignment to create vertical charts. Series may be registered on specific X,Y axis pairs for infinite layout configuration.",
                title: "JavaScript Chart Axis Layout Options",
                pageTitle: "JavaScript Chart Axis Layout Options",
                metaDescription:
                    "Demonstrates outer, inner, central and stacked axes, and use of axis alignment to create vertical charts",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "The same data is rendered many to show the Axis Layout options in SciChart.js. Charts support outer, inner, central and stacked axes, and use of axis alignment to create vertical charts. Series may be registered on specific X,Y axis pairs for infinite layout configuration.",
                title: "React Chart Axis Layout Options",
                pageTitle: "React Chart Axis Layout Options",
                metaDescription:
                    "Demonstrates outer, inner, central and stacked axes, and use of axis alignment to create vertical charts",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "The same data is rendered many to show the Axis Layout options in SciChart.js. Charts support outer, inner, central and stacked axes, and use of axis alignment to create vertical charts. Series may be registered on specific X,Y axis pairs for infinite layout configuration.",
                title: "Angular Chart Axis Layout Options",
                pageTitle: "Angular Chart Axis Layout Options",
                metaDescription:
                    "Demonstrates outer, inner, central and stacked axes, and use of axis alignment to create vertical charts",
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

export const axisLayoutExampleInfo = createExampleInfo(metaData);
