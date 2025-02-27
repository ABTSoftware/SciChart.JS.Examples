import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "VirtualizedDataOverview",
        id: "chart2D_zoomAndPanAChart_VirtualizedDataOverview",
        exampleId: "Charts2DZoomingAndPanningVirtualizedDataWithOverview",
        imagePath: "virtualized-data-javascript-chart.jpg",
        description:
            "Whenever the visible range changes, the chart requests data from the server, which returns a reduced view of the dataset, in this case using a very simple `take every nth point` method. The overview is created manually because it does not share data with the main chart but has a reduced view of the entire dataset.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Whenever the visible range changes, the chart requests data from the server, which returns a reduced view of the dataset, in this case using a very simple `take every nth point` method. The overview is created manually because it does not share data with the main chart but has a reduced view of the entire dataset.",
                title: "Virtualized JavaScript Charts: Load Data on Zoom/Pan",
                pageTitle: "Virtualized JavaScript Charts: Load Data on Zoom/Pan",
                metaDescription:
                    "shows how to load data on zoom/pan and how to create an overview chart for this case.",
                markdownContent: null,
            },
            react: {
                subtitle:
                    "Whenever the visible range changes, the chart requests data from the server, which returns a reduced view of the dataset, in this case using a very simple `take every nth point` method. The overview is created manually because it does not share data with the main chart but has a reduced view of the entire dataset.",
                title: "Virtualized React Charts: Load Data on Zoom/Pan",
                pageTitle: "Virtualized React Charts: Load Data on Zoom/Pan",
                metaDescription:
                    "shows how to load data on zoom/pan and how to create an overview chart for this case.",
                markdownContent: null,
            },
            angular: {
                subtitle:
                    "Whenever the visible range changes, the chart requests data from the server, which returns a reduced view of the dataset, in this case using a very simple `take every nth point` method. The overview is created manually because it does not share data with the main chart but has a reduced view of the entire dataset.",
                title: "Virtualized Angular Charts: Load Data on Zoom/Pan",
                pageTitle: "Virtualized Angular Charts: Load Data on Zoom/Pan",
                metaDescription:
                    "shows how to load data on zoom/pan and how to create an overview chart for this case.",
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
        path: "chart-with-virtualized-data",
        metaKeywords: "zoom, pan, virtualize, server, overview, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ZoomingAndPanning/VirtualizedDataWithOverview",
        thumbnailImage: "virtualized-data-javascript-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {
            rxjs: "^7.5.6",
        },
    };
//// End of computer generated metadata

export const virtualizedDataOverviewExampleInfo = createExampleInfo(metaData);
