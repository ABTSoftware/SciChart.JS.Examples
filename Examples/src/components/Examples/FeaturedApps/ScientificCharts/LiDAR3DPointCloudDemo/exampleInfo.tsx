import * as React from "react";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import Gallery from "../../../../Gallery/Gallery";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import bubbleChart3d from "../../../Charts3D/Basic3DChartTypes/Bubble3DChart/javascript-3d-bubble-chart.jpg";
import surfaceMesh3d from "../../../Charts3D/Basic3DChartTypes/SurfaceMesh3DChart/javascript-3d-surface-mesh-chart.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const description = `Demonstrating the capability of SciChart.js to create JavaScript 3D Point Cloud charts and visualize LiDAR
data from the UK Defra Survey.`;
const tips = [
    `This example uses a ScatterRenderableSeries3D with PixelPointMarker to render a high performance LiDAR
visualization of a 500x500 (250k points) ASC format dataset.`,
    `You can also overlay contours if you use the SurfaceMeshRenderableSeries3D and enable contours by setting
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
                imgPath: bubbleChart3d,
                title: ExampleStrings.titleBubble3DChart,
                seoTitle: ExampleStrings.titleBubble3DChart,
                examplePath: ExampleStrings.urlBubble3DChart
            },
            {
                imgPath: surfaceMesh3d,
                title: ExampleStrings.titleSurfaceMesh3D,
                seoTitle: ExampleStrings.urlTitleSurfaceMesh3D,
                examplePath: ExampleStrings.urlSurfaceMesh3D
            }
        ]
    }
];

const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Subtitle = () => (
    <p>
        Demonstrates how to visualize <strong>250k points of LiDAR Data</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript 3D Charts
        </a>
    </p>
);

const Description = () => (
    <div>
        <ExampleDescription documentationLinks={documentationLinks} tips={tips} description={description} />
    </div>
);
export const lidar3DPointCloudExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleLidarFeaturedApp,
    path: ExampleStrings.urlLidarFeaturedApp,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription:
        "Demonstrating the capability of SciChart.js to create JavaScript 3D Point Cloud charts and visualize LiDAR data " +
        "from the UK Defra Survey.",
    seoKeywords: "lidar, 3d, point, cloud, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-3d-lidar-visualization.jpg"
};
