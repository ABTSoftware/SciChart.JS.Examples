import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import { GalleryItem } from "../../../../../helpers/types/types";

const description = `Demonstrates how to create a JavaScript Stacked Column Chart. An column or rectangle is rendered from the
Y-value of each stacked column series to the Y-value of the next.`;
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
        Demonstrates how to create a <strong>JavaScript Stacked Column Chart</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const stackedColumnChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleStackedColumnChart,
    path: ExampleStrings.urlStackedColumnChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a JavaScript Stacked Column Chart. Stacked Column series can be stacked 100%, grouped side by side or above and below.",
    seoKeywords: "stacked, column, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-stacked-column-chart.png"
};
