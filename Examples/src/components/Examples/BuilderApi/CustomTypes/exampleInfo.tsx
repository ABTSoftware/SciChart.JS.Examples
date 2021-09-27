import * as React from "react";
import { TExampleInfo } from "../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../ExampleStrings";
import { GalleryItem } from "../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../helpers/types/ExampleDescriptionTypes";

const Subtitle = () => (
    <p>
        Demonstrates how to use the Builder Api with <strong>Custom Types</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const previewDescription = `Demonstrates how to make a custom PaletteProvider available for use with the Builder Api.`;
const description = `To use a custom type, you just need to register it using chartBuilder.registerType, with a name, and a function that will create an instance of your type.  
This example also shows how you can call methods within the builder api to get references to the objects being built, so you can update them later.`;
const tips = [
    ` Custom types can have options which will be passed to the registered function.`,
    ` Add a toJSON method to your custom type if you want it to be serialized`
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
                imgPath: ExampleStrings.imgBuilderFullChart,
                title: ExampleStrings.titleBuilderFullChart,
                seoTitle: ExampleStrings.titleBuilderFullChart,
                examplePath: ExampleStrings.urlBuilderFullChart
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

export const customTypesExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleCustomTypes,
    path: ExampleStrings.urlCustomTypes,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to make a custom type such as a PaletteProvider available for use with the Builder Api." +
        "You can call methods within the builder api to get references to the objects being built, so you can update them later.",
    seoKeywords: "custom, chart, javascript, builder, paletteprovider",
    thumbnailImage: "javascript-custom-types.jpg"
};
