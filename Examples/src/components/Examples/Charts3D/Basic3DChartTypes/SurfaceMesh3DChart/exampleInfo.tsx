import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts3DBasic3DChartTypesSurfaceMesh3DChart",
        imagePath: "javascript-3d-surface-mesh-chart.jpg",
        description:
            "Learn how to create a detailed **JavaScript 3D Surface Mesh Chart** using SciChart.js, and our High Performance JavaScript 3D Chart Library",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Learn how to create a detailed **JavaScript 3D Surface Mesh Chart** using SciChart.js, and our High Performance JavaScript 3D Chart Library",
                title: "JavaScript Surface Mesh 3D Chart",
                pageTitle: "JavaScript 3D Surface Mesh Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Design a JavaScript 3D Surface Mesh Chart with SciChart.js - feature-rich JavaScript chart library. Represent 2D data in a 3D map. Get your free demo.",
                markdownContent:
                    "## Surface Mesh 3D Chart - Vanilla JavaScript\n\n### Overview\nThis example demonstrates how to create a 3D surface mesh chart using SciChart.js in vanilla JavaScript. The example constructs a heightmap using a 2D array and renders it with a dynamic color gradient, providing an interactive 3D visualization. Developers can learn how to efficiently set up a 3D chart project as explained in the [3D Tutorial 01](https://www.scichart.com/documentation/js/current/3D%20Tutorial%2001%20-%20Setting%20up%20a%203D%20Chart%20Project%20with%20SciChart.js.html).\n\n### Technical Implementation\nThe implementation begins with the creation of a SciChart3DSurface in plain JavaScript, leveraging the high-performance WebAssembly context (wasmContext) for rendering. The camera is precisely positioned using the **CameraController** and **Vector3** classes, as documented in [The SciChartSurface Camera](https://www.scichart.com/documentation/js/current/The%20SciChartSurface%20Camera.html). Next, the world dimensions and three numeric axes are defined with **NumericAxis3D**, which is further detailed in the [Numeric Axis in SciChart3D](https://www.scichart.com/documentation/js/current/Axis%20Types%20in%20SciChart3D.html) guide. A uniform grid heightmap is then generated using the helper function **zeroArray2D** and populated with sine wave calculations. This data is subsequently wrapped in a **UniformGridDataSeries3D** to feed into the renderable series. For color mapping, the example employs a **GradientColorPalette** to create custom gradient fills, which you can read more about in the [GradientColorPalette documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/gradientcolorpalette.html). Finally, the surface mesh is rendered as a solid wireframe using **SurfaceMeshRenderableSeries3D**.\n\n### Features and Capabilities\nThe example integrates several advanced features including interactive chart modifiers such as **MouseWheelZoomModifier3D**, **OrbitModifier3D**, **ResetCamera3DModifier**, and **TooltipModifier3D**. These modifiers offer an intuitive user experience for exploring the 3D visualization. For additional details on interactivity, refer to the [Tooltip Modifier 3D documentation](https://www.scichart.com/documentation/js/current/TooltipModifier3D.html). The use of WebAssembly (wasmContext) and WebGL-based rendering ensures high performance even with complex 3D datasets, following best practices as described in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide.\n\n### Integration and Best Practices\nThis example emphasizes a clean integration approach by using vanilla JavaScript without reliance on frameworks like React or Angular. It showcases how to directly manipulate the SciChart3DSurface and its components to achieve desired visual effects. Additionally, developers are encouraged to explore performance optimization techniques through efficient WebGL rendering and proper use of the wasmContext, as outlined in the [SciChart JS User Manual](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html). By following these practices, one can build highly responsive and visually rich 3D charts.\n",
            },
            react: {
                subtitle:
                    "Learn how to create a detailed **React 3D Surface Mesh Chart** using SciChart.js, and our High Performance JavaScript 3D Chart Library",
                title: "React Surface Mesh 3D Chart",
                pageTitle: "React 3D Surface Mesh Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Design a React 3D Surface Mesh Chart with SciChart.js - feature-rich JavaScript chart library. Represent 2D data in a 3D map. Get your free demo.",
                markdownContent:
                    "## Surface Mesh 3D Chart in React\n\n### Overview\nThis example demonstrates how to build an interactive **SciChart.js 3D Surface Mesh Chart** using the React framework. The implementation leverages the SciChartReact component to initialize the chart by passing a custom drawExample function, creating a captivating 3D visualization from a heightmap array with an integrated heatmap legend.\n\n### Technical Implementation\nThe chart is created by instantiating a SciChart3DSurface with WebAssembly support, ensuring efficient performance. The drawExample function configures the 3D scene by setting up the camera using the CameraController, defining world dimensions, and creating numeric axes. A two-dimensional array of height values is generated using a mathematical sine function, and this data is used to produce a surface mesh via the UniformGridDataSeries3D and SurfaceMeshRenderableSeries3D classes. Interactive modifiers such as MouseWheelZoomModifier3D, OrbitModifier3D, ResetCamera3DModifier, and TooltipModifier3D are added to enhance user interaction. This approach follows [best practices for initializing SciChart3DSurface in React](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html) and emphasizes efficient WebAssembly usage as detailed in the [SciChart3DSurface API documentation](https://www.scichart.com/documentation/js/current/Creating%20your%20first%20SciChartSurface3D.html).\n\n### Features and Capabilities\n- **Real-time Interactivity:** Interactive modifiers provide smooth zooming, orbiting, and tooltip support for a dynamic user experience.\n- **Advanced Customizations:** The example uses a GradientColorPalette to map colors onto the surface mesh, while the heatmap legend adds an extra layer of visual context.\n- **Detailed 3D Visualization:** The integration of a customized camera, precise axis definitions, and a generated data series allows for an accurate depiction of 3D data.\n\n### Integration and Best Practices\nThe React integration is handled seamlessly via the SciChartReact component, which accepts functions like drawExample and drawHeatmapLegend as props. This pattern promotes modularity and reusability in React applications. Developers can refer to discussions on [React component patterns](https://medium.com/flyparakeet/react-component-patterns-e7fb75be7bb0) and the [SciChart React integration blog](https://www.scichart.com/blog/react-charts-with-scichart-js/) for deeper insights into component-based chart setups. Furthermore, leveraging WebAssembly for rendering provides significant performance benefits, a topic further explored in the context of [JavaScript performance optimization](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/). Overall, the implementation emphasizes interactive 3D visualization and efficient rendering in a modern React environment.",
            },
            angular: {
                subtitle:
                    "Learn how to create a detailed **Angular 3D Surface Mesh Chart** using SciChart.js, and our High Performance JavaScript 3D Chart Library",
                title: "Angular Surface Mesh 3D Chart",
                pageTitle: "Angular 3D Surface Mesh Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Design a Angular 3D Surface Mesh Chart with SciChart.js - feature-rich JavaScript chart library. Represent 2D data in a 3D map. Get your free demo.",
                markdownContent:
                    "## Angular Surface Mesh 3D Chart\n\n### Overview\nThis example demonstrates how to create an interactive **3D Surface Mesh Chart** using SciChart.js in an Angular application. The implementation leverages the Angular standalone component paradigm by integrating the SciChartAngularComponent and using Angular input binding patterns to initialize the chart with a custom draw function.\n\n### Technical Implementation\nThe chart is instantiated by creating a SciChart3DSurface within the Angular context. The component binds a custom draw function via the Angular property binding mechanism ([Property binding - Angular](https://angular.io/guide/property-binding)) to the SciChartAngularComponent. The draw function sets up the scene by configuring the camera using the CameraController, defining world dimensions, and establishing numeric axes. A custom heightmap is generated using a mathematical sine function, which is then visualized through a uniform grid data series and rendered as a surface mesh by the SurfaceMeshRenderableSeries3D. The example also incorporates WebAssembly-based rendering for optimal performance, as detailed in the [JavaScript 3D Surface Mesh Chart - SciChart](https://www.scichart.com/example/javascript-chart/javascript-3d-surface-mesh-chart/) documentation.\n\n### Features and Capabilities\nThe example offers advanced technical features including real-time interactivity with modifiers such as MouseWheelZoomModifier3D, OrbitModifier3D, ResetCamera3DModifier, and TooltipModifier3D. These interactive controls enhance user engagement by facilitating dynamic zoom, pan, and tooltip-based data exploration. Additionally, developers can customize the visual appearance of the chart using a GradientColorPalette to define a detailed color mapping on the mesh.\n\n### Integration and Best Practices\nIntegrating SciChart.js within an Angular application is streamlined by using function binding as an input property, which enhances modularity and simplicity. The chart initialization follows best practices, as seen in the implementation of dependency injection for third-party libraries in Angular ([How to integrate third party libraries and widgets into Angular](https://angular.schule/blog/2019-02-third-party-libraries-and-widgets/)). Moreover, performance optimizations are achieved by leveraging WebAssembly, ensuring that high rendering performance is maintained even with complex 3D visualizations ([SciChart.js Performance Demo: 1 Million Datapoints in under 15ms](https://www.scichart.com/blog/scichart-js-performance-demo-1-million-datapoints-70ms/)). This tightly integrated approach ensures that developers can deliver customized, high-performance 3D charts in Angular while following modern software practices.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20SurfaceMesh%203D%20Chart%20Type.html",
                title: "SciChart.js 3D Surface Mesh Documentation",
                linkTitle: "JavaScript 3D Surface Mesh Documentation",
            },
        ],
        path: "3d-surface-mesh-chart",
        metaKeywords: "3d, surface, mesh, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts3D/Basic3DChartTypes/SurfaceMesh3DChart",
        thumbnailImage: "javascript-3d-surface-mesh-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const surfaceMesh3DChartExampleInfo = createExampleInfo(metaData);
