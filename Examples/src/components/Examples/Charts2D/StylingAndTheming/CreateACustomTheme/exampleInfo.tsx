import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import Gallery from "../../../../Gallery/Gallery";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import themeManager from "../UsingThemeManager/javascript-chart-themes.png";
import stylingInCode from "../StylingInCode/javascript-chart-styling-theming-in-code.png";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

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
                imgPath: themeManager,
                title: ExampleStrings.titleThemeManager,
                seoTitle: ExampleStrings.urlTitleThemeManager,
                examplePath: ExampleStrings.urlThemeManager
            },
            {
                imgPath: stylingInCode,
                title: ExampleStrings.titleStylingInCode,
                seoTitle: ExampleStrings.urlTitleThemeManager,
                examplePath: ExampleStrings.urlStylingInCode
            }
        ]
    }
];

const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>Custom Theme</strong> for SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const Description = () => (
    <div>
        <ExampleDescription documentationLinks={documentationLinks} tips={tips} description={description} />
    </div>
);

export const createACustomThemeExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleCustomTheme,
    path: ExampleStrings.urlCustomTheme,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a Custom Theme for a SciChart.js JavaScript Chart using our Theming API",
    seoKeywords: "theming, chart, javascript, webgl, canvas"
};
