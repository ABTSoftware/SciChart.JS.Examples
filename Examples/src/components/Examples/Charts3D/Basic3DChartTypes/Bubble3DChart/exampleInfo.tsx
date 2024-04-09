import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-3d-bubble-chart.jpg";

const description = `JavaScript 3D Bubble Charts can be created using SciChart.js.
    Large datasets up to a million points can be drawn, enabling point-clouds or visualisation of large statistical datsets in a browser.`;
const tips = [
    `Bubbles can be colored individually, programmatically selected and scaled using the PointMetadata3D class.
    PointMetadata also allows you to tag individual bubbles with a business object of any type.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlBubble3DChartDocumentation,
        title: ExampleStrings.urlTitleBubble3DChartDocumentation,
        linkTitle: "JavaScript 3D Bubble Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Our team demonstrates how to create a <strong>{frameworkName} 3D Bubble Chart</strong> using SciChart.js,
        capable of creating detailed{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="3D JavaScript Charts">
            3D JavaScript Charts
        </a>
        .
    </p>
);

export const bubble3DChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleBubble3DChart,
    pageTitle: ExampleStrings.pageTitleBubble3DChart,
    path: ExampleStrings.urlBubble3DChart,
    filepath: "Charts3D/Basic3DChartTypes/Bubble3DChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Create detailed ${frameworkName} 3D Bubble Chart using SciChart's 5-star rated JavaScript chart library. Supports large datasets. Get your free demo now.`,
    metaKeywords: "3d, bubble, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
