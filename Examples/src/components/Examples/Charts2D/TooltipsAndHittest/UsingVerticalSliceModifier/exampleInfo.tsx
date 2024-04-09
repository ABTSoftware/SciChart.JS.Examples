import { TExampleInfo } from "../../../../AppRouter/examplePages";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-vertical-slice-modifier.jpg";

const previewDescription = `Demonstrates using the VerticalSliceModifier, part of the ChartModifier API, to add tooltips at fixed positions on time-series to the user.`;
const description = `Tooltips can be positioned absolutely, or by data value, and support dragging by the user.`;
const tips = [
    `The x1 property of the modifier.verticalLine is in pixels and can be used to synchronise the position of other annotations relative to the line`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlVerticalSliceModifierDocumentation,
        title: ExampleStrings.urlTitleVerticalSliceModifierDocumentation,
        linkTitle: "VerticalSliceModifier documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to use <strong>tooltips at fixed positions</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const usingVerticalSliceModifierExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleVerticalSliceModifier,
    pageTitle: ExampleStrings.titleVerticalSliceModifier,
    path: ExampleStrings.urlVerticalSliceModifier,
    filepath: "Charts2D/TooltipsAndHittest/VerticalSliceModifier",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates adding Tooltips at certain positions to a ${frameworkName} Chart with SciChart.js VerticalSliceModifier`,
    metaKeywords: "tooltips, modifier, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
