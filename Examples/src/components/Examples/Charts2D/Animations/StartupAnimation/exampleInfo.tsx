import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

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

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgDataAnimation,
                title: ExampleStrings.titleDataAnimation,
                seoTitle: ExampleStrings.urlTitleDataAnimation,
                examplePath: ExampleStrings.urlDataAnimation
            },
            {
                imgPath: ExampleStrings.imgStyleAnimation,
                title: ExampleStrings.titleStyleAnimation,
                seoTitle: ExampleStrings.urlTitleStyleAnimation,
                examplePath: ExampleStrings.urlStyleAnimation
            }
        ]
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
    path: ExampleStrings.urlStartupAnimation,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription: "Demonstrates how to run Startup Animations with JavaScript.",
    seoKeywords: "startup, on-start, animation, javascript",
    thumbnailImage: "javascript-startup-animation.png"
};