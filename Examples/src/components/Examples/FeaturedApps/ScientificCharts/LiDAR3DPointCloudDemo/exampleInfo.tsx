import * as React from "react";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Demonstrating the capability of SciChart.js to create JavaScript 3D Point Cloud charts and visualize LiDAR
data from the UK Defra Survey.`;
const tips = [
    `This example uses a ScatterRenderable Series3D with PixelPointMarker to render a high performance LiDAR
visualization of a 500x500 (250k points) ASC format dataset.`,
    `You can also overlay contours if you use the SurfaceMeshRenderable Series3D and enable contours by setting
    the DrawMeshAs property.`
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
                imgPath: ExampleStrings.imgTenorCurves,
                title: ExampleStrings.titleTenorCurvesFeaturedApp,
                seoTitle: ExampleStrings.titleTenorCurvesFeaturedApp,
                examplePath: ExampleStrings.urlTenorCurvesFeaturedApp
            },
            {
                imgPath: ExampleStrings.imgAudioAnalyzer,
                title: ExampleStrings.titleAudioAnalyzerFeaturedApp,
                seoTitle: ExampleStrings.titleAudioAnalyzerFeaturedApp,
                examplePath: ExampleStrings.urlAudioAnalyzerFeaturedApp
            },
            {
                imgPath: ExampleStrings.imgSurfaceMeash3D,
                title: ExampleStrings.titleSurfaceMesh3D,
                seoTitle: ExampleStrings.urlTitleSurfaceMesh3D,
                examplePath: ExampleStrings.urlSurfaceMesh3D
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to visualize <strong>250k points of LiDAR Data</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript 3D Charts
        </a>
    </p>
);

export const lidar3DPointCloudExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleLidarFeaturedApp,
    path: ExampleStrings.urlLidarFeaturedApp,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrating the capability of SciChart.js to create JavaScript 3D Point Cloud charts and visualize LiDAR data " +
        "from the UK Defra Survey.",
    seoKeywords: "lidar, 3d, point, cloud, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-3d-lidar-visualization.jpg"
};
