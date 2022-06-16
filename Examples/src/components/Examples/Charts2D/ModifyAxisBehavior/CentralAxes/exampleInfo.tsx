import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Demonstrates a chart with axes being placed centrally.
SciChart supports customization of axes placement. This example shows how to use inner axes and set a layout strategy.`;
const tips = [`You can create a custom Axis Layout Strategy!`];

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
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgSecondaryYAxis,
                title: ExampleStrings.titleSecondaryYAxis,
                seoTitle: ExampleStrings.urlTitleSecondaryYAxis,
                examplePath: ExampleStrings.urlSecondaryYAxis
            },
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Chart with central axes</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const centralAxesExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleCentralAxes,
    pageTitle: ExampleStrings.titleCentralAxes + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlCentralAxes,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Demonstrates Central Axes on a JavaScript Chart using SciChart.js. SciChart supports unlimited left, right, top, bottom X, Y axis with configurable layout",
    metaKeywords: "multiple, axis, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-central-axes.png"
};
