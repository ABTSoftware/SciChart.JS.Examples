import * as React from "react";
import { TExampleInfo } from "../../../AppRouter/examplePages";
import { ExampleStrings } from "../../ExampleStrings";
import exampleImage from "./javascript-shared-data.jpg";
import { TDocumentationLink } from "../../../../helpers/types/ExampleDescriptionTypes";

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to use the Builder Api to create <strong>Reusable Chart Templates</strong> using SciChart.js
        Builder API. Use this method when you want to create a template for a chart and add data later.
    </p>
);

const previewDescription = `The Builder Api offers a way to pass data to the chart that cleanly separates the data from the chart definition.`;
const description = `This allows data to be reused in the chart, but more importantly allows the data and the chart definition to be built separately and then combined with ease.`;
const tips = [
    ` To deserialize a definition before adding data, use JSON.parse(jsonString, chartBuilder.chartReviver)`,
    ` To convert a chart to a definition without data, use sciChartSurface.toJSON(true)`,
    ` Data will be serialized to the individual series if the resulting chart is serialized`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlBuilderApiDocumentation,
        title: ExampleStrings.urlTitleBuilderApiDocumentation,
        linkTitle: "JavaScript Builder API Documentation",
    },
];

export const sharedDataExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleSharedData,
    pageTitle: ExampleStrings.titleSharedData,
    path: ExampleStrings.urlSharedData,
    filepath: "BuilderApi/SharedData",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription:
        "Demonstrates how to use the Builder Api to create Reusable Chart Templates." +
        "Data can be easily integrated into a definition and shared between series",
    metaKeywords: "template, chart, javascript, data, reuse",
    thumbnailImage: exampleImage,
};
