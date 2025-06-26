import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DAnimationsDataAnimation",
        imagePath: "javascript-data-animation.jpg",
        description:
            "Demonstrates how to run **Dataset Animations** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to run **Dataset Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Chart Data Animation",
                pageTitle: "JavaScript Chart Data Animation",
                metaDescription: "Demonstrates how to run Dataset Animations with JavaScript.",
                markdownContent:
                    "## Data Animation Example - JavaScript\n\n### Overview\nThe Data Animation Example demonstrates how to implement real-time dataset animations with SciChart.js using JavaScript. This example initializes a SciChartSurface asynchronously and dynamically updates chart data with smooth animated transitions, making it ideal for high-performance WebGL visualizations.\n\n### Technical Implementation\nThe chart is created by asynchronously initializing the [SciChartSurface](https://www.scichart.com/getting-started/scichart-javascript/) using async/await, a pattern explained in [Async and Await in JavaScript](https://dev.to/this-is-learning/async-and-await-in-vanilla-javascript-2mep). It configures **NumericAxis** objects with specific visible ranges set by [NumberRange](https://www.scichart.com/documentation/js/current/NumericAxis.html) to control the chart axes. The data is managed through an **XyDataSeries** and rendered with a **FastLineRenderableSeries**, which incorporates a custom **EllipsePointMarker** for enhanced visual emphasis. Real-time data updates are achieved via a looping setTimeout function that adjusts the data and triggers a [ScatterAnimation](https://www.scichart.com/documentation/js/current/Dataset%20Animations.html) to animate these changes.\n\n### Features and Capabilities\nThis example highlights several advanced features and customizations: the use of dynamic, randomized data updates that enable smooth animated transitions; advanced styling with a gradient palette applied through [PaletteFactory](https://www.scichart.com/documentation/js/current/PaletteFactoryHelperClass.html) and gradient parameters; and custom point markers providing greater visual clarity. These capabilities are engineered for high-performance, real-time updates while ensuring efficient data handling.\n\n### Integration and Best Practices\nEven though this implementation is in JavaScript, it adheres to best practices applicable across various frameworks. The asynchronous initialization ensures that the chart setup is non-blocking, as illustrated in the asynchronous patterns from [Async and Await in JavaScript](https://www.scichart.com/getting-started/scichart-javascript/). The implementation also emphasizes proper resource management and cleanup, following [resource management](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guidelines to prevent memory leaks by disposing of the SciChartSurface appropriately. Finally, developers can consult the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation to further optimize real-time dataset animations in their applications.",
            },
            react: {
                subtitle:
                    "Demonstrates how to run **Dataset Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "React Chart Data Animation",
                pageTitle: "React Chart Data Animation",
                metaDescription: "Demonstrates how to run Dataset Animations with JavaScript.",
                markdownContent:
                    "## React Chart Data Animation\n\n### Overview\nThis example demonstrates a dynamic dataset animation using SciChart.js in a React environment. It showcases how to continuously update chart data in real-time and animate transitions in a high-performance WebGL canvas.\n\n### Technical Implementation\nThe core functionality is implemented in an external async function, which initializes a SciChart surface with numeric X and Y axes and a fast line series that mimics scatter data. Data is periodically updated using randomized adjustments to both the X and Y values, with animations controlled by the SciChart.js ScatterAnimation class. Developers can explore the details of dataset animations in the [Dataset Animations documentation](https://www.scichart.com/documentation/js/current/Dataset%20Animations.html). As asynchronous initialization plays a key role, the code leverages async/await for efficient non-blocking setup, as discussed in [Using async/await inside a React functional component](https://stackoverflow.com/questions/57847626/using-async-await-inside-a-react-functional-component).\n\n### Features and Capabilities\nThe example emphasizes real-time update capabilities with smooth and visually appealing transitions. It uses custom point markers and a gradient palette for enhanced visual output, while interactive controls allow starting and stopping of the animation update cycle. The design aligns with performance optimization practices, ensuring resource cleanup by leveraging the React component lifecycle via the onDelete callback in the `<SciChartReact/>` component. This approach helps maintain optimal performance for real-time chart animations, as detailed in the [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) guide.\n\n### Integration and Best Practices\nIntegration with React is achieved using the `<SciChartReact/>` component which ensures the chart is rendered as part of the React component hierarchy. The component accepts the async drawExample function via the initChart prop, allowing for clean initialization and proper resource management once the component unmounts. Lifecycle management is further enhanced by the onDelete callback, ensuring that any ongoing animations or data updates are properly halted, following [best practices for React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/). This example demonstrates how to effectively combine realtime data streaming, asynchronous chart initialization, and interactive controls in a React application, showcasing a robust design for integrating third-party libraries like SciChart.js within modern React projects.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to run **Dataset Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Chart Data Animation",
                pageTitle: "Angular Chart Data Animation",
                metaDescription: "Demonstrates how to run Dataset Animations with JavaScript.",
                markdownContent:
                    "## Angular Chart Data Animation\n\n### Overview\nThis example demonstrates how to implement real-time **dataset animations** using SciChart.js in an Angular standalone application. The chart is initialized asynchronously and dynamically updates with randomized data to create smooth animated transitions.\n\n### Technical Implementation\nThe chart is integrated using the [scichart-angular](https://www.npmjs.com/package/scichart-angular) component, which embeds the SciChart surface directly into the Angular template. An asynchronous function initializes the chart using async/await as outlined in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. A Fast Line Renderable Series is created with a custom point marker and gradient palette, and dataset animations are executed via a looping setTimeout function calling the ScatterAnimation.\n\n### Features and Capabilities\nThe example highlights real-time update capabilities through continuous data modifications and animated transitions. It employs advanced features such as custom styling with gradient palettes and elliptical point markers to enhance visual output. These implementations are optimized for performance by careful resource management, ensuring that animation timers and data series are properly cleaned up during the Angular component lifecycle.\n\n### Integration and Best Practices\nIntegration with Angular is achieved through a standalone component that leverages asynchronous initialization and resource cleanup as prescribed by Angular’s lifecycle hooks, detailed in [Angular Lifecycle Hooks Best Practices](https://www.angularminds.com/blog/angular-lifecycle-hooks-best-practices). The use of setTimeout for animation timing is consistent with practices demonstrated in the [Angular Chart Data Animation](https://scichart.com/demo/angular/data-animation) demo, while performance optimization techniques are further discussed in [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html). Developers are encouraged to adopt these techniques to ensure responsive, high-performance real-time chart updates in Angular applications.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Dataset%20Animations.html",
                title: "The specific page for the JavaScript Dataset Animation documentation will help you to get started",
                linkTitle: "JavaScript Data Animation Documentation",
            },
        ],
        path: "data-animation",
        metaKeywords: "data, dataset, animation, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/Animations/DataAnimation",
        thumbnailImage: "javascript-data-animation.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const dataAnimationExampleInfo = createExampleInfo(metaData);
