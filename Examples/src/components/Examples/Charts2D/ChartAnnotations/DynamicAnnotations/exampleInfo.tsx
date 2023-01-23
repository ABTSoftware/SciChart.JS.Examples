import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-editable-annotations.jpg";

const previewDescription = `Demonstrates how to allow users to dynamically add annotations using custom modifiers`;
const description = ``;
const tips = [``];

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

const Subtitle = () => (
    <p>
       Demonstrates how to allow users to dynamically add annotations to a {" "}
        <strong>JavaScript Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const dynamicAnnotationsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDynamicAnnotations,
    pageTitle: ExampleStrings.titleDynamicAnnotations + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlDynamicAnnotations,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription:
        "Demonstrates how to allow users to dynamically add annotations using custom modifiers",
    metaKeywords: "annotations, chart, api, javascript, webgl, canvas, drag and drop",
    thumbnailImage: exampleImage
};
