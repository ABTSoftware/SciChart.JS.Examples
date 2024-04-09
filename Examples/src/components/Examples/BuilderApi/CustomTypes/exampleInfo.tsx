import * as React from "react";
import { TExampleInfo } from "../../../AppRouter/examplePages";
import { ExampleStrings } from "../../ExampleStrings";
import exampleImage from "./javascript-custom-types.jpg";
import { TDocumentationLink } from "../../../../helpers/types/ExampleDescriptionTypes";

const Subtitle = (frameworkName: string) => (
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
    ` Add a toJSON method to your custom type if you want it to be serialized`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlBuilderApiDocumentation,
        title: ExampleStrings.urlTitleBuilderApiDocumentation,
        linkTitle: "JavaScript Builder API Documentation",
    },
];

export const customTypesExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleCustomTypes,
    pageTitle: ExampleStrings.titleCustomTypes,
    path: ExampleStrings.urlCustomTypes,
    filepath: "BuilderApi/CustomTypes",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription:
        "Demonstrates how to make a custom type such as a PaletteProvider available for use with the Builder Api." +
        "You can call methods within the builder api to get references to the objects being built, so you can update them later.",
    metaKeywords: "custom, chart, javascript, builder, paletteprovider",
    thumbnailImage: exampleImage,
};
