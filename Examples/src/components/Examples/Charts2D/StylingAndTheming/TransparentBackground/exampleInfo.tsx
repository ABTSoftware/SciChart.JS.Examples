import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-transparent-background.jpg";

const previewDescription = `Demonstrates how to set a background image by setting a transparent background to SciChart.js.`;
const description = `SciChart.js v2.x now supports transparent backgrounds in all browsers, and will show through the DOM element underneath the chart. In this example we use a background image to demonstrate how to create a stunning styled chart.`;
const tips = [
    `It's also possible to show DOM elements: Videos, Images, Gradient Backgrounds or an entire webpage behind charts!`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlTransparentBackgroundDocumentation,
        title: ExampleStrings.urlTitleTransparentBackgroundDocumentation,
        linkTitle: "Custom Theme documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create a <strong>Chart with Transparent Background</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const transparentBackgroundExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleTransparentBackground,
    pageTitle: ExampleStrings.titleTransparentBackground,
    path: ExampleStrings.urlTransparentBackground,
    filepath: "Charts2D/StylingAndTheming/TransparentBackground",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates how to create a ${frameworkName} Chart with background image using transparency in SciChart.js`,
    metaKeywords: "styling, transparent, background, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
