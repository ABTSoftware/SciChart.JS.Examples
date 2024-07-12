import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-data-animation.jpg";

const previewDescription = ``; //`Demonstrates how to run data animation for a JavaScript Chart.`;
const description = `Every second new random values are generated for the scatter series and transition from one state to another is animated`;
const tips: string[] = ["Animations can be chained"];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDataAnimationDocumentation,
        title: ExampleStrings.urlTitleDataAnimationDocumentation,
        linkTitle: "JavaScript Data Animation Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to run <strong>Dataset Animations</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const dataAnimationExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleDataAnimation,
    pageTitle: ExampleStrings.titleDataAnimation,
    path: ExampleStrings.urlDataAnimation,
    filepath: "Charts2D/Animations/DataAnimation",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) => `Demonstrates how to run Dataset Animations with JavaScript.`,
    metaKeywords: "data, dataset, animation, webgl, canvas",
    thumbnailImage: exampleImage,
};
