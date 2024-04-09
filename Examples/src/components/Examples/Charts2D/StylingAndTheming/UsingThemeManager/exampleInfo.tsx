import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-themes.jpg";

const description = `SciChart.js ships with a light and a dark theme, which you can switch by calling the
SciChartSurface.applyTheme() function.`;
const tips = [
    `If you implement IThemeProvider you can create your own custom themes! It's also possible to style
    chart-parts in code.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlThemeManagerDocumentation,
        title: ExampleStrings.urlTitleThemeManagerDocumentation,
        linkTitle: "The ThemeManager documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates the <strong>light and dark theme</strong> in SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const usingThemeManagerExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleThemeManager,
    pageTitle: ExampleStrings.titleThemeManager,
    path: ExampleStrings.urlThemeManager,
    filepath: "Charts2D/StylingAndTheming/UsingThemeManager",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Demonstrates our Light and Dark Themes for ${frameworkName} Charts with SciChart.js ThemeManager API`,
    metaKeywords: "theme, provider, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
