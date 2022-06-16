import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `Demonstrates how to add a Legend to a JavaScript Line Chart using SciChart.js. The legend is created when
you add a LegendModifier type to the sciChartSurface.chartModifiers collection.`;
const description = `Legends may be placed in the top left, top right, bottom left and bottom right of the chart, and can be
oriented horizontally or vertically. Each legend item takes its text from the dataSeriesName property`;
const tips = [
    `There are many different configurations for the legend, including fine grained control over the legend rows.
    Please review the API documentation below carefully for further information.`
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    },
    {
        href: ExampleStrings.urlTutorialsHome,
        title: ExampleStrings.titleTutorialsHome,
        linkTitle: "SciChart.js Tutorials"
    },
    {
        href: ExampleStrings.urlLegendDocumentation,
        title: ExampleStrings.urlTitleLegendDocumentation,
        linkTitle: "Legend API Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgRealtimeTickingStockCharts,
                title: ExampleStrings.titleRealtimeTickingStockCharts,
                seoTitle: ExampleStrings.urlTitleRealtimeTickingStockCharts,
                examplePath: ExampleStrings.urlRealtimeTickingStockCharts
            },
            {
                imgPath: ExampleStrings.imgOhlcChart,
                title: ExampleStrings.titleOhlcChart,
                seoTitle: ExampleStrings.urlTitleOhlcChart,
                examplePath: ExampleStrings.urlOhlcChart
            },
            {
                imgPath: ExampleStrings.imgCandleStickChart,
                title: ExampleStrings.titleCandlestickChart,
                seoTitle: ExampleStrings.urlTitleCandlestickChart,
                examplePath: ExampleStrings.urlCandlestickChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to add a legend to a <strong>JavaScript Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const chartLegendsAPIExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleChartLegends,
    pageTitle: ExampleStrings.titleChartLegends + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlChartLegends,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Demonstrates how to add a Legends to a JavaScript Line Chart using SciChart.js. The legend is created when you add " +
        "a LegendModifier type to the sciChartSurface.chartModifiers collection.",
    metaKeywords: "legend, api, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-legends.jpg"
};
