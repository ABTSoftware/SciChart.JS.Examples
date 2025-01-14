import { IExampleMetadata } from "../../../IExampleMetadata";

export const metaData: IExampleMetadata =
    //// this file is generated, do not edit it!  JSON DATA >>>>>

    {
        exampleId: "datapointselection",
        imagePath: "./javascript-datapoint-selection.jpg",
        title: "dataPointSelection",
        description:
            "Click to select a single point.  Drag to select many points. CTRL + Click or Drag to Union. SHIFT + Click or Drag to subtract",
        path: "datapointselection",
        metaKeywords: "datapoint, selection, api, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/TooltipsAndHittest/DatapointSelection",
        tips: [
            "Adding DataPointSelectionModifier will automatically create the metadata required to track selection, but it does not stop you using your own metadata.",
            "You don't have to use DataPointSelectionPaletteProvider.  You can create your own and use the metadata.isSelected that is passed to the paletteProvider methods.",
        ],
        thumbnailImage: 'getExampleImage("javascript-datapoint-selection.jpg")',
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React dataPointSelection** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React dataPointSelection",
                pageTitle: "React dataPointSelection | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React dataPointSelection with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular dataPointSelection** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular dataPointSelection",
                pageTitle: "Angular dataPointSelection | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular dataPointSelection with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript dataPointSelection** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript dataPointSelection",
                pageTitle: "JavaScript dataPointSelection | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript dataPointSelection with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "DataPointSelectionModifier documentation",
            },
        ],
    };
