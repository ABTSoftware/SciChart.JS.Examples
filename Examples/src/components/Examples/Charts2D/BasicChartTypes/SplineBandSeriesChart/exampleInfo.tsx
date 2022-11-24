import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import exampleImage from "./javascript-spline-band-chart.jpg";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `Band Charts fill a polygon between two high and low lines. The colour of the polygon changes depending on which line Y1 or Y2 is higher.`;
const description = `This variation on Band charts uses Spline interpolation (smoothing). This JS chart type can be used to draw thresholds, a fill between two lines or areas of interest on a chart.`;
const tips = [
    `If you have data where Y1 is greater than Y2 always, you’ll get an envelope effect. Great for rendering
    confidence intervals, error margins or Bollinger Bands!`
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Spline Band Chart</strong> or High-Low Fill using SciChart.js,{" "}
        our High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Chart Software
        </a>
    </p>
);

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
        href: ExampleStrings.urlBandChartDocumentation,
        title: ExampleStrings.urlTitleBandChart,
        linkTitle: "JavaScript Line Band Documentation"
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
                imgPath: ExampleStrings.imgLineChart,
                title: ExampleStrings.titleLineChart,
                seoTitle: ExampleStrings.urlTitleLineChartDocumentation,
                examplePath: ExampleStrings.urlLineChart
            },
            {
                imgPath: ExampleStrings.imgGroupedColumnChart,
                title: ExampleStrings.titleGroupedColumnChart,
                seoTitle: ExampleStrings.urlTitleGroupedColumnChart,
                examplePath: ExampleStrings.urlGroupedColumnChart
            },
            {
                imgPath: ExampleStrings.imgDonutChart,
                title: ExampleStrings.titleDonutChart,
                seoTitle: ExampleStrings.urlTitleDonutChartDocumentation,
                examplePath: ExampleStrings.urlDonutChart
            },
            {
                imgPath: ExampleStrings.imgCandleStickChart,
                title: ExampleStrings.titleCandlestickChart,
                seoTitle: ExampleStrings.urlTitleCandlestickChart,
                examplePath: ExampleStrings.urlCandlestickChart
            },
            {
                imgPath: ExampleStrings.imgScatterChart,
                title: ExampleStrings.titleScatterChart,
                seoTitle: ExampleStrings.urlTitleScatterChart,
                examplePath: ExampleStrings.urlScatterChart
            }
        ]
    }
];

export const splineBandSeriesChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleSplineBandChart,
    pageTitle: ExampleStrings.pageTitleSplineBandChart,
    path: ExampleStrings.urlSplineBandChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "SciChart's JavaScript Spline Band Chart makes it easy to draw thresholds or fills between two lines on a chart. Get your free demo today.",
    metaKeywords: "band, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
