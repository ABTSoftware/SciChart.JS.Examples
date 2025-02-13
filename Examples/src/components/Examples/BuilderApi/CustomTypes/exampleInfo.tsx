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
                markdownContent: null,
            },
            react: {
                subtitle:
                    "Demonstrates how to use the Builder Api with **Custom Types** using SciChart.js, High Performance JavaScript Charts",
                title: "Custom Types with Builder API",
                pageTitle: "Custom Types with Builder API",
                metaDescription:
                    "Demonstrates how to make a custom type such as a PaletteProvider available for use with the Builder Api.You can call methods within the builder api to get references to the objects being built, so you can update them later.",
                markdownContent:
                    "# CustomTypes Example with React\n\n## Overview\nThis example demonstrates the integration of SciChart.js custom chart types within a React application. It highlights how to use custom configurations and the Builder API to extend chart capabilities, providing a dynamic and interactive charting experience. The focus is on leveraging [SciChart React](https://www.scichart.com/blog/react-charts-with-scichart-js/) techniques to seamlessly integrate high-performance WebGL charts into React components.\n\n## Technical Implementation\nThe implementation uses SciChart.js’s Builder API by consuming JSON data to define and configure custom chart elements. Developers can tailor the configuration, including custom axes and annotations, by referencing the [Custom Types with Builder API - JavaScript Chart](https://www.scichart.com/example/javascript-chart/javascript-custom-types/) documentation. The React component lifecycle methods such as componentDidMount and componentWillUnmount ensure proper creation and disposal of chart instances, following guidance from [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).\n\n## Features and Capabilities\nThis example supports real-time data updates and advanced customizations. Using React’s state management and hooks, developers efficiently manage the chart state while integrating real-time data streaming, as outlined in the [Adding Realtime Updates | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html). The example also showcases how custom chart elements such as unique annotations and axis markers can be seamlessly added to enhance the user interface.\n\n## Integration and Best Practices\nIntegrating SciChart.js with React follows best practices by establishing reusable components and utilizing the Context API to manage shared chart configurations. Performance optimization techniques, such as efficient WebGL rendering, are applied to guarantee smooth interaction and update cycles as recommended in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/). With this reusable design, the application not only ensures maintainability but also simplifies the integration of additional custom types and real-time data handling using [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/).",
            },
            angular: {
                subtitle:
                    "Demonstrates how to use the Builder Api with **Custom Types** using SciChart.js, High Performance JavaScript Charts",
                title: "Custom Types with Builder API",
                pageTitle: "Custom Types with Builder API",
                metaDescription:
                    "Demonstrates how to make a custom type such as a PaletteProvider available for use with the Builder Api.You can call methods within the builder api to get references to the objects being built, so you can update them later.",
                markdownContent: null,
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
