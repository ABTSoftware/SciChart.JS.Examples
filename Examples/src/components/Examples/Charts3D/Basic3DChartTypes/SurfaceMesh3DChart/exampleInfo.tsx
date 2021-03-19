import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import Gallery from "../../../../Gallery/Gallery";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import bubbleChart from "../Bubble3DChart/javascript-3d-bubble-chart.jpg";
import lidarChart from "../../../FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo/javascript-3d-lidar-visualization.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const description = `Demonstrates how to create a JavaScript 3D Surface Mesh Chart. This is a chart type which draws a 3D
point-marker (Sphere, Cylinder, Cube) or a 2D flat billboarded pointmarker (Ellipse, Quad, Pixel) at X,Y,Z
locations in 3D Space.
</p>`;
const tips = [
    `sBubbles can be colored individually, programmatically selected and scaled using the PointMetadata3D class.
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
                imgPath: bubbleChart,
                title: ExampleStrings.titleBubbleChart,
                seoTitle: ExampleStrings.urlTitleBubbleChart,
                examplePath: ExampleStrings.urlBubbleChart
            },
            {
                imgPath: lidarChart,
                title: ExampleStrings.titleLidarFeaturedApp,
                seoTitle: ExampleStrings.urlTitleLidarFeaturedApp,
                examplePath: ExampleStrings.urlLidarFeaturedApp
            }
        ]
    }
];

const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript 3D Bubble Chart</strong> using SciChart.js, High Performance{" "}
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

export const surfaceMesh3DChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleSurfaceMesh3D,
    path: ExampleStrings.urlSurfaceMesh3D,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a JavaScript 3D Surface Mesh Plot. This 3D Chart type can be used in scientific or financial applications to view data in many dimensions",
    seoKeywords: "3d, surface, mesh, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-3d-surface-mesh-chart.jpg"
};
