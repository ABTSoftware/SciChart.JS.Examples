import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DStylingAndThemingDashedLineStyling",
        imagePath: "javascript-dashed-line-chart.jpg",
        description:
            "Demonstrates how create **JavaScript Charts with dashed lines** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how create **JavaScript Charts with dashed lines** using SciChart.js, High Performance JavaScript Charts",
                title: "Dashed Line Styling",
                pageTitle: "Dashed Line Styling",
                metaDescription: "Demonstrates dashed line series in JavaScript Charts with SciChart.js",
                markdownContent:
                    "# Dashed Line Styling - Vanilla JavaScript\n\n## Overview\nThis example demonstrates the use of SciChart.js to create high performance 2D charts using vanilla JavaScript. The focus is on rendering series with advanced dashed and dotted line styles along with gradient fills, providing a clear illustration of custom styling capabilities.\n\n## Technical Implementation\nThe chart is initialized asynchronously using SciChartSurface.create in a dedicated drawExample function. Numeric axes are configured with custom label formatting and precision (see [NumericAxis Documentation](https://www.scichart.com/documentation/js/current/NumericAxis.html)). Several renderable series are added including a mountain series with a gradient fill implemented using GradientParams as described in [The Mountain (Area) Series Type](https://www.scichart.com/documentation/js/current/The%20Mountain%20(Area)%20Series%20Type.html) and multiple line series with varying strokeDashArray values to achieve dashed and dotted effects (refer to [Series Styling - Dash Line Patterns](https://www.scichart.com/documentation/js/current/Series%20Styling%20-%20Dash%20Line%20Patterns.html) for more details). Interactive modifiers such as ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier further enhance user interaction, while the use of the WebAssembly context (wasmContext) aids performance as noted in [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n## Features and Capabilities\nThe example highlights advanced styling techniques with a mountain series featuring a [10,5] dash pattern along with gradient fills, and additional line series using [5,5] and [3,3] patterns for dotted effects. A band series adds further visual context, and interactive modifiers provide real-time dynamic updates.\n\n## Integration and Best Practices\nThis vanilla JavaScript implementation exemplifies best practices for asynchronous chart initialization and resource management. Charts are created by invoking a single asynchronous method and are properly disposed of using sciChartSurface.delete(), in line with guidelines found in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) and [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) documentation.\n",
            },
            react: {
                subtitle:
                    "Demonstrates how create **React Charts with dashed lines** using SciChart.js, High Performance JavaScript Charts",
                title: "Dashed Line Styling",
                pageTitle: "Dashed Line Styling",
                metaDescription: "Demonstrates dashed line series in React Charts with SciChart.js",
                markdownContent:
                    "# Dashed Line Styling (React)\n\n## Overview\nThis example demonstrates how to create high performance SciChart.js charts within a React application. It focuses on advanced styling techniques including dashed and dotted line patterns alongside gradient fills, all rendered using WebGL for optimal performance.\n\n## Technical Implementation\nIn this example, a React component utilizes the [SciChartReact](https://www.scichart.com/blog/react-charts-with-scichart-js/) component to asynchronously initialize a SciChartSurface through the initChart prop. The chart is built by creating numeric axes and multiple renderable series with distinct stroke dash arrays (for instance, a mountain series with a [10,5] dash pattern and line series with [5,5] and [3,3] dash arrays). Gradient fills are applied to the mountain series using gradient parameters. Detailed techniques for dashed line styling can be found in the [SciChart.js Dash Line Styling Documentation](https://www.scichart.com/documentation/js/current/webframe.html#Series%20Styling%20-%20Dash%20Line%20Patterns.html).\n\n## Features and Capabilities\nThe implementation supports a variety of series including a mountain series with gradient fills, two line series with varying dash styles, and a band series, demonstrating the extensive customization possibilities of SciChart.js. In addition, interactive modifiers such as ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier enhance the real-time responsiveness and user experience of the chart.\n\n## Integration and Best Practices\nBy leveraging React integration best practices, the example illustrates efficient asynchronous chart setup and resource management. Developers can refer to the [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) tutorial for deeper insights into component lifecycle and optimization techniques. This approach ensures that the high performance capabilities of SciChart.js are fully utilized within React, providing a robust and maintainable solution for dynamic charting applications.",
            },
            angular: {
                subtitle:
                    "Demonstrates how create **Angular Charts with dashed lines** using SciChart.js, High Performance JavaScript Charts",
                title: "Dashed Line Styling",
                pageTitle: "Dashed Line Styling",
                metaDescription: "Demonstrates dashed line series in Angular Charts with SciChart.js",
                markdownContent:
                    "# Dashed Line Styling - Angular\n\n## Overview\nThis example demonstrates the integration of SciChart.js within an Angular application to create high-performance 2D charts featuring advanced dashed and dotted line styling. Designed to showcase various styling techniques, the chart includes a mountain series with gradient fills, multiple line series with different dash patterns, and a band series for additional visual context.\n\n## Technical Implementation\nThe chart is initialized asynchronously using SciChartSurface within a standalone Angular component that leverages the [ScichartAngularComponent](https://classic.yarnpkg.com/en/package/scichart-angular) for seamless integration. Numeric axes are configured with custom label formatting and precision, while renderable series are styled using the [strokeDashArray](https://www.scichart.com/documentation/js/current/Series%20Styling%20-%20Dash%20Line%20Patterns.html) property to achieve the desired dashed and dotted effects. Gradient fills are applied to the mountain series using defined gradient parameters. The asynchronous initialization method aligns with best practices as outlined in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation.\n\n## Features and Capabilities\nThe example highlights several key features: \n- **Advanced Line Styling:** Multiple renderable series apply varying dash patterns, including a mountain series with a [10,5] pattern and line series with [5,5] and [3,3] patterns.\n- **Gradient Styling:** The mountain series uses gradient fills to seamlessly blend colors, adding visual depth.\n- **Interactive Modifiers:** Interactive chart behaviors are enabled via modifiers such as ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier, enhancing user interaction and navigation.\n- **Optimized Rendering:** Leveraging WebGL for high performance, the chart manages real-time interactions and animations efficiently.\n\n## Integration and Best Practices\nDevelopers can integrate this example into their Angular projects by using standalone Angular components, ensuring the chart is loaded asynchronously and managed effectively throughout the component lifecycle. Proper resource disposal is advised to prevent memory leaks, as highlighted in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. Interactive features can be further customized by referring to the [Common ChartModifiers Features](https://www.scichart.com/documentation/js/current/Common%20ChartModifiers%20Features.html) documentation, which provides additional context on implementing robust chart interactivity.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Series%20Styling%20-%20Dash%20Line%20Patterns.html",
                title: "SciChart.js Dash Line Styling Documentation page",
                linkTitle: "The Dashed Line Styling Documentation",
            },
        ],
        path: "dashed-line-chart",
        metaKeywords: "dash, dashed, dotted, line, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/StylingAndTheming/DashedLineStyling",
        thumbnailImage: "javascript-dashed-line-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const dashedLineStylingExampleInfo = createExampleInfo(metaData);
