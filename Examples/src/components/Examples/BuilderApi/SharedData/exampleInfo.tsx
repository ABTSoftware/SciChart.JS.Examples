import * as React from "react";
import { TExampleInfo } from "../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../ExampleStrings";
import { GalleryItem } from "../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../helpers/types/ExampleDescriptionTypes";

const Subtitle = () => (
    <p>
        Demonstrates how to use the Builder Api to create <strong>Reusable Chart Templates</strong>
         using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const previewDescription = `The Builder Api offers a way to pass data to the chart that cleanly separates the data from the chart definition.`;
const description = `This allows data to be reused in the chart, but more importantly allows the data and the chart definition to be built separately and then combined with ease.`;
const tips = [
    ` To deserialize a definition before adding data, use JSON.parse(jsonString, chartBuilder.chartReviver)`,
    ` To convert a chart to a definition without data, use sciChartSurface.toJSON(true)`,
    ` Data will be serialized to the individual series if the resulting chart is serialized`
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
                imgPath: ExampleStrings.imgCustomTypes,
                title: ExampleStrings.titleCustomTypes,
                seoTitle: ExampleStrings.titleCustomTypes,
                examplePath: ExampleStrings.urlCustomTypes
            },
            {
                imgPath: ExampleStrings.imgBuilderFullChart,
                title: ExampleStrings.titleBuilderFullChart,
                seoTitle: ExampleStrings.titleBuilderFullChart,
                examplePath: ExampleStrings.urlBuilderFullChart
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

export const sharedDataExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleSharedData,
    pageTitle: ExampleStrings.titleSharedData + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlSharedData,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Demonstrates how to use the Builder Api to create Reusable Chart Templates." +
        "Data can be easily integrated into a definition and shared between series",
    metaKeywords: "template, chart, javascript, data, reuse",
    thumbnailImage: "javascript-shared-data.jpg"
};
