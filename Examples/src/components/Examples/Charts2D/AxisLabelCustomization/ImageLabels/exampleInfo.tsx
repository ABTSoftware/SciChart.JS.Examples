import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-image-labels.jpg";

const previewDescription = `SciChart JS v2 allows you to use anything as an axis label, even an image.`;
const description = `By default, the LabelProvider uses the size of the texture for layout, so we do not need to override the measurement functions here.
However, if you want to allow your labels to overlap, you can do this by telling scichart they are smaller than they really are.`;
const tips = [`Label textures are automatically cached, so complex label rendering will not slow down your chart.`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlImageLabelsDocumentation,
        title: ExampleStrings.urlTitleImageLabelsDocumentation,
        linkTitle: "SciChart.js Image Labels Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to use <strong>Images as Labels</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const imageLabelsExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleImageLabels,
    pageTitle: ExampleStrings.titleImageLabels,
    path: ExampleStrings.urlImageLabels,
    filepath: "Charts2D/AxisLabelCustomization/ImageLabels",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) => `Demonstrates how to use Images as Axis Labels`,
    metaKeywords: "image, axis, label, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
