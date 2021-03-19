import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import Gallery from "../../../../Gallery/Gallery";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import themeManager from "../UsingThemeManager/javascript-chart-themes.png";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const previewDescription = `Using garish colors to demonstrate styling of a JavaScript chart, Axis, grid lines, tick lines and more.`;
const description = `Almost any element in SciChart is stylable in code and most parts of the chart are exposed. You can easily
set background, grid-line, axis label, viewport background and chart series colors in JavaScript.`;
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
                imgPath: themeManager,
                title: ExampleStrings.titleThemeManager,
                seoTitle: ExampleStrings.urlTitleThemeManager,
                examplePath: ExampleStrings.urlThemeManager
            }
        ]
    }
];

const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Subtitle = () => (
    <p>
        Demonstrates how to <strong>style or theme a JavaScript Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const Description = () => (
    <div>
        <ExampleDescription
            previewDescription={previewDescription}
            documentationLinks={documentationLinks}
            tips={tips}
            description={description}
        />
    </div>
);
export const stylingInCodeExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleStylingInCode,
    path: ExampleStrings.urlStylingInCode,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription: "Demonstrates how to style a JavaScript Chart entirely in code with SciChart.js themeing API",
    seoKeywords: "styling, in, code, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-styling-theming-in-code.png"
};
