import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `Rotating axis labels is now easy!  This example uses it to create vertical labels so as to fit more onto a x axis.`;
const description = `maxAutoTicks has been increased to force more major gridlines to be rendered, and minor gridlines have been turned off.`;
const tips = [
    `Rotation is is degrees clockwise.`,
    `All axes and label providers support rotation.`
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
        href: ExampleStrings.urlAxisLabelCustomizationDocumentation,
        title: ExampleStrings.urlTitleAxisLabelCustomizationDocumentation,
        linkTitle: "Axis Label Customization"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgMultiLineLabels,
                title: ExampleStrings.titleMultiLineLabels,
                seoTitle: ExampleStrings.titleMultiLineLabels,
                examplePath: ExampleStrings.urlMultiLineLabels
            },
            {
                imgPath: ExampleStrings.imgImageLabels,
                title: ExampleStrings.titleImageLabels,
                seoTitle: ExampleStrings.titleImageLabels,
                examplePath: ExampleStrings.urlImageLabels
            },
            {
                imgPath: ExampleStrings.imgRealtimeTickingStockCharts,
                title: ExampleStrings.titleRealtimeTickingStockCharts,
                seoTitle: ExampleStrings.urlTitleRealtimeTickingStockCharts,
                examplePath: ExampleStrings.urlRealtimeTickingStockCharts
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to use <strong>Rotated Axis Labels</strong> with SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const rotatedLabelsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRotatedLabels,
    path: ExampleStrings.urlRotatedLabels,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Rotate to create vertical axis labels and fit more on an axis",
    seoKeywords: "Axis, label, rotated, vertical, javascript, webgl, canvas",
    thumbnailImage: "javascript-rotated-labels.jpg"
};
