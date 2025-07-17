import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "BoxPlotChart",
        id: "chart2D_v4Charts_BoxPlotChart",
        imagePath: "javascript-box-plot-chart.jpg",
        description:
            "Creates a **JavaScript Box Plot Chart** using SciChart.js, with the following features: DataLabels, Rounded corners, Gradient-palette fill, startup animations.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Box Plot Chart** using SciChart.js, with the following features: DataLabels, Rounded corners, Gradient-palette fill, startup animations.",
                title: "JavaScript Box Plot Chart",
                pageTitle: "JavaScript Box Plot Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "JavaScript Box Plot Chart demo by SciChart supports gradient fill and paletteproviders for more custom coloring options. Get your free demo now.",
                markdownContent:
                    "## Box Plot Chart Example (JavaScript)\n\n### Overview\nThis example demonstrates how to create an interactive **Box Plot Chart** using SciChart.js in a JavaScript environment. The chart illustrates key features such as data labels, rounded corners, gradient palette fills, and startup animations, providing a high-performance real-time data visualization solution.\n\n### Technical Implementation\nThe chart is initialized by creating a `SciChartSurface` via the asynchronous call to `SciChartSurface.create()`, a method detailed in the [Tutorial 01 - Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html). The implementation sets up numeric axes using the `NumericAxis` class and populates the chart with a `FastColumnRenderableSeries`, which uses an `XyDataSeries` to manage the data points. Advanced customizations include setting rounded corners, a gradient fill created with `PaletteFactory`, and a `WaveAnimation` to animate the chart on startup. For more details on these aspects, refer to the [The Column Series Type](https://www.scichart.com/documentation/js/current/The%20Column%20Series%20Type.html) and [The Animations API](https://www.scichart.com/documentation/js/current/Animations%20API.html) documentation.\n\n### Features and Capabilities\nKey technical features of this example include interactive modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` which enhance user interaction by providing seamless zooming and panning capabilities. The series is further enhanced with data labels that are styled and positioned above each column for improved readability. The use of gradient fills via `PaletteFactory` not only enhances visual appeal but also demonstrates advanced customization options, aligning with best practices for high-performance WebGL rendering. Details on gradient customization can be found in the [The PaletteFactory Helper Class](https://www.scichart.com/documentation/js/current/PaletteFactoryHelperClass.html) documentation.\n\n### Integration and Best Practices\nIn a JavaScript integration, the chart is created and managed by directly invoking the `drawExample` function. Resource management is handled by returning a destructor function that calls `sciChartSurface.delete()`, ensuring that resources are properly freed when the chart is no longer needed. This approach aligns with recommended practices for WebAssembly integration and efficient memory management as explained in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. Additionally, the direct method of instantiating and disposing of the chart ensures optimal performance in high-frequency data scenarios.\n",
            },
            react: {
                subtitle:
                    "Creates a **React Box Plot Chart** using SciChart.js, with the following features: DataLabels, Rounded corners, Gradient-palette fill, startup animations.",
                title: "React Box Plot Chart",
                pageTitle: "React Box Plot Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "React Box Plot Chart demo by SciChart supports gradient fill and paletteproviders for more custom coloring options. Get your free demo now.",
                markdownContent:
                    "## React Box Plot Chart Example\n\n### Overview\nThis example demonstrates how to integrate SciChart.js with React to create a **Box Plot Chart** featuring data labels, rounded corners, gradient fill, and startup animations. The chart is rendered using the `<SciChartReact/>` component, ensuring a seamless integration within a React application.\n\n### Technical Implementation\nThe chart is initialized through an asynchronous `drawExample` function, which creates a `SciChartSurface` and sets up numeric axes. A `FastColumnRenderableSeries` is added with an `XyDataSeries` for x and y values. Key features such as the gradient palette provider for advanced fill styling and a `WaveAnimation` for smooth startup animations are integrated directly in the series configuration. This approach is detailed further in the [Column Series Type Documentation](https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html).\n\n### Features and Capabilities\nAdvanced styling is achieved with options like rounded corners, a gradient fill created via the palette provider, and configurable data labels that position text above the columns as described in the [Adding DataLabels to a Chart Series](https://www.scichart.com/documentation/js/current/AddingDataLabels.html) guide. Interactive modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` are added to enhance user experience and enable real-time chart interactions.\n\n### Integration and Best Practices\nThe integration leverages the `<SciChartReact/>` component, ensuring best practices for embedding high-performance WebGL charts in React. The implementation follows the principles highlighted in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) and emphasizes proper lifecycle management, initializing and cleaning up the chart efficiently. For further guidance on setting up such projects, refer to the [Tutorial 01 - Setting up a project with scichart-react and config object](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html).",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Box Plot Chart** using SciChart.js, with the following features: DataLabels, Rounded corners, Gradient-palette fill, startup animations.",
                title: "Angular Box Plot Chart",
                pageTitle: "Angular Box Plot Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Angular Box Plot Chart demo by SciChart supports gradient fill and paletteproviders for more custom coloring options. Get your free demo now.",
                markdownContent:
                    "## Angular Box Plot Chart\n\n### Overview\nThis Angular Box Plot Chart example demonstrates how to integrate SciChart.js within an Angular application using the [scichart-angular](https://www.npmjs.com/package/scichart-angular) component. The example focuses on rendering an interactive Box Plot chart with features including data labels, rounded corners, a gradient palette fill, and smooth startup animations.\n\n### Technical Implementation\nThe chart is initialized via a standalone Angular component where the SciChart chart is embedded using the [initChart] property binding. The `drawExample` function creates a `SciChartSurface`, adds numeric axes, and configures a `FastColumnRenderableSeries` with an `XyDataSeries` for the data points. Advanced customizations such as a gradient fill implemented with `PaletteFactory` and a `WaveAnimation` for startup effects are directly applied within the series settings. This technique is in line with best practices detailed in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation.\n\n### Features and Capabilities\nKey capabilities include interactive modifiers like `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` which enable smooth user interactions, while customizable data labels and a gradient palette provider enhance the visual appeal. These features ensure high performance and responsiveness, ideal for real-time data visualization.\n\n### Integration and Best Practices\nThe integration leverages the scichart-angular component to simplify embedding SciChart.js into Angular applications. The use of property binding for initializing the chart underscores efficient Angular component design as described in the [Understanding binding - Angular](https://v17.angular.io/guide/binding-overview) guide. Additionally, effective cleanup and lifecycle management of the `SciChartSurface`, as recommended in the [Angular Lifecycle Hooks Best Practices](https://www.angularminds.com/blog/angular-lifecycle-hooks-best-practices), ensures optimal performance and resource management. For further details on interactive and animation features, developers can also refer to the [Getting Started Guide](https://www.scichart.com/getting-started/scichart-javascript/) for more tips on setting up SciChart.js with Angular.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Box Plot Chart documentation will help you to get started",
                linkTitle: "JavaScript Box Plot Chart Documentation",
            },
        ],
        path: "box-plot-chart",
        metaKeywords: "box-plot, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/BoxPlotChart",
        thumbnailImage: "javascript-box-plot-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

const BoxPlotChartExampleInfo = createExampleInfo(metaData);
export default BoxPlotChartExampleInfo;
