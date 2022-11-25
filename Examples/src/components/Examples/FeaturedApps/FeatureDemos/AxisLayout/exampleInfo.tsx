import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-axis-layout.jpg";

const previewDescription = `Demonstrates the different axis layouts available in Scichart and how they affect the series`;
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
        Demonstrates outer, inner, central and stacked axes, and use of axis alignment to create vertical charts using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const axisLayoutExampleInfo: TExampleInfo = {
    title: "Axis Layout",
    pageTitle: "Axis Layout" + ExampleStrings.exampleGenericTitleSuffix,
    path: "/javascript-axis-layout",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    code,
    githubUrl,
    metaDescription:
        "Demonstratesouter, inner, central and stacked axes, and use of axis alignment to create vertical charts",
    metaKeywords: "stacked, axis, layout, alignment, vertical, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
