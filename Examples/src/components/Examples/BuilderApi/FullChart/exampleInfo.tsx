import { createExampleInfo } from "../../exampleInfoUtils";
import { IExampleMetadata } from "../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "BuilderApiFullChart",
        imagePath: "javascript-builder-full.jpg",
        description:
            "Demonstrates how to use the Builder Api to create a **Fully Configured Chart** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Fully Configured Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Full Chart using Builder API",
                pageTitle: "Full Chart using Builder API",
                metaDescription:
                    "Demonstrates how to use the Builder Api to configure axes, series, annotations and modifiers using a definition object. The builder api is designed to make it easier to discover the types and options available in SciChart JS.",
                markdownContent:
                    "# Full Chart Using Builder API in Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to create a fully configured chart using the SciChart.js Builder API in a vanilla JavaScript environment. It utilizes a comprehensive JSON configuration to set up axes, series, annotations, and interaction modifiers, showcasing the high-performance capabilities of SciChart.js.\n\n## Technical Implementation\nThe chart is constructed by defining its components with JSON objects. For example, a categorical X-Axis is configured with custom text labels and two numeric Y-Axes are set up for different data scales, as highlighted in the [Adding Multiple Axis tutorial](https://www.scichart.com/documentation/js/current/Tutorial%2008%20-%20Adding%20Multiple%20Axis.html). Series such as a Spline Mountain Series with a custom gradient fill—demonstrated in the [JavaScript Spline Mountain Area Chart example](https://www.scichart.com/example/javascript-chart/javascript-spline-mountain-chart/)—and a Bubble Series with custom point markers—see [Custom Pointmarkers documentation](https://www.scichart.com/example/javascript-chart/javascript-chart-custom-pointmarkers/)—illustrate the advanced visual capabilities available. The asynchronous initialization process follows the guidelines described in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/), ensuring optimal performance and seamless rendering.\n\n## Features and Capabilities\nThis implementation supports real-time updates and interactivity through features such as rollover, mouse wheel zoom, and zoom extents modifiers, enhancing the user experience. Annotations are flexibly positioned using both data and relative coordinate modes, as detailed in the [Adding Annotations tutorial](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html). The JSON-based configuration approach makes it simple to customize and extend the chart’s behavior.\n\n## Integration and Best Practices\nWhile built with vanilla JavaScript, the same principles can be applied across different frameworks. The Builder API’s JSON configuration allows for clear separation of chart setup from rendering logic, a best practice that promotes maintainability and performance optimization. Developers are encouraged to refer to the [Intro to the Builder API](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html) for an in-depth understanding of these techniques and to review [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) for strategies aimed at ensuring efficient chart rendering.",
            },
            react: {
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Fully Configured Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Full Chart using Builder API",
                pageTitle: "Full Chart using Builder API",
                metaDescription:
                    "Demonstrates how to use the Builder Api to configure axes, series, annotations and modifiers using a definition object. The builder api is designed to make it easier to discover the types and options available in SciChart JS.",
                markdownContent:
                    "# Full Chart Using Builder API with React\n\n## Overview\nThis example demonstrates how to integrate SciChart.js with React using the Builder API. The chart is fully configured via a JSON object that specifies axes, series, annotations, and interaction modifiers, making it simple to construct complex, high-performance charts. Developers can refer to the [Builder API documentation](https://www.scichart.com/documentation/js/current/webframe.html#Intro%20to%20the%20Builder%20API.html) for more details on this approach.\n\n## Technical Implementation\nThe implementation leverages the Builder API to define all chart components as JSON data. The React integration is achieved using the <SciChartReact> component, which calls the asynchronous draw function to initialize the chart. This function sets up a categorical X-Axis, two numeric Y-Axes, and multiple series, including a spline mountain series with a gradient fill and a bubble series featuring custom point markers. For additional information on multi-axis configuration, see the [Adding Multiple Axis tutorial](https://www.scichart.com/documentation/js/current/Tutorial%2008%20-%20Adding%20Multiple%20Axis.html), and for custom series implementation, explore the [JavaScript Bubble Chart example](https://www.scichart.com/example/javascript-chart/javascript-bubble-chart/).\n\n## Features and Capabilities\nThis example not only demonstrates the creation of a fully configured chart but also highlights advanced features such as gradient fills, custom point markers, and flexible annotation placement using both data and relative coordinate modes. Interaction modifiers like rollover, mouse wheel zoom, and zoom extents add an extra layer of interactivity. Annotations are precisely configured, as detailed in the [Adding Annotations tutorial](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html), providing clear insight into how text and coordinate modes can enhance data visualization.\n\n## Integration and Best Practices\nSeamless React integration is a key aspect of this example. By wrapping the chart initialization within a React component, developers can manage the chart’s lifecycle alongside other React components. This design follows best practices for performance and maintainability. For further insights on integrating SciChart.js into React projects, check out the [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) article. Additionally, performance optimization techniques discussed in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) can help ensure efficient rendering even with complex configurations.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Fully Configured Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Full Chart using Builder API",
                pageTitle: "Full Chart using Builder API",
                metaDescription:
                    "Demonstrates how to use the Builder Api to configure axes, series, annotations and modifiers using a definition object. The builder api is designed to make it easier to discover the types and options available in SciChart JS.",
                markdownContent:
                    "# Full Chart using Builder API with Angular\n\n## Overview\nThis example demonstrates how to create a fully configured chart using the SciChart.js Builder API in an Angular environment. The chart is constructed via a JSON configuration that sets up axes, series, annotations, and interaction modifiers, providing a powerful and flexible way to produce high-performance visualizations.\n\n## Technical Implementation\nThe chart is initialized by defining its components in a structured JSON object. A categorical **X Axis** with custom text labels and two numeric **Y Axes** (one left-aligned and one right-aligned) are configured to manage different data scales. The Builder API is used to create complex series types, including a Spline Mountain Series with gradient fills and a Bubble Series with custom point markers. For a deep dive into how the Builder API functions, refer to the [JavaScript Builder API Documentation](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html). The asynchronous initialization of the chart also demonstrates best practices for handling complex rendering within Angular components.\n\n## Features and Capabilities\nThis example not only sets up a multi-axis chart but also includes advanced features such as custom annotations and interaction modifiers like rollover, mouse wheel zoom, and zoom extents. The annotations are configured using both data and relative coordinate modes, enabling precise placement of text and visual cues. Developers can explore the details of annotation configuration in the [Tutorial 06 - Adding Annotations](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html) guide. Additionally, the example’s use of gradient fills and custom marker settings enhances the visual appeal of the chart.\n\n## Integration and Best Practices\nIntegrated within an Angular application, this example leverages the [scichart-angular](https://classic.yarnpkg.com/en/package/scichart-angular) package to ensure seamless chart rendering and lifecycle management. By using asynchronous chart initialization, the implementation adheres to Angular’s component lifecycle best practices as outlined in the [Component Lifecycle - Angular](https://angular.io/guide/lifecycle-hooks) documentation. Furthermore, performance considerations are addressed to optimize rendering even in complex scenarios, with strategies inspired by the [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) guide.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Intro%20to%20the%20Builder%20API.html",
                title: "This specific page in the JavaScript Builder API documentation will help you to get started",
                linkTitle: "JavaScript Builder API Documentation",
            },
        ],
        path: "builder-full",
        metaKeywords: "definition, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "BuilderApi/FullChart",
        thumbnailImage: "javascript-builder-full.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const fullChartExampleInfo = createExampleInfo(metaData);
