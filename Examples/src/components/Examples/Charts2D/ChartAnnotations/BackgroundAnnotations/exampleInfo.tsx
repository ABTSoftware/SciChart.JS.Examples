import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
const exampleImage = "javascript-background-annotations.jpg";

const previewDescription = `Chart with the quadrants individually coloured, using background annotations.`;
const description = `Annotations can be placed on the Background layer, behind the gridlines, which allows for colouring areas of the chart`;
const tips = [
    `The AnnotationBase type has properties for x,yCoordinateMode which allow you to place annotations are
    relative or absolute values. Great for docking annotations to the top,left,right,bottom of a chart`
];

const documentationLinks: TDocumentationLink[] = [{
    href: ExampleStrings.urlAnnotationsDocumentation,
    title: ExampleStrings.urlTitleAnnotationsDocumentation,
    linkTitle: "Annotations API Documentation"
}];

const Subtitle = () => (
    <p>
        Demonstrates how to color areas of the chart surface using background Annotations using
        SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const backgroundAnnotationsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBackgroundAnnotations,
    pageTitle: ExampleStrings.titleBackgroundAnnotations + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlBackgroundAnnotations,
    filepath: "Charts2D/ChartAnnotations/BackgroundAnnotations",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription:
        "Demonstrates how to color areas of the chart surface using background Annotations using SciChart.js Annotations API",
    metaKeywords: "annotations, chart, api, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
