import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-rotated-labels-chart.jpg";

const previewDescription = `This example uses rotation to create vertical labels so as to fit more onto a x axis.
Y axis uses right aligned labels so decimals are nicely aligned.`;
const description = `maxAutoTicks has been increased to force more major gridlines to be rendered, and minor gridlines have been turned off.
The default label alignment is Auto, meaning that labels will be aligned closest to the axis.`;
const tips = [`Rotation is is degrees clockwise.`, `All axes and label providers support rotation.`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlRotatingLabelsDocumentation,
        title: ExampleStrings.urlTitleRotatingLabelsDocumentation,
        linkTitle: "SciChart.js Axis Label Formatting Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to use <strong>Rotation and Alignment of Axis Labels</strong> with SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const rotatedLabelsExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleRotatedLabels,
    pageTitle: ExampleStrings.titleRotatedLabels,
    path: ExampleStrings.urlRotatedLabels,
    filepath: "Charts2D/AxisLabelCustomizationRotatedLabels",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) => `Rotate to create vertical axis labels and fit more on an axis`,
    metaKeywords: "Axis, label, rotated, vertical, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
