import { IExampleMetadata } from "../../../IExampleMetadata";
import { createExampleInfo } from "../../../exampleInfoUtils";
import { metaData } from "./MultipleZoomPanModifiersMetadata";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import exampleImage from "./zoom-pan-multiple-modifiers.jpg";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Scroll Middle Mouse button to zoom in/zoom out. Use Right Mouse Button to select an area on the chart with RubberBandXyZoomModifier. Try it out on touch devices: use pinch zoom gesture to scale.`;
const tips = [
    `Use 'executeOn' property to assign a Modifier to specific mouse button. `,
    `Use 'easingFunction' property to animate zoom. `,
    `Use CSS 'touch-action' property to override browser default touch behavior. e.g., 'touch-action: none'. `,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlZoomPanModifierDocumentation,
        title: ExampleStrings.urlTitleZoomPanModifierDocumentation,
        linkTitle: "SciChart.js Zooming and Panning documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates different <strong>Zoom and Pan Modifiers on a {frameworkName} Chart</strong> including Mousewheel,
        Pinchzoom, Rubber-band zoom.
    </p>
);

const markdownContent: string = undefined;

export const oldzoomAndPanWithMultipleChartModifiersExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleZoomPanWithMultipleChartModifiers,
    pageTitle: ExampleStrings.titleZoomPanWithMultipleChartModifiers,
    path: ExampleStrings.urlZoomPanWithMultipleChartModifiers,
    filepath: "Charts2D/ZoomingAndPanning/MultipleZoomPanModifiers",
    subtitle: Subtitle,
    metaDescription: (frameworkName: string) =>
        `Demonstrates how to use multiple Zoom and Pan Modifiers on a ${frameworkName} Chart with SciChart.js`,
    metaKeywords: "zoom, pan, pinch, touch, scale, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
    markdownContent,
    documentationLinks,
};

// New implementation using centralized utility
export const zoomAndPanWithMultipleChartModifiersExampleInfo = createExampleInfo(metaData as IExampleMetadata);
