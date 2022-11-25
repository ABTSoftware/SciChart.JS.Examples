import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-startup-animations.jpg";

const previewDescription = ``;//`Demonstrates how to run startup animations for a JavaScript Chart.`;
const description = `Startup animations run on start and decorate charts`;
const tips: string[] = ["Choose Fade, Scale, Wave or Sweep animation using the dropdown"];

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
        href: ExampleStrings.urlStartupAnimationDocumentation,
        title: ExampleStrings.urlTitleStartupAnimationDocumentation,
        linkTitle: "JavaScript Startup Animation Documentation"
    },
    {
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
    }
];

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
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    code,
    githubUrl,
    metaDescription: "Demonstrates how to run Startup Animations with JavaScript.",
    metaKeywords: "startup, on-start, animation, javascript",
    thumbnailImage: exampleImage
};
