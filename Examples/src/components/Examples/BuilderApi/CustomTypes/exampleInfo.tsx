import { createExampleInfo } from "../../exampleInfoUtils";
import { IExampleMetadata } from "../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "BuilderApiCustomTypes",
        imagePath: "javascript-custom-types.jpg",
        description:
            "Demonstrates how to use the Builder Api with **Custom Types** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to use the Builder Api with **Custom Types** using SciChart.js, High Performance JavaScript Charts",
                title: "Custom Types with Builder API",
                pageTitle: "Custom Types with Builder API",
                metaDescription:
                    "Demonstrates how to make a custom type such as a PaletteProvider available for use with the Builder Api.You can call methods within the builder api to get references to the objects being built, so you can update them later.",
                markdownContent:
                    "# CustomTypes Example using Vanilla JS\n\n## Overview\nThis example demonstrates how to extend default SciChart.js functionalities by creating **custom chart types** using vanilla JavaScript. The implementation focuses on crafting unique data series, custom axis renderers, and tailored annotations that provide a robust foundation for building high-performance charts.\n\n## Technical Implementation\nThe example leverages the SciChart.js Builder API through JSON configurations to dynamically construct and customize charts. By overriding default behaviors, developers can tailor the rendering of axes and series for specific use cases. For guidance on creating custom chart types with vanilla JavaScript, please refer to the [SciChart.js Getting Started guide](https://www.scichart.com/getting-started/scichart-javascript/). Custom axis rendering techniques are detailed in the [SciChart.js User Manual](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html), which provides strategies to enhance visual output.\n\n## Features and Capabilities\nThe implementation supports real-time update capabilities and leverages advanced features such as efficient [WebGL rendering](https://www.scichart.com/scichart-js-for-web-a-fast-realtime-2d-3d-chart-component-for-html5-javascript-apps/) to ensure optimal performance under data-intensive conditions. Enhanced user interactions are supported through advanced event handling and dynamic data binding, enabling seamless updates. Moreover, custom annotations and tooltips enhance the debugger and data visualization experience as illustrated in the [Adding Tooltips and Legends tutorial](https://www.scichart.com/documentation/js/current/Tutorial%2007%20-%20Adding%20Tooltips%20and%20Legends.html).\n\n## Integration and Best Practices\nFor integrating this custom chart example into a vanilla JavaScript project, best practices include setting up the environment via CDN as described in the [Tutorial for Including SciChart.js in an HTML Page](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html). Developers are encouraged to implement performance optimization techniques, efficient JSON data binding, and robust event subscriptions. Additional insights can be found in the [API Documentation for SciChart.js](https://www.scichart.com/documentation/js/current/typedoc/index.html) which offers comprehensive guidelines for extending and customizing default functionalities.\n",
            },
            react: {
                subtitle:
                    "Demonstrates how to use the Builder Api with **Custom Types** using SciChart.js, High Performance JavaScript Charts",
                title: "Custom Types with Builder API",
                pageTitle: "Custom Types with Builder API",
                metaDescription:
                    "Demonstrates how to make a custom type such as a PaletteProvider available for use with the Builder Api.You can call methods within the builder api to get references to the objects being built, so you can update them later.",
                markdownContent:
                    "# CustomTypes Example with React\n\n## Overview\n\nThe CustomTypes example demonstrates advanced customization capabilities within a React application using SciChart.js. This example focuses on creating custom chart types and demonstrates how to integrate SciChart.js in a modular and reusable way, leveraging the modern syntax and lifecycle methods of React.\n\n## Technical Implementation\n\nThe implementation uses the Builder API to configure chart properties via JSON, allowing developers to easily customize and extend the chart behaviors. This approach simplifies the integration of real-time data updates and dynamic configurations. For instance, developers can utilize [real-time updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) along with JSON configuration to handle dynamic data streams very effectively. Meanwhile, the example employs [WebGL rendering](https://dev.to/andyb1979/scichartjs-javascript-3d-charts-with-webgl-webassembly-5gle) to benefit from performance enhancements when handling complex, large datasets.\n\n## Features and Capabilities\n\nThis example showcases several significant features: \n\n- **Real-time Update Capabilities:** Leveraging React's state management and hooks, the chart updates dynamically using techniques outlined in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).\n\n- **Custom Chart Types:** The component demonstrates how to implement custom series types in a React environment, a powerful feature for bespoke visualizations as described in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/).\n\n- **Advanced Performance Optimizations:** Utilizing efficient WebGL rendering and proven performance practices, the chart is optimized for large datasets. Techniques similar to those discussed in [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) are applied to ensure a smooth user experience.\n\n## Integration and Best Practices\n\nIntegration is achieved by embedding SciChart.js charts into React components, taking full advantage of React’s lifecycle methods like useEffect to initialize and update the charts. This approach is detailed in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) and further discussed in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/).\n\nDevelopers are encouraged to use React hooks, such as useEffect, for side effects during the component life cycle, ensuring that initialization and clean-up processes are handled smoothly. For additional insights on efficient React patterns, the [Discovering patterns with React hooks](https://ponyfoo.com/articles/discovering-patterns-with-react-hooks) guide offers practical advice.\n\nFurthermore, using state management solutions like Redux in tandem with React can help in managing the complex state of real-time chart updates, further enhancing performance and scalability as outlined in various best practices for state management in React applications.\n",
            },
            angular: {
                subtitle:
                    "Demonstrates how to use the Builder Api with **Custom Types** using SciChart.js, High Performance JavaScript Charts",
                title: "Custom Types with Builder API",
                pageTitle: "Custom Types with Builder API",
                metaDescription:
                    "Demonstrates how to make a custom type such as a PaletteProvider available for use with the Builder Api.You can call methods within the builder api to get references to the objects being built, so you can update them later.",
                markdownContent:
                    "# CustomTypes Example - Angular\n\n## Overview\n\nThe CustomTypes example demonstrates how to seamlessly integrate SciChart.js within an Angular application. This example is designed to illustrate the creation of custom chart types using Angular components, services, and directives while leveraging the framework's powerful features such as dependency injection and lifecycle hooks.\n\n## Technical Implementation\n\nThe implementation centers around the Builder API, which utilizes JSON configurations to define custom chart types. This approach enables dynamic chart customization and real-time data streaming. The example integrates [SciChart JS features](https://www.scichart.com/javascript-chart-features/) within Angular components, ensuring that the charts are both customizable and performant. Angular services are employed to manage real-time data updates, following patterns similar to those outlined in [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html). Additionally, custom Angular directives are used to extend chart behavior, allowing for modular and maintainable code as discussed in [Using Angular Custom directives](https://stackoverflow.com/questions/38723751/using-angular-custom-directives?rq=3).\n\n## Features and Capabilities\n\nThis example highlights several advanced capabilities: \n\n- **Real-time Data Updates:** Leveraging Angular services, the implementation handles dynamic data inputs effectively, ensuring that the charts reflect live changes.\n\n- **Custom Chart Types:** Developers can define new chart behaviors and representations, using JSON configurations to tailor each chart to specific needs.\n\n- **Performance Optimizations:** Through the use of Angular’s change detection strategies and efficient dependency injection, the charts are optimized for performance, even with complex data scenarios. Detailed performance tips can be found in articles like [Angular Performance Optimization](https://davembush.medium.com/angular-performance-optimization-5ec630d2b8f1) and [Performance Tips & Tricks by SciChart JS](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n## Integration and Best Practices\n\nThe integration follows best practices for Angular component communication and lifecycle management. Components initialize and update the SciChart.js instances within the appropriate Angular lifecycle hooks, as explained in [Angular Lifecycle Hooks: The Ultimate Beginner's Guide](https://www.youtube.com/watch?v=ecBq6y1R2qk). Furthermore, the use of Angular's advanced dependency injection ensures that the SciChart.js instances are managed efficiently, contributing to robust application architecture. Developers are encouraged to explore these integration techniques to build high-performance, maintainable, and scalable charting applications.\n\nThis example serves as a practical guide for creating custom SciChart.js types in Angular, providing a strong foundation on which developers can build further customizations and enhancements in their charting solutions.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Intro%20to%20the%20Builder%20API.html",
                title: "This specific page in the JavaScript Builder API documentation will help you to get started",
                linkTitle: "JavaScript Builder API Documentation",
            },
        ],
        path: "custom-types",
        metaKeywords: "custom, chart, javascript, builder, paletteprovider",
        onWebsite: true,
        filepath: "BuilderApi/CustomTypes",
        thumbnailImage: "javascript-custom-types.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const customTypesExampleInfo = createExampleInfo(metaData);
