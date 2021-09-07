import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";
import {GalleryItem} from "../../../../../helpers/types/types";
import {TDocumentationLink} from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `Demonstrates how to set a background image by setting a transparent background to SciChart.js.`;
const description = `SciChart.js v2.x now supports transparent backgrounds in all browsers, and will show through the DOM element underneath the chart. In this example we use a background image to demonstrate how to create a stunning styled chart.`;
const tips = [`It's also possible to show DOM elements: Videos, Images, Gradient Backgrounds or an entire webpage behind charts!`];

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
        href: ExampleStrings.urlAxisStylingDocumentation,
        title: ExampleStrings.urlTitleAxisStylingDocumentation,
        linkTitle: "Custom Theme documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgThemeManagerChart,
                title: ExampleStrings.titleThemeManager,
                seoTitle: ExampleStrings.urlTitleThemeManager,
                examplePath: ExampleStrings.urlThemeManager
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>Chart with Transparent Background</strong>
        {' '}using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const transparentBackgroundExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleTransparentBackground,
    path: ExampleStrings.urlTransparentBackground,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription: "Demonstrates how to create a JavaScript Chart with background image using transparency in SciChart.js",
    seoKeywords: "styling, transparent, background, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-background-image-with-transparency.jpg",
};