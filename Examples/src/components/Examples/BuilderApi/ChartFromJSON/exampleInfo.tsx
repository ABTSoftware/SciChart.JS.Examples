import { createExampleInfo } from "../../exampleInfoUtils";
import { IExampleMetadata } from "../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "BuilderApiChartFromJSON",
        imagePath: "javascript-chart-from-json.jpg",
        description:
            "Demonstrates how to use the Builder Api to create a **Chart from JSON** using SciChart.js. Adjust the JSON in the window below and the chart will re-build. Choose from pre-selected defaults to learn more about the Builder API.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Chart from JSON** using SciChart.js. Adjust the JSON in the window below and the chart will re-build. Choose from pre-selected defaults to learn more about the Builder API.",
                title: "Chart from JSON",
                pageTitle: "Chart from JSON",
                metaDescription: "Demonstrates how to create a JavaScript Chart from JSON using the builder API. ",
                markdownContent:
                    "# Chart From JSON - Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to create a chart from a JSON configuration using the SciChart.js Builder API in vanilla JavaScript. The purpose is to provide a dynamic and highly customizable charting solution that leverages JSON data to configure series, axes, layout, annotations and more.\n\n## Technical Implementation\nThe example utilizes the Builder API method [build2DChart](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html) to parse JSON definitions and initialize the chart. The async function handles chart creation and integrates WebAssembly for high-performance rendering, following best practices for asynchronous error handling as outlined in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/). Dynamic data is generated using vanilla JavaScript loops to create series data such as spiraling points, demonstrating practical usage of the [Working with Data](https://www.scichart.com/documentation/js/current/Working%20with%20Data.html) techniques.\n\n## Features and Capabilities\nThe configuration supports multiple chart types including simple spline line series, dual-axis charts, bubble series, and scatter series with a central axis layout. Advanced customizations are provided via JSON definitions such as gradient fill configurations and annotation settings. The example also showcases the ability to switch between different pre-defined configurations, including a detailed full-featured chart, a simple minimal example, and a central layout configuration as described in the [Central Axis Layout](https://www.scichart.com/documentation/js/current/CentralAxisLayout.html) documentation.\n\n## Integration and Best Practices\nBy relying solely on vanilla JavaScript, the example avoids framework-specific implementations and highlights the simplicity of using the SciChart.js Builder API for dynamic chart configuration. Developers are encouraged to use async/await for clear error handling and to utilize JSON configurations for scalable chart definitions, ensuring maintainability and performance. The approach detailed here aligns with recommended practices for creating modular and efficient charting applications, as emphasized in the [Intro to the Builder API](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html) and the broader SciChart.js documentation.",
            },
            react: {
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Chart from JSON** using SciChart.js. Adjust the JSON in the window below and the chart will re-build. Choose from pre-selected defaults to learn more about the Builder API.",
                title: "Chart from JSON",
                pageTitle: "Chart from JSON",
                metaDescription: "Demonstrates how to create a React Chart from JSON using the builder API. ",
                markdownContent:
                    "# Chart From JSON - React\n\n## Overview\nThis example demonstrates how to integrate SciChart.js within a React application to dynamically generate 2D charts from JSON configurations. It allows users to update the chart in real time by modifying the JSON data, offering a highly interactive and customizable charting experience.\n\n## Technical Implementation\nThe chart is created using the SciChart.js Builder API by parsing JSON definitions via the asynchronous function that calls [chartBuilder.build2DChart](https://www.scichart.com/documentation/js/current/webframe.html#Intro%20to%20the%20Builder%20API.html). This function initializes the chart and handles errors using async/await methods. The integration is encapsulated in the [SciChartReact](https://github.com/ABTSoftware/scichart-react) component, which facilitates seamless embedding of WebAssembly-powered charts in React. Additionally, the implementation leverages React memoization techniques such as **useMemo** and **React.memo** to optimize rendering performance, as discussed in [performance optimization techniques](https://yosua-halim.medium.com/optimize-react-render-using-usememo-usecallback-and-react-memo-366524b97486).\n\n## Features and Capabilities\nThe example supports real-time chart updates by allowing users to switch between various chart configurations including simple spline line charts, detailed dual-axis charts, and scatter charts with a central axis layout. Advanced features such as gradient fills, custom annotations, and dual y-axis configurations are all defined through JSON, demonstrating the flexibility of the Builder API. For further details on the capabilities of the JSON configuration approach, developers can refer to the [Builder API documentation](https://www.scichart.com/documentation/js/current/webframe.html#Intro%20to%20the%20Builder%20API.html).\n\n## Integration and Best Practices\nThe React integration showcased here aligns with modern best practices by using Material-UI components such as **ButtonGroup** and **TextField** for building a user-friendly interface. This not only ensures a consistent UI design but also supports dynamic updates to the chart configuration, as highlighted in the [Tutorial on setting up a project with scichart-react](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html). Comprehensive error handling and the use of memoization help maintain high performance and responsiveness in the application. Additionally, the implementation of a central layout using custom JSON further demonstrates the robustness and flexibility provided by SciChart.js, details of which can be found in the [Central Axis Layout documentation](https://www.scichart.com/documentation/js/current/CentralAxisLayout.html).",
            },
            angular: {
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Chart from JSON** using SciChart.js. Adjust the JSON in the window below and the chart will re-build. Choose from pre-selected defaults to learn more about the Builder API.",
                title: "Chart from JSON",
                pageTitle: "Chart from JSON",
                metaDescription: "Demonstrates how to create a Angular Chart from JSON using the builder API. ",
                markdownContent:
                    "# Chart From JSON - Angular\n\n## Overview\nThis example demonstrates how to create dynamic charts from JSON configurations within an Angular application using SciChart.js. It leverages the SciChart.js Builder API to generate a variety of chart types by parsing JSON definitions, allowing users to update the chart in real time.\n\n## Technical Implementation\nThe chart is built by asynchronously initializing the SciChartSurface using the Builder API method [build2DChart](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html), which parses provided JSON configurations to construct charts with multiple series, axes, and annotations. The implementation uses async/await to handle WebAssembly initialization following common Angular asynchronous initialization practices as described in [Angular Async/Await: How To Use It](https://www.infragistics.com/community/blogs/b/infragistics/posts/angular-async-await). Robust error handling is incorporated to capture and display any issues during chart construction, echoing techniques found in [Global Error Handling in Angular](https://pkief.medium.com/global-error-handling-in-angular-ea395ce174b1).\n\n## Features and Capabilities\nThe example offers real-time update capabilities by allowing chart configurations to be dynamically modified. It supports a range of chart types including simple spline line charts, detailed dual-axis charts, and scatter charts with central axes. Advanced visual customizations such as gradient fills, custom annotations, and dual y-axis configurations are defined through JSON, underscoring the flexibility of the Builder API and aligning with insights from the [Advanced JavaScript Chart and Graph Library](https://www.scichart.com/javascript-chart-features/).\n\n## Integration and Best Practices\nAngular integration is further enhanced by using Angular Material components to provide an intuitive interface for updating chart configurations. The approach promotes best practices in dynamic chart configuration, component encapsulation, and efficient change detection strategies critical for high-performance applications. Developers seeking additional guidance may find it helpful to review the [Angular Column Chart Demo](https://demo.scichart.com/angular/column-chart) and the [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) for further insights.\n\nOverall, this example serves as a practical guide for integrating JSON-driven charts in Angular using the SciChart.js Builder API, with a focus on asynchronous initialization, error handling, and dynamic UI controls.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Intro%20to%20the%20Builder%20API.html",
                title: "This specific page in the JavaScript Builder API documentation will help you to get started",
                linkTitle: "JavaScript Builder API Documentation",
            },
        ],
        path: "chart-from-json",
        metaKeywords: "json, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "BuilderApi/ChartFromJSON",
        thumbnailImage: "javascript-chart-from-json.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const chartFromJSONExampleInfo = createExampleInfo(metaData);
