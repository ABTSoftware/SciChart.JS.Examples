import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-metadata.jpg";

const previewDescription = `Demonstrates the Metadata API, which allows you to associate custom data to each point,
which can be displayed using cursor or rollover modifiers, or used to drive a palletprovider.`;
const description = `The metadata holds a text value and the value of the previous data point, which is used by the pallet provider to color
increasing and decreasing parts of the chart.`;
const tips = [
    `MetaData can be anything that implements IPointMetadata.  You do not have to assign metadata to every point.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlMetaDataDocumentation,
        title: ExampleStrings.urlTitleMetaDataDocumentation,
        linkTitle: "MetaData API documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to add and use <strong>MetaData</strong> in a chart using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const metaDataExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleMetaData,
    pageTitle: ExampleStrings.titleMetaData,
    path: ExampleStrings.urlMetaData,
    filepath: "Charts2D/TooltipsAndHittest/MetaData",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates using MetaData in a ${frameworkName} Chart - add custom data to points for display or to drive visual customisation`,
    metaKeywords: "metaData, api, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
