import * as React from "react";
import { TExampleInfo } from "../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../ExampleStrings";
import exampleImage from "./javascript-builder-full.jpg";
import { TDocumentationLink } from "../../../../helpers/types/ExampleDescriptionTypes";

const Subtitle = () => (
    <p>
        Demonstrates how to use the Builder Api to create a <strong>Fully Configured Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const previewDescription = `Demonstrates how to use the Builder Api to configure theme, axes, series, annotations and modifiers using a definition object. `;
const description = `The builder api is designed to make it easier to discover the types and options available in SciChart JS.`;
const tips = [
    `Axes, series, annotations and modifiers can all be a single definition object, or an array`,
    `The builder api supports all SciChart 2D features.`,
    `Use the new TextLabelProvider for easy configuration of text labels on a category axis`
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
        href: ExampleStrings.urlBuilderApiDocumentation,
        title: ExampleStrings.urlTitleBuilderApiDocumentation,
        linkTitle: "JavaScript Builder API Documentation"
    }
];

export const fullChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBuilderFullChart,
    pageTitle: ExampleStrings.titleBuilderFullChart + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlBuilderFullChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    code,
    githubUrl,
    metaDescription:
        "Demonstrates how to use the Builder Api to configure axes, series, annotations and modifiers using a definition object. " +
        "The builder api is designed to make it easier to discover the types and options available in SciChart JS.",
    metaKeywords: "definition, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
