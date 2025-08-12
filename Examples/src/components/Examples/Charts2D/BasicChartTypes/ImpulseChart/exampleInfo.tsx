import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "ImpulseChart",
        id: "chart2D_basicCharts_ImpulseChart",
        imagePath: "javascript-impulse-chart.jpg",
        description:
            "Use this demonstration to learn how to create a **JavaScript Impulse Chart** using SciChart.js, our own High Performance JavaScript Chart Library.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Use this demonstration to learn how to create a **JavaScript Impulse Chart** using SciChart.js, our own High Performance JavaScript Chart Library.",
                title: "JavaScript Impulse Chart",
                pageTitle: "JavaScript Impulse Chart | JavaScript Charts | View Online",
                metaDescription:
                    "Easily create JavaScript Impulse Chart or Stem Chart using SciChart.js - our own high performance JavaScript Chart Library. Get your free trial now. ",
                markdownContent:
                    "## Impulse Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create a high-performance **Impulse Chart** using SciChart.js with JavaScript. The implementation renders a lollipop or stem chart by calculating dynamic data points and leveraging a modern WebGL and WASM-based rendering engine.\n\n### Technical Implementation\nThe chart is asynchronously initialized using `SciChartSurface.create()`, which sets up a WebGL-powered WASM context for optimal rendering performance. For detailed guidance on this initialization process, see the [Creating a new SciChartSurface and loading Wasm](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) documentation. `NumericAxis` are configured via the constructor options, and custom data series are populated using `XyDataSeries`. The `FastImpulseRenderableSeries` is used to render the impulse chart with a built-in wave animation effect, as described in the [Animations API](https://www.scichart.com/documentation/js/current/Animations%20API.html).\n\n### Features and Capabilities\nThis implementation includes interactive features such as panning and zooming through the use of `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier`, enhancing user interaction with the chart. These interactive functionalities support real-time updates and dynamic customizations, ensuring that users can seamlessly explore the data. For more insights on interactive chart modifiers, refer to the [Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) tutorial.\n\n### Integration and Best Practices\nThe JavaScript implementation emphasizes efficient resource management. A dedicated cleanup function is provided which deletes the chart instance when it is no longer needed, following best practices outlined in the [Memory Best Practices | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html). This approach ensures that memory is managed appropriately and resources are freed up promptly, maintaining optimal application performance.",
            },
            react: {
                subtitle:
                    "Use this demonstration to learn how to create a **React Impulse Chart** using SciChart.js, our own High Performance JavaScript Chart Library.",
                title: "React Impulse Chart",
                pageTitle: "React Impulse Chart | JavaScript Charts | View Online",
                metaDescription:
                    "Easily create React Impulse Chart or Stem Chart using SciChart.js - our own high performance JavaScript Chart Library. Get your free trial now. ",
                markdownContent:
                    '# React Impulse Chart\n\n### Overview\nThis example demonstrates how to create a high-performance **Impulse Chart** using SciChart.js in a **React** environment. It initializes a chart within a React component by leveraging the `<SciChartReact/>` component, setting up `NumericAxis`, a customized impulse series, interactive modifiers, and animated effects to deliver a responsive charting experience.\n\n### Technical Implementation\nThe chart is asynchronously initialized through a dedicated function that creates the `SciChartSurface` with a WebGL-powered WASM context. In this setup, a `FastImpulseRenderableSeries` is configured with custom data and a minimal point marker, and animation (specifically a wave effect) is applied to enhance visual engagement. Developers interested in the available animation options can refer to the [Animations API Documentation](https://www.scichart.com/documentation/js/current/Animations%20API.html).\n\n### Features and Capabilities\nThe example incorporates advanced chart modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier`, providing interactive zooming and panning capabilities. The use of a customizable theme (via an external appTheme configuration) ensures that styling remains consistent and easy to manage. These features, combined with the optimized rendering of the impulse series on WebGL, illustrate how SciChart.js supports real-time updates and dynamic customizations. For further insights into these interactive modifiers, please see the [ZoomPanModifier Documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html).\n\n### Integration and Best Practices\nThis implementation follows best practices for integrating SciChart.js with React by using the `<SciChartReact/>` component, which simplifies the asynchronous creation and disposal of chart instances. By embedding the initialization function directly within the component lifecycle, the example avoids common pitfalls related to resource management in React. Developers looking to deepen their understanding of React integration with SciChart.js are encouraged to review the [React Charts with SciChart.js: Introducing "SciChart React"](https://www.scichart.com/blog/react-charts-with-scichart-js/) article, as well as the guide on [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).',
            },
            angular: {
                subtitle:
                    "Use this demonstration to learn how to create a **Angular Impulse Chart** using SciChart.js, our own High Performance JavaScript Chart Library.",
                title: "Angular Impulse Chart",
                pageTitle: "Angular Impulse Chart | JavaScript Charts | View Online",
                metaDescription:
                    "Easily create Angular Impulse Chart or Stem Chart using SciChart.js - our own high performance JavaScript Chart Library. Get your free trial now. ",
                markdownContent:
                    "## Angular Impulse Chart\n\n### Overview\nThis example demonstrates how to create an **Angular Impulse Chart** using SciChart.js, a high-performance JavaScript charting library. The chart is seamlessly integrated into an Angular application by leveraging the `ScichartAngularComponent`, providing a dynamic visualization of an impulse (stem) chart.\n\n### Technical Implementation\nThe chart is asynchronously initialized within an Angular component by calling `SciChartSurface.create()`, which sets up a WebGL-powered WASM context. Numeric axes for both the X and Y dimensions are configured using the `NumericAxis` constructor as detailed in the [Numeric Axis Documentation](https://www.scichart.com/documentation/js/current/NumericAxis.html). The data series is generated by calculating sine and logarithmic values, and a highly efficient `FastImpulseRenderableSeries` is rendered with a custom wave animation effect, as described in the [Animations API](https://www.scichart.com/documentation/js/current/Animations%20API.html).\n\n### Features and Capabilities\nThe implementation includes several advanced features such as interactive chart modifiers: `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier`, which enhance user experience by enabling smooth zooming and panning. These interactive capabilities are further illustrated in the [ZoomPanModifier Documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html). Additionally, the example demonstrates performance optimization by harnessing WebGL and WebAssembly technologies to deliver real-time, high-performance rendering even during dynamic data updates.\n\n### Integration and Best Practices\nIntegration is achieved by utilizing the `ScichartAngularComponent` available on [scichart-angular](https://www.npmjs.com/package/scichart-angular), ensuring a clean and modular Angular component design. The asynchronous initialization pattern adopted here follows the best practices outlined in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide, ensuring that resources are properly managed and disposed of when no longer needed. This example serves as a valuable reference for developers looking to implement responsive and interactive charts in Angular applications using SciChart.js.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Lollipop%20(Impulse%20or%20Stem)%20Chart%20Type.html",
                title: "This specific page in the JavaScript Impulse Chart documentation will help you to get started",
                linkTitle: "JavaScript Impulse Chart Documentation",
            },
        ],
        path: "impulse-chart",
        metaKeywords: "impulse, lollipop, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/ImpulseChart",
        thumbnailImage: "javascript-impulse-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

const impulseChartExampleInfo = createExampleInfo(metaData);
export default impulseChartExampleInfo;
