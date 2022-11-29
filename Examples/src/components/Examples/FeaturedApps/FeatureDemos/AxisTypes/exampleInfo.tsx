import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-axis-types.jpg";

const previewDescription = `Demonstrates The different axis types available in Scichart, and some of the options for configuring them`;
const description = ``;
const tips = [
    ``,
    ``
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
        href: ExampleStrings.urlTextLabelProviderDocumentation,
        title: ExampleStrings.urlTitleTextLabelProviderDocumentation,
        linkTitle: "Scichart.js TextlabelProvider Documentation"
    }
];

const Subtitle = () => (
    <p>
        Demonstrates the Numeric, Category, Date and Logarithmic axis types available SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const axisTypesExampleInfo: TExampleInfo = {
    title: "Axis Types",
    pageTitle: "Axis Types" + ExampleStrings.exampleGenericTitleSuffix,
    path: "/javascript-axis-types",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    code,
    githubUrl,
    metaDescription:
        "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
    metaKeywords: "text, axis, date, logarithmic, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
