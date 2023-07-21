import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-dashed-line-chart.jpg";

const description = `Demonstrates the Line series, Mountain series and Band series StrokeDashArray property which can be used to
style a dashed line, dotted line or solid line.`;
const tips = [
    `The StrokeDashArray property accepts a number array e.g. [2,3] which defines the length of the dash and the
    length of the gap.`
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDashedLineStylingDocumentation,
        title: ExampleStrings.urlTitleDashedLineStylingDocumentation,
        linkTitle: "The Dashed Line Styling Documentation"
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how create <strong>JavaScript Charts with dashed lines</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const dashedLineStylingExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDashedLineStyling,
    pageTitle: ExampleStrings.titleDashedLineStyling + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlDashedLineStyling,
    filepath: "Charts2D/StylingAndTheming/DashedLineStyling",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription: "Demonstrates dashed line series in JavaScript charts with SciChart.js",
    metaKeywords: "dash, dashed, dotted, line, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
