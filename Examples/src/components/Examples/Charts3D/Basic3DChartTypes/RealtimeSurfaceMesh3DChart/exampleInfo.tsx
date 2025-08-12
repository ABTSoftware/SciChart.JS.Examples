import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "RealtimeSurfaceMesh3DChart",
        id: "chart3D_basic3DChartTypes_RealtimeSurfaceMesh3DChart",
        imagePath: "javascript-realtime-3d-surface-mesh-chart.jpg",
        description:
            "Learn how to create a realtime updating **JavaScript 3D Surface Mesh Chart** using SciChart.js, and our High Performance JavaScript 3D Chart Library",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Learn how to create a realtime updating **JavaScript 3D Surface Mesh Chart** using SciChart.js, and our High Performance JavaScript 3D Chart Library",
                title: "JavaScript Realtime Surface Mesh 3D Chart",
                pageTitle: "JavaScript Realtime 3D Surface Mesh Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Design a JavaScript 3D Surface Mesh Chart with SciChart.js - feature-rich JavaScript chart library. Represent 2D data in a 3D map. Get your free demo.",
                markdownContent:
                    "## Realtime Surface Mesh 3D Chart (JavaScript)\n\n### Overview\nThis example demonstrates how to build a **real-time 3D surface mesh chart** using SciChart.js in a JavaScript environment. The chart dynamically updates its mesh data by recalculating a heightmap at regular intervals, providing a fluid, animated visualization of mathematical functions.\n\n### Technical Implementation\nThe chart is constructed by creating a SciChart3DSurface and configuring a 3D camera with the [CameraController](https://www.scichart.com/documentation/js/current/The%20SciChartSurface%20Camera.html) and [Vector3](https://www.scichart.com/documentation/js/current/typedoc/classes/vector3.html) to set its position and target. Three numeric axes (X, Y, and Z) are added using NumericAxis3D, and the data is managed through a UniformGridDataSeries3D that is initialized with a helper function (zeroArray2D). The data is updated in real time using the native JavaScript function setInterval, as described in the [Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) documentation.\n\n### Features and Capabilities\nThe example includes several advanced features: \n- **Real-Time Updates**: The heightmap is recalculated every 20 milliseconds, showcasing dynamic data streaming.\n- **3D Surface Mesh Rendering**: The surface is rendered using a custom gradient color palette defined with GradientColorPalette, supporting smooth color transitions and contour effects; more details can be found in the [Surface Mesh 3D Chart Type](https://www.scichart.com/documentation/js/current/The%20SurfaceMesh%203D%20Chart%20Type.html) guide.\n- **Chart Interactivity**: Interactivity modifiers such as [MouseWheelZoomModifier3D](https://www.scichart.com/documentation/js/current/Creating%20your%20first%20SciChartSurface3D.html), [OrbitModifier3D](https://www.scichart.com/documentation/js/current/Creating%20your%20first%20SciChartSurface3D.html), and [ResetCamera3DModifier](https://www.scichart.com/documentation/js/current/Creating%20your%20first%20SciChartSurface3D.html) let users effortlessly explore the 3D environment.\n\n### Integration and Best Practices\nThis implementation leverages JavaScript, ensuring that the chart library can be integrated into any standard web project without framework-specific overhead. Developers should consider [performance optimization techniques](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) to handle rapid real-time updates efficiently. Additionally, using WebAssembly (via the wasmContext) further boosts performance as discussed in the [WebAssembly Integration](https://www.scichart.com/documentation/js/current/Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html) documentation.\n\nBy focusing solely on JavaScript, this example highlights the core capabilities of SciChart.js for creating highly interactive, real-time 3D visualizations with minimal overhead.",
            },
            react: {
                subtitle:
                    "Learn how to create a realtime updating **React 3D Surface Mesh Chart** using SciChart.js, and our High Performance JavaScript 3D Chart Library",
                title: "React Realtime Surface Mesh 3D Chart",
                pageTitle: "React Realtime 3D Surface Mesh Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Design a React 3D Surface Mesh Chart with SciChart.js - feature-rich JavaScript chart library. Represent 2D data in a 3D map. Get your free demo.",
                markdownContent:
                    "## React Realtime Surface Mesh 3D Chart\n\n### Overview\nThis example demonstrates how to create a realtime updating **3D Surface Mesh Chart** within a React application using SciChart.js. The implementation showcases dynamic data streaming and visualization in a high-performance 3D environment powered by WebGL.\n\n### Technical Implementation\nThe chart is initialized using the `<SciChartReact/>` component, which wraps the imperative API of **SciChart3DSurface**. The core logic is encapsulated in a function that sets up the 3D surface, configures axes, and generates a dynamic data series using a 2D array through the **UniformGridDataSeries3D** class. Realtime data updates are driven by a setInterval loop, and the realtime animation approach is detailed in the [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) documentation.\n\n### Features and Capabilities\nKey features of this example include realtime updates to the surface mesh, detailed customization of the mesh appearance with a **GradientColorPalette**, and interactivity enhancements such as mouse wheel zoom, orbit controls, and a camera reset modifier. The demo clearly illustrates how to achieve smooth animated changes in a 3D scene and offers tips on fine-tuning performance for realtime applications, as seen in the [React Realtime 3D Surface Mesh Chart Demo](https://scichart.com/demo/react/realtime-3d-surface-mesh-chart).\n\n### Integration and Best Practices\nIntegration with React is streamlined using the `<SciChartReact/>` component, which leverages TypeScript generics for robust type safety and component reusability. The clear separation between chart setup and realtime update logic makes it easier to manage state and resources. Developers can follow [best practices for React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/) and adopt performance optimization techniques highlighted in the [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) article to ensure efficient rendering and cleanup, especially when managing intervals and resource-intensive operations.\n\n### Additional Technical Insights\nThe example also features advanced 3D camera control using the **CameraController** and explicitly defined world dimensions for a realistic scene. For more in-depth details on configuring and interacting with the 3D chart, refer to the [SciChart3DSurface API Documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/scichart3dsurface.html).",
            },
            angular: {
                subtitle:
                    "Learn how to create a realtime updating **Angular 3D Surface Mesh Chart** using SciChart.js, and our High Performance JavaScript 3D Chart Library",
                title: "Angular Realtime Surface Mesh 3D Chart",
                pageTitle: "Angular Realtime 3D Surface Mesh Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Design a Angular 3D Surface Mesh Chart with SciChart.js - feature-rich JavaScript chart library. Represent 2D data in a 3D map. Get your free demo.",
                markdownContent:
                    "## Angular Realtime Surface Mesh 3D Chart\n\n### Overview\nThis example demonstrates a realtime updating 3D surface mesh chart implemented in an Angular application using SciChart.js. The chart renders a dynamic 3D surface mesh where the data is continuously updated using an interval-based mechanism. The example showcases how to integrate SciChart.js into Angular as a standalone component, leveraging Angular best practices for initialization, configuration, and cleanup.\n\n### Technical Implementation\nThe core logic is encapsulated in a function that creates a SciChart 3D surface, configures a camera using the **CameraController**, and sets up three numeric axes. Data for the surface mesh is generated using a 2D array fed into a **UniformGridDataSeries3D**. The realtime updates are implemented with a simple **setInterval** loop that periodically recalculates the surface values. This implementation follows the guidelines from the [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) documentation for efficient dynamic updates. The code does not use a builder API or hooks, but instead relies on direct imperative calls within the Angular component.\n\n### Features and Capabilities\nThe example features realtime data streaming where the mesh surface dynamically oscillates based on a trigonometric function. Advanced customization is achieved using a **GradientColorPalette** to provide a visually appealing color map that enhances the mesh visualization. Interactive functionalities such as mouse wheel zoom, orbit control, and camera reset are added through modifiers like **MouseWheelZoomModifier3D**, **OrbitModifier3D**, and **ResetCamera3DModifier**. Developers can explore detailed settings by referring to the [SciChart.js 3D Surface Mesh Documentation](https://www.scichart.com/documentation/js/current/The%20SurfaceMesh%203D%20Chart%20Type.html).\n\n### Integration and Best Practices\nIntegration is streamlined using a standalone Angular component that imports the **ScichartAngularComponent**. This approach aligns with the [standalone components](https://angular.io/guide/standalone-components) paradigm in Angular. The separation of chart initialization logic and realtime update control ensures that resource management and cleanup (using techniques similar to those discussed in [Angular component cleanup](https://stackoverflow.com/questions/50356282/proper-disposal-of-scichartsurface)) are handled effectively.\n\nDevelopers should consider performance optimization techniques when dealing with high-frequency updates on WebGL powered charts. Best practices for this can be found in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation, which advise on memory management and efficient rendering strategies for 3D charts.\n\nFurthermore, the example demonstrates a robust integration strategy by cleanly separating the chart configuration from the realtime update logic, ensuring that Angular’s lifecycle hooks can be leveraged for initialization and disposal, thus maintaining optimal performance and resource usage.\n\nThis Angular integration pattern, combined with advanced customization features, makes it a comprehensive reference for building high-performance realtime 3D charts using SciChart.js.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20SurfaceMesh%203D%20Chart%20Type.html",
                title: "SciChart.js 3D Surface Mesh Documentation",
                linkTitle: "JavaScript 3D Surface Mesh Documentation",
            },
        ],
        path: "realtime-3d-surface-mesh-chart",
        metaKeywords: "3d, surface, mesh, chart, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "Charts3D/Basic3DChartTypes/RealtimeSurfaceMesh3DChart",
        thumbnailImage: "javascript-realtime-3d-surface-mesh-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

export const realtimeSurfaceMesh3DChartExampleInfo = createExampleInfo(metaData);
export default realtimeSurfaceMesh3DChartExampleInfo;
