import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `This custom LabelProvider renders rotated text for axis labels by overriding getLabelTexture and using textureManager.createTextTexture.`;
const description = `In order to lay these out correctly, we also have to override the measuring functions of LabelProvider, so that the textures can overlap.`;
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
        Demonstrates how to create a custom LabelProvider which produces <strong>Rotated Axis Labels</strong> using SciChart.js, High
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
        "Demonstrates how to create a custom LabelProvider which produces Rotated Axis Labels",
    seoKeywords: "Axis, label, rotated, text, javascript, webgl, canvas",
    thumbnailImage: "javascript-multiline-labels.jpg"
};
