import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `With our ThemeManager API you can create a custom theme. To do this, create a type that implements all the
properties of the IThemeProvider interface and pass to sciChartSurface.applyTheme.`;
const tips = [`It's also possible to style chart-parts in code!`];

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
        href: ExampleStrings.urlCustomThemeDocumentation,
        title: ExampleStrings.urlTitleCustomThemeDocumentation,
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
            },
            {
                imgPath: ExampleStrings.imgStylingInCode,
                title: ExampleStrings.titleStylingInCode,
                seoTitle: ExampleStrings.urlTitleThemeManager,
                examplePath: ExampleStrings.urlStylingInCode
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>Custom Theme</strong> for SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const createACustomThemeExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleCustomTheme,
    path: ExampleStrings.urlCustomTheme,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a Custom Theme for a SciChart.js JavaScript Chart using our Theming API",
    seoKeywords: "theming, chart, javascript, webgl, canvas"
};
