import { IExampleMetadata } from "../../../IExampleMetadata";

export const metaData: IExampleMetadata =
    //// this file is generated, do not edit it!  JSON DATA >>>>>

    {
        exampleId: "customfilters",
        imagePath: "./javascript-custom-filters.jpg",
        title: "customFilters",
        description:
            "Simple Custom Filters are great if you just want to apply some function to each y value.  Just create an XyCustomFilter and set your function.\r\nIf you want to significantly reshape your data, create a class that extends XyFilterBase",
        path: "customfilters",
        metaKeywords: "real-time, filter, transform, updating, aggregation, custom, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/Filters/CustomFilters",
        tips: [
            '" There are CustomFilter and FitlerBase types for each of the series types (xy, xyy, xyz, ohlc)", " Complex custom filters do not have to output the same series type as they take as input.", " If your filter takes a parameter, use a setter to call filterAll when the parameter is updated",',
        ],
        thumbnailImage: 'getExampleImage("javascript-custom-filters.jpg")',
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React customFilters** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React customFilters",
                pageTitle: "React customFilters | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React customFilters with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular customFilters** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular customFilters",
                pageTitle: "Angular customFilters | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular customFilters with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript customFilters** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript customFilters",
                pageTitle: "JavaScript customFilters | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript customFilters with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "SciChart.js Custom Filters Documentation",
            },
        ],
    };
