import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-3d-column-chart.jpg";

const description = `JavaScript 3D Column Charts can be created using SciChart.js.`;
const tips = [``];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlColumn3DChartDocumentation,
        title: ExampleStrings.urlTitleColumn3DChartDocumentation,
        linkTitle: "JavaScript 3D Column Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        The SciChart.js <strong>{frameworkName} 3D Column Chart</strong> uses uses XYZ data and can show sparse or grid
        based columns, with indivdual column coloring and a variety of column shapes.
    </p>
);

export const column3DChartExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: ExampleStrings.titleColumn3DChart,
    pageTitle: ExampleStrings.pageTitleColumn3DChart,
    path: ExampleStrings.urlColumn3DChart,
    filepath: "Charts3D/Basic3DChartTypes/Column3DChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Create detailed ${frameworkName} 3D Column Chart using SciChart's 5-star rated JavaScript chart library. Supports large datasets`,
    metaKeywords: "3d, column, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
