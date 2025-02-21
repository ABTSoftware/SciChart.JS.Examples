import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DBasicChartTypesSplineMountainChart",
        imagePath: "javascript-spline-mountain-chart.jpg",
        description:
            "This example showcases how to create a **JavaScript Spline Mountain Chart** using SciChart.js' feature-rich and High Performance JavaScript Charts.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "This example showcases how to create a **JavaScript Spline Mountain Chart** using SciChart.js' feature-rich and High Performance JavaScript Charts.",
                title: "JavaScript Spline Mountain Chart",
                pageTitle: "JavaScript Spline Mountain Chart | JavaScript Chart Library",
                metaDescription:
                    "JavaScript Spline Mountain Chart design made easy. Use SciChart.js' JavaScript Charts for high performance, feature-rich designs. Get free demo now.",
                markdownContent:
                    "# Vanilla JavaScript Spline Mountain Chart\n\n## Overview\nThis example demonstrates how to create a high-performance **Spline Mountain Chart** using vanilla JavaScript and SciChart.js. The chart is initialized asynchronously and leverages modern WebAssembly techniques to deliver smooth interpolation, dynamic gradient fills, and interactive modifiers for an engaging data visualization experience.\n\n## Technical Implementation\nThe chart is created by asynchronously initializing a SciChartSurface from a WebAssembly context, following techniques outlined in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. A Spline Mountain Renderable Series is then configured with an associated XyDataSeries and 20 interpolation points, ensuring a smooth curve as detailed in [The Spline (Smoothed) Mountain Series Type](https://www.scichart.com/documentation/js/current/The%20Spline%20(Smoothed)%20Mountain%20Series%20Type.html). The series utilizes a gradient fill set up with [GradientParams](https://www.scichart.com/documentation/js/current/typedoc/classes/gradientparams.html) and incorporates an animated wave effect via the WaveAnimation API for visual appeal. Interactive modifiers such as ZoomExtentsModifier, RubberBandXyZoomModifier, and MouseWheelZoomModifier are added to enable intuitive zooming and panning, as described in the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) documentation.\n\n## Features and Capabilities\nThe example provides real-time chart rendering with advanced customizations. It employs a smooth spline interpolation technique and utilizes an EllipsePointMarker for clear data point visualization, as documented in the [EllipsePointMarker](https://www.scichart.com/documentation/js/current/typedoc/classes/ellipsepointmarker.html) reference. The inclusion of a wave animation adds dynamic visual transitions, enhancing the overall user experience. Additionally, the use of WebAssembly technology helps achieve optimal performance, which is further explained in [Surpassing the limits of JavaScript for Charting with WebAssembly](https://www.scichart.com/blog/surpassing-limits-javascript-bigdata-webassembly/).\n\n## Integration and Best Practices\nDesigned exclusively for vanilla JavaScript, this implementation follows best practices for asynchronous initialization and resource cleanup. Developers can easily integrate this pattern by targeting a root HTML element and disposing of the SciChartSurface when necessary, in line with recommendations from the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guide. This clear and concise approach ensures efficient memory management and sets out a scalable path for further enhancements in high-performance charting solutions.",
            },
            react: {
                subtitle:
                    "This example showcases how to create a **React Spline Mountain Chart** using SciChart.js' feature-rich and High Performance JavaScript Charts.",
                title: "React Spline Mountain Chart",
                pageTitle: "React Spline Mountain Chart | JavaScript Chart Library",
                metaDescription:
                    "React Spline Mountain Chart design made easy. Use SciChart.js' JavaScript Charts for high performance, feature-rich designs. Get free demo now.",
                markdownContent:
                    "# Spline Mountain Chart (React)\n\n## Overview\nThis React example demonstrates how to integrate SciChart.js high-performance charts into a React application using the SciChartReact component. It showcases the creation of a smooth and visually appealing spline mountain chart with gradient fills and animated transitions, leveraging asynchronous initialization and WebAssembly for optimal performance.\n\n## Technical Implementation\nThe chart is initialized asynchronously via an async function that creates a SciChartSurface and adds numeric axes. A Spline Mountain Series is constructed with 20 interpolation points to achieve smoothness, along with gradient fills defined using linear gradient parameters. Interactive modifiers such as ZoomExtentsModifier, RubberBandXyZoomModifier, and MouseWheelZoomModifier are added to improve user experience. This approach follows [best practices for React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/) and utilizes WebAssembly for enhanced performance as outlined in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation.\n\n## Features and Capabilities\nThe example features real-time rendering of the spline mountain series with advanced customization capabilities. It illustrates the use of gradient fills for a more dynamic visual style and employs a wave animation effect to add life to the chart. The configuration in the example provides detailed control over the series properties—including stroke settings, point markers, and animation parameters—demonstrating the flexibility offered by SciChart.js. For additional details on the series configuration, see [The Spline (Smoothed) Mountain Series Type documentation](https://www.scichart.com/documentation/js/current/The%20Spline%20(Smoothed)%20Mountain%20Series%20Type.html).\n\n## Integration and Best Practices\nIntegration within React is achieved by encapsulating the chart initialization inside a functional component via the SciChartReact wrapper. This not only simplifies the management of asynchronous initialization but also aligns with modern React practices. Developers are encouraged to ensure proper resource cleanup to prevent memory leaks, a concept covered in various performance optimization articles. Moreover, interactive modifiers integrated into the example empower users with zooming and panning capabilities, showcasing the adaptability of SciChart.js in a React environment. For further guidance, refer to the [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) resource.",
            },
            angular: {
                subtitle:
                    "This example showcases how to create a **Angular Spline Mountain Chart** using SciChart.js' feature-rich and High Performance JavaScript Charts.",
                title: "Angular Spline Mountain Chart",
                pageTitle: "Angular Spline Mountain Chart | JavaScript Chart Library",
                metaDescription:
                    "Angular Spline Mountain Chart design made easy. Use SciChart.js' JavaScript Charts for high performance, feature-rich designs. Get free demo now.",
                markdownContent:
                    "# Angular Spline Mountain Chart\n\n## Overview\nThis example demonstrates how to integrate SciChart.js within an Angular standalone component using the [scichart-angular wrapper](https://www.npmjs.com/package/scichart-angular) to build a high performance Spline Mountain Chart. The chart showcases smooth line interpolation, gradient fills, point markers, and animated transitions, providing a visually engaging and interactive data visualization.\n\n## Technical Implementation\nThe chart is initialized asynchronously by creating a SciChartSurface from a WebAssembly context (wasmContext) via the asynchronous method SciChartSurface.create. Two [Numeric Axes](https://www.scichart.com/documentation/js/current/Tutorial%2002%20-%20Adding%20Series%20and%20Data.html) are added to represent the X and Y dimensions of the chart. A Spline Mountain Renderable Series is constructed with an associated XyDataSeries, utilizing 20 interpolation points to produce a smooth curve. The series is enhanced with a gradient fill configured through [GradientParams](https://www.scichart.com/documentation/js/current/typedoc/classes/gradientparams.html) and is embellished with an [EllipsePointMarker](https://www.scichart.com/documentation/js/current/typedoc/classes/ellipsepointmarker.html) for clear data point visualization. Additionally, a [WaveAnimation](https://www.scichart.com/documentation/js/current/The%20Spline%20(Smoothed)%20Mountain%20Series%20Type.html) is applied to introduce dynamic visual transitions. Interactive chart modifiers including ZoomExtentsModifier, RubberBandXyZoomModifier, and MouseWheelZoomModifier are integrated to facilitate intuitive zooming and panning interactions.\n\n## Features and Capabilities\nThe example provides real-time rendering capabilities with advanced customizations. It leverages smooth interpolation for a refined aesthetic and integrates gradient fills to enhance the visual experience. The inclusion of interactive modifiers ensures users can easily manipulate the chart view, while the wave animation effect adds an element of dynamism to the data presentation.\n\n## Integration and Best Practices\nBy encapsulating the chart initialization in an Angular standalone component, this example adheres to Angular best practices for resource management and asynchronous operations. Developers can refer to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide for further insights into efficient integration techniques. The example also demonstrates effective use of WebAssembly to boost performance, ensuring that the high-performance capabilities of SciChart.js are fully leveraged within the Angular framework.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Spline%20(Smoothed)%20Mountain%20Series%20Type.html",
                title: "This specific page in the JavaScript Spline Mountain Chart documentation will help you to get started",
                linkTitle: "JavaScript Mountain Chart Documentation",
            },
        ],
        path: "spline-mountain-chart",
        metaKeywords: "mountain, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/SplineMountainChart",
        thumbnailImage: "javascript-spline-mountain-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const splineMountainChartExampleInfo = createExampleInfo(metaData);
