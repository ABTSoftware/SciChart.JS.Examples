import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";

const description = `Demonstrates how to use the PaletteProvider API to color lines, points and fills individually based on a
rule. Using this API you can color individual data-points of the following chart series: Line, Column,
Candlestick, Ohlc, Mountain, Scatter, Bubble and Band.`;
const tips = [`The PaletteProvider API is useful for showing thresholds or areas of interest!`];

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
        href: ExampleStrings.urlLineChartDocumentation,
        title: ExampleStrings.urlTitleLineChartDocumentation,
        linkTitle: "JavaScript Line Chart Documentation"
    },
    {
        href: ExampleStrings.urlMountainChartDocumentation,
        title: ExampleStrings.urlTitleMountainChartDocumentation,
        linkTitle: "JavaScript Mountain Chart Documentation"
    },
    {
        href: ExampleStrings.urlScatterChartDocumentation,
        title: ExampleStrings.urlTitleScatterChartDocumentation,
        linkTitle: "JavaScript Scatter Chart Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgThemeManagerChart,
                title: ExampleStrings.titleThemeManager,
                seoTitle: ExampleStrings.urlTitleThemeManager,
                examplePath: ExampleStrings.urlThemeManager
            },
            {
                imgPath: ExampleStrings.imgScatterChart,
                title: ExampleStrings.titleScatterChart,
                seoTitle: ExampleStrings.urlTitleScatterChartDocumentation,
                examplePath: ExampleStrings.urlScatterChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how create <strong>JavaScript Charts with per-point coloring</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const perPointColoringExampleInfo: TExampleInfo = {
    title: ExampleStrings.titlePaletteProvider,
    path: ExampleStrings.urlPaletteProvider,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    seoDescription: "Demonstrates per-point coloring in JavaScript chart types with SciChart.js PaletteProvider API",
    seoKeywords: "palette, provider, api, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-color-points-individually-with-paletteprovider.jpg"
};
