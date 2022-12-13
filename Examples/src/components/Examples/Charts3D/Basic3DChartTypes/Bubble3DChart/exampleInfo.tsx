import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-3d-bubble-chart.jpg";

const description = `JavaScript 3D Bubble Charts can be created using SciChart.js.
    Large datasets up to a million points can be drawn, enabling point-clouds or visualisation of large statistical datsets in a browser.`;
const tips = [
    `Bubbles can be colored individually, programmatically selected and scaled using the PointMetadata3D class.
    PointMetadata also allows you to tag individual bubbles with a business object of any type.`
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
        href: ExampleStrings.urlSurfaceMesh3DChartDocumentation,
        title: ExampleStrings.urlTitleSurfaceMesh3DChartDocumentation,
        linkTitle: "JavaScript 3D Surface Mesh Documentation"
    }
];

const Subtitle = () => (
    <p>
        Our team demonstrates how to create a <strong>JavaScript 3D Bubble Chart</strong> using SciChart.js, capable of creating detailed{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="3D JavaScript Charts">
            3D JavaScript Charts
        </a>.
    </p>
);

export const bubble3DChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBubble3DChart,
    pageTitle: ExampleStrings.pageTitleBubble3DChart,
    path: ExampleStrings.urlBubble3DChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription:
        "Create detailed JavaScript 3D Bubble Chart using SciChart's 5-star rated JavaScript chart library. Supports large datasets. Get your free demo now.",
    metaKeywords: "3d, bubble, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
