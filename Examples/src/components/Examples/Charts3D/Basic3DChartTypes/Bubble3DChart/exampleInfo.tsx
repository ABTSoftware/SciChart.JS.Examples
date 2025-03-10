import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts3DBasic3DChartTypesBubble3DChart",
        imagePath: "javascript-3d-bubble-chart.jpg",
        description:
            "Our team demonstrates how to create a **JavaScript 3D Bubble Chart** using SciChart.js, capable of creating detailed 3D JavaScript Charts.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Our team demonstrates how to create a **JavaScript 3D Bubble Chart** using SciChart.js, capable of creating detailed 3D JavaScript Charts.",
                title: "JavaScript 3D Bubble Chart",
                pageTitle: "JavaScript 3D Bubble Chart | 3D JavaScript Charts | View Now",
                metaDescription:
                    "Create detailed JavaScript 3D Bubble Chart using SciChart's 5-star rated JavaScript chart library. Supports large datasets. Get your free demo now.",
                markdownContent:
                    "## Bubble 3D Chart in JavaScript\n\n### Overview\nThis example demonstrates the creation of an interactive 3D bubble chart using SciChart.js in a JavaScript environment. The chart leverages the power of WebAssembly for high-performance rendering and offers advanced features such as custom tooltip rendering, interactive 3D modifiers, and efficient data series management.\n\n### Technical Implementation\nThe chart is initialized by creating a new SciChart3DSurface with a WebAssembly context, as described in the [3D Tutorial](https://www.scichart.com/documentation/js/current/3D%20Tutorial%2001%20-%20Setting%20up%20a%203D%20Chart%20Project%20with%20SciChart.js.html). Asynchronous initialization is handled using Promise.all to ensure that both the chart setup and data fetching complete before rendering. Interactive modifiers such as MouseWheelZoomModifier3D, OrbitModifier3D, and ResetCamera3DModifier are added to enable smooth 3D navigation; learn more in the [Orbit Modifier 3D documentation](https://www.scichart.com/documentation/js/current/OrbitModifier3D.html). Custom camera control is achieved via the CameraController, allowing for precise positioning of the 3D view.\n\n### Features and Capabilities\nThe example features a sophisticated custom tooltip implementation using TooltipModifier3D. Data points in the scatter renderable series are enriched with metadata (such as country, life expectancy, GDP per capita, and year), and tooltips are rendered using custom data and SVG templates as outlined in the [Tooltip Modifier 3D documentation](https://www.scichart.com/documentation/js/current/TooltipModifier3D.html). Additionally, each of the 3D axes is configured using NumericAxis3D with specified visible ranges and label precision. Detailed information on axis configuration can be found in the [NumericAxis3D API documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis3d.html).\n\n### Integration and Best Practices\nResource cleanup is managed via a destructor function that calls the delete method on the SciChartSurface, in accordance with best practices described in the [Memory Best Practices documentation](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html). The asynchronous pattern using Promise.all is further supported by guidelines discussed in the [MDN Promise.all documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all). By integrating these advanced features in a JavaScript framework, the example illustrates how to build high-performance, customizable 3D charts using SciChart.js.",
            },
            react: {
                subtitle:
                    "Our team demonstrates how to create a **React 3D Bubble Chart** using SciChart.js, capable of creating detailed 3D JavaScript Charts.",
                title: "React 3D Bubble Chart",
                pageTitle: "React 3D Bubble Chart | 3D JavaScript Charts | View Now",
                metaDescription:
                    "Create detailed React 3D Bubble Chart using SciChart's 5-star rated JavaScript chart library. Supports large datasets. Get your free demo now.",
                markdownContent:
                    "## React Three Dimensional Bubble Chart Example\n\n### Overview\nThis example demonstrates how to create a **React 3D Bubble Chart** using SciChart.js. It presents a comprehensive setup where a 3D chart is asynchronously initialized, customized, and data-bound in a React environment. The example visualizes complex datasets such as life expectancy, GDP per capita, and year, and integrates custom tooltips to enhance interactive data exploration.\n\n### Technical Implementation\nThe implementation utilizes the `<SciChartReact/>` component for seamless React integration. The initialization function, passed as the initChart prop, sets up a SciChart 3D surface with features such as camera control via a CameraController, 3D chart modifiers like MouseWheelZoomModifier3D, OrbitModifier3D, and ResetCamera3DModifier, and a custom tooltip modifier for dynamic data rendering. Asynchronous initialization is managed with async/await, ensuring that chart setup and data fetching occur concurrently. Developers can refer to the [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) article for deeper insights into the integration process.\n\n### Features and Capabilities\nThe example highlights advanced features such as custom tooltip rendering, which is implemented to display detailed metadata (e.g., country, life expectancy, GDP per capita, and year) in a styled format. Real-time data binding is managed by appending data points to an XyzDataSeries3D, enabling dynamic updates. The use of WebGL rendering ensures high performance even when working with large datasets, a concept well explained in the [Advanced JavaScript Chart and Graph Library | SciChart JS](https://www.scichart.com/javascript-chart-features/) documentation. Additionally, performance optimization techniques are inherently supported by SciChart.js, reducing CPU overhead and improving rendering times.\n\n### Integration and Best Practices\nThis example adheres to best practices for React integration including clear component separation, asynchronous chart initialization, and careful resource management to ensure charts are properly disposed when no longer needed. Customizations such as chart modifiers and tooltip templates leverage the deep customization capabilities of SciChart.js as seen in the [Orbit Modifier 3D | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/OrbitModifier3D.html). For asynchronous data synchronization and binding mechanics, developers might also review the guidelines in the [Tutorial 05 - Synchronizing React Charts with Data in a Group](https://www.scichart.com/documentation/js/current/Tutorial05SynchronizingReactCharts.html). This structured approach not only simplifies development but also enhances maintainability and performance of highly interactive 3D charts in React.\n",
            },
            angular: {
                subtitle:
                    "Our team demonstrates how to create a **Angular 3D Bubble Chart** using SciChart.js, capable of creating detailed 3D JavaScript Charts.",
                title: "Angular 3D Bubble Chart",
                pageTitle: "Angular 3D Bubble Chart | 3D JavaScript Charts | View Now",
                metaDescription:
                    "Create detailed Angular 3D Bubble Chart using SciChart's 5-star rated JavaScript chart library. Supports large datasets. Get your free demo now.",
                markdownContent:
                    "## Angular 3D Bubble Chart\n\n### Overview\nThis example demonstrates the integration of SciChart.js within an Angular application to create an interactive 3D Bubble Chart. The chart visualizes population data with metrics such as life expectancy, GDP per capita, and year, providing users with a dynamic tool for data exploration. The integration is achieved using Angular standalone components, as detailed in the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package and the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide.\n\n### Technical Implementation\nThe chart is initialized asynchronously using async/await patterns common to Angular applications. A SciChart 3D surface is created and configured with a custom camera setup via the CameraController. Interactive modifiers such as MouseWheelZoomModifier3D, OrbitModifier3D, and ResetCamera3DModifier are added to enable smooth user interactions. This implementation leverages asynchronous data fetching with Promise.all to concurrently initialize the chart and retrieve population data, ensuring responsive performance. For more details on asynchronous initialization in Angular, refer to [Angular Async/Await: How To Use It](https://www.infragistics.com/community/blogs/b/infragistics/posts/angular-async-await).\n\n### Features and Capabilities\nKey features include real-time data binding through an XyzDataSeries3D and customized tooltip functionality implemented with TooltipModifier3D. The tooltips are dynamically styled using custom SVG templates and provide detailed contextual information about each data point. Additional interactive capabilities are provided by the OrbitModifier3D, which allows smooth rotation of the 3D chart, as described in the [Orbit Modifier 3D](https://www.scichart.com/documentation/js/current/OrbitModifier3D.html) documentation.\n\n### Integration and Best Practices\nThis example follows best practices for integrating external libraries with Angular. It demonstrates the use of Angular standalone components for encapsulation, proper asynchronous initialization, and effective lifecycle management. Developers interested in managing external WebGL resources in Angular can benefit from the concepts discussed in the [Angular Component Lifecycle](https://angular.io/guide/lifecycle-hooks) documentation. The approach aligns with the guidelines provided in [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html), ensuring a modular and maintainable codebase.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Bubble%203D%20Chart%20Type.html",
                title: "SciChart.js 3D Bubble Chart Documentation",
                linkTitle: "JavaScript 3D Bubble Chart Documentation",
            },
        ],
        path: "3d-bubble-chart",
        metaKeywords: "3d, bubble, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts3D/Basic3DChartTypes/Bubble3DChart",
        thumbnailImage: "javascript-3d-bubble-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const bubble3DChartExampleInfo = createExampleInfo(metaData);
