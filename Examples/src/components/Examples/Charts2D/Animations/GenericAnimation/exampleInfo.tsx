import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-generic-animation.jpg";

const previewDescription = ``; //`Demonstrates how to run Generic Animation for a JavaScript Chart.`;
const description = `Generic Animation gives an opportunity to build complex animations and control progress of each animation separately`;
const tips: string[] = ["Use START, CANCEL or RESTART buttons to see the control action of Generic Animation"];

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
        href: ExampleStrings.urlGenericAnimationDocumentation,
        title: ExampleStrings.urlTitleGenericAnimationDocumentation,
        linkTitle: "Generic Animation Documentation"
    },
    {
        href: ExampleStrings.urlAnnotationsDocumentation,
        title: ExampleStrings.urlTitleAnnotationsDocumentation,
        linkTitle: "Annotations API Documentation"
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to run <strong>Generic Animation</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const genericAnimationExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleGenericAnimation,
    pageTitle: ExampleStrings.titleGenericAnimation + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlGenericAnimation,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    code,
    githubUrl,
    metaDescription: "Demonstrates how to run Generic Animation with JavaScript.",
    metaKeywords: "generic, animation, javascript",
    thumbnailImage: exampleImage
};
