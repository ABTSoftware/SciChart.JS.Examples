import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "RealTimeMountainChart",
        id: "chart2D_basicCharts_RealtimeMountainChart",
        imagePath: "javascript-realtime-mountain-chart.jpg",
        description:
            "This example demonstrates how create a **JavaScript Mountain Chart** with animated realtime updates using SciChart.js, our High Performance JavaScript Charts.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "This example demonstrates how create a **JavaScript Mountain Chart** with animated realtime updates using SciChart.js, our High Performance JavaScript Charts.",
                title: "JavaScript Realtime Mountain Chart",
                pageTitle: "JavaScript Realtime Mountain Chart | View Online At SciChart",
                metaDescription:
                    "JavaScript Realtime Mountain Chart made easy. Add animated, real-time updates with SciChart.js - high performance JavaScript Charts. Get free trial now. ",
                markdownContent:
                    "## Real Time Mountain Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create an animated real-time mountain chart using SciChart.js in JavaScript. The chart is designed to continuously update by appending new data points and animating the transitions, while leveraging the high performance of a WebAssembly context.\n\n### Technical Implementation\nThe implementation begins by creating a `SciChartSurface` using the method documented in the [Creating a new SciChartSurface and loading Wasm](https://www.scichart.com/documentation/js/v5/2d-charts/surface/new-scichart-surface/) guide. `NumericAxis` are configured with the [NumericAxis](https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/axis-types/numeric-axis/) class and a `growBy` property to ensure proper scaling. A `FastMountainRenderableSeries` is then used to render the mountain chart with a gradient fill similar to that described in the [Mountain (Area) Chart documentation](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/fast-mountain-area-renderable-series/). Real-time data updates are implemented via a `setTimeout` loop that appends new data points. The newest point is animated using the [DoubleAnimator](https://www.scichart.com/documentation/js/v5/2d-charts/animations-api/generic-animations/) class with an easing function (`easing.outExpo`) to create smooth transitions. A custom SVG annotation renders an animated pulsing dot at the latest data point, enhancing the visual feedback.\n\n### Features and Capabilities\nThe example showcases several advanced features including real-time data updating, animated transitions, and custom annotations. It manipulates WebAssembly-based native arrays directly for performance optimization and applies gradient styling to the mountain series, providing an engaging real-time visualization that highlights the most recent data updates.\n\n### Integration and Best Practices\nDevelopers working with JavaScript can integrate this example into their projects by following the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. The example emphasizes performance optimization by efficiently managing the animation loop and reentrancy, as further explained in the [Adding Realtime Updates](https://www.scichart.com/documentation/js/v5/get-started/tutorials-js-npm-webpack/tutorial-04-adding-realtime-updates/) documentation. Best practices such as proper resource cleanup and efficient DOM interactions are demonstrated, ensuring a robust implementation for high-frequency data updates.",
            },
            react: {
                subtitle:
                    "This example demonstrates how create a **React Mountain Chart** with animated realtime updates using SciChart.js, our High Performance JavaScript Charts.",
                title: "React Realtime Mountain Chart",
                pageTitle: "React Realtime Mountain Chart | View Online At SciChart",
                metaDescription:
                    "React Realtime Mountain Chart made easy. Add animated, real-time updates with SciChart.js - high performance JavaScript Charts. Get free trial now. ",
                markdownContent:
                    "## React Realtime Mountain Chart\n\n### Overview\nThis [React Charts](https://www.scichart.com/react-charts/) example demonstrates a high performance real time Mountain Chart implemented in React using SciChart.js.\n\n### Technical Implementation\nThe chart is configured by creating `NumericAxis` X and Y axes and a Mountain Series via the `FastMountainRenderableSeries`, as detailed in the [Mountain (Area) Chart Documentation](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/fast-mountain-area-renderable-series/). Real-time data is injected into the chart using a timer loop, where new points are added and then animated using the `DoubleAnimator` with easing functions such as `easing.outExpo`, as described in the [Generic Animations](https://www.scichart.com/documentation/js/v5/2d-charts/animations-api/generic-animations/) guide. A custom SVG annotation renders a pulsing dot at the latest data point, enhancing the dynamic feel of the visualization.\n\n### Features and Capabilities\nThe implementation supports real-time updates by continuously appending new data points and animating transitions. In addition, it includes advanced styling features like gradient fills for the mountain series and animated custom annotations. Developers looking to implement similar real-time behaviors can refer to the [Adding Realtime Updates](https://www.scichart.com/documentation/js/v5/get-started/tutorials-js-npm-webpack/tutorial-04-adding-realtime-updates/) tutorial for further insight.\n\n### Integration and Best Practices\nThe example integrates into React through the `<SciChartReact/>` component, utilizing the `onInit` and `onDelete` callbacks to start and stop data updates. This approach ensures smooth lifecycle management within React applications and follows [best practices for React integration](https://www.scichart.com/documentation/js/v5/get-started/tutorials-react/tutorial-02-creating-a-chart-with-scichart-react/). Additionally, performance is optimized by leveraging the WebAssembly context provided by SciChart.js, ensuring efficient rendering even with continuous data updates. For more detailed guidance on integrating SciChart.js with React, developers are encouraged to review the resources provided in the [SciChart React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/) documentation.",
            },
            angular: {
                subtitle:
                    "This example demonstrates how create a **Angular Mountain Chart** with animated realtime updates using SciChart.js, our High Performance JavaScript Charts.",
                title: "Angular Realtime Mountain Chart",
                pageTitle: "Angular Realtime Mountain Chart | View Online At SciChart",
                metaDescription:
                    "Angular Realtime Mountain Chart made easy. Add animated, real-time updates with SciChart.js - high performance JavaScript Charts. Get free trial now. ",
                markdownContent:
                    "## Angular Realtime Mountain Chart\n\n### Overview\nThis example demonstrates how to integrate SciChart.js into an Angular standalone component to create a real-time Mountain or Area Chart. The chart continuously updates by appending new data points and animating transitions, making use of a custom SVG annotation that renders a pulsing dot to highlight the latest data point.\n\n### Technical Implementation\nThe implementation starts with an Angular component that imports the `ScichartAngularComponent`, as detailed in the [Getting started with standalone components - Angular](https://angular.io/guide/standalone-components) guide. The component binds to the chart using Angular event binding (via `onInit` and `onDelete`), which allows it to start and stop real-time updates seamlessly. The core chart logic is encapsulated in the `drawExample` function where a `SciChartSurface` is created with a WebAssembly context. `NumericAxis` are configured, and a `FastMountainRenderableSeries` is rendered with a gradient fill. New data points are added using a `setTimeout` loop, and the latest point is animated using the `DoubleAnimator` with an easing function (easing.outExpo), as explained in the [Adding Realtime Updates | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/v5/get-started/tutorials-js-npm-webpack/tutorial-04-adding-realtime-updates/) tutorial.\n\n### Features and Capabilities\nThe chart not only supports real-time data updates but also includes advanced visual customizations. A `FastMountainRenderableSeries` is used to render the data with a smooth gradient fill, and a custom SVG annotation creates an animated pulsing dot at the most recent data point. These visual elements help in emphasizing data changes dynamically while maintaining high rendering performance. For detailed customization of annotations, refer to the [CustomAnnotation Documentation](https://www.scichart.com/documentation/js/v5/2d-charts/annotations-api/custom-annotation/).\n\n### Integration and Best Practices\nIntegration into Angular is achieved through effective use of Angular’s event binding and lifecycle management. By initiating updates in the `onInit` event and stopping them in the `onDelete` event, the example adheres to best practices for managing component lifecycles, ensuring that WebAssembly resources and real-time update loops are efficiently handled. Developers looking to optimize performance with real-time updates should also consider insights from the [DataSeries Realtime Updates | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/data-series-api/realtime-updates/) guide. Additionally, integration of the WebAssembly-based `SciChartSurface` within Angular is in line with modern techniques for deploying high-performance visualizations, as explained in the [Deploying Wasm (WebAssembly) and Data Files with your app](https://www.scichart.com/documentation/js/v5/2d-charts/surface/deploying-wasm/) documentation.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/fast-mountain-area-renderable-series/",
                title: "The JavaScript Mountain Chart example demonstrates how to create a Mountain Chart with SciChart.js",
                linkTitle: "Mountain (Area) Chart Documentation",
            },
        ],
        path: "realtime-mountain-chart",
        metaKeywords: "mountain, chart, realtime, animated, javascript, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/RealTimeMountainChart",
        thumbnailImage: "javascript-realtime-mountain-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

const realTimeMountainChartExampleInfo = createExampleInfo(metaData);
export default realTimeMountainChartExampleInfo;
