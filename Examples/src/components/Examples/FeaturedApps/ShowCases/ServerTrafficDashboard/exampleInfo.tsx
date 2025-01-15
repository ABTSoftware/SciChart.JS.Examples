import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "servertrafficdashboarddemo",
        imagePath: "./javascript-server-traffic-dashboard.jpg",
        title: "serverTrafficDashboardDemo",
        description:
            "SciChart can handle realtime data, and lots of it!.  Pick a chart type and use the sliders to adjust the data volume and see how SciChart is able to keep up.\r\nData is streamed from the server via websocket and buffered locally so it keeps up with the data even if the render time is more than the update interval.\r\nStop the updates then zoom with the mousewheel to see all the data is really there.",
        path: "servertrafficdashboarddemo",
        metaKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/ShowCases/ServerTrafficDashboard",
        tips: [
            "For the fastest possible way of creating and appending data to a SciChartSurface, use the overloaded appendRange functions on dataseries.",
        ],
        thumbnailImage: "javascript-server-traffic-dashboard.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React serverTrafficDashboardDemo** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React serverTrafficDashboardDemo",
                pageTitle: "React serverTrafficDashboardDemo | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React serverTrafficDashboardDemo with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular serverTrafficDashboardDemo** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular serverTrafficDashboardDemo",
                pageTitle: "Angular serverTrafficDashboardDemo | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular serverTrafficDashboardDemo with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript serverTrafficDashboardDemo** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript serverTrafficDashboardDemo",
                pageTitle: "JavaScript serverTrafficDashboardDemo | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript serverTrafficDashboardDemo with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
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
//// End of computer generated metadata

export const serverTrafficDashboardDemoExampleInfo = createExampleInfo(metaData);
