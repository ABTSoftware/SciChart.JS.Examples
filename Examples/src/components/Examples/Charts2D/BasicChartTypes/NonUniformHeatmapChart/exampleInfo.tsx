import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-non-uniform-heatmap-chart.jpg";

const description = `Non-uniform heatmaps should be used if you want to specify independent sizes for heat cells.`;
const tips = [
    `To specify the sizes of the cells, use the xCellOffsets and yCellOffsets params.`,
    `It is possible to specify offsets as arrays or mapping functions.`,
    `Updating data with setZValues method recalcula tes the mapped offsets.`,
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
        href: ExampleStrings.urlNonUniformHeatmapChartDocumentation,
        title: ExampleStrings.urlTitleNonUniformHeatmapChartDocumentation,
        linkTitle: "JavaScript Non Uniform Heatmap Chart Documentation"
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
                imgPath: ExampleStrings.imgHeatMapChart,
                title: ExampleStrings.titleHeatmapChart,
                seoTitle: ExampleStrings.urlTitleHeatmapChart,
                examplePath: ExampleStrings.urlHeatmapChart
            },
            {
                imgPath: ExampleStrings.imgFanChart,
                title: ExampleStrings.titleFanChart,
                seoTitle: ExampleStrings.urlTitleFanChartDocumentation,
                examplePath: ExampleStrings.urlFanChart
            },
            {
                imgPath: ExampleStrings.imgGroupedColumnChart,
                title: ExampleStrings.titleGroupedColumnChart,
                seoTitle: ExampleStrings.urlTitleGroupedColumnChart,
                examplePath: ExampleStrings.urlGroupedColumnChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        This SciChart demo demonstrates how to create a <strong>JavaScript Non Uniform Heatmap Chart</strong> using{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="SciChart.js">
            SciChart.js
        </a>{" "}
        our High Performance JavaScript Chart component.
    </p>
);

export const nonUniformHeatmapExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleNonUniformHeatmapChart,
    pageTitle: ExampleStrings.pageTitleNonUniformHeatmapChart,
    path: ExampleStrings.urlNonUniformHeatmapChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Create JavaScript Non Uniform Chart using high performance SciChart.js. Display Heatmap with variable cell sizes. Get free demo now.",
    metaKeywords: "error, bars, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
