import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarMapExample",
        id: "chart2D_polarCharts_PolarMapExample",
        imagePath: "javascript-polar-map-demo.jpg",
        description:
            "Demonstrates how to create a **Polar Map Example** using our **PolarTriangleRenderableSeries** class, along with a triangulation alorithm.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **Polar Map Example** using our **PolarTriangleRenderableSeries** class, along with a triangulation alorithm.",
                title: "Polar Map Example",
                pageTitle: "Polar Map Example | JavaScript Charts | View Examples",
                metaDescription: null,
                markdownContent:
                    "# Polar Map Example - JavaScript\n\n## Overview\nThis example demonstrates how to create a **polar map visualization** using SciChart.js in JavaScript. The implementation renders geographic data as a series of colored triangles on a polar coordinate system, with options to view from either the North or South pole.\n\n## Technical Implementation\nThe chart uses a [PolarNumericAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/polarnumericaxis.html) for angular (longitude) and radial (latitude) coordinates. Geographic polygons are converted to triangles using a [constrained Delaunay triangulation](https://www.scichart.com/documentation/js/current/typedoc/classes/fasttrianglerenderableseries.html) algorithm. Each triangle's color represents population density, calculated via an interpolation function between white and blue.\n\n## Features and Capabilities\nThe visualization includes interactive modifiers like [PolarPanModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/polarpanmodifier.html) and [PolarZoomExtentsModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/polarzoomextentsmodifier.html). The `flippedCoordinates` property enables switching between North and South pole views dynamically.\n\n## Integration and Best Practices\nThe example follows best practices for WebAssembly initialization and surface disposal. Geographic data is loaded asynchronously from a JSON file, with proper error handling.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **Polar Map Example** using our **PolarTriangleRenderableSeries** class, along with a triangulation alorithm.",
                title: "Polar Map Example",
                pageTitle: "Polar Map Example | JavaScript Charts | View Examples",
                metaDescription: null,
                markdownContent:
                    "# Polar Map Example - React\n\n## Overview\nThis React implementation showcases a **polar map visualization** using SciChart's [SciChartReact](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartreact.html) component. The example displays geographic data as color-coded triangles on a polar coordinate system with view switching capabilities.\n\n## Technical Implementation\nThe chart surface is initialized via the `initChart` prop, which creates a [SciChartPolarSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpolarsurface.html) with angular and radial axes. React hooks manage state for the pole view preference (North/South) and geographic data loading.\n\n## Features and Capabilities\nThe component includes view toggle buttons that update the chart's `flippedCoordinates` property. Data is fetched asynchronously and processed using the same triangulation algorithm as the JavaScript version. The implementation leverages React's lifecycle management for clean resource disposal.\n\n## Integration and Best Practices\nThe example demonstrates proper integration of SciChart with React's state management and effect hooks. The [SciChartReact](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartreact.html) component handles WASM context and surface lifecycle automatically.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Polar Map Example** using our **PolarTriangleRenderableSeries** class, along with a triangulation alorithm.",
                title: "Polar Map Example",
                pageTitle: "Polar Map Example | JavaScript Charts | View Examples",
                metaDescription: null,
                markdownContent:
                    "# Polar Map Example - Angular\n\n## Overview\nThis Angular implementation demonstrates a **polar map visualization** using the [SciChart Angular](https://www.npmjs.com/package/scichart-angular) wrapper. The standalone component displays geographic data as triangles on polar coordinates with dynamic view switching.\n\n## Technical Implementation\nThe chart is initialized through the `[initChart]` input binding, which creates a [SciChartPolarSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpolarsurface.html) with configured axes. Geographic data is loaded via HTTP client and processed into triangles using the constrained Delaunay algorithm.\n\n## Features and Capabilities\nThe component maintains the same core functionality as other frameworks, including population-based coloring and polar coordinate transformations. Angular's change detection ensures proper updates when switching between North/South pole views.\n\n## Integration and Best Practices\nThe example follows Angular best practices for standalone components and async data loading. The [SciChart Angular](https://www.npmjs.com/package/scichart-angular) wrapper simplifies integration while maintaining full access to SciChart's API.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Band%20Series%20type.html",
                title: "The specific page for the JavaScript Digital Line Chart documentation will help you to get started",
                linkTitle: "JavaScript Band Chart Documentation",
            },
        ],
        path: "polar-map-example",
        metaKeywords: "polar, map, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarMapExample",
        thumbnailImage: "javascript-polar-map-demo.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

const eampleInfo = createExampleInfo(metaData);
export default eampleInfo;
