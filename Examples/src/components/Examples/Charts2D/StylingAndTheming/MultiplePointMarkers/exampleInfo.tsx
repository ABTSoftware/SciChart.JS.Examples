import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-color-points-individually-with-paletteprovider.jpg";

const description = `Demonstrates how to apply multiple different point markers to a single series using RenderDataTransform`;
const tips = [``];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlPaletteProviderDocumentation,
        title: ExampleStrings.urlTitlePaletteProviderDocumentation,
        linkTitle: "SciChart.js PaletteProvider documentation"
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how create <strong>JavaScript Charts multiple pointmarkers</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const multiplePointMarkersExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: ExampleStrings.titleMultiplePointMarkers,
    pageTitle: ExampleStrings.titleMultiplePointMarkers + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlMultiplePointMarkers,
    filepath: "Charts2D/StylingAndTheming/MultiplePointMarkers",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription: "Demonstrates per-point coloring in JavaScript chart types with SciChart.js PaletteProvider API",
    metaKeywords: "palette, provider, api, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
