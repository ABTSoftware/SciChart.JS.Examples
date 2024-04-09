import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-generic-animation.jpg";

const previewDescription = ``; //`Demonstrates how to run Generic Animation for a JavaScript Chart.`;
const description = `Generic Animation gives an opportunity to build complex animations and control progress of each animation separately`;
const tips: string[] = ["Use START, CANCEL or RESTART buttons to see the control action of Generic Animation"];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlGenericAnimationDocumentation,
        title: ExampleStrings.urlTitleGenericAnimationDocumentation,
        linkTitle: "Generic Animation Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to run <strong>Generic Animation</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const genericAnimationExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleGenericAnimation,
    pageTitle: ExampleStrings.titleGenericAnimation,
    path: ExampleStrings.urlGenericAnimation,
    filepath: "Charts2D/Animations/GenericAnimation",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) => `Demonstrates how to run Generic Animation with JavaScript.`,
    metaKeywords: "generic, animation, javascript",
    thumbnailImage: exampleImage,
};
