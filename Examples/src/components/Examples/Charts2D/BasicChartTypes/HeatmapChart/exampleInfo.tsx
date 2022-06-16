import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Our Heatmap is highly dynamic and enables display of Sonar, MRI/medical imagery, Spectrograms or Audio/Radio analysis in JavaScript.
    The entire heatmap is represented by a 2D array and is color-mapped to a numeric value.
    Massive heatmaps (1000x1000 or more) can be achieved in SciChart.js!`;

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
        href: ExampleStrings.urlHeatmapChartDocumentation,
        title: ExampleStrings.urlTitleHeatmapChartDocumentation,
        linkTitle: "JavaScript Heatmap Chart Documentation"
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
                imgPath: ExampleStrings.imgContourChart,
                title: ExampleStrings.titleContourChart,
                seoTitle: ExampleStrings.urlTitleContourChartDocumentation,
                examplePath: ExampleStrings.urlContourChart
            },
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
        If you want to learn about heatmaps. this demo shows you how to create a <strong>JavaScript Heatmap Chart</strong>{" "}
        using SciChart.js, our 5-star rated{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Component">
            JavaScript Chart Component
        </a>.
    </p>
);

export const heatmapChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleHeatmapChart,
    pageTitle: ExampleStrings.pageTitleHeatmapChart,
    path: ExampleStrings.urlHeatmapChart,
    subtitle: Subtitle,
    documentationLinks,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Demonstrates how to create a Realtime JavaScript Heatmap Chart. The Heatmap series accepts a 2D array" +
        "of data and has user-defined color map which can be used to color points by value.",
    metaKeywords: "heatmap, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-heatmap-chart.jpg"
};
