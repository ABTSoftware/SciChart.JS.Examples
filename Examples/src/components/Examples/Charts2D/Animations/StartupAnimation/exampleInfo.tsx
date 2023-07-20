import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
const exampleImage = "javascript-startup-animations.jpg";

const previewDescription = ``;//`Demonstrates how to run startup animations for a JavaScript Chart.`;
const description = `Startup animations run on start and decorate charts`;
const tips: string[] = ["Choose Fade, Scale, Wave or Sweep animation using the dropdown"];

const documentationLinks: TDocumentationLink[] = [{
    href: ExampleStrings.urlStartupAnimationDocumentation,
    title: ExampleStrings.urlTitleStartupAnimationDocumentation,
    linkTitle: "JavaScript Startup Animation Documentation"
}];

const Subtitle = () => (
    <p>
        Demonstrates how to run <strong>Startup Animations</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const startupAnimationExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleStartupAnimation,
    pageTitle: ExampleStrings.titleStartupAnimation + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlStartupAnimation,
    filepath: "Charts2D/Animations/StartupAnimation",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription: "Demonstrates how to run Startup Animations with JavaScript.",
    metaKeywords: "startup, on-start, animation, javascript",
    thumbnailImage: exampleImage
};
