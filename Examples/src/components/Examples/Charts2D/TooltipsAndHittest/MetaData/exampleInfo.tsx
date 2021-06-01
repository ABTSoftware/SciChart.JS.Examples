import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `Demonstrates the Metadata API, which allows you to associate custom data to each point, 
which can be displayed using cursor or rollover modifiers, or used to drive a palletprovider.`;
const description = `The metadata holds a text value and the value of the previous data point, which is used by the pallet provider to color 
increasing and decreasing parts of the chart.`;
const tips = [
    `MetaData can be anything that implements IPointMetadata.  You do not have to assign metadata to every point.`
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
        href: ExampleStrings.urlHitTestDocumentation,
        title: ExampleStrings.urlTitleHitTestDocumentation,
        linkTitle: "Hit-Test API documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgHitTestApiChart,
                title: ExampleStrings.titleHitTestApi,
                seoTitle: ExampleStrings.titleHitTestApi,
                examplePath: ExampleStrings.urlHitTestApi
            },
            {
                imgPath: ExampleStrings.imgOhlcChart,
                title: ExampleStrings.titleOhlcChart,
                seoTitle: ExampleStrings.urlTitleOhlcChart,
                examplePath: ExampleStrings.urlOhlcChart
            },
            {
                imgPath: ExampleStrings.imgMultiPaneStockChart,
                title: ExampleStrings.titleMultiPaneStockChart,
                seoTitle: ExampleStrings.urlTitleMultiPaneStockChart,
                examplePath: ExampleStrings.urlMultiPaneStockChart
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
        Demonstrates how to add and use <strong>MetaData</strong> in a chart using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const metaDataExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleMetaData,
    path: ExampleStrings.urlMetaData,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates using MetaData in a JavaScript Chart - add custom data to points for display or to drive visual customisation",
    seoKeywords: "metaData, api, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-metaData.png"
};
