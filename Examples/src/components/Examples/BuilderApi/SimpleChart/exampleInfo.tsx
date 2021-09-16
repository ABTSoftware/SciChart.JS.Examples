import * as React from "react";
import { TExampleInfo } from "../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../ExampleStrings";
import { GalleryItem } from "../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../helpers/types/ExampleDescriptionTypes";

const Subtitle = () => (
    <p>
        Demonstrates how to use the Builder Api to create a <strong>Simple Chart</strong>
         using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const previewDescription = `With the builder api you can define a simple chart in just one line of code using a single object. `;
const description = `The builder api is designed to make it easier to discover the types and options available in SciChart JS.`;
const tips = [
    `Everything in the definition is optional. SciChart will add numeric axes by default.`,
    `The builder api supports all SciChart 2D features.`,
    `You can combine the builder api and normal api to utilize the strengths of each`
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
        ]
    }
];

export const simpleChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBuilderSimpleChart,
    path: ExampleStrings.urlBuilderSimpleChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to use the Builder Api to create a simple chart using a definition object. " +
        "The builder api is designed to make it easier to discover the types and options available in SciChart JS.",
    seoKeywords: "definition, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-builder-simple.jpg"
};
