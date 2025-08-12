import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "ContoursChart",
        id: "chart2D_basicCharts_ContourChart",
        imagePath: "javascript-heatmap-chart-with-contours.jpg",
        description:
            "Our Contours Chart example demonstrates how to create a **JavaScript Contour-map Chart** using our powerful JavaScript Chart Library.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Our Contours Chart example demonstrates how to create a **JavaScript Contour-map Chart** using our powerful JavaScript Chart Library.",
                title: "JavaScript Heatmap Chart With Contours",
                pageTitle: "JavaScript Heatmap Chart With Contours Example | SciChart.js",
                metaDescription:
                    "Design a highly dynamic JavaScript Heatmap Chart With Contours with SciChart's feature-rich JavaScript Chart Library. Get your free demo today.",
                markdownContent:
                    "## Contours Chart Example - JavaScript\n\n### Overview\nThis example demonstrates how to create an interactive **heatmap chart with contours** using SciChart.js in JavaScript. It renders a vivid heatmap background combined with overlaid contour lines, providing a powerful visualization tool for data analysis.\n\n### Technical Implementation\nThe chart is initialized asynchronously using async/await, ensuring a smooth startup process. For more information on asynchronous initialization in JavaScript, refer to [Async and Await in JavaScript](https://dev.to/this-is-learning/async-and-await-in-vanilla-javascript-2mep) and [How to use async and await with JavaScript](https://gomakethings.com/how-to-use-async-and-await-with-vanilla-javascript/). The implementation sets up hidden numeric X and Y axes and creates a data series using a custom generator. Two main renderable series are used: the `UniformHeatmapRenderableSeries` for the heatmap and the `UniformContoursRenderableSeries` for the contours. Detailed information about the contours series can be found in the [Contours Series documentation](https://www.scichart.com/documentation/js/current/The%20Contours%20Series%20Type.html).\n\n### Features and Capabilities\nThe example supports advanced interactive features. Chart navigation is enhanced with modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier`; further details are available in the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html). Additionally, a dynamic color mapping is applied via the `HeatmapColorMap` with multiple gradient stops, and the layered rendering of heatmap and contour series creates a comprehensive visualization platform.\n\n### Integration and Best Practices\nThe implementation follows best practices by separating data generation from rendering logic, which promotes maintainability and scalability. The use of WebGL rendering in SciChart.js guarantees high performance, as described in the [Advanced JavaScript Chart and Graph Library](https://www.scichart.com/javascript-chart-features/) page. This example, built purely with JavaScript, serves as a solid foundation for developers looking to create high-performance, interactive charts without relying on additional frameworks.",
            },
            react: {
                subtitle:
                    "Our Contours Chart example demonstrates how to create a **React Contour-map Chart** using our powerful JavaScript Chart Library.",
                title: "React Heatmap Chart With Contours",
                pageTitle: "React Heatmap Chart With Contours Example | SciChart.js",
                metaDescription:
                    "Design a highly dynamic React Heatmap Chart With Contours with SciChart's feature-rich JavaScript Chart Library. Get your free demo today.",
                markdownContent:
                    "## React Heatmap Chart With Contours\n\n### Overview\nThis example demonstrates a highly dynamic **React Contour-map Chart** built with SciChart.js. It integrates a detailed heatmap visualization with overlaid contour lines, offering an interactive and visually appealing chart that leverages WebGL for optimal performance.\n\n### Technical Implementation\nThe chart is asynchronously initialized through the [SciChartReact](https://www.scichart.com/blog/react-charts-with-scichart-js/) component in a React application. The example uses an asynchronous function to create a SciChartSurface, add hidden X and Y axes, and generate heatmap data via a custom data generator. Two distinct renderable series are implemented: one for the contours (using `UniformContoursRenderableSeries`) and a background heatmap (using `UniformHeatmapRenderableSeries`). Interaction is enhanced by adding modifiers such as [ZoomPanModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html) and [MouseWheelZoomModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html), ensuring smooth navigation and zooming capabilities. Asynchronous patterns via async/await are employed, following best practices as seen in [this discussion](https://stackoverflow.com/questions/57847626/using-async-await-inside-a-react-functional-component) for clean and effective React integration.\n\n### Features and Capabilities\nThe example showcases advanced visualization techniques by layering a heatmap with contours, enabling detailed data representation and analysis. It supports high-performant, real-time interactions with features like panning, zooming, and dynamic legend overlays. The use of WebGL via SciChart.js is a key factor in achieving excellent rendering performance, as further detailed in the [React Charts](https://www.scichart.com/react-charts/) page.\n\n### Integration and Best Practices\nIn this example, the separation of concerns is maintained by decoupling chart drawing logic from React component structure, enabling easier maintenance and customization. Multiple `<SciChartReact/>` components are integrated with precise absolute positioning for overlaying the heatmap legend, adhering to strategies for managing layered components in React. Developers can refer to the [SciChart React setup tutorial](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html) for further insights on best practices. Overall, this implementation is optimized for performance and interactivity, making it a robust solution for complex data visualization scenarios in React applications.",
            },
            angular: {
                subtitle:
                    "Our Contours Chart example demonstrates how to create a **Angular Contour-map Chart** using our powerful JavaScript Chart Library.",
                title: "Angular Heatmap Chart With Contours",
                pageTitle: "Angular Heatmap Chart With Contours Example | SciChart.js",
                metaDescription:
                    "Design a highly dynamic Angular Heatmap Chart With Contours with SciChart's feature-rich JavaScript Chart Library. Get your free demo today.",
                markdownContent:
                    "## Angular Heatmap Chart With Contours\n\n### Overview\nThis Angular example demonstrates how to render an interactive heatmap chart overlaid with contour lines using SciChart.js. The implementation leverages the scichart-angular package to integrate the chart into a standalone Angular component, ensuring a seamless integration within Angular applications.\n\n### Technical Implementation\nThe chart is initialized asynchronously using the async/await pattern as shown in the example. The `SciChartSurface` is created with hidden numeric X and Y axes, and a custom data generator produces the heatmap values. Two renderable series are used: one for the contour layer implemented with the `UniformContoursRenderableSeries` and another for the background heatmap provided by the `UniformHeatmapRenderableSeries`. Detailed documentation for these series can be found in the [Contours Series documentation](https://www.scichart.com/documentation/js/current/The%20Contours%20Series%20Type.html). Chart interactions are enhanced by integrating modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` as described in the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).\n\n### Features and Capabilities\nThe example showcases real-time interactive features including seamless panning and zooming while rendering detailed heatmap and contour overlays. Customization options such as adjustable color maps, opacity settings, and precise stroke definitions enable advanced data visualization and analysis. Developers can easily update the configuration to handle dynamic data sets, ensuring robust visualization performance.\n\n### Integration and Best Practices\nThe Angular integration is achieved using standalone component bindings from the scichart-angular package; more details can be found in the [scichart-angular](https://www.npmjs.com/package/scichart-angular) npm page and Angular binding guides. Efficient asynchronous initialization and modular design separate chart rendering logic from the Angular component, thereby enhancing maintainability and scalability. Additional chart elements like the HeatmapLegend are configured independently to further enrich the user experience, as explained in the [HeatmapLegend API Documentation](https://www.scichart.com/documentation/js/current/Uniform-Heatmap-Colormaps.html).",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Contours%20Series%20Type.html",
                title: "The specific page for the JavaScript Contours Chart documentation will help you to get started",
                linkTitle: "JavaScript Contours Chart Documentation",
            },
        ],
        path: "heatmap-chart-with-contours",
        metaKeywords: "contour, contours, heatmap, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/ContoursChart",
        thumbnailImage: "javascript-heatmap-chart-with-contours.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

const contourChartExampleInfo = createExampleInfo(metaData);
export default contourChartExampleInfo;
