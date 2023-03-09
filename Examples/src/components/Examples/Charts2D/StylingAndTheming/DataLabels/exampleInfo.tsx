import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-datalabels-chart.jpg";

const description = `Shows how to add and customise data labels for series using SciChart.js`;
const tips = [
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
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
    }
];

const Subtitle = () => (
    <p>
        Shows how you can add <strong>Data Labels</strong> to a chart using SciChart.js
    </p>
);

export const datalabelsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDatalabels,
    pageTitle: ExampleStrings.titleDatalabels + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlDatalabels,
    filepath: "Charts2D/StylingAndTheming/DataLabels",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription:
        "Show data labels on javascript chart. Get your free demo now.",
    metaKeywords: "data labels, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
