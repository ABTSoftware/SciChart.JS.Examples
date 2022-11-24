import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import { GalleryItem } from "../../../../../helpers/types/types";
import exampleImage from "./javascript-stacked-column-chart.jpg";

const description = `Stacked Column Charts can be created in JavaScript using SciChart.js. An column or rectangle is rendered from the
    Y-value of each stacked column series to the Y-value of the next.
    Each column can have a different color and you can stack to 100% using our library.`;
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
        The example on this page demonstrates how to create a <strong>JavaScript Stacked Column Chart</strong> using our{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Library">
            feature-rich JavaScript Chart Library
        </a>, SciChart.js.
    </p>
);

export const stackedColumnChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleStackedColumnChart,
    pageTitle: ExampleStrings.pageTitleStackedColumnChart,
    path: ExampleStrings.urlStackedColumnChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Discover how to create a JavaScript Stacked Column Chart using our feature-rich JavaScript Chart Library, SciChart.js. Get your free demo today!",
    metaKeywords: "stacked, column, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
