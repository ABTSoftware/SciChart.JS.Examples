import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-style-animation.jpg";

const previewDescription = ``; // `Demonstrates how to run style and data animations simultaneously for a JavaScript Chart.`;
const description = `By clicking the buttons the chart styles and data transform from one value to another`;
const tips: string[] = ["Use runAnimation or enqueueAnimation method"];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlStyleAnimationDocumentation,
        title: ExampleStrings.urlTitleStyleAnimationDocumentation,
        linkTitle: "JavaScript Style Transition Animation Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to run <strong>Style Transition Animations</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const styleAnimationExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleStyleAnimation,
    pageTitle: ExampleStrings.titleStyleAnimation,
    path: ExampleStrings.urlStyleAnimation,
    filepath: "Charts2D/Animations/StyleAnimation",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) => `Demonstrates how to run Style Transition Animations with JavaScript.`,
    metaKeywords: "style, animation, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
