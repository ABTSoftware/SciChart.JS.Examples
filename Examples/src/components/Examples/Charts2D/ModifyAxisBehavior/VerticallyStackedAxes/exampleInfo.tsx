import { TExampleInfo } from "../../../../AppRouter/examplePages";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-vertically-stacked-axes.jpg";

const description = `Stacked axes allow data to be drawn in different sections of the chart but still overlap.
Zoom vertically using the mouse wheel, or by dragging individual axes.  Right-click and drag to zoom horizontally.  Double click to Reset`;
const tips = [
    `Make sure data series and annotations are bound to the correct axis.`,
    `You can also Horizontally stack top and bottom axes`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlVerticallyStackedAxesDocumentation,
        title: ExampleStrings.urlTitleVerticallyStackedAxesDocumentation,
        linkTitle: "SciChart.js Stacked Axes Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Vertically-Stacked Axis in SciChart.js allows several traces with independent Y-axis to be placed on the same
        chart, stacking the Y-Axis and enabling an ECG/EEG-style trace. Great for neurological apps, medical apps,
        earthquake monitoring.
    </p>
);

export const verticallyStackedAxesExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleVerticallyStackedAxes,
    pageTitle: ExampleStrings.titleVerticallyStackedAxes,
    path: ExampleStrings.urlVerticallyStackedAxes,
    filepath: "Charts2D/ModifyAxisBehavior/VerticallyStackedAxes",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Demonstrates Vertically Stacked Axes on a ${frameworkName} Chart using SciChart.js, allowing data to overlap`,
    metaKeywords: "multiple, stacked, overlap, axis, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
