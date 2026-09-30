import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const markdownContent =
    "## 3D Model Example\n\nThis example loads a 3D model into a `SciChart3DSurface`. The model shown here is a racing car, but nothing in the code is specific to it: the SciChart 3D engine can load **any 3D model**, so the same few lines will show a CAD assembly, a scanned part, a machine, a building or a character.\n\n### How it works\n\n-   A model is not a renderable series, it is a scene entity. A thin `BaseSceneEntity3D` wrapper holds the native model entity and is added to `sciChart3DSurface.rootEntity.children`.\n-   The model is named by its path inside an asset package. The engine appends `.web.pkg` to the package name and fetches the result, so the package may be a bare name served from your site root, or an absolute URL as it is here.\n-   The package downloads in the background, so the example shows a loader until the model is in the scene. The entity has no load event: it reports a node hierarchy only once it has a model, so polling that tells you when the model has arrived.\n-   Call `invalidateElement()` at that point. A cached package can arrive before the first render pass, and without a redraw the scene would stay empty.\n-   `SetModelScale()` sizes the model to the 3D world, and the camera is placed so the whole model is in view when the example opens.\n-   Only the floor plane of the axis cube is drawn here, so the model is not boxed in by the X-Y and Z-Y planes.\n\nOrbit with the left mouse button, zoom with the mouse wheel and double-click to reset the camera.";

const metaData: IExampleMetadata = {
    reactComponent: "Model3DChart",
    id: "chart3D_basic3DChartTypes_Model3DChart",
    imagePath: "javascript-3d-model-chart.jpg",
    description:
        "Demonstrates how to load a 3D model into a `SciChart3DSurface`. The model is wrapped in a `BaseSceneEntity3D` and added to the 3D scene, and the camera is framed so the whole model is in view. The engine can load any 3D model, not just the car shown here.",
    tips: [],
    frameworks: {
        javascript: {
            subtitle:
                "Demonstrates how to load a 3D model in JavaScript and show it in a `SciChart3DSurface`. The engine can load any 3D model, not just the car shown here.",
            title: "JavaScript 3D Model Example",
            pageTitle: "JavaScript 3D Model Example | View 3D JavaScript Charts",
            metaDescription:
                "Load a 3D model in JavaScript with SciChart.js. Add the model to a SciChart3DSurface as a 3D scene entity, frame it with the camera, then orbit and zoom it. Any 3D model can be loaded.",
            markdownContent,
        },
        react: {
            subtitle:
                "Demonstrates how to load a 3D model in React and show it in a `SciChart3DSurface`. The engine can load any 3D model, not just the car shown here.",
            title: "React 3D Model Example",
            pageTitle: "React 3D Model Example | View 3D JavaScript Charts",
            metaDescription:
                "Load a 3D model in React with SciChart.js. Add the model to a SciChart3DSurface as a 3D scene entity, frame it with the camera, then orbit and zoom it. Any 3D model can be loaded.",
            markdownContent,
        },
        angular: {
            subtitle:
                "Demonstrates how to load a 3D model in Angular and show it in a `SciChart3DSurface`. The engine can load any 3D model, not just the car shown here.",
            title: "Angular 3D Model Example",
            pageTitle: "Angular 3D Model Example | View 3D JavaScript Charts",
            metaDescription:
                "Load a 3D model in Angular with SciChart.js. Add the model to a SciChart3DSurface as a 3D scene entity, frame it with the camera, then orbit and zoom it. Any 3D model can be loaded.",
            markdownContent,
        },
    },
    documentationLinks: [
        {
            href: "https://www.scichart.com/documentation/js/v6/3d-charts/scichart-3d-basics/scichart-3d-basics-overview/",
            title: "SciChart.js 3D Charts Documentation",
            linkTitle: "SciChart 3D Basics Documentation",
        },
        {
            href: "https://www.scichart.com/documentation/js/v6/3d-charts/scichart-3d-basics/scichart-surface-camera/",
            title: "SciChart.js 3D Camera Documentation",
            linkTitle: "3D Camera Documentation",
        },
    ],
    path: "3d-model-chart",
    metaKeywords: "3d, model, cad, mesh, scene, entity, chart, javascript, webgl",
    onWebsite: true,
    filepath: "Charts3D/Basic3DChartTypes/Model3DChart",
    thumbnailImage: "javascript-3d-model-chart.jpg",
    sandboxConfig: {},
    markdownContent: null,
    pageLayout: "default",
    extraDependencies: {},
    isNew: true,
};

export default createExampleInfo(metaData);
