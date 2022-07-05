import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Demonstrates how to create a JavaScript Stacked Column Chart with side-by-side grouping. This mode of
Stacked Column Charts groups the columns next to each other, allowing for easy comparison of several
datasets.`;
const tips = [
    `To change the width of the column, set the dataPointWidth property from 0.0 to 1.0. This alters how much space the column takes up.`
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
        href: ExampleStrings.urlStackedColumnChartDocumentation,
        title: ExampleStrings.urlTitleStackedColumnChartDocumentation,
        linkTitle: "JavaScript Stacked Column Chart Documentation"
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
                imgPath: ExampleStrings.imgColumnChart,
                title: ExampleStrings.titleColumnChart,
                seoTitle: ExampleStrings.urlTitleColumnChart,
                examplePath: ExampleStrings.urlColumnChart
            },
            {
                imgPath: ExampleStrings.imgStackedColumnChart,
                title: ExampleStrings.titleStackedColumnChart,
                seoTitle: ExampleStrings.urlTitleStackedColumnChart,
                examplePath: ExampleStrings.urlStackedColumnChart
            },
            {
                imgPath: ExampleStrings.imgGroupedColumnChart,
                title: ExampleStrings.titleGroupedColumnChart,
                seoTitle: ExampleStrings.urlTitleGroupedColumnChart,
                examplePath: ExampleStrings.urlGroupedColumnChart
            },
            {
                imgPath: ExampleStrings.imgLineChart,
                title: ExampleStrings.titleLineChart,
                seoTitle: ExampleStrings.urlTitleLineChartDocumentation,
                examplePath: ExampleStrings.urlLineChart
            },
            {
                imgPath: ExampleStrings.imgDonutChart,
                title: ExampleStrings.titleDonutChart,
                seoTitle: ExampleStrings.urlTitleDonutChartDocumentation,
                examplePath: ExampleStrings.urlDonutChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        We have created a simple example that shows you how to create a{" "}
        <strong>JavaScript Stacked Column Chart Side-by-side</strong> using our{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Framework">
            JavaScript Chart Framework
        </a>.
    </p>
);

export const stackedColumnSideBySideExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleGroupedColumnChart,
    pageTitle: ExampleStrings.pageTitleGroupedColumnChart,
    path: ExampleStrings.urlGroupedColumnChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Design JavaScript Stacked Group Column Chart side-by-side using our 5-star rated JavaScript Chart Framework, SciChart.js. Get  your free demo now.",
    metaKeywords: "stacked, column, side-by-side, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-stacked-grouped-column-chart-side-by-side.png"
};
