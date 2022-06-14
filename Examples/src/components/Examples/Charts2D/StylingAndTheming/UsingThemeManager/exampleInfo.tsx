import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `SciChart.js ships with a light and a dark theme, which you can switch by calling the
SciChartSurface.applyTheme() function.`;
const tips = [
    `If you implement IThemeProvider you can create your own custom themes! It's also possible to style
    chart-parts in code.`
];

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
        href: ExampleStrings.urlThemeManagerDocumentation,
        title: ExampleStrings.urlTitleThemeManagerDocumentation,
        linkTitle: "The ThemeManager documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgStylingInCode,
                title: ExampleStrings.titleStylingInCode,
                seoTitle: ExampleStrings.urlTitleStylingInCode,
                examplePath: ExampleStrings.urlStylingInCode
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates the <strong>light and dark theme</strong> in SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const usingThemeManagerExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleThemeManager,
    pageTitle: ExampleStrings.titleThemeManager + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlThemeManager,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription: "Demonstrates our Light and Dark Themes for JavaScript Charts with SciChart.js ThemeManager API",
    metaKeywords: "theme, provider, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-themes.png"
};
