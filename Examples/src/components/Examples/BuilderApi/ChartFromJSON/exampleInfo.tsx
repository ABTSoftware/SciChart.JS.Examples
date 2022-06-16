import * as React from "react";
import { TExampleInfo } from "../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../ExampleStrings";
import { GalleryItem } from "../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../helpers/types/ExampleDescriptionTypes";

const Subtitle = () => (
    <p>
        Demonstrates how to use the Builder Api to create a <strong>Chart from JSON</strong>
         using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const previewDescription = `Charts can be built from pure data, and also serialized to json.`;
const description = `This example simply passes the json you specify into the chartBuilder.build2DChart method`;
const tips = [
    ` Call sciChartSurface.toJSON() to get definition object, rather than a string.`,
    ` See the documentation links for the types and options you can specify.`
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
    },
    {
        href: ExampleStrings.urlDefinitionDocumentation,
        title: ExampleStrings.urlTitleDefinitionDocumentation,
        linkTitle: "ISciChart2DDefinition Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgBuilderSimpleChart,
                title: ExampleStrings.titleBuilderSimpleChart,
                seoTitle: ExampleStrings.titleBuilderSimpleChart,
                examplePath: ExampleStrings.urlBuilderSimpleChart
            },
            {
                imgPath: ExampleStrings.imgBuilderFullChart,
                title: ExampleStrings.titleBuilderFullChart,
                seoTitle: ExampleStrings.titleBuilderFullChart,
                examplePath: ExampleStrings.urlBuilderFullChart
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

export const chartFromJSONExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleChartFromJSON,
    pageTitle: ExampleStrings.titleChartFromJSON + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlChartFromJSON,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Demonstrates how to create a JavaScript Chart from JSON using the builder API. ",
    metaKeywords: "json, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-from-json.jpg"
};
