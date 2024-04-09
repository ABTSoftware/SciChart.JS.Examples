import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-3d-point-line-chart.jpg";

const description = `JavaScript 3D Point Line Charts can be created using SciChart.js.
    Large datasets can be drawn, enabling visualisation of large statistical datsets in a browser.`;
const tips = [
    `Lines and points can be colored individually, programmatically selected and scaled using the PointMetadata3D class.
    PointMetadata also allows you to tag individual data-points with a business object of any type.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlPointLine3DChartDocumentation,
        title: ExampleStrings.urlTitlePointLine3DChartDocumentation,
        linkTitle: "JavaScript 3D Point Line Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Our team demonstrates how to create a <strong>{frameworkName} 3D Point Line Chart</strong> using SciChart.js,
        capable of creating detailed{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="3D JavaScript Charts">
            3D JavaScript Charts
        </a>
        .
    </p>
);

export const pointLine3DChartExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: ExampleStrings.titlePointLine3DChart,
    pageTitle: ExampleStrings.pageTitlePointLine3DChart,
    path: ExampleStrings.urlPointLine3DChart,
    filepath: "Charts3D/Basic3DChartTypes/PointLine3DChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Create detailed ${frameworkName} 3D Line Chart using SciChart's 5-star rated JavaScript chart library. Supports large datasets. Get your free demo now.`,
    metaKeywords: "3d, bubble, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
