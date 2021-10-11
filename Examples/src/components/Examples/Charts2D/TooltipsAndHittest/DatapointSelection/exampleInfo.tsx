import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `Demonstrates the DataPointSelectionModifier, which provides a UI to select one or many data points, 
and works with DataPointSelectionPaletteProvider to change the appearance of selected points`;
const description = `Click to select a single point.  Drag to select many points. CTRL + Click or Drag to Union. SHIFT + Click or Drag to subtract`;
const tips = [
    `Adding DataPointSelectionModifier will automatically create the metadata required to track selection, but it does not stop you using your own metadata.`,
    `You don't have to use DataPointSelectionPaletteProvider.  You can create your own and use the metadata.isSelected that is passed to the paletteProvider methods.`
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
        href: ExampleStrings.urlDataPointSelectionDocumentation,
        title: ExampleStrings.urlTitleDataPointSelectionDocumentation,
        linkTitle: "DataPointSelectionModifier documentation"
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
                imgPath: ExampleStrings.imgSeriesSelectionChart,
                title: ExampleStrings.titleSeriesSelection,
                seoTitle: ExampleStrings.titleSeriesSelection,
                examplePath: ExampleStrings.urlSeriesSelection
            },
            {
                imgPath: ExampleStrings.imgMetaDataChart,
                title: ExampleStrings.titleMetaData,
                seoTitle: ExampleStrings.titleMetaData,
                examplePath: ExampleStrings.urlMetaData
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
        Demonstrates how to <strong>Select Data Points</strong> on a chart using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const dataPointSelectionExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDataPointSelection,
    path: ExampleStrings.urlDataPointSelection,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates the DatapointSelectionModifier, which provides a UI to select one or many data points, and works with DataPointSelectionPaletteProvider to change the appearance of selected points",
    seoKeywords: "datapoint, selection, api, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-datapoint-selection.png"
};
