import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarGaugesChart",
        id: "chart2D_polarCharts_PolarGaugesChart",
        imagePath: "javascript-polar-gauge-chart.jpg",
        description:
            "Creates multiple **JavaScript Polar Gauge Chart** using SciChart.js, with 2 different ways to draw the gauge: either with **PolarColumnRenderableSeries** or **PolarArcAnnotation**.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates multiple **JavaScript Polar Gauge Chart** using SciChart.js, with 2 different ways to draw the gauge: either with **PolarColumnRenderableSeries** or **PolarArcAnnotation**.",
                title: "JavaScript Polar Gauge Chart",
                pageTitle: "JavaScript Polar Gauge Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "## Polar Gauge Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create a **Polar Gauge Chart** using SciChart.js in JavaScript. The implementation showcases six different gauge variations, each utilizing [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) with [EPolarAxisMode](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolaraxismode.html) for radial and angular configurations.\n\n### Technical Implementation\nThe gauges are built using [PolarArcAnnotation](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html) for arc segments and [PolarPointerAnnotation](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpointerannotation.html) for value indicators. Each gauge initializes a [SciChartPolarSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) with custom axes and annotations. The implementation uses [NumberRange](https://www.scichart.com/documentation/js/v4/typedoc/classes/numberrange.html) to define gauge scales and [ECoordinateMode](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecoordinatemode.html) for precise positioning.\n\n### Features and Capabilities\nThe example highlights gradient-filled arcs, dynamic pointer positioning, and multi-threshold visualization. Gauge 5 demonstrates conditional rendering based on value thresholds, while Gauge 6 features tick marks and danger zones using [EPolarLabelMode](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolarlabelmode.html).\n\n### Integration and Best Practices\nThe implementation follows best practices for polar chart initialization and cleanup. Developers can extend this example by adding real-time updates as shown in the [Real-Time Updates Guide](https://www.scichart.com/documentation/js/v4/RealTimeUpdates.html)."
            },
            react: {
                subtitle:
                    "Creates multiple **React Polar Gauge Chart** using SciChart.js, with 2 different ways to draw the gauge: either with **PolarColumnRenderableSeries** or **PolarArcAnnotation**.",
                title: "React Polar Gauge Chart",
                pageTitle: "React Polar Gauge Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "## Polar Gauge Chart - React\n\n### Overview\nThis React example demonstrates how to integrate SciChart's **Polar Gauge Chart** using the [SciChartReact](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartreact.html) component. The implementation renders six distinct gauge variations with React-friendly initialization.\n\n### Technical Implementation\nThe chart initialization is handled via the `initChart` prop, which creates a [SciChartPolarSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) with polar axes and annotations. The example uses React's component structure while leveraging SciChart's [PolarColumnRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) for some gauge types.\n\n### Features and Capabilities\nKey features include responsive design, theme integration via `appTheme`, and declarative annotation configuration. The implementation shows how to use React state management with SciChart's imperative API, following patterns from the [React Integration Guide](https://www.scichart.com/documentation/js/v4/ReactIntegration.html).\n\n### Integration and Best Practices\nThe example demonstrates proper cleanup in React's useEffect hook equivalent. For performance optimization, consider memoizing chart configurations as suggested in the [Performance Optimization](https://www.scichart.com/documentation/js/v4/PerformanceOptimization.html) documentation.",
            },
            angular: {
                subtitle:
                    "Creates multiple **Angular Polar Gauge Chart** using SciChart.js, with 2 different ways to draw the gauge: either with **PolarColumnRenderableSeries** or **PolarArcAnnotation**.",
                title: "Angular Polar Gauge Chart",
                pageTitle: "Angular Polar Gauge Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "## Polar Gauge Chart - Angular\n\n### Overview\nThis Angular example showcases how to create a **Polar Gauge Chart** using the [SciChartAngularComponent](https://www.npmjs.com/package/scichart-angular). The implementation features six gauge variations in a standalone Angular component.\n\n### Technical Implementation\nThe chart is initialized through the `[initChart]` input binding, which calls the `drawExample` function to create a [SciChartPolarSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html). Angular's change detection works seamlessly with SciChart's WebAssembly rendering, as explained in the [Angular Integration Guide](https://www.scichart.com/documentation/js/v4/AngularIntegration.html).\n\n### Features and Capabilities\nThe example highlights Angular-specific patterns for chart initialization and destruction. It demonstrates how to use [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) configurations within Angular's component architecture, with type safety provided by SciChart's TypeScript definitions.\n\n### Integration and Best Practices\nThe implementation follows Angular best practices for standalone components and demonstrates proper resource cleanup. For advanced use cases, refer to the [Memory Management](https://www.scichart.com/documentation/js/v4/MemoryManagement.html) documentation to prevent memory leaks in Angular applications."
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Gauge Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Gauge Chart Documentation",
            },
        ],
        path: "polar-gauge-chart",
        metaKeywords: "polar, gauge, progress, bar, pointer, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarGaugeChart",
        thumbnailImage: "javascript-polar-gauge-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
