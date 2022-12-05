import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-datalabels-chart.jpg";

const description = `Columns in SciChart.js are rendered with a stroke and fill, and
support gradient fill and paletteproviders for more custom coloring options.`;
const tips = [
    `To change the width of the column, set the dataPointWidth property from 0.0 to 1.0. This alters how much
    space the column takes up.`
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
    pageTitle: ExampleStrings.pageTitleDatalabels,
    path: ExampleStrings.urlDatalabels,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    code,
    githubUrl,
    metaDescription:
        "JavaScript Column Chart demo by SciChart supports gradient fill and paletteproviders for more custom coloring options. Get your free demo now.",
    metaKeywords: "column, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
