import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "digitalbandserieschart",
        imagePath: "./javascript-digital-band-chart.jpg",
        title: "digitalBandSeriesChart",
        description:
            "Band series (also known as High-Low fill or Poylgon Fill) can be used to draw thresholds, a fill between two lines or areas of interest on a chart.",
        path: "digitalbandserieschart",
        metaKeywords: "digital, band, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/DigitalBandSeriesChart",
        tips: [
            "If you have data where Y1 is greater than Y2 always, you’ll get an envelope effect. Great for rendering confidence intervals, error margins or Bollinger Bands!",
        ],
        thumbnailImage: "javascript-digital-band-chart.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React digitalBandSeriesChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React digitalBandSeriesChart",
                pageTitle: "React digitalBandSeriesChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React digitalBandSeriesChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular digitalBandSeriesChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular digitalBandSeriesChart",
                pageTitle: "Angular digitalBandSeriesChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular digitalBandSeriesChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript digitalBandSeriesChart** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript digitalBandSeriesChart",
                pageTitle: "JavaScript digitalBandSeriesChart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript digitalBandSeriesChart with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "JavaScript Digital Band Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const digitalBandSeriesChartExampleInfo = createExampleInfo(metaData);
