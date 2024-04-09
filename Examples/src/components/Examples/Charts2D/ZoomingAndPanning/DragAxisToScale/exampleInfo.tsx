import { TExampleInfo } from "../../../../AppRouter/examplePages";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import exampleImage from "./drag-axis-on-javascript-charts-to-scale-or-pan.jpg";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Demonstrates how to add behaviour to scale, zoom or pan a chart by dragging the X or Y Axis on the chart.
Try it out below! Drag an axis to watch the chart re-scale.`;
const tips = [`Try dragging an axis to zoom or pan the axis. Double clicking the chart resets the zoom!`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDragAxisToScaleDocumentation,
        title: ExampleStrings.urlTitleDragAxisToScaleDocumentation,
        linkTitle: "SciChart.js Axis Drag documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to <strong>scale or pan the Axis on a {frameworkName} Chart</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const dragAxisToScaleExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: ExampleStrings.titleDragAxisToScale,
    pageTitle: ExampleStrings.titleDragAxisToScale,
    path: ExampleStrings.urlDragAxisToScale,
    filepath: "Charts2D/ZoomingAndPanning/DragAxisToScale",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Demonstrates how to Zoom, Scale or Pan individual Axis on a ${frameworkName} Chart with SciChart.js AxisDragModifiers`,
    metaKeywords: "drag, axis, scale, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
