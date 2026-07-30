import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const description =
    "Shows one seeded OHLC data set toggled between no filter, Heikin-Ashi, Renko, and Point & Figure views.";

const vanillaMarkdown = `## Financial Data Filters

This example creates one SciChart surface and switches the visible series between source OHLC candles, Heikin-Ashi candles, Renko bricks, and Point & Figure marks. The source OHLC data is seeded so the chart is repeatable.`;

const reactMarkdown = `## Financial Data Filters

The React wrapper keeps the selected filter mode in state and forwards it to a chart API returned by \`drawExample\`. The filters are created once during chart initialization.`;

const angularMarkdown = `## Financial Data Filters

In Angular, bind the selected filter mode to template controls and call the same chart update function from click handlers. The seeded OHLC source and filter instances can live on the component class after chart initialization.`;

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "FinancialDataFilters",
        id: "chart2D_createStockCharts_FinancialDataFilters",
        imagePath: "javascript-candlestick-chart.jpg",
        description,
        tips: [],
        frameworks: {
            javascript: {
                subtitle: description,
                title: "Financial Data Filters",
                pageTitle: "Financial Data Filters",
                metaDescription: description,
                markdownContent: vanillaMarkdown,
            },
            react: {
                subtitle: description,
                title: "Financial Data Filters",
                pageTitle: "Financial Data Filters",
                metaDescription: description,
                markdownContent: reactMarkdown,
            },
            angular: {
                subtitle: description,
                title: "Financial Data Filters",
                pageTitle: "Financial Data Filters",
                metaDescription: description,
                markdownContent: angularMarkdown,
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v5/intro/",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "Scichart.js Documentation",
            },
        ],
        path: "financial-data-filters",
        metaKeywords: "financial, filters, heikin ashi, renko, point and figure, ohlc, candlestick",
        onWebsite: false,
        filepath: "Charts2D/CreateStockCharts/FinancialDataFilters",
        thumbnailImage: "javascript-candlestick-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "max-width",
        extraDependencies: {
            "scichart-financial-tools": "5.2.11",
        },
        isNew: true,
    };
//// End of computer generated metadata

export const financialDataFiltersExampleInfo = createExampleInfo(metaData);
export default financialDataFiltersExampleInfo;
