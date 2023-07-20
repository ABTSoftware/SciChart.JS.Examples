import * as React from "react";
import { TExampleInfo } from "../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../ExampleStrings";
const exampleImage = "javascript-chart-from-json.jpg";
import { TDocumentationLink } from "../../../../helpers/types/ExampleDescriptionTypes";

const Subtitle = () => (
    <p>
        Demonstrates how to use the Builder Api to create a <strong>Chart from JSON</strong> using SciChart.js.{" "}
        Adjust the JSON in the window below and the chart will re-build. Choose from pre-selected defaults to learn more about the Builder API.
    </p>
);

const previewDescription = `Charts can be built from pure data, and also serialized to json.`;
const description = `This example simply passes the json you specify into the chartBuilder.build2DChart method`;
const tips = [
    ` Call sciChartSurface.toJSON() to get definition object, rather than a string.`,
    ` See the documentation links for the types and options you can specify.`
];

const documentationLinks: TDocumentationLink[] = [{
    href: ExampleStrings.urlBuilderApiDocumentation,
    title: ExampleStrings.urlTitleBuilderApiDocumentation,
    linkTitle: "JavaScript Builder API Documentation"
}];

export const chartFromJSONExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleChartFromJSON,
    pageTitle: ExampleStrings.titleChartFromJSON + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlChartFromJSON,
    filepath: "BuilderApi/ChartFromJSON",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription:
        "Demonstrates how to create a JavaScript Chart from JSON using the builder API. ",
    metaKeywords: "json, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
