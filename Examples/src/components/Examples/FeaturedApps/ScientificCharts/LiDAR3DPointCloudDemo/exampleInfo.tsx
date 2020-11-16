import * as React from "react";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrating the capability of SciChart.js to create JavaScript 3D Point Cloud charts and visualize LiDAR data
        from the UK Defra Survey.</p>
    <h4>Tips!</h4>
    <p>This example uses a ScatterRenderableSeries3D with PixelPointMarker to render a high performance LiDAR
        visualization of a 500x500 (250k points) ASC format dataset.</p>
    <p>You can also overlay contours if you use the SurfaceMeshRenderableSeries3D and enable contours by setting the
        DrawMeshAs property.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorials3DHome} title={ExampleStrings.titleTutorials3DHome} target="_blank">
            SciChart3D.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlBubble3DChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleBubble3DChartDocumentation}>JavaScript 3D Scatter
            Chart Documentation</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlBubble3DChart}
               title={ExampleStrings.urlTitleBubbleChart}>The
            JavaScript 3D Bubble Chart Example</a></li>
        <li><a href={ExampleStrings.urlSurfaceMesh3D}
               title={ExampleStrings.urlTitleSurfaceMesh3D}>The
            JavaScript 3D Surface Mesh Chart Example</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to visualize <strong>250k points of LiDAR Data</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript 3D Charts</a></p>);

export const lidar3DPointCloudExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleLidarFeaturedApp,
    path: ExampleStrings.urlLidarFeaturedApp,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: "Demonstrating the capability of SciChart.js to create JavaScript 3D Point Cloud charts and visualize LiDAR data " +
        "from the UK Defra Survey.",
    seoKeywords: "lidar, 3d, point, cloud, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-3d-lidar-visualization.jpg"
};
