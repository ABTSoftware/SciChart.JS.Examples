import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-datapoint-selection.jpg";

const previewDescription = `Demonstrates the DataPointSelectionModifier, which provides a UI to select one or many data points,
and works with DataPointSelectionPaletteProvider to change the appearance of selected points`;
const description = `Click to select a single point.  Drag to select many points. CTRL + Click or Drag to Union. SHIFT + Click or Drag to subtract`;
const tips = [
    `Adding DataPointSelectionModifier will automatically create the metadata required to track selection, but it does not stop you using your own metadata.`,
    `You don't have to use DataPointSelectionPaletteProvider.  You can create your own and use the metadata.isSelected that is passed to the paletteProvider methods.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDataPointSelectionDocumentation,
        title: ExampleStrings.urlTitleDataPointSelectionDocumentation,
        linkTitle: "DataPointSelectionModifier documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to <strong>Select Data Points</strong> on a chart using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const dataPointSelectionExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleDataPointSelection,
    pageTitle: ExampleStrings.titleDataPointSelection,
    path: ExampleStrings.urlDataPointSelection,
    filepath: "Charts2D/TooltipsAndHittest/DatapointSelection",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates the DatapointSelectionModifier, which provides a UI to select one or many data points, and works with DataPointSelectionPaletteProvider to change the appearance of selected points`,
    metaKeywords: "datapoint, selection, api, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
