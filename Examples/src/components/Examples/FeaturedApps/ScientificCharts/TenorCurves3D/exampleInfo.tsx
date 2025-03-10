import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsScientificChartsTenorCurves3D",
        imagePath: "javascript-2d-3d-chart-tenor-curves-example.jpg",
        description:
            "In financial applications sometimes you want to visualise options-volatility smiles or interest-rate swap tenor curves. This can be done in SciChart.js using a 3D Surface Mesh (heightmap) chart type.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "In financial applications sometimes you want to visualise options-volatility smiles or interest-rate swap tenor curves. This can be done in SciChart.js using a 3D Surface Mesh (heightmap) chart type.",
                title: "Tenor Curves Demo",
                pageTitle: "Tenor Curves Demo",
                metaDescription:
                    "Demonstrating the capability of SciChart.js to create a composite 2D &amp; 3D Chart application. An example like this could be used to visualize Tenor curves in a financial setting, or other 2D/3D data combined on a single screen.",
                markdownContent:
                    "## Tenor Curves 3D JavaScript\n\n### Overview\nThe Tenor Curves 3D example demonstrates how to create an interactive 3D chart alongside complementary 2D line charts and a heatmap legend using SciChart.js in a JavaScript environment. This example leverages advanced WebGL rendering to display a 3D surface mesh, while also showcasing dynamic data visualizations and custom heatmap legend configurations.\n\n### Technical Implementation\nThe implementation begins by creating a 3D chart with `SciChart3DSurface`. A [CameraController](https://www.scichart.com/documentation/js/current/Creating%20your%20first%20SciChartSurface3D.html) is used to set the camera position and target, enabling an interactive viewing experience. Interaction modifiers such as [OrbitModifier3D](https://www.scichart.com/documentation/js/current/OrbitModifier3D.html) and `MouseWheelZoomModifier3D` are added to facilitate smooth navigation within the 3D scene. Data is generated dynamically by computing a parabola function and adjusting parameters using a switch-case statement. A helper function, which utilizes `zeroArray2D` to initialize a 2D array, is used to provide dummy data for the `UniformGridDataSeries3D`. For performance optimization when working with large datasets, refer to the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n### Features and Capabilities\nThis example highlights several advanced features:\n\n- A high-performance 3D interactive chart combining a surface mesh with a dynamic color mapping implemented via a [GradientColorPalette](https://www.scichart.com/documentation/js/current/typedoc/classes/gradientcolorpalette.html).\n- Two distinct 2D line charts that demonstrate different methods of data slicing and aggregation.\n- A custom heatmap legend configured to reflect the height map interpolation, as detailed in [Applying Palettes to Surface Meshes](https://www.scichart.com/documentation/win/current/Applying%20Palettes%20to%20Surface%20Meshes.html).\n\n### Integration and Best Practices\nThe example is structured to integrate multiple chart types within a single layout, with the 3D surface mesh, heatmap legend, and 2D line charts arranged in a responsive design. Although implemented in JavaScript, the same techniques can be adapted for frameworks like React or Angular. The use of control flow (via switch-case statements) for dynamic data generation and the optimization strategies provided in the [WebGL Performance Optimization](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) guide ensure smooth rendering and interactive performance. For further integration details and best practices, developers are encouraged to review the [SciChart.js JavaScript Charts User Manual](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html).",
            },
            react: {
                subtitle:
                    "In financial applications sometimes you want to visualise options-volatility smiles or interest-rate swap tenor curves. This can be done in SciChart.js using a 3D Surface Mesh (heightmap) chart type.",
                title: "Tenor Curves Demo",
                pageTitle: "Tenor Curves Demo",
                metaDescription:
                    "Demonstrating the capability of SciChart.js to create a composite 2D &amp; 3D Chart application. An example like this could be used to visualize Tenor curves in a financial setting, or other 2D/3D data combined on a single screen.",
                markdownContent:
                    "## Tenor Curves 3D (React)\n\n### Overview\nThis example demonstrates how to create a composite chart layout in React that combines a 3D surface mesh with two 2D line charts and a heatmap legend. The visualization is designed to model financial data such as tenor curves in swap markets or options-volatility smiles using the power of SciChart.js in a React environment.\n\n### Technical Implementation\nThe application leverages the `<SciChartReact/>` component to integrate SciChart.js with React. Asynchronous initialization is employed to ensure that the charts render efficiently once the WebAssembly context is available. Each chart (3D surface mesh, two 2D mountain charts, and a heatmap legend) is initialized with its own dedicated function (e.g., `draw3DChart`, `drawLineChart1`, `drawLineChart2`, `drawHeatmapLegend`) which encapsulate the chart configuration and data binding logic. For further details on asynchronous initialization and React integration, please see [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/).\n\n### Features and Capabilities\nThe example showcases several advanced features: \n- A **3D Surface Mesh** that visualizes a heightmap derived from dummy tenor curve data using custom gradient color mapping. More details can be found in the [JavaScript 3D Surface Mesh Chart Documentation](https://www.scichart.com/documentation/js/current/The%20SurfaceMesh%203D%20Chart%20Type.html).\n- Two 2D **Mountain Charts** that display averaged slice data from the same underlying dataset, providing a complementary view of the financial visualization.\n- An integrated **Heatmap Legend** that synchronizes with the 3D chart’s color palette, offering an intuitive visual guide for interpreting data values.\n\n### Integration and Best Practices\nThe implementation follows best practices for composing React components by utilizing CSS Flexbox for responsive layouts and ensuring that each `<SciChartReact/>` component is self-contained. Developers can reference [Creating a React Dashboard with SciChart.js, SciChart-React](https://www.scichart.com/blog/creating-a-react-dashboard-with-scichart-js-scichart-react-and-deepseek-r1/) for additional insights on effective dashboard composition.\n\nPerformance is optimized by isolating each chart’s creation logic and minimizing overlapping WebGL contexts. This aligns with recommended techniques for asynchronous chart initialization in React, as discussed in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).\n",
            },
            angular: {
                subtitle:
                    "In financial applications sometimes you want to visualise options-volatility smiles or interest-rate swap tenor curves. This can be done in SciChart.js using a 3D Surface Mesh (heightmap) chart type.",
                title: "Tenor Curves Demo",
                pageTitle: "Tenor Curves Demo",
                metaDescription:
                    "Demonstrating the capability of SciChart.js to create a composite 2D &amp; 3D Chart application. An example like this could be used to visualize Tenor curves in a financial setting, or other 2D/3D data combined on a single screen.",
                markdownContent:
                    "## Tenor Curves Demo 3D with Angular\n\n### Overview\nThis example demonstrates a composite chart layout built with Angular where a 3D surface mesh is combined with two 2D line charts and an integrated heatmap legend. The application is designed to visualize financial data, such as tenor curves, by leveraging the power of SciChart.js. The charts are embedded inside Angular standalone components using the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package.\n\n### Technical Implementation\nThe implementation uses asynchronous initialization for each chart through dedicated functions like `draw3DChart`, `drawLineChart1`, `drawLineChart2` and `drawHeatmapLegend`. These functions are passed to the Angular component through input bindings, ensuring that each chart initializes independently when its WebAssembly context becomes available. For detailed guidance on asynchronous chart initialization, refer to [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/). The code configures camera settings, axis definitions, rendering series, and color mapping to render the charts efficiently.\n\n### Features and Capabilities\nThe example integrates multiple advanced features: \n- A **3D Surface Mesh** chart that uses a height map generated from tenor curve data with custom gradient color palettes. This is aligned with the guidelines provided in the [SciChart.js 3D Surface Mesh Documentation](https://www.scichart.com/documentation/js/current/The%20SurfaceMesh%203D%20Chart%20Type.html).\n- Two **2D Mountain Charts** which aggregate and present slice data from the underlying dataset.\n- An integrated **Heatmap Legend** is employed to visually correlate the color gradient with data values, adding clarity to the 3D visualization.\n\n### Integration and Best Practices\nThe charts are rendered within Angular's standalone components using input bindings, demonstrating best practices in Angular component integration. Developers can refer to the [Angular Responsive Design: Complete Guide](https://blog.angular-university.io/angular-responsive-design/) for strategies that ensure the charts and layouts remain adaptive across devices. Additionally, the composite layout strategy, which integrates several chart components in a single view, follows robust practices for managing multiple WebGL contexts in Angular applications. For further insights on composite layout strategies, the [3D Tutorial 01 - Setting up a 3D Chart Project with SciChart.js](https://www.scichart.com/documentation/js/current/3D%20Tutorial%2001%20-%20Setting%20up%20a%203D%20Chart%20Project%20with%20SciChart.js.html) provides valuable context.\n\nThe approach in this example emphasizes performance optimizations by isolating the chart initialization logic and reducing overlapping WebGL contexts, ensuring smooth and responsive interactions. This makes it an ideal reference for Angular developers looking to build real-time, composite data visualizations with SciChart.js.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20SurfaceMesh%203D%20Chart%20Type.html",
                title: "SciChart.js 3D Surface Mesh Documentation",
                linkTitle: "JavaScript 3D Surface Mesh Chart Documentation",
            },
        ],
        path: "2d-3d-chart-tenor-curves-example",
        metaKeywords: "tenor, curves, 3d, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/ScientificCharts/TenorCurves3D",
        thumbnailImage: "javascript-2d-3d-chart-tenor-curves-example.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const tenorCurvesExampleInfo = createExampleInfo(metaData);
