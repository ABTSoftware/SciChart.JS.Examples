import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts3DBasic3DChartTypesPointLine3DChart",
        imagePath: "javascript-3d-point-line-chart.jpg",
        description:
            "Our team demonstrates how to create a **JavaScript 3D Point Line Chart** using SciChart.js, capable of creating detailed 3D JavaScript Charts.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Our team demonstrates how to create a **JavaScript 3D Point Line Chart** using SciChart.js, capable of creating detailed 3D JavaScript Charts.",
                title: "JavaScript Point Line 3D Chart",
                pageTitle: "JavaScript 3D Point Line Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Create detailed JavaScript 3D Line Chart using SciChart's 5-star rated JavaScript chart library. Supports large datasets. Get your free demo now.",
                markdownContent:
                    "## Point Line 3D Chart with Vanilla JavaScript\n\n### Overview\nThis example demonstrates a sophisticated 3D point-line chart built with SciChart.js using vanilla JavaScript. It visualizes spectral data generated via a Fourier Transform (using the Radix2FFT algorithm) and displays the frequency domain in a dynamic 3D scene. The example illustrates how to integrate complex data processing and 3D rendering without relying on frameworks such as Angular or React.\n\n### Technical Implementation\nThe core of the implementation is the creation of a SciChart 3D surface using the [Creating your first SciChartSurface3D](https://www.scichart.com/documentation/js/current/Creating%20your%20first%20SciChartSurface3D.html) guide. The example sets up a custom 3D world with defined dimensions and configures the camera using the CameraController. Interaction is enhanced by modifiers such as the MouseWheelZoomModifier3D, OrbitModifier3D (see [OrbitModifier3D](https://www.scichart.com/documentation/js/current/OrbitModifier3D.html) for details), and ResetCamera3DModifier which enable intuitive zooming, panning, and orbiting around the data. Additionally, three 3D NumericAxes are configured using the [NumericAxis3D](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis3d.html) API. Data points are enriched with custom metadata that maps spectral intensities to color gradients. This metadata formatting leverages a gradient-stop approach and a utility function to convert CSS color strings into UInt ARGB values, ensuring accurate per-point styling. The renderable series is then created using the [Point Line 3D Chart Type](https://www.scichart.com/documentation/js/current/ThePointLine3DChartType.html) for a smooth visual output.\n\n### Features and Capabilities\nKey features include the generation of dynamic spectral data, efficient FFT-based signal processing, and advanced 3D rendering. The example further demonstrates how to customize chart appearance through adjustable stroke thickness, opacity, and per-point metadata coloring. A separate heatmap legend, created via the [HeatmapLegend](https://www.scichart.com/documentation/js/current/typedoc/classes/heatmaplegend.html) API, provides a visual mapping of data values to color scales, enhancing interpretability.\n\n### Integration and Best Practices\nThis implementation serves as a template for integrating high-performance 3D charts into applications using only vanilla JavaScript. Best practices demonstrated here include organizing the code into clear asynchronous initialization steps, optimizing performance by limiting the number of rendered points, and applying efficient color parsing routines. Developers can use these techniques along with detailed SciChart.js documentation to customize and extend the chart’s functionality as needed.",
            },
            react: {
                subtitle:
                    "Our team demonstrates how to create a **React 3D Point Line Chart** using SciChart.js, capable of creating detailed 3D JavaScript Charts.",
                title: "React Point Line 3D Chart",
                pageTitle: "React 3D Point Line Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Create detailed React 3D Line Chart using SciChart's 5-star rated JavaScript chart library. Supports large datasets. Get your free demo now.",
                markdownContent:
                    "## React Point Line 3D Chart\n\n### Overview\nThis example demonstrates the implementation of a 3D Point Line Chart in a React application using SciChart.js. The chart is designed to visualize spectral data generated via a Fourier transform, with dynamic color scaling achieved through metadata formatting. The example showcases the use of multiple SciChartReact components to layer both the primary 3D chart and an accompanying heatmap legend.\n\n### Technical Implementation\nThe 3D chart is initialized using the SciChartReact component, which receives an initialization function (drawExample) that sets up the 3D surface, axes, and chart modifiers such as 3D camera controls (e.g., [MouseWheelZoomModifier3D](https://www.scichart.com/documentation/js/current/MouseWheelZoomModifier3D.html) and [OrbitModifier3D](https://www.scichart.com/documentation/js/current/OrbitModifier3D.html)). Data for the chart is dynamically generated; spectral data is created and processed using a Fourier transform, and a metadata formatting function dynamically assigns color and scaling to each data point. This configuration leverages a WebAssembly context (wasmContext) for optimized performance—a technique further explained in the [SciChart.js User Manual](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html).\n\n### Features and Capabilities\nThe example implements advanced charting features including real-time spectral data computation and efficient rendering of multiple 3D series. The dynamic metadata formatting enables smooth color gradients based on data values, while the customizable camera controls provide an intuitive zoom and pan experience. Additionally, the integration of a separately rendered heatmap legend enhances the visual storytelling of the chart by providing context to the power (dB) measurements.\n\n### Integration and Best Practices\nThe React integration leverages the SciChartReact component to seamlessly incorporate high-performance WebGL charts into the React ecosystem. The layout management is handled by a custom ChartGroupLoader which organizes the primary chart and legend components, following [best practices for React integration with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/). Developers are encouraged to explore performance optimization techniques, such as minimizing re-rendering and reusing the WebAssembly context, to maintain smooth interactivity even with large datasets. Furthermore, the example demonstrates best practices in layering multiple SciChartReact components to create complex chart layouts, as seen in this [React chart layering approach](https://demo.scichart.com/react/chart-legends).",
            },
            angular: {
                subtitle:
                    "Our team demonstrates how to create a **Angular 3D Point Line Chart** using SciChart.js, capable of creating detailed 3D JavaScript Charts.",
                title: "Angular Point Line 3D Chart",
                pageTitle: "Angular 3D Point Line Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Create detailed Angular 3D Line Chart using SciChart's 5-star rated JavaScript chart library. Supports large datasets. Get your free demo now.",
                markdownContent:
                    "## Angular 3D Point Line Chart Example\n\n### Overview\nThis example demonstrates how to integrate SciChart.js into an Angular standalone application to render an advanced 3D point-line chart. It visualizes spectral data transformed through a Fourier algorithm and applies dynamic metadata for color and scaling. The implementation leverages the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package to initialize and render chart components using Angular’s standalone component architecture.\n\n### Technical Implementation\nThe chart is configured using the initChart callbacks provided by the Angular components. In the drawExample function, a SciChart3DSurface is created with a specified world dimension and camera settings which are enhanced by adding 3D modifiers such as [OrbitModifier3D](https://www.scichart.com/documentation/js/current/OrbitModifier3D.html) and [MouseWheelZoomModifier3D](https://www.scichart.com/documentation/js/current/Creating%20your%20first%20SciChartSurface3D.html). Spectral data is generated dynamically and processed using a Fourier transform, while a helper function formats the metadata so that each point is rendered with the correct color and scale as outlined in the [Point Line 3D Chart Documentation](https://www.scichart.com/documentation/js/current/ThePointLine3DChartType.html). The use of a WebAssembly context (wasmContext) ensures that the rendering is optimized for high performance, following guidelines available in [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html).\n\n### Features and Capabilities\nThe example provides advanced features including real-time spectral data visualization and sophisticated 3D navigation. It supports multiple interactive camera controls and the ability to reset the camera view using advanced modifiers such as [ResetCamera3DModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/resetcamera3dmodifier.html). A separate heatmap legend is also rendered alongside the main chart to provide additional context, showcasing the capability for layered chart designs and dynamic metadata styling.\n\n### Integration and Best Practices\nDevelopers can adopt this example as a blueprint for integrating SciChart.js in Angular environments. The utilization of Angular’s standalone components, along with the initChart callback mechanism, allows for clean and modular chart initialization. By following the practices detailed in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/), and effectively using 3D camera controls, developers can achieve efficient rendering and optimal user experience. This example reinforces the importance of reusing the WebAssembly context for performance optimizations and demonstrates best practices in building interactive, high-performance 3D charts in Angular.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/ThePointLine3DChartType.html",
                title: "SciChart.js 3D Point Line Chart Documentation",
                linkTitle: "JavaScript 3D Point Line Chart Documentation",
            },
        ],
        path: "3d-point-line-chart",
        metaKeywords: "3d, bubble, chart, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "Charts3D/Basic3DChartTypes/PointLine3DChart",
        thumbnailImage: "javascript-3d-point-line-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const pointLine3DChartExampleInfo = createExampleInfo(metaData);
