import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "LogarithmicAxis",
        id: "chart2D_modifyAxisBehavior_LogarithmicAxis",
        imagePath: "javascript-chart-logarithmic-axis.jpg",
        description:
            "Demonstrates how to create a **JavaScript Chart with Logarithmic axis** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Chart with Logarithmic axis** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Chart with Logarithmic Axis Example",
                pageTitle: "JavaScript Chart with Logarithmic Axis Example",
                metaDescription:
                    "Demonstrates Logarithmic Axis on a JavaScript Chart using SciChart.js. SciChart supports logarithmic axis with scientific or engineering notation and positive and negative values",
                markdownContent:
                    "## Logarithmic Axis Example (JavaScript)\n\n### Overview\nThis example demonstrates how to create a high-performance SciChart.js chart featuring `LogarithmicAxis` configuration using JavaScript. The implementation plots exponential curves on both the X and Y axes while allowing runtime toggling between logarithmic and linear axis configurations.\n\n### Technical Implementation\nThe chart is asynchronously initialized using [SciChartSurface.create](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html), which loads the WebAssembly context and applies a custom theme for styling. Two `LogarithmicAxis` are configured with properties such as `logBase`, `labelFormat`, and `labelPrecision`; details of these configurations can be found in the [Logarithmic Axis Documentation](https://www.scichart.com/documentation/js/current/Logarithmic%20Axis.html). Renderable series are created using `FastLineRenderableSeries` in combination with `XyDataSeries` to plot exponential curves, and each series is enhanced with a `SweepAnimation` for smooth visual transitions.\n\n### Features and Capabilities\nThe example showcases real-time update capabilities by enabling users to seamlessly switch between logarithmic and linear axis states at runtime. It integrates interactive modifiers such as `RubberBandXyZoomModifier` and `MouseWheelZoomModifier` to facilitate intuitive zooming and panning. Additionally, the application of custom theming—including grid line brushes and title styling—illustrates how visual aspects can be tailored to meet specific design requirements. For additional context on building high-performance charts, refer to [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/).\n\n### Integration and Best Practices\nDespite being a JavaScript example, the implementation follows best practices in asynchronous initialization, interactive behavior, and dynamic configuration. The runtime axis switching is handled by toggling the visibility and primary status of the axes, ensuring that the currently active axes are correctly bound to the series data; this approach is in line with the guidance provided in the [SciChart.js Documentation](https://www.scichart.com/documentation/js/current/Logarithmic%20Axis.html). Developers looking to optimize performance and customize their charts further can benefit from exploring the available [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) provided by SciChart.js.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **React Chart with Logarithmic axis** using SciChart.js, High Performance JavaScript Charts",
                title: "React Chart with Logarithmic Axis Example",
                pageTitle: "React Chart with Logarithmic Axis Example",
                metaDescription:
                    "Demonstrates Logarithmic Axis on a React Chart using SciChart.js. SciChart supports logarithmic axis with scientific or engineering notation and positive and negative values",
                markdownContent:
                    '## Logarithmic Axis Example in React\n\n### Overview\nThis example demonstrates how to create a high performance chart using SciChart.js in a React application. It focuses on implementing logarithmic axes on both the X and Y axes and provides functionality for dynamically switching between logarithmic and linear representations using interactive controls.\n\n### Technical Implementation\nThe chart is implemented using the `<SciChartReact/>` component for React integration, with asynchronous initialization of the `SciChartSurface` ensuring a responsive and efficient setup. Interactive modifiers such as `RubberBandZoomModifier`, `MouseWheelZoomModifier`, and `ZoomExtentsModifier` are integrated to enable advanced chart interactions. Custom point markers and sweep animations are used to enhance visual feedback. For detailed information on integrating SciChart.js with React, refer to the [React Charts with SciChart.js: Introducing "SciChart React"](https://www.scichart.com/blog/react-charts-with-scichart-js/) documentation.\n\nThe dynamic axis switching is managed by toggling the visibility and primary status of `LogarithmicAxis` and linear `NumericAxis`. This approach updates the `FastLineRenderableSeries` with the correct `xAxisId` and `yAxisId` properties based on the selected configuration. This method aligns with best practices described in the [LogarithmicAxis Documentation - SciChart](https://www.scichart.com/documentation/js/current/Logarithmic%20Axis.html) resource.\n\n### Features and Capabilities\nThe example offers dynamic update capabilities by allowing users to switch between three configurations: Logarithmic on both axes, Logarithmic X with Linear Y, and Linear on both axes. It leverages advanced features such as custom point markers for data visualization and sweep animations for smooth transitions. The inclusion of interactive modifiers ensures that users have control over zooming and panning, enhancing overall usability and performance.\n\n### Integration and Best Practices\nThe integration utilizes Material-UI\'s `ToggleButtonGroup` within the React environment to facilitate dynamic chart controls. This effective combination of React state management and SciChart.js configuration demonstrates scalable best practices for real-time data visualization. Developers can learn more about asynchronous initialization and component reuse in React from the [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) guide. Additionally, the use of interactive behaviors is further detailed in the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) documentation, providing valuable insights for optimizing performance in dynamic charting applications.',
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Angular Chart with Logarithmic axis** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Chart with Logarithmic Axis Example",
                pageTitle: "Angular Chart with Logarithmic Axis Example",
                metaDescription:
                    "Demonstrates Logarithmic Axis on a Angular Chart using SciChart.js. SciChart supports logarithmic axis with scientific or engineering notation and positive and negative values",
                markdownContent:
                    "## Angular Chart with Logarithmic Axis Example\n\n### Overview\nThis example demonstrates how to integrate SciChart.js into an Angular application using the standalone `ScichartAngularComponent`. It creates a high-performance chart that supports dynamically switching between logarithmic and linear axes, providing users with flexible data visualization options. The integration leverages the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package, which simplifies embedding SciChart in Angular applications.\n\n### Technical Implementation\nThe implementation utilizes an Angular standalone component where the chart is initialized asynchronously by passing a function to the component's input property. This approach ensures that the `SciChartSurface` is created efficiently with custom theming and advanced configurations, such as the use of both `LogarithmicAxis` and linear `NumericAxis`. The logarithmic axes are configured with parameters like `logBase`, `labelFormat`, and `labelPrecision`, as detailed in the [SciChart.js Logarithmic Axis Documentation](https://www.scichart.com/documentation/js/current/Logarithmic%20Axis.html). Interactive modifiers including `RubberBandXyZoomModifier`, `MouseWheelZoomModifier`, and `ZoomExtentsModifier` are integrated to enhance user interactions, with performance optimizations guided by best practices described in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) resource.\n\n### Features and Capabilities\nThe chart offers dynamic update capabilities by allowing users to toggle between logarithmic and linear axis configurations via an Angular UI component, the `ToggleButtonGroup`. Advanced features such as custom point markers, sweep animations, and multiple renderable series enrich the visualization experience. This dynamic reconfiguration technique provides immediate visual feedback, demonstrating how interactive behaviors can be seamlessly integrated in a modern Angular application.\n\n### Integration and Best Practices\nThe example follows Angular best practices by using standalone components as described in [Getting started with standalone components - Angular](https://angular.io/guide/standalone-components). The modular nature of the implementation not only facilitates easier maintenance and scalability but also ensures that high-performance asynchronous chart initialization is maintained even in complex scenarios. Developers looking to build interactive charts in Angular will benefit from understanding these techniques, alongside further insights available in the SciChart.js documentation.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Logarithmic%20Axis.html",
                title: "SciChart.js Logarithmic Axis Documentation",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "chart-logarithmic-axis",
        metaKeywords: "logarithmic, axis, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ModifyAxisBehavior/LogarithmicAxis",
        thumbnailImage: "javascript-chart-logarithmic-axis.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const logarithmicAxisExampleInfo = createExampleInfo(metaData);
export default logarithmicAxisExampleInfo;
