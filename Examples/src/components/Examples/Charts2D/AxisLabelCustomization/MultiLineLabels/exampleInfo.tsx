import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-multiline-labels.jpg";

const previewDescription = `Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider.
Click the buttons below the chart to see different arrangements.`;
const description = `TextLabelProvider provides an easy way to map tick values to text.  It can also do word wrapping.  Rotation is now available on all LabelProviders.`;
const tips = [
    `If some labels are not appearing, it is probably because there is not enough space for them.  Sometimes adjusting the padding in the labelStyle can help.`,
    `To see how padding affects label placement try setting sciChartSurface.debugRendering = true;`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlTextLabelProviderDocumentation,
        title: ExampleStrings.urlTitleTextLabelProviderDocumentation,
        linkTitle: "Scichart.js TextlabelProvider Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to use <strong>Multi-Line Text</strong> for axis labels using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const multiLineLabelsExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleMultiLineLabels,
    pageTitle: ExampleStrings.titleMultiLineLabels,
    path: ExampleStrings.urlMultiLineLabels,
    filepath: "Charts2D/AxisLabelCustomization/MultiLineLabels",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider`,
    metaKeywords: "text, axis, label, wrap, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
