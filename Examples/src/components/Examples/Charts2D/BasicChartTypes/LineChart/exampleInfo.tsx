import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "LineChart",
        id: "chart2D_basicCharts_LineChart",
        imagePath: "javascript-line-chart.jpg",
        description:
            "Demonstrates all the permutations of JavaScript Line Chart using SciChart.js, including Digital Line chart, Tooltips, Dashed lines, Gradient lines, Hovering/selecting lines, vertical lines and paletted lines.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates all the permutations of JavaScript Line Chart using SciChart.js, including Digital Line chart, Tooltips, Dashed lines, Gradient lines, Hovering/selecting lines, vertical lines and paletted lines.",
                title: "JavaScript Line Chart",
                pageTitle: "JavaScript Line Chart | JavaScript Chart Examples | SciChart",
                metaDescription:
                    "Discover how to create a high performance JavaScript Line Chart with SciChart - the leading JavaScript library. Get your free demo now.",
                markdownContent:
                    "## Line Chart - JavaScript\n\n### Overview\nThis example demonstrates various permutations of a SciChart.js line chart implemented in JavaScript. It showcases multiple variations such as simple line charts, digital (step) line charts, charts with tooltips, dashed lines, gradient and paletted line charts, hover/select enabled charts, vertical charts, charts with data gaps, and thresholded line charts. The example emphasizes high performance and advanced customization using asynchronous chart initialization.\n\n### Technical Implementation\nThe charts are created by asynchronously initializing a `SciChartSurface` with an API call that returns both the surface and the underlying WebAssembly context. This method, which you can explore further in the [Tutorial 01 - Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html), leverages JavaScript’s async/await pattern to handle initialization tasks. Each line series is configured using the `FastLineRenderableSeries` along with the `XyDataSeries` for data binding as described in the [Tutorial 02 - Adding Series and Data to an HTML Page - SciChart](https://www.scichart.com/documentation/js/current/Tutorial02AddingSeriesDataHTMLPage.html). Animations such as sweep, wave, and fade effects are applied to enhance visual rendering, following guidelines from the [Series Startup Animations | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/Series%20Startup%20Animations.html).\n\n### Features and Capabilities\n**Real-time Updates and Advanced Customizations:** The example demonstrates dynamic data updates and advanced configurations including digital (step) line charts, which are enabled by setting the `isDigitalLine` property as detailed in [The Digital (Step) Line Series | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/The%20Digital%20(Step)%20Line%20Series.html). Additional features include per-point styling using palette providers for gradient and threshold-based coloring, as well as handling data gaps with discontinuous line rendering. Interactive tooltips are enabled using modifiers such as the `RolloverModifier`, which you can learn more about from the [Rollover Modifier | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/RolloverModifier.html).\n\n### Integration and Best Practices\nThe example adheres to best practices by decoupling the chart creation logic into modular asynchronous functions for improved maintainability and performance. Developers are encouraged to follow efficient error handling and resource management guidelines to optimize WebGL and WebAssembly performance. With an emphasis on responsive design using CSS Flexbox for layout management, this example serves as a robust reference for integrating SciChart.js in standalone JavaScript projects. For more details on performance and advanced customization, review the official SciChart documentation linked throughout this overview.",
            },
            react: {
                subtitle:
                    "Demonstrates all the permutations of JavaScript Line Chart using SciChart.js, including Digital Line chart, Tooltips, Dashed lines, Gradient lines, Hovering/selecting lines, vertical lines and paletted lines.",
                title: "React Line Chart",
                pageTitle: "React Line Chart | JavaScript Chart Examples | SciChart",
                metaDescription:
                    "Discover how to create a high performance React Line Chart with SciChart - the leading JavaScript library. Get your free demo now.",
                markdownContent:
                    "## React Line Chart Example - SciChart.js\n\n### Overview\nThis example demonstrates a comprehensive set of SciChart.js line chart variations implemented in React. It showcases multiple chart types including digital (step) line charts, charts with tooltips, dashed line charts, gradient and paletted line charts, hover/select enabled charts, vertical orientation charts, charts with gaps, and thresholded line charts.\n\n### Technical Implementation\nThe implementation utilizes the `<SciChartReact/>` component to encapsulate each chart’s lifecycle and rendering logic. Initialization functions are passed as React props to the `<SciChartReact/>` component, following best practices for component composition in React. For an in-depth guide on integrating SciChart with React, developers are encouraged to review the [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) article. The approach also leverages React hooks for state management and lifecycle control, as outlined in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).\n\n### Features and Capabilities\nThe example illustrates several advanced features and customizations. Each chart uses animations such as sweep, wave, and fade effects for smooth rendering, while interactive modifiers like rollover tooltips and selection behaviors enhance user interaction. Developers can see these interactive elements in action in charts that leverage tooltips and hover effects, as detailed in the [Using Rollover Modifier Tooltips - SciChart.js Demo](https://demo.scichart.com/javascript/chart-rollovermodifier-tooltips) documentation. Custom theming is applied via an app-specific theme configuration, ensuring a consistent and modern look.\n\n### Integration and Best Practices\nWith React’s component-based architecture, this example demonstrates effective integration strategies with SciChart.js. The use of functional React components and hooks not only simplifies code management but also optimizes performance when rendering multiple charts in a grid. Best practices for React props and state management play a key role, as seen by passing initialization functions directly to the `<SciChartReact/>` component. For more insight into performance optimization and custom theming in React applications, refer to [Create a Custom Theme for React Chart | SciChart.js Demo](https://demo.scichart.com/react/chart-custom-themes). By following these techniques, developers can build scalable, interactive, and visually compelling data visualization dashboards using SciChart.js with React.",
            },
            angular: {
                subtitle:
                    "Demonstrates all the permutations of JavaScript Line Chart using SciChart.js, including Digital Line chart, Tooltips, Dashed lines, Gradient lines, Hovering/selecting lines, vertical lines and paletted lines.",
                title: "Angular Line Chart",
                pageTitle: "Angular Line Chart | JavaScript Chart Examples | SciChart",
                metaDescription:
                    "Discover how to create a high performance Angular Line Chart with SciChart - the leading JavaScript library. Get your free demo now.",
                markdownContent:
                    "## Angular Line Chart - Angular Integration\n\n### Overview\nThis example demonstrates various permutations of a SciChart.js line chart implemented within an Angular standalone component. It showcases multiple chart variations including simple line charts, digital (step) charts, charts with tooltips, dashed lines, gradient and paletted lines, as well as hover/select enabled charts, vertical charts, charts with gaps, and thresholded line charts.\n\n### Technical Implementation\nThe implementation leverages Angular's component-based architecture using the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package. Each chart is asynchronously initialized via `ngOnInit` where initialization callbacks are assigned as `@Input()` functions to the `ScichartAngularComponent`, ensuring a clear separation of concerns. This approach follows best practices outlined in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) and the [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html) guide. Custom animations such as sweep, wave, and fade are applied to enhance rendering, while interactive modifiers including tooltips, rollover, and slice modifiers provide dynamic feedback during user interaction.\n\n### Features and Capabilities\nThe example includes several advanced features: **real-time data updates**, configurable styling options like gradient and dashed line effects, and interactivity such as hover and selection callbacks that adjust series properties dynamically. The demonstration also incorporates responsive design using CSS Flexbox, ensuring optimal layout across device sizes. Developers can explore performance optimization techniques for multi-chart rendering as discussed in the [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) article.\n\n### Integration and Best Practices\nBy decoupling chart initialization logic from component templates and using asynchronous lifecycle hooks, the example adheres to Angular best practices for component communication and performance. Effective use of `@Input()` functions to pass initialization callbacks facilitates modularity and maintainability. For more details on managing asynchronous initialization in Angular, refer to the [async/await in Angular ngOnInit](https://stackoverflow.com/questions/56092083/async-await-in-angular-ngoninit) discussion. Additionally, further memory and rendering best practices can be found in the [SciChart Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guide.\n\nThis comprehensive example serves as a robust reference for developers looking to integrate SciChart.js with Angular, demonstrating advanced chart customization, interactive features, and optimal performance in a scalable architectural design.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Line%20Series%20Type.html",
                title: "The specific page for the JavaScript Line Chart documentation will help you to get started",
                linkTitle: "JavaScript Line Chart Documentation",
            },
        ],
        path: "line-chart",
        metaKeywords: "line, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/LineChart",
        thumbnailImage: "javascript-line-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false
    };
//// End of computer generated metadata

const lineChartExampleInfo = createExampleInfo(metaData);
export default lineChartExampleInfo;
