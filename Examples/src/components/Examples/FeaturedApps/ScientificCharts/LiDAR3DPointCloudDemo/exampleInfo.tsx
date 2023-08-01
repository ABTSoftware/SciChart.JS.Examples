import * as React from "react";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-3d-lidar-visualization.jpg";

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
        href: ExampleStrings.urlBubble3DChartDocumentation,
        title: ExampleStrings.urlTitleBubble3DChartDocumentation,
        linkTitle: "JavaScript 3D Bubble Chart Documentation"
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to visualize <strong>LiDAR UAV Data</strong> from the Defra survey using SciChart.js. A 1km x
        1km slice of London is visualised as a 3D point-cloud with contour map overlaid. A heatmap legend on the right
        indicates the heightmap.
    </p>
);

export const lidar3DPointCloudExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleLidarFeaturedApp,
    pageTitle: ExampleStrings.titleLidarFeaturedApp + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlLidarFeaturedApp,
    filepath: "FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription:
        "Demonstrating the capability of SciChart.js to create JavaScript 3D Point Cloud charts and visualize LiDAR data " +
        "from the UK Defra Survey.",
    metaKeywords: "lidar, 3d, point, cloud, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
