import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-title.jpg";

const previewDescription = `Demonstrates how to set a Chart Title and some configuration options.`;
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

export const chartTitleExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleChartTitle,
    pageTitle: ExampleStrings.titleChartTitle + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlChartTitle,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription:
        "Demonstrates chart title wit different position and alignment options",
    metaKeywords: "title, text, alignment, multiline, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
