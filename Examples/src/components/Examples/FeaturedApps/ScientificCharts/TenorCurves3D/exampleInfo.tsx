import * as React from "react";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrating the capability of SciChart.js to create a composite 2D &amp; 3D Chart application.
        An example like this could be used to visualize Tenor curves in a financial setting,
        or other 2D/3D data combined on a single screen.</p>
    <h4>Tips!</h4>
    <p>This example uses a SurfaceMeshRenderableSeries3D to render a 2-dimensional array as a heightmap.
        Line charts are shown on the same example to show that 2D &amp; 3D charts can be combined.</p>
    <p>You can also overlay contours if you use the SurfaceMeshRenderableSeries3D and enable contours by setting the
        DrawMeshAs property.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorials3DHome} title={ExampleStrings.titleTutorials3DHome} target="_blank">
            SciChart3D.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlSurfaceMesh3DChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleSurfaceMesh3DChartDocumentation}>JavaScript 3D Surface Mesh
            Chart Documentation</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlSurfaceMesh3D}
               title={ExampleStrings.urlTitleSurfaceMesh3D}>The
            JavaScript 3D Surface Mesh Chart Example</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to visualize <strong>2-dimensional arrays as a height-map</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript 3D Charts</a></p>);

export const tenorCurvesExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleTenorCurvesFeaturedApp,
    path: ExampleStrings.urlTenorCurvesFeaturedApp,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `Demonstrating the capability of SciChart.js to create a composite 2D &amp; 3D Chart application.
        An example like this could be used to visualize Tenor curves in a financial setting,
        or other 2D/3D data combined on a single screen.`,
    seoKeywords: "tenor, curves, 3d, chart, javascript, webgl, canvas"
};
