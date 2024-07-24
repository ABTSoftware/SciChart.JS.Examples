import { TExampleInfo } from "../../../../AppRouter/examplePages";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-cursormodifier-crosshairs.jpg";

const previewDescription = `Demonstrates using the CursorModifier, part of the ChartModifier API, to add a cursor and tooltips which
tracks the mouse.`;
const description = `This can be used to add Tooltips to a JavaScript chart as well as draw cursors (crosshairs) and axis labels
values as the user moves the mouse.`;
const tips = [
    `The hitTest function accepts parameters to control the hit-test logic. See the documentation on Hit-Testing
    for more info!`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlCursorModifierDocumentation,
        title: ExampleStrings.urlTitleCursorModifierDocumentation,
        linkTitle: "CursorModifier documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create <strong>crosshairs on mouseover</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const usingCursorModifierTooltipsExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleCursorModifier,
    pageTitle: ExampleStrings.titleCursorModifier,
    path: ExampleStrings.urlCursorModifier,
    filepath: "Charts2D/TooltipsAndHittest/UsingCursorModifierTooltips",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates adding a Cursor (Crosshair) to a ${frameworkName} Chart with SciChart.js CursorModifier`,
    metaKeywords: "cursor, modifier, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
