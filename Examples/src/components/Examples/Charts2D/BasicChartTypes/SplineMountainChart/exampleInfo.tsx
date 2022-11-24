import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-spline-mountain-chart.jpg";

const previewDescription = `A mountain or area chart draws a polygon from a line to configurable zero value. This variation on Mountain Charts in SciChart.js uses Spline (smoothed) lines to achieve a nice visual effect!`;
const description = `This chart type features a spline or smoothed line which beautifies the datavizualization where there are
few points on the chart.`;
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
        href: ExampleStrings.urlMountainChartDocumentation,
        title: ExampleStrings.titleMountainChart,
        linkTitle: "JavaScript Mountain Chart Documentation"
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
        This example showcases how to create a <strong>JavaScript Spline Mountain Chart</strong> using{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="SciChart.js">
            SciChart.js
        </a>'{" "}
        feature-rich and High Performance JavaScript Charts.
    </p>
);

export const splineMountainChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleSplineMountainChart,
    pageTitle: ExampleStrings.pageTitleSplineMountainChart,
    path: ExampleStrings.urlSplineMountainChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "JavaScript Spline Mountain Chart design made easy. Use SciChart.js' JavaScript Charts for high performance, feature-rich designs. Get free demo now.",
    metaKeywords: "mountain, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
