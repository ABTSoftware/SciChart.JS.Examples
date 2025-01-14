import { IExampleMetadata } from "../../../IExampleMetadata";

export const metaData: IExampleMetadata =
    //// this file is generated, do not edit it!  JSON DATA >>>>>

    {
        exampleId: "eventmarkers",
        imagePath: "./javascript-draggable-event-markers.jpg",
        title: "eventMarkers",
        description: "Demonstrates how to repurpose a Candlestick Series into dragabble, labled, event markers",
        path: "eventmarkers",
        metaKeywords: "events, drag, edit, datalabels, , layout, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/ShowCases/EventMarkers",
        tips: [
            "Take control of the candle width by overriding series.getDataPointWidth",
            "FastCandleStickRenderableSeries needs to be given a properly configured DataLabelProvider in order to show labels",
            "DataPointSelectionPaletteProvider takes care of coloring the selected point, even when you are setting isSelected on the metaData manually",
        ],
        thumbnailImage: 'getExampleImage("javascript-draggable-event-markers.jpg")',
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React eventMarkers** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React eventMarkers",
                pageTitle: "React eventMarkers | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React eventMarkers with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular eventMarkers** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular eventMarkers",
                pageTitle: "Angular eventMarkers | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular eventMarkers with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript eventMarkers** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript eventMarkers",
                pageTitle: "JavaScript eventMarkers | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript eventMarkers with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
    };
