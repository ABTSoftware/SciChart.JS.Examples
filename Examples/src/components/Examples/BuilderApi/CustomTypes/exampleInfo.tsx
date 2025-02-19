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
                    "# Custom Types with Builder API - Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to extend the default functionalities of SciChart.js using vanilla JavaScript. It shows how to create a custom palette provider that dynamically overrides the fill and stroke of a Mountain Series chart based on specific data thresholds, while leveraging JSON configuration for flexible chart construction with the Builder API.\n\n## Technical Implementation\nThe implementation uses the SciChart.js Builder API to build a 2D chart using a JSON configuration. In the file drawExample.ts, the chart is configured with a numeric Y-Axis, custom annotations, and a Mountain Series whose look is dynamically altered by the custom palette provider (ExampleMountainPaletteProvider). This provider overrides the default rendering behavior for data points by checking if the Y value falls within a set range before applying custom colors. For a deeper dive into this approach, check out the [Custom Types with Builder API - JavaScript Chart - SciChart](https://www.scichart.com/example/javascript-chart/javascript-custom-types/) documentation. Additionally, the use of JSON in defining chart properties is detailed in the [Serialization and Deserialization of Charts - SciChart](https://www.scichart.com/documentation/js/current/Serialization%20and%20Deserialization%20of%20Charts.html) guide.\n\n## Features and Capabilities\nThe example incorporates several advanced features, including real-time data updates, dynamic handling of NaN values, and gradient fill techniques. It leverages WebGL rendering for high-performance updates and demonstrates advanced customization by overriding fill and stroke colors via a custom palette provider. These optimizations align with best practices discussed in the [Performance Tips & Tricks | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n## Integration and Best Practices\nFor developers working purely in vanilla JavaScript, this example provides a clear blueprint for integrating SciChart.js into any web project without relying on frameworks like React or Angular. The approach emphasizes the use of the Builder API for streamlined chart creation and customization, as outlined in the [JavaScript Builder API Documentation](https://www.scichart.com/examples/builder-api/). By using JSON configuration and custom types, the example encourages modularity and adherence to performance optimizations, making it easy to manage dynamic data and real-time updates. This serves as a solid foundation for building high-performance charts with customized visual behavior.",
            },
            react: {
                subtitle:
                    "Demonstrates how to use the Builder Api with **Custom Types** using SciChart.js, High Performance JavaScript Charts",
                title: "Custom Types with Builder API",
                pageTitle: "Custom Types with Builder API",
                metaDescription:
                    "Demonstrates how to make a custom type such as a PaletteProvider available for use with the Builder Api.You can call methods within the builder api to get references to the objects being built, so you can update them later.",
                markdownContent:
                    "# Custom Types with Builder API in React\n\n## Overview\nThis example demonstrates advanced chart customization within a React application using SciChart.js. It focuses on creating a custom palette provider to dynamically alter the appearance of a Mountain Series chart, while leveraging JSON configuration through the Builder API for a flexible and modular setup.\n\n## Technical Implementation\nThe implementation utilizes the Builder API to construct a 2D chart from JSON objects. A custom palette provider, implemented as the ExampleMountainPaletteProvider, overrides the default drawing behavior of chart series based on the data values. The chart and series are configured via JSON, enabling developers to easily modify properties such as gradient fills, stroke thickness, and animations. For further details on how to integrate SciChart.js into a React application, refer to [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html). Additionally, the implementation showcases how to create [custom chart types](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html) using JSON configuration.\n\n## Features and Capabilities\nThis example offers features such as real-time update capabilities, advanced rendering with WebGL, and dynamic data binding. The use of JSON configuration simplifies adjustments to the chart properties and animations, contributing to high performance even with complex datasets. These optimizations are in line with best practices outlined in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).\n\n## Integration and Best Practices\nIntegration is achieved by embedding the SciChartReact component into a React component, which effectively manages the lifecycle of the SciChart.js instance. This approach encourages the use of React's own lifecycle hooks (such as useEffect) for proper initialization and cleanup. Developers are encouraged to manage JSON configurations for dynamic chart updates, as detailed in the [Tutorial 01 - Setting up a project with scichart-react and config object](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html) and the [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) guide.\n",
            },
            angular: {
                subtitle:
                    "Demonstrates how to use the Builder Api with **Custom Types** using SciChart.js, High Performance JavaScript Charts",
                title: "Custom Types with Builder API",
                pageTitle: "Custom Types with Builder API",
                metaDescription:
                    "Demonstrates how to make a custom type such as a PaletteProvider available for use with the Builder Api.You can call methods within the builder api to get references to the objects being built, so you can update them later.",
                markdownContent:
                    '# Custom Types Example - Angular\n\n## Overview\nThis example demonstrates how to integrate SciChart.js within an Angular application using a standalone component. The example, titled "Custom Types", showcases the creation of custom chart functionality by extending the default behavior through a custom PaletteProvider. It illustrates how to dynamically update a Mountain Series chart with custom stroke and fill styling based on data values.\n\n## Technical Implementation\nThe implementation utilizes the SciChart.js Builder API to construct and configure a 2D chart via JSON objects. In the file drawExample.ts, the chart is built with a numeric Y-Axis, custom annotations, and a Mountain Series that leverages a custom PaletteProvider (ExampleMountainPaletteProvider) to override fill and stroke based on specific data thresholds. This PaletteProvider is registered through the Builder API for later reuse. The Angular integration is managed by a standalone component defined in angular.ts, where the SciChartAngularComponent injects the chart into the Angular application. For a comprehensive guide on setting up SciChart.js in Angular, see the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation, and for details on the Builder API approach, refer to the [Intro to the Builder API](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html).\n\n## Features and Capabilities\nThis example highlights several advanced features: \n- **Real-time Data Updates:** The dynamic data series updates in real-time, ensuring that live data changes are rendered promptly.\n- **Custom Chart Types:** By implementing a custom PaletteProvider, developers can tailor the visual representation of the chart based on custom thresholds.\n- **JSON Configuration:** The Builder API leverages JSON configuration to define chart properties, making it flexible to update and customize elements on-the-fly. For more on JSON configuration, check the [JavaScript Chart JSON](https://www.scichart.com/example/javascript-chart/javascript-chart-from-json/) documentation.\n\n## Integration and Best Practices\nIntegration in Angular is achieved by using standalone components and taking advantage of Angular\'s dependency injection and lifecycle management. The SciChartAngularComponent minimizes boilerplate, seamlessly incorporating the chart’s initialization and cleanup within Angular’s lifecycle hooks as detailed in the [Angular Lifecycle Hooks](https://angular.io/guide/lifecycle-hooks) guide. Best practices include modularizing custom types and optimizing performance by reducing unnecessary change detection, which are further elaborated in the [Using Angular Components with Third-Party Libraries](https://medium.com/netanelbasal/using-angular-components-with-third-party-libraries-522a1f33003) article. Additionally, the example demonstrates how to register and use custom chart types, a concept further explored in the [Custom Types with Builder API](https://www.scichart.com/example/javascript-chart/javascript-custom-types/) documentation.',
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
