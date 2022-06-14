import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = ``;//`Demonstrates how to run data animation for a JavaScript Chart.`;
const description = `Every second new random values are generated for the scatter series and transition from one state to another is animated`;
const tips: string[] = ["Animations can be chained"];

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
        href: ExampleStrings.urlDataAnimationDocumentation,
        title: ExampleStrings.urlTitleDataAnimationDocumentation,
        linkTitle: "JavaScript Data Animation Documentation"
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
                imgPath: ExampleStrings.imgStyleAnimation,
                title: ExampleStrings.titleStyleAnimation,
                seoTitle: ExampleStrings.urlTitleStyleAnimation,
                examplePath: ExampleStrings.urlStyleAnimation
            },
            {
                imgPath: ExampleStrings.imgStartupAnimation,
                title: ExampleStrings.titleStartupAnimation,
                seoTitle: ExampleStrings.urlTitleStartupAnimation,
                examplePath: ExampleStrings.urlStartupAnimation
            },
            {
                imgPath: ExampleStrings.imgGenericAnimation,
                title: ExampleStrings.titleGenericAnimation,
                seoTitle: ExampleStrings.urlTitleGenericAnimation,
                examplePath: ExampleStrings.urlGenericAnimation
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to run <strong>Dataset Animations</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const dataAnimationExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDataAnimation,
    pageTitle: ExampleStrings.titleDataAnimation + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlDataAnimation,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription: "Demonstrates how to run Dataset Animations with JavaScript.",
    metaKeywords: "data, dataset, animation, webgl, canvas",
    thumbnailImage: "javascript-data-animation.png"
};
