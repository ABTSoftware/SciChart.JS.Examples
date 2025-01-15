import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "bandChart",
        imagePath: "javascript-band-chart.jpg",
        title: "Band Chart",
        description: "This chart type fills a polygon between two high and low lines...",
        path: "band-chart",
        metaKeywords: "band, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/BandSeriesChart",
        tips: ["Great for rendering confidence intervals, error margins or Bollinger Bands!"],
        thumbnailImage: "/javascript-band-chart.jpg",
        frameworks: {
            react: {
                component: "BandChartComponent",
                subtitle:
                    "Demonstrates how to create a **React Band Chart** or High-Low Fill using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React Band Chart",
                pageTitle: "React Band Chart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React Band Chart or High-Low Fill with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "BandChartComponent",
                subtitle:
                    "Demonstrates how to create an **Angular Band Chart** or High-Low Fill using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular Band Chart",
                pageTitle: "Angular Band Chart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular Band Chart or High-Low Fill with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "BandChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript Band Chart** or High-Low Fill using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript Band Chart",
                pageTitle: "JavaScript Band Chart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript Band Chart or High-Low Fill with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Band%20Series%20type.html",
                title: "The specific page for the JavaScript Digital Line Chart documentation will help you to get started",
                linkTitle: "JavaScript Band Chart Documentation",
            },
        ],
    };
//// End of computer generated metadata

export const bandSeriesChartExampleInfo = createExampleInfo(metaData);
