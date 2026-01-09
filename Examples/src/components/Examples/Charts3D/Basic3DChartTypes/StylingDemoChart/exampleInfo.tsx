import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "StylingDemoChart",
        id: "chart3D_basic3DChartTypes_StylingDemoChart",
        imagePath: "javascript-3d-styling-demo.jpg",
        description:
            "Our team demonstrates how to create a **JavaScript 3D Styling Demo Chart** using SciChart.js, showcasing advanced 3D chart styling capabilities including custom fonts, axis styling, and multiple point marker types.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Our team demonstrates how to create a **JavaScript 3D Styling Demo Chart** using SciChart.js, showcasing advanced 3D chart styling capabilities.",
                title: "JavaScript 3D Styling Demo Chart",
                pageTitle: "JavaScript 3D Styling Demo Chart | Advanced 3D Chart Styling",
                metaDescription:
                    "Create advanced JavaScript 3D Styling Demo using SciChart's 5-star rated JavaScript chart library. Explore custom fonts, axis styling, and multiple point markers. Get your free demo now.",
                markdownContent:
                    "## 3D Styling Demo Chart with JavaScript\n\n### Overview\nThis example demonstrates advanced 3D chart styling capabilities built with SciChart.js using JavaScript. It showcases a comprehensive styling demo featuring multiple point marker types, custom font integration, axis styling controls, and interactive styling features. The example illustrates how to create visually rich 3D charts with extensive customization options without relying on frameworks such as Angular or React.\n\n### Technical Implementation\nThe core of the implementation is the creation of a SciChart 3D surface using the [Creating your first SciChartSurface3D](https://www.scichart.com/documentation/js/current/Creating%20your%20first%20SciChartSurface3D.html) guide. The example sets up a custom 3D world with defined dimensions and configures the camera for optimal viewing. Interaction is enhanced by modifiers such as the MouseWheelZoomModifier3D, OrbitModifier3D (see [OrbitModifier3D](https://www.scichart.com/documentation/js/current/OrbitModifier3D.html) for details), and ResetCamera3DModifier which enable intuitive zooming, panning, and orbiting around the data. The chart features eight different [3D Point Markers](https://www.scichart.com/documentation/js/current/3DPointMarkers.html) including EllipsePointMarker3D, TrianglePointMarker3D, SpherePointMarker3D, CubePointMarker3D, and more, each with unique styling and metadata. Custom Google Fonts are registered and applied to axis labels and titles, demonstrating advanced typography integration.\n\n### Features and Capabilities\nKey features include multiple point marker types with individual styling, dynamic font registration from Google Fonts, comprehensive axis styling controls, and interactive plane visibility management. The example demonstrates how to customize axis planes with different visibility modes, label drawing modes, and title positioning. Advanced styling options include grid bands, major grid lines, label orientation modes, and dynamic color theming. Each data point is rendered with unique metadata including custom colors and scaling factors.\n\n### Integration and Best Practices\nThis implementation serves as a comprehensive template for integrating advanced 3D chart styling into applications using only JavaScript. Best practices demonstrated here include efficient font loading with Promise.all, modular styling control functions, and organized axis configuration. The example shows how to create reusable styling functions for different chart elements and how to manage complex 3D chart interactions. Developers can use these techniques along with detailed SciChart.js documentation to create highly customized and visually appealing 3D charts.",
            },
            react: {
                subtitle:
                    "Our team demonstrates how to create a **React 3D Styling Demo** using SciChart.js, showcasing advanced 3D chart styling capabilities.",
                title: "React 3D Styling Demo",
                pageTitle: "React 3D Styling Demo | Advanced 3D Chart Styling",
                metaDescription:
                    "Create advanced React 3D Styling Demo using SciChart's 5-star rated JavaScript chart library. Explore custom fonts, axis styling, and multiple point markers. Get your free demo now.",
                markdownContent:
                    "## React 3D Styling Demo Chart\n\n### Overview\nThis example demonstrates the implementation of an advanced 3D Styling Demo in a React application using SciChart.js. The chart showcases comprehensive styling capabilities including multiple point marker types, custom font integration, axis styling controls, and interactive styling features. The example demonstrates how to create visually rich 3D charts with extensive customization options using the `<SciChartReact/>` component.\n\n### Technical Implementation\nThe 3D chart is initialized using the `<SciChartReact/>` component, which receives an initialization function (drawExample) that sets up the 3D surface, axes, and chart modifiers such as 3D camera controls (e.g., [MouseWheelZoomModifier3D](https://www.scichart.com/documentation/js/current/MouseWheelZoomModifier3D.html) and [OrbitModifier3D](https://www.scichart.com/documentation/js/current/OrbitModifier3D.html)). The chart features eight different [3D Point Markers](https://www.scichart.com/documentation/js/current/3DPointMarkers.html) including EllipsePointMarker3D, TrianglePointMarker3D, SpherePointMarker3D, CubePointMarker3D, and more. Custom Google Fonts are registered asynchronously and applied to axis labels and titles, demonstrating advanced typography integration. This configuration leverages a WebAssembly context (wasmContext) for optimized performance—a technique further explained in the [SciChart.js User Manual](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html).\n\n### Features and Capabilities\nThe example implements advanced styling features including multiple point marker types with individual styling, dynamic font registration from Google Fonts, comprehensive axis styling controls, and interactive plane visibility management. The styling controls include functions for axis plane visibility, label drawing modes, title positioning, grid bands, major grid lines, and label orientation modes. Each data point is rendered with unique metadata including custom colors and scaling factors, creating a visually diverse and informative 3D scatter plot.\n\n### Integration and Best Practices\nThe React integration leverages the `<SciChartReact/>` component to seamlessly incorporate high-performance WebGL charts with advanced styling capabilities into the React ecosystem. The implementation demonstrates best practices for font loading with Promise.all, modular styling control functions, and organized axis configuration. Developers are encouraged to explore the comprehensive styling API and reuse the modular control functions for creating highly customized 3D charts. The example serves as a template for building visually rich 3D applications with extensive styling options in React.",
            },
            angular: {
                subtitle:
                    "Our team demonstrates how to create a **Angular 3D Styling Demo Chart** using SciChart.js, showcasing advanced 3D chart styling capabilities.",
                title: "Angular 3D Styling Demo Chart",
                pageTitle: "Angular 3D Styling Demo Chart | Advanced 3D Chart Styling",
                metaDescription:
                    "Create advanced Angular 3D Styling Demo using SciChart's 5-star rated JavaScript chart library. Explore custom fonts, axis styling, and multiple point markers. Get your free demo now.",
                markdownContent:
                    "## Angular 3D Styling Demo Chart Example\n\n### Overview\nThis example demonstrates how to integrate SciChart.js into an Angular standalone application to render an advanced 3D Styling Demo chart. It showcases comprehensive styling capabilities including multiple point marker types, custom font integration, axis styling controls, and interactive styling features. The implementation leverages the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package to initialize and render chart components using Angular's standalone component architecture.\n\n### Technical Implementation\nThe chart is configured using the initChart callbacks provided by the Angular components. In the drawExample function, a SciChart3DSurface is created with a specified world dimension and camera settings which are enhanced by adding 3D modifiers such as [OrbitModifier3D](https://www.scichart.com/documentation/js/current/OrbitModifier3D.html) and [MouseWheelZoomModifier3D](https://www.scichart.com/documentation/js/current/Creating%20your%20first%20SciChartSurface3D.html). The chart features eight different [3D Point Markers](https://www.scichart.com/documentation/js/current/3DPointMarkers.html) including EllipsePointMarker3D, TrianglePointMarker3D, SpherePointMarker3D, CubePointMarker3D, and more. Custom Google Fonts are registered asynchronously and applied to axis labels and titles. The use of a WebAssembly context (wasmContext) ensures that the rendering is optimized for high performance, following guidelines available in [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html).\n\n### Features and Capabilities\nThe example provides advanced styling features including multiple point marker types with individual styling, dynamic font registration from Google Fonts, comprehensive axis styling controls, and interactive plane visibility management. It supports multiple interactive camera controls and the ability to reset the camera view using advanced modifiers such as [ResetCamera3DModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/resetcamera3dmodifier.html). The styling controls include functions for axis plane visibility, label drawing modes, title positioning, grid bands, major grid lines, and label orientation modes.\n\n### Integration and Best Practices\nDevelopers can adopt this example as a blueprint for integrating advanced 3D chart styling in Angular environments. The utilization of Angular's standalone components, along with the initChart callback mechanism, allows for clean and modular chart initialization. By following the practices detailed in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/), and effectively using comprehensive styling controls, developers can achieve visually rich and highly customized 3D charts. This example reinforces the importance of reusing the WebAssembly context for performance optimizations and demonstrates best practices in building interactive, high-performance 3D styling demos in Angular.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v4/3d-charts/scichart-3d-basics/scichart-3d-basics-overview/",
                title: "SciChart.js 3D Surface Creation Documentation",
                linkTitle: "JavaScript 3D Surface Creation Documentation",
            },
        ],
        path: "3d-styling-demo-chart",
        metaKeywords: "3d, styling, demo, scatter, chart, javascript, webgl, canvas, fonts, markers",
        onWebsite: false,
        filepath: "Charts3D/Basic3DChartTypes/StylingDemoChart",
        thumbnailImage: "javascript-3d-styling-demo.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

export const stylingDemoChartExampleInfo = createExampleInfo(metaData);
export default stylingDemoChartExampleInfo;
