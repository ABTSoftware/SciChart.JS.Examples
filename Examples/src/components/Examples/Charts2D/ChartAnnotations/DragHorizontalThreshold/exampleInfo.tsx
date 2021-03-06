import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `Drag Threshold demo shows how to add draggable vertical and horizontal thresholds to the chart and change chart series colour based on the threshold value.`;
const description = `The Drag Threshold demo shows how to add draggable vertical and horizontal thresholds to a JavaScript chart and change chart series colour based on the threshold value.`;
const tips = [
    ` All Annotations have an isEditable property. When true, the annotation can be dragged and resized. Chart colouring may be changed via a rule using the PaletteProvider API.`
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
    },
    {
        href: ExampleStrings.urlAnnotationsDocumentation,
        title: ExampleStrings.urlTitleAnnotationsDocumentation,
        linkTitle: "Annotations API Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgEditableAnnotation,
                title: ExampleStrings.titleEditableAnnotations,
                seoTitle: ExampleStrings.urlTitleEditableAnnotations,
                examplePath: ExampleStrings.urlEditableAnnotations
            },
            {
                imgPath: ExampleStrings.imgAnnotationsAreEasyChart,
                title: ExampleStrings.titleAnnotationsAreEasy,
                seoTitle: ExampleStrings.urlTitleAnnotationsDocumentation,
                examplePath: ExampleStrings.urlAnnotationsAreEasy
            },
            {
                imgPath: ExampleStrings.imgTradeMarkers,
                title: ExampleStrings.titleTradeMarkers,
                seoTitle: ExampleStrings.urlTitleTradeMarkers,
                examplePath: ExampleStrings.urlTradeMarkers
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates interaction by dragging vertical and horizontal line thresholds.{" "}
        As the thresholds move, the chart colour updates.
    </p>
);

export const dragHorizontalThresholdExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDragHorizontalThreshold,
    path: ExampleStrings.urlDragHorizontalThreshold,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to add draggable thresholds which change the series color in the chart in SciChart.js",
    seoKeywords: "trade, markers, demo, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-drag-horizontal-threshold.jpg"
};
