import * as React from "react";
import { TExampleInfo } from "../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../ExampleStrings";
import { GalleryItem } from "../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../helpers/types/ExampleDescriptionTypes";

const Subtitle = () => (
    <p>
        Demonstrates how to use the Builder Api to create a <strong>Fully Configured Chart</strong>
         using SciChart.js, High Performance{" "}
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
        href: ExampleStrings.urlChartFromJSONDocumentation,
        title: ExampleStrings.urlTitleChartFromJSONDocumentation,
        linkTitle: "JavaScript Builder API Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgChartFromJSON,
                title: ExampleStrings.titleChartFromJSON,
                seoTitle: ExampleStrings.titleChartFromJSON,
                examplePath: ExampleStrings.urlChartFromJSON
            },
            {
                imgPath: ExampleStrings.imgCustomTypes,
                title: ExampleStrings.titleCustomTypes,
                seoTitle: ExampleStrings.titleCustomTypes,
                examplePath: ExampleStrings.urlCustomTypes
            },
            {
                imgPath: ExampleStrings.imgSharedData,
                title: ExampleStrings.titleSharedData,
                seoTitle: ExampleStrings.titleSharedData,
                examplePath: ExampleStrings.urlSharedData
            },
            {
                imgPath: ExampleStrings.imgBuilderSimpleChart,
                title: ExampleStrings.titleBuilderSimpleChart,
                seoTitle: ExampleStrings.titleBuilderSimpleChart,
                examplePath: ExampleStrings.urlBuilderSimpleChart
            }
        ]
    }
];

export const fullChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBuilderFullChart,
    path: ExampleStrings.urlBuilderFullChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to use the Builder Api to configure axes, series, annotations and modifiers using a definition object. " +
        "The builder api is designed to make it easier to discover the types and options available in SciChart JS.",
    seoKeywords: "definition, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-builder-full.jpg"
};
