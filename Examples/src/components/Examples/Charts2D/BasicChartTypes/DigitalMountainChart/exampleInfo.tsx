import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `A mountain or area chart draws a polygon from a line to configurable zero value.
    This variation on Mountain Charts in SciChart.js uses the IsDigitalLine property to achieve a stepped-line visual effect!`;
const tips = [
    `By setting the stroke property you alter the line color, and fill alters the fill. The Mountain-series also
    supports semi-transparent and linear gradient brush fills and looks great!.`
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
        href: ExampleStrings.urlDigitalMountainChartDocumentation,
        title: ExampleStrings.titleDigitalMountainChart,
        linkTitle: "JavaScript Digital Mountain Chart Documentation"
    },
    {
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgStackedMountainChart,
                title: ExampleStrings.titleStackedMountainChart,
                seoTitle: ExampleStrings.urlTitleStackedMountainChart,
                examplePath: ExampleStrings.urlStackedMountainChart
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
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        For Digital Mountain Charts, you can use this demonstration to see how to create a <strong>JavaScript Digital Mountain Chart</strong>{" "}
        using SciChart.js, and its powerful{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Library">
            JavaScript Chart Library
        </a>.
    </p>
);

export const digitalMountainChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDigitalMountainChart,
    pageTitle: ExampleStrings.pageTitleDigitalMountainChart,
    path: ExampleStrings.urlDigitalMountainChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Create JavaScript Digital Mountain Chart with a stepped-line visual effect. Get your free trial of SciChart's 5-star rated JavaScript Chart Component now.",
    metaKeywords: "digital, mountain, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-digital-mountain-chart.jpg"
};
