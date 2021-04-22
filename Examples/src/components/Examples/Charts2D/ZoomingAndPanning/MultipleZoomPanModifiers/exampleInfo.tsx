import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Scroll Middle Mouse button to zoom in/zoom out. Use Right Mouse Button to select an area on the chart with RubberBandXyZoomModifier. Try it out on touch devices: use pinch zoom gesture to scale.`;
const tips = [
    `Use 'executeOn' property to assign a Modifier to specific mouse button. `,
    `Use 'easingFunction' property to animate zoom. `,
    `Use CSS 'touch-action' property to override browser default touch behavior. e.g., 'touch-action: none'. `,
];

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

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgDragAxisToScale,
                title: ExampleStrings.titleDragAxisToScale,
                seoTitle: ExampleStrings.urlDragAxisToScale,
                examplePath: ExampleStrings.urlDragAxisToScale
            },
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates different <strong>Zoom and Pan Modifiers on a JavaScript Chart</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const zoomAndPanWithMultipleChartModifiersExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleZoomPanWithMultipleChartModifiers,
    path: ExampleStrings.urlZoomPanWithMultipleChartModifiers,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to use multiple Zoom and Pan Modifiers on a JavaScript Chart with SciChart.js",
    seoKeywords: "zoom, pan, pinch, touch, scale, javascript, webgl, canvas",
    thumbnailImage: "zoom-pan-javascript-charts-with-multiple-modifiers.jpg"
};
