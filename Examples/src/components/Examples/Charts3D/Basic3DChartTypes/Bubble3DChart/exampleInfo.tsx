import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";

const description = `Demonstrates how to create a JavaScript 3D Bubble Chart. This is a chart type which draws a 3D point-marker
(Sphere, Cylinder, Cube) or a 2D flat billboarded pointmarker (Ellipse, Quad, Pixel) at X,Y,Z locations in
3D Space.`;
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

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgSurfaceMeash3D,
                title: ExampleStrings.titleSurfaceMesh3D,
                seoTitle: ExampleStrings.urlTitleSurfaceMesh3D,
                examplePath: ExampleStrings.urlSurfaceMesh3D
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
        Demonstrates how to create a <strong>JavaScript 3D Bubble Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript 3D Charts
        </a>
    </p>
);

export const bubble3DChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBubble3DChart,
    path: ExampleStrings.urlBubble3DChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how a JavaScript 3D Bubble Chart. Each point draws a 3D point-marker " +
        "(Sphere, Cylinder, Cube) at X,Y,Z locations in 3D Space.",
    seoKeywords: "3d, bubble, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-3d-bubble-chart.jpg"
};
