import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
const exampleImage = "javascript-chart-styling-theming-in-code.jpg";

const previewDescription = `Using garish colors to demonstrate styling of a JavaScript chart, Axis, grid lines, tick lines and more.`;
const description = `Almost any element in SciChart is stylable in code and most parts of the chart are exposed. You can easily
set background, grid-line, axis label, viewport background and chart series colors in JavaScript.`;
const tips = [`It's also possible to style chart-parts in code!`];

const documentationLinks: TDocumentationLink[] = [{
    href: ExampleStrings.urlStylingInCodeDocumentation,
    title: ExampleStrings.urlTitleStylingInCodeDocumentation,
    linkTitle: "Custom Theme documentation"
}];

const Subtitle = () => (
    <p>
        Demonstrates how to <strong>style or theme a JavaScript Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const stylingInCodeExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleStylingInCode,
    pageTitle: ExampleStrings.titleStylingInCode + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlStylingInCode,
    filepath: "Charts2D/StylingAndTheming/StylingInCode",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription: "Demonstrates how to style a JavaScript Chart entirely in code with SciChart.js themeing API",
    metaKeywords: "styling, in, code, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
