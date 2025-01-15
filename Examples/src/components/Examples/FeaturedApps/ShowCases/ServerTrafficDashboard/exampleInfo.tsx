import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "featuredapps\\showcases\\servertrafficdashboard",
        imagePath: "./javascript-server-traffic-dashboard.jpg",
        title: "Server Traffic Dashboard",
        description: "",
        path: "server-traffic-dashboard",
        metaKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/ShowCases/ServerTrafficDashboard",
        tips: ['""'],
        thumbnailImage: "javascript-server-traffic-dashboard.jpg",
        frameworks: {
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
                title: "Server Traffic Dashboard",
                pageTitle: "Server Traffic Dashboard",
                metaDescription:
                    "This dashboard demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!",
                markdownContent: "",
            },
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
                title: "Server Traffic Dashboard",
                pageTitle: "Server Traffic Dashboard",
                metaDescription:
                    "This dashboard demo showcases the incredible realtime performance of our React charts by updating the series with millions of data-points!",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
                title: "Server Traffic Dashboard",
                pageTitle: "Server Traffic Dashboard",
                metaDescription:
                    "This dashboard demo showcases the incredible realtime performance of our Angular charts by updating the series with millions of data-points!",
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

export const serverTrafficDashboardDemoExampleInfo = createExampleInfo(metaData);
