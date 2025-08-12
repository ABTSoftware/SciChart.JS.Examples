import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "MultiMapExample",
        id: "chart2D_v4Charts_MultiMapExample",
        imagePath: "javascript-multi-map-demo.jpg",
        description:
            "Demonstrates how to create a **Multi Map Example**, by pairing our **FastTriangleRenderableSeries** with GeoJSON data-points turned to triangles with a constrained delaunay triangulation algorithm",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **Multi Map Example**, by pairing our **FastTriangleRenderableSeries** with GeoJSON data-points turned to triangles with a constrained delaunay triangulation algorithm",
                title: "Multi Map Example",
                pageTitle: "Multi Map Example | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a **JavaScript Multi Map Example**, by pairing our **FastTriangleRenderableSeries** with GeoJSON data-points turned to triangles with a constrained delaunay triangulation algorithm",
                markdownContent:
                    "# Multi-Map Example - JavaScript\n\n## Overview\nThis example demonstrates a **multi-map visualization** using SciChart.js, combining [FastTriangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fasttrianglerenderableseries.html) for filled regions and [FastLineRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html) for outlines. The implementation features dynamic data loading and aspect ratio preservation.\n\n## Technical Implementation\nThe chart uses `ETriangleSeriesDrawMode.List` mode to render geographic polygons as triangle meshes, with a color palette for differentiation. A custom `preserveAspectRatio` function maintains correct proportions during resizing. The example includes interactive modifiers like [ZoomExtentsModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/zoomextentsmodifier.html) and implements efficient data management through `setConvertedData` and `clearMap` methods.\n\n## Features and Capabilities\nKey features include dynamic map rendering with color-coded regions, outline visualization, and real-time aspect ratio correction. The solution demonstrates handling complex geographic data structures while maintaining performance through WebGL rendering.\n\n## Integration and Best Practices\nThe implementation showcases proper SciChart surface lifecycle management and efficient data series handling. Developers can extend this for real-time geographic data visualization applications.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **Multi Map Example**, by pairing our **FastTriangleRenderableSeries** with GeoJSON data-points turned to triangles with a constrained delaunay triangulation algorithm",
                title: "Multi Map Example",
                pageTitle: "Multi Map Example | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a **React Multi Map Example**, by pairing our **FastTriangleRenderableSeries** with GeoJSON data-points turned to triangles with a constrained delaunay triangulation algorithm",
                markdownContent:
                    "# Multi-Map Example - React\n\n## Overview\nThis React example demonstrates a **geographic multi-map visualization** using SciChart.js, combining triangle series for filled areas and line series for borders. The component leverages React's lifecycle for efficient chart management.\n\n## Technical Implementation\nThe implementation uses the [SciChartReact](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartreact.html) component with an `initChart` function that creates both [FastTriangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fasttrianglerenderableseries.html) (for filled regions) and [FastLineRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html) (for outlines). The `preserveAspectRatio` function ensures proper scaling, while modifiers like [MouseWheelZoomModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/mousewheelzoommodifier.html) enable interaction.\n\n## Features and Capabilities\nThe example features dynamic data loading through `setConvertedData`, color-coded regions using a predefined palette, and automatic aspect ratio maintenance. The solution demonstrates React-specific patterns for managing complex chart state and updates.\n\n## Integration and Best Practices\nThe implementation follows React best practices by encapsulating chart logic and exposing clean API methods (`setMap`, `clearMap`). Developers can integrate this with geographic data pipelines while benefiting from SciChart's WebGL performance.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Multi Map Example**, by pairing our **FastTriangleRenderableSeries** with GeoJSON data-points turned to triangles with a constrained delaunay triangulation algorithm",
                title: "Multi Map Example",
                pageTitle: "Multi Map Example | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a **Angular Multi Map Example**, by pairing our **FastTriangleRenderableSeries** with GeoJSON data-points turned to triangles with a constrained delaunay triangulation algorithm",
                markdownContent:
                    "# Multi-Map Example - Angular\n\n## Overview\nThis Angular example showcases a **geographic visualization** using SciChart's [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular), rendering complex maps through triangle and line series in a standalone component.\n\n## Technical Implementation\nThe chart initializes via `[initChart]` input, creating multiple [FastTriangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fasttrianglerenderableseries.html) instances for filled areas and [FastLineRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html) for borders. The implementation includes a dynamic color palette and uses `preserveAspectRatio` for responsive scaling. Interactive tools like [ZoomPanModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html) enhance usability.\n\n## Features and Capabilities\nKey features include efficient geographic data rendering through triangle meshes, outline visualization with customizable styling, and automatic viewport management. The example demonstrates Angular-specific patterns for chart integration and data binding.\n\n## Integration and Best Practices\nThe solution follows Angular standalone component practices, with proper resource cleanup handled by the `ScichartAngularComponent`. Developers can extend this for GIS applications by connecting to geographic data services.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Band%20Series%20type.html",
                title: "The specific page for the JavaScript Digital Line Chart documentation will help you to get started",
                linkTitle: "JavaScript Band Chart Documentation",
            },
        ],
        path: "multi-map-example",
        metaKeywords: "band, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/MultiMapExample",
        thumbnailImage: "javascript-multi-map-demo.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

const eampleInfo = createExampleInfo(metaData);
export default eampleInfo;
