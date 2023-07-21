import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-color-points-individually-with-paletteprovider.jpg";

const description = `Demonstrates how to use the PaletteProvider API to color lines, points and fills individually based on a
rule. Using this API you can color individual data-points of the following chart series: Line, Column,
Candlestick, Ohlc, Mountain, Scatter, Bubble and Band.`;
const tips = [`The PaletteProvider API is useful for showing thresholds or areas of interest!`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlPaletteProviderDocumentation,
        title: ExampleStrings.urlTitlePaletteProviderDocumentation,
        linkTitle: "SciChart.js PaletteProvider documentation"
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
    pageTitle: ExampleStrings.titlePaletteProvider + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlPaletteProvider,
    filepath: "Charts2D/StylingAndTheming/PerPointColoring",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription: "Demonstrates per-point coloring in JavaScript chart types with SciChart.js PaletteProvider API",
    metaKeywords: "palette, provider, api, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
