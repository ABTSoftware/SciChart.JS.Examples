import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-axis-layout.jpg";

const previewDescription = `Demonstrates the different axis layouts available in Scichart and how they affect the series`;
const description = ``;
const tips = [
    ``,
    ``
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
        href: ExampleStrings.urlTextLabelProviderDocumentation,
        title: ExampleStrings.urlTitleTextLabelProviderDocumentation,
        linkTitle: "Scichart.js TextlabelProvider Documentation"
    }
];

const Subtitle = () => (
    <p>
        The same data is rendered many to show the Axis Layout options in SciChart.js. Charts support outer, inner, central and stacked axes,{" "}
        and use of axis alignment to create vertical charts. Series may be registered on specific X,Y axis pairs for infinite layout configuration.
    </p>
);

export const axisLayoutExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleAxisLayout,
    pageTitle: ExampleStrings.titleAxisLayout + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlAxisLayout,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    code,
    githubUrl,
    metaDescription:
        "Demonstrates outer, inner, central and stacked axes, and use of axis alignment to create vertical charts",
    metaKeywords: "stacked, axis, layout, alignment, vertical, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
