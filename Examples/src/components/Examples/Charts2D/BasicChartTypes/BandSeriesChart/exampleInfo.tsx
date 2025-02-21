import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DBasicChartTypesBandSeriesChart",
        imagePath: "javascript-band-chart.jpg",
        description:
            "Demonstrates how to create a **JavaScript Band Chart** or High-Low Fill using SciChart.js, our High Performance JavaScript Chart Framework",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Band Chart** or High-Low Fill using SciChart.js, our High Performance JavaScript Chart Framework",
                title: "JavaScript Band Chart",
                pageTitle: "JavaScript Band Chart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript Band Chart or High-Low Fill with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent:
                    "## Band Series Chart in Vanilla JavaScript\n\n### Overview\nThis example demonstrates how to create a high-performance **band series chart** using SciChart.js in a vanilla JavaScript environment. It visualizes high and low values using two band series, each with distinct visual styles and smooth animations.\n\n### Technical Implementation\nThe chart is initialized asynchronously with [SciChartSurface.create](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html), which efficiently sets up the WebGL context. The implementation adds numeric X and Y axes and prepares three arrays for X, Y, and Y1 values. These values are fed into the **XyyDataSeries** (see [XyyDataSeries documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/xyydataseries.html)) to supply the data for each band. Two **FastBandRenderableSeries** are then created. The first series applies solid color fills with transparency, while the second series demonstrates the use of linear gradient fills defined via [GradientParams](https://www.scichart.com/documentation/js/current/typedoc/classes/gradientparams.html). Both series incorporate smooth transitioning effects using **SweepAnimation** ([SweepAnimation documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/sweepanimation.html)).\n\n### Features and Capabilities\nThis example highlights several advanced features: interactive modifiers such as **ZoomExtentsModifier**, **ZoomPanModifier**, and **MouseWheelZoomModifier** enhance user experience by providing intuitive zooming and panning (refer to the [interactive modifier guide](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html)). Additionally, the implementation demonstrates robust handling of real-time data updates and performance optimizations through efficient WebGL rendering.\n\n### Integration and Best Practices\nUsing a pure vanilla JavaScript approach, the example directly calls an asynchronous function that both creates the chart and returns a destructor for proper resource management. Developers can cleanly dispose of the chart by invoking the delete method on the SciChartSurface, as described in the [SciChartSurface API documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html). This methodical approach ensures optimal performance and memory usage, making it a strong foundation for integrating SciChart.js into broader JavaScript applications.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **React Band Chart** or High-Low Fill using SciChart.js, our High Performance JavaScript Chart Framework",
                title: "React Band Chart",
                pageTitle: "React Band Chart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React Band Chart or High-Low Fill with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent:
                    "## React Band Series Chart\n\n### Overview\nThis example demonstrates a React implementation of a high performance Band Series Chart using SciChart.js. The chart renders two band series with distinct stroke and gradient fill configurations, and incorporates interactive modifiers for zooming and panning.\n\n### Technical Implementation\nThe chart is initialized asynchronously via the SciChartReact component’s initChart property, which is linked to a drawExample function. This function sets up the SciChartSurface with numeric X and Y axes and creates two band series using the FastBandRenderableSeries class with data provided by the XyyDataSeries. The example leverages advanced sweep animations (via SweepAnimation) to animate the rendering of the series. Developers can refer to the [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) guide for more details on asynchronous initialization in a React environment.\n\n### Features and Capabilities\nThe implementation features advanced gradient customizations through fill and fillLinearGradient parameters, allowing different color gradients for the upper and lower bounds of the bands. Interactive modifiers such as ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier enhance the user experience by supporting dynamic zooming and panning. The chart performance benefits from SciChart.js’s efficient WebGL rendering, which is crucial for real-time updates and smooth animations. Detailed information on gradient fills can be found in [The Band Series type](https://www.scichart.com/documentation/js/current/The%20Band%20Series%20type.html) documentation.\n\n### Integration and Best Practices\nThis React-centric implementation follows best practices for integrating SciChart components into React applications. The use of the SciChartReact wrapper ensures that the chart is created and managed in a React-friendly manner. Performance optimizations such as asynchronous chart creation and the reuse of the underlying WebGL context are key to maintaining responsiveness in complex applications. For additional best practices, developers can explore the [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) article and the interactive modifiers are further detailed in the [ZoomPanModifier documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html) to help optimize user interactions.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Angular Band Chart** or High-Low Fill using SciChart.js, our High Performance JavaScript Chart Framework",
                title: "Angular Band Chart",
                pageTitle: "Angular Band Chart | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a Angular Band Chart or High-Low Fill with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent:
                    "## Angular Band Series Chart in Angular\n\n### Overview\nThis Angular example demonstrates how to integrate SciChart.js into a modern Angular application using a standalone component. The chart renders two band series with distinct visual styling and interactive capabilities, allowing for a high-performance band or High-Low Fill representation.\n\n### Technical Implementation\nThe chart is asynchronously initialized within an Angular standalone component that leverages the [SciChartAngularComponent](https://angular.io/guide/standalone-components) to simplify integration. The example uses the SciChartSurface to create numeric X and Y axes, and plots two band series using the [FastBandRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) class combined with an XyyDataSeries for supplying X, Y, and Y1 values. Each series is enhanced with a [SweepAnimation](https://www.scichart.com/getting-started/scichart-javascript/) for smooth rendering and customized further using gradient fills provided by [GradientParams](https://www.scichart.com/documentation/js/current/typedoc/classes/gradientparams.html).\n\n### Features and Capabilities\nThe implementation highlights real-time update capabilities and advanced styling customizations. One series uses semi-transparent fills with distinct stroke colors, while the other applies a linear gradient fill effect to both the upper and lower components of the band. Interactive modifiers such as the [ZoomExtentsModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html), ZoomPanModifier, and MouseWheelZoomModifier are incorporated to provide intuitive zooming and panning, ensuring a responsive and engaging user experience.\n\n### Integration and Best Practices\nBy utilizing a standalone Angular component, this example adheres to modern Angular component design practices, simplifying the integration process. Developers can refer to the [Angular standalone components guide](https://angular.io/guide/standalone-components) for further information on structuring such components within an Angular module. The asynchronous initialization pattern used here not only improves performance by offloading heavy tasks but also enhances the overall responsiveness of the application. For more insights into rendering optimizations and interactive features, the [SciChart JS Getting Started guide](https://www.scichart.com/getting-started/scichart-javascript/) provides additional best practices.\n\nThis example serves as a strong foundation for integrating high-performance SciChart.js charts within Angular applications, combining advanced visualizations with efficient WebGL rendering to build sophisticated data visualizations.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Band%20Series%20type.html",
                title: "The specific page for the JavaScript Digital Line Chart documentation will help you to get started",
                linkTitle: "JavaScript Band Chart Documentation",
            },
        ],
        path: "band-chart",
        metaKeywords: "band, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/BandSeriesChart",
        thumbnailImage: "javascript-band-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const bandSeriesChartExampleInfo = createExampleInfo(metaData);
