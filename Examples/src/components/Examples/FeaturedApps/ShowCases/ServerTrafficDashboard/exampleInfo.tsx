import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";
import { EPageLayout } from "../../../../../helpers/types/types";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        id: "featuredApps_showCases_ServerTrafficDashboard",
        exampleId: "FeaturedAppsShowCasesServerTrafficDashboard",
        imagePath: "javascript-server-traffic-dashboard.jpg",
        description:
            "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
                title: "Server Traffic Dashboard",
                pageTitle: "Server Traffic Dashboard",
                metaDescription:
                    "This dashboard demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!",
                markdownContent: null,
            },
            react: {
                subtitle:
                    "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
                title: "Server Traffic Dashboard",
                pageTitle: "Server Traffic Dashboard",
                metaDescription:
                    "This dashboard demo showcases the incredible realtime performance of our React charts by updating the series with millions of data-points!",
                markdownContent: null,
            },
            angular: {
                subtitle:
                    "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
                title: "Server Traffic Dashboard",
                pageTitle: "Server Traffic Dashboard",
                metaDescription:
                    "This dashboard demo showcases the incredible realtime performance of our Angular charts by updating the series with millions of data-points!",
                markdownContent: null,
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "server-traffic-dashboard",
        metaKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/ShowCases/ServerTrafficDashboard",
        thumbnailImage: "javascript-server-traffic-dashboard.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: EPageLayout.MaxWidth,
        extraDependencies: {
            "country-flag-icons": "^1.5.7",
        },
    };
//// End of computer generated metadata

export const serverTrafficDashboardDemoExampleInfo = createExampleInfo(metaData);
