import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-column-chart.jpg";

const description = `Columns in SciChart.js are rendered with a stroke and fill, and
support gradient fill and paletteproviders for more custom coloring options.`;
const tips = [
    `To change the width of the column, set the dataPointWidth property from 0.0 to 1.0. This alters how much
    space the column takes up.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlColumnChartDocumentation,
        title: ExampleStrings.urlTitleColumnChartDocumentation,
        linkTitle: "JavaScript Column Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Creates a <strong>{frameworkName} Column Chart</strong> using SciChart.js, with the following features:
        DataLabels, Rounded corners, Gradient-palette fill, startup animations.
    </p>
);

export const columnChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleColumnChart,
    pageTitle: ExampleStrings.pageTitleColumnChart,
    path: ExampleStrings.urlColumnChart,
    filepath: "Charts2D/BasicChartTypes/ColumnChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `${frameworkName} Column Chart demo by SciChart supports gradient fill and paletteproviders for more custom coloring options. Get your free demo now.`,
    metaKeywords: "column, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
