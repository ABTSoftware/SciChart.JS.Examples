import { TExampleInfo } from "../../../../AppRouter/examplePages";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-central-axes.jpg";

const description = `Demonstrates a chart with a static X Axis
SciChart supports customization of Axis static behavior by setting the isStaticAxis property to true.`

const documentationLinks: TDocumentationLink[] = [
    {   
        href: ExampleStrings.urlStaticAxisDocumentation,
        title: ExampleStrings.urlTitleStaticAxisDocumentation,
        linkTitle: "Static Axis",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create a <strong>{frameworkName} Chart with static X Axis</strong>.
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const staticAxisExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleStaticAxis,
    pageTitle: ExampleStrings.titleStaticAxis,
    path: ExampleStrings.urlStaticAxis,
    filepath: "Charts2D/ModifyAxisBehavior/StaticAxis",
    subtitle: Subtitle,
    documentationLinks,
    description,
    metaDescription: (frameworkName: string) =>
        `Demonstrates isStaticAxis on a ${frameworkName} Chart using SciChart.js.`,
    metaKeywords: "multiple, axis, static, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
