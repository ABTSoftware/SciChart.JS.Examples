import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import exampleImage from "./drag-axis-on-javascript-charts-to-scale-or-pan.jpg";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Demonstrates how to add behaviour to scale, zoom or pan a chart by dragging the X or Y Axis on the chart.
Try it out below! Drag an axis to watch the chart re-scale.`;
const tips = [`Try dragging an axis to zoom or pan the axis. Double clicking the chart resets the zoom!`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    },
    {
        href: ExampleStrings.urlTutorialsHome,
        title: ExampleStrings.titleTutorialsHome,
        linkTitle: "SciChart.js Tutorials"
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to <strong>scale or pan the Axis on a JavaScript Chart</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const dragAxisToScaleExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDragAxisToScale,
    pageTitle: ExampleStrings.titleDragAxisToScale + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlDragAxisToScale,
    filepath: "Charts2D/ZoomingAndPanning/DragAxisToScale",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription:
        "Demonstrates how to Zoom, Scale or Pan individual Axis on a JavaScript Chart with SciChart.js AxisDragModifiers",
    metaKeywords: "drag, axis, scale, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
