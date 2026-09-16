import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const markdownContent =
    "## Immediate Mesh 3D Chart\n\n`ImmediateLitMeshContext` draws custom lit geometry directly into a `SciChart3DSurface` scene. It is useful when no built-in 3D series can describe the shape you need: a swept path, a non-uniform tube, or application-specific geometry.\n\nUnlike a renderable series, an immediate mesh is a custom `BaseSceneEntity3D` added to `rootEntity.children`. This example builds an aurora-like, banked helix as one triangle strip. Every emitted vertex carries a position, normal, texture coordinate and colour, so the scene light reveals the ribbon's shape while the colour shifts along its length.\n\n### How it works\n\n-   The render mode controls how SciChart joins emitted vertices. This example uses `TSR_RENDERMODE_TRIANGLESTRIP`, so each pair of left and right vertices adds one ribbon segment. Other native render modes cover triangles, lines and points.\n-   `setVertex3()` always takes world coordinates. The ribbon is kept in **data space** and each vertex is mapped through the current render-pass axis calculators, so axis ranges and `worldDimensions` affect the mesh. Normals are recalculated after that conversion, because axis scaling can alter their direction.\n-   For a fixed scene object such as a gizmo or a world-space overlay, pass world coordinates straight to `setVertex3()` and skip the conversion.\n-   `normal3()`, `texCoord2()`, `setVertexColor()` and `setSelectionId()` set the state applied to subsequently emitted vertices. `setVertexColor()` accepts a CSS colour string or an ARGB `number`.\n-   Create and dispose the context inside `Render()`. `dispose()` submits the completed mesh and releases the native resources.\n\nOrbit with the left mouse button, zoom with the mouse wheel and double-click to reset the camera.";

const metaData: IExampleMetadata = {
    reactComponent: "ImmediateMesh3DChart",
    id: "chart3D_basic3DChartTypes_ImmediateMesh3DChart",
    imagePath: "javascript-immediate-mesh-3d-chart.jpg",
    description:
        "Demonstrates how to draw custom lit 3D geometry with `ImmediateLitMeshContext` in SciChart.js. A custom `BaseSceneEntity3D` emits an aurora-like banked helix as a single triangle strip, with per-vertex normals, texture coordinates and colours.",
    tips: [],
    frameworks: {
        javascript: {
            subtitle:
                "Demonstrates how to draw custom lit 3D geometry in JavaScript with `ImmediateLitMeshContext`, by emitting an aurora-like banked helix as a single triangle strip from a custom scene entity.",
            title: "JavaScript Immediate Mesh 3D Chart",
            pageTitle: "JavaScript Immediate Mesh 3D Chart | View 3D JavaScript Charts",
            metaDescription:
                "Draw custom lit 3D geometry in JavaScript with SciChart.js using ImmediateLitMeshContext. Emit per-vertex positions, normals, texture coordinates and colours from a custom 3D scene entity.",
            markdownContent,
        },
        react: {
            subtitle:
                "Demonstrates how to draw custom lit 3D geometry in React with `ImmediateLitMeshContext`, by emitting an aurora-like banked helix as a single triangle strip from a custom scene entity.",
            title: "React Immediate Mesh 3D Chart",
            pageTitle: "React Immediate Mesh 3D Chart | View 3D JavaScript Charts",
            metaDescription:
                "Draw custom lit 3D geometry in React with SciChart.js using ImmediateLitMeshContext. Emit per-vertex positions, normals, texture coordinates and colours from a custom 3D scene entity.",
            markdownContent,
        },
    },
    documentationLinks: [
        {
            href: "https://www.scichart.com/documentation/js/v6/3d-charts/chart-types/immediate-mesh-3d/",
            title: "SciChart.js Immediate Mesh 3D Documentation",
            linkTitle: "Immediate Mesh 3D Documentation",
        },
    ],
    path: "immediate-mesh-3d-chart",
    metaKeywords: "immediate, mesh, custom, geometry, 3d, chart, javascript, webgl",
    onWebsite: true,
    filepath: "Charts3D/Basic3DChartTypes/ImmediateMesh3DChart",
    thumbnailImage: "javascript-immediate-mesh-3d-chart.jpg",
    sandboxConfig: {},
    markdownContent: null,
    pageLayout: "default",
    extraDependencies: {},
    isNew: true,
};

export default createExampleInfo(metaData);
