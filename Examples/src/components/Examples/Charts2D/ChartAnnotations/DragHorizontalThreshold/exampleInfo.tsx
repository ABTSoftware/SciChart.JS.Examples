import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-drag-horizontal-threshold.jpg";

const previewDescription = `Drag Threshold demo shows how to add draggable vertical and horizontal thresholds to the chart and change chart series colour based on the threshold value.`;
const description = `The Drag Threshold demo shows how to add draggable vertical and horizontal thresholds to a JavaScript chart and change chart series colour based on the threshold value.`;
const tips = [
    ` All Annotations have an isEditable property. When true, the annotation can be dragged and resized. Chart colouring may be changed via a rule using the PaletteProvider API.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlAnnotationsDocumentation,
        title: ExampleStrings.urlTitleAnnotationsDocumentation,
        linkTitle: "Annotations API Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates interaction by dragging vertical and horizontal line thresholds. As the thresholds move, the chart
        colour updates.
    </p>
);

export const dragHorizontalThresholdExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleDragHorizontalThreshold,
    pageTitle: ExampleStrings.titleDragHorizontalThreshold,
    path: ExampleStrings.urlDragHorizontalThreshold,
    filepath: "Charts2D/ChartAnnotations/DragHorizontalThreshold",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates how to add draggable thresholds which change the series color in the chart in SciChart.js`,
    metaKeywords: "trade, markers, demo, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
