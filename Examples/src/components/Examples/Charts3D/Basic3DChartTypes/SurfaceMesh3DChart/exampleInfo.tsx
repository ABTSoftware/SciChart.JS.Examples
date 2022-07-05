import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `The Surface Mesh chart type can be used to represent 2D data in a 3D map.
    It looks like a topographical map where values in a 2D array are drawn as heights and mapped to a color.
    The Surface Mesh 3D chart type in SciChart.js is highly dynamic and allows for large volumes of data to be plotted.`;
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
        href: ExampleStrings.urlBubble3DChartDocumentation,
        title: ExampleStrings.urlTitleBubble3DChartDocumentation,
        linkTitle: "JavaScript 3D Bubble Chart Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgBubble3DChart,
                title: ExampleStrings.titleBubble3DChart,
                seoTitle: ExampleStrings.titleBubble3DChart,
                examplePath: ExampleStrings.urlBubble3DChart
            },
            {
                imgPath: ExampleStrings.imgLidarFeaturedApp,
                title: ExampleStrings.titleLidarFeaturedApp,
                seoTitle: ExampleStrings.urlTitleLidarFeaturedApp,
                examplePath: ExampleStrings.urlLidarFeaturedApp
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Learn how to create a detailed <strong>JavaScript 3D Surface Mesh Chart</strong> using SciChart.js, and our {" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="High Performance JavaScript 3D Chart Library">
            High Performance JavaScript 3D Chart Library
        </a>
    </p>
);

export const surfaceMesh3DChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleSurfaceMesh3D,
    pageTitle: ExampleStrings.pageTitleSurfaceMesh3D,
    path: ExampleStrings.urlSurfaceMesh3D,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Design a JavaScript 3D Surface Mesh Chart with SciChart.js - feature-rich JavaScript chart library. Represent 2D data in a 3D map. Get your free demo.",
    metaKeywords: "3d, surface, mesh, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-3d-surface-mesh-chart.jpg"
};
