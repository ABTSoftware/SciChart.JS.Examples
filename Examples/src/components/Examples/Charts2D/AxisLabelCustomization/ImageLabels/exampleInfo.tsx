import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-image-labels.jpg";

const previewDescription = `SciChart JS v2 allows you to use anything as an axis label, even an image.`;
const description = `By default, the LabelProvider uses the size of the texture for layout, so we do not need to override the measurement functions here.
However, if you want to allow your labels to overlap, you can do this by telling scichart they are smaller than they really are.`;
const tips = [
    `Label textures are automatically cached, so complex label rendering will not slow down your chart.`
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
        href: ExampleStrings.urlCustomLabelProviderDocumentation,
        title: ExampleStrings.urlTitleCustomLabelProviderDocumentation,
        linkTitle: "SciChart.js Custom LabelProvider Documentation"
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
                imgPath: ExampleStrings.imgRotatedLabels,
                title: ExampleStrings.titleRotatedLabels,
                seoTitle: ExampleStrings.titleRotatedLabels,
                examplePath: ExampleStrings.urlRotatedLabels
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
        Demonstrates how to use <strong>Images as Labels</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const imageLabelsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleImageLabels,
    pageTitle: ExampleStrings.titleImageLabels + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlImageLabels,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Demonstrates how to use Images as Axis Labels",
    metaKeywords: "image, axis, label, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
