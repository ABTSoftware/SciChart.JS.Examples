import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `With our ThemeManager API you can create a custom theme. To do this, create a type that implements all the
properties of the IThemeProvider interface and pass to sciChartSurface.applyTheme.`;
const tips = [`It's also possible to style chart-parts in code!`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlCustomThemeDocumentation,
        title: ExampleStrings.urlTitleCustomThemeDocumentation,
        linkTitle: "Custom Theme documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create a <strong>Custom Theme</strong> for SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const createACustomThemeExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: ExampleStrings.titleCustomTheme,
    pageTitle: ExampleStrings.titleCustomTheme,
    path: ExampleStrings.urlCustomTheme,
    filepath: "Charts2D/StylingAndTheming/CreateACustomTheme",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Demonstrates how to create a Custom Theme for a SciChart.js ${frameworkName} Chart using our Theming API`,
    metaKeywords: "theming, chart, javascript, webgl, canvas",
};
