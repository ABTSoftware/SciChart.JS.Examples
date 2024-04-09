import { TExampleInfo } from "../../../../AppRouter/examplePages";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./zoom-and-pan-a-realtime-javascript-chart.jpg";

const previewDescription = `This examples shows how to add zooming and panning behaviour to a realtime JavaScript Chart.`;
const description = `When you use AutoRanging in a SciChart.js chart, the chart will always automatically range to fit the data.
This means that zoom, pan modifiers will not work on the chart. In order to allow both behaviors, this
example demonstrates how to use the ZoomState property to determine when to zoom to fit, or when to allow
user zooming.`;
const tips = [
    `Check in the source-code for how we use the SciChartSurface.ZoomState property to determine when to scroll
and when to allow user-zooming.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlZoomPanModifierDocumentation,
        title: ExampleStrings.urlTitleZoomPanModifierDocumentation,
        linkTitle: "SciChart.js Zooming and Panning Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Zoom the real-time chart below by dragging on the surface. Right click and drag to pan. Then double-click to
        reset zoom and start automatically scrolling again.
    </p>
);

export const realtimeZoomPanExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleRealtimeZoomPan,
    pageTitle: ExampleStrings.titleRealtimeZoomPan,
    path: ExampleStrings.urlRealtimeZoomPan,
    filepath: "Charts2D/ZoomingAndPanning/RealtimeZoomPan",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates how to zoom and pan a realtime ${frameworkName} Chart while it is updating, with SciChart.js ZoomState API`,
    metaKeywords: "drag, axis, scale, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
