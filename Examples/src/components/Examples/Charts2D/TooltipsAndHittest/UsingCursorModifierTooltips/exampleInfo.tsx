import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "UsingCursorModifierTooltips",
        id: "chart2D_tooltipsAndHittest_UsingCursorModifierTooltips",
        imagePath: "javascript-chart-cursormodifier-crosshairs.jpg",
        description:
            "Demonstrates how to create **crosshairs on mouseover** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create **crosshairs on mouseover** using SciChart.js, High Performance JavaScript Charts",
                title: "Using CursorModifier Crosshairs",
                pageTitle: "Using CursorModifier Crosshairs",
                metaDescription:
                    "Demonstrates adding a Cursor (Crosshair) to a JavaScript Chart with SciChart.js CursorModifier",
                markdownContent:
                    "## Using Cursor Modifier Tooltips - JavaScript\n\n### Overview\nThis example demonstrates how to integrate SciChart.js into a JavaScript application to create high-performance, interactive charts. The implementation utilizes WebAssembly for efficient rendering as explained in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation. Key features include the configuration of numeric axes, multiple fast line series, and advanced cursor behavior with custom tooltip support.\n\n### Technical Implementation\nThe chart is asynchronously initialized by creating a `SciChartSurface` along with X and Y axes configured through `NumericAxis` and `NumberRange`, ensuring precise label formatting (see [The Numeric Axis](https://www.scichart.com/documentation/js/current/NumericAxis.html) for more details). Multiple `FastLineRenderableSeries` are added with corresponding `XyDataSeries` and `EllipsePointMarker` to effectively display data. The example adds several interactive chart modifiers including `CursorModifier` for crosshair behavior, `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` for intuitive zooming and panning. Custom tooltips are implemented by overriding the default behavior using an SVG template, as detailed in [Customizing the CursorModifier Tooltip Container Appearance](https://www.scichart.com/documentation/js/current/CursorModifier_CustomisingContainer.html).\n\n### Features and Capabilities\nThis implementation provides dynamic updates with interactive zooming, panning, and detailed tooltips that display a legend for the underlying series. Advanced customization is achieved by dynamically generating SVG annotations for the tooltip, allowing a clear display of series names and formatted data values. Performance optimizations and resource management strategies using WebAssembly are employed to ensure smooth interactions.\n\n### Integration and Best Practices\nThe example follows best practices for asynchronous initialization and resource cleanup. A cleanup function is returned after the chart is created, and calling `sciChartSurface.delete()` ensures that resources are properly disposed of when the chart is no longer needed, thus preventing memory leaks. Developers can refer to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide for further understanding of initializing and managing chart resources. Additionally, the axis configuration and tooltip customization patterns leveraged in this example align with the recommended approaches discussed in the SciChart documentation.\n\nBy using JavaScript, this example clearly illustrates how to build an interactive, high-performance chart with advanced visual customizations and robust user interaction capabilities.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create **crosshairs on mouseover** using SciChart.js, High Performance JavaScript Charts",
                title: "Using CursorModifier Crosshairs",
                pageTitle: "Using CursorModifier Crosshairs",
                metaDescription:
                    "Demonstrates adding a Cursor (Crosshair) to a React Chart with SciChart.js CursorModifier",
                markdownContent:
                    "## Using Cursor Modifier Tooltips in React\n\n### Overview\nThis example demonstrates how to integrate SciChart.js into a React application using the `<SciChartReact/>` component. It sets up a chart with X and Y numeric axes, renders multiple line series, and implements crosshair/cursor functionality along with customized tooltips. The example highlights how to leverage high-performance WebAssembly (WASM) rendering within a React environment.\n\n### Technical Implementation\nThe chart is created asynchronously through the `drawExample` function, which initializes a `SciChartSurface` with a chosen theme and adds `NumericAxis` configured with precise label formats. Three line series are added with distinct styling and point markers. The key feature is the use of the `CursorModifier` to provide crosshair behavior along with a custom tooltip legend, overridden via a dedicated function `getTooltipLegendTemplate` to display formatted series data. In addition, zoom and pan modifiers (`ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier`) are incorporated to enhance user interaction. This asynchronous pattern and separation of chart drawing logic from React components follows [best practices for React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/) and is detailed further in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).\n\n### Features and Capabilities\nThe example emphasizes advanced tooltip customization through the `CursorModifier`, enabling dynamic display of series information as the user moves the mouse over the chart. In addition, it demonstrates advanced zooming and panning controls for detailed data inspection, which can be explored further in [Advanced Zoom and Pan with SciChart.js](https://www.scichart.com/demo/react/zoom-pan-multiple-modifiers). The use of a custom tooltip legend template allows for a clearly formatted, data-driven tooltip display.\n\n### Integration and Best Practices\nDevelopers can see how the `<SciChartReact/>` component is used to seamlessly integrate high performance charts into a React application, maintaining separation of concerns by offloading chart rendering to a dedicated asynchronous function. The example emphasizes performance optimization through the use of a WebAssembly (WASM) context, as outlined in [Deploying Wasm and Data Files with your app](https://www.scichart.com/documentation/js/current/Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html). Custom tooltips and legends are implemented by leveraging the CursorModifier, with complete API details available in the [CursorModifier documentation](https://www.scichart.com/documentation/js/current/CursorModifier.html).",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create **crosshairs on mouseover** using SciChart.js, High Performance JavaScript Charts",
                title: "Using CursorModifier Crosshairs",
                pageTitle: "Using CursorModifier Crosshairs",
                metaDescription:
                    "Demonstrates adding a Cursor (Crosshair) to a Angular Chart with SciChart.js CursorModifier",
                markdownContent:
                    "## Using Cursor Modifier Tooltips in Angular\n\n### Overview\nThis example demonstrates how to integrate SciChart.js within an Angular standalone component to render high performance JavaScript charts. It focuses on implementing advanced crosshair tooltips and interactive chart modifiers to provide detailed data insights. Developers can get started with the basic setup by following guidelines in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation.\n\n### Technical Implementation\nThe chart is initialized asynchronously in an Angular standalone component using the `ScichartAngularComponent`. The drawExample function creates a `SciChartSurface` with configured X and Y numeric axes and renders multiple line series generated from Fourier series data. A notable feature is the use of the `CursorModifier` that adds crosshair behavior along with a custom SVG tooltip legend. This is achieved by overriding the default tooltip rendering via a function `getTooltipLegendTemplate` to display formatted series data, as detailed in the [CursorModifier documentation](https://www.scichart.com/documentation/js/current/CursorModifier.html). The example also integrates additional chart modifiers like `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` to enhance interactive zooming and panning capabilities.\n\n### Features and Capabilities\nThe implementation provides several advanced features: **custom tooltip legends** that dynamically display series information during mouseover events, **interactive crosshair cursors** that enhance data point tracking, and robust **zooming and panning** interactions for detailed chart inspection. These features are critical when a real-time update capability is needed to analyze dynamic data. The customization of tooltips is further elaborated in [Customizing the CursorModifier Tooltip Container Appearance](https://www.scichart.com/documentation/js/current/CursorModifier_CustomisingContainer.html), which provides guidance on tailoring tooltip visuals.\n\n### Integration and Best Practices\nThis example follows Angular best practices by isolating chart rendering logic within a standalone component, ensuring a clean and modular application structure. The integration of the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package simplifies the embedding of high performance charts into Angular applications. Furthermore, leveraging WebAssembly (WASM) for the `SciChartSurface` underscores the importance of performance optimization, as discussed in [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html). By combining these techniques, developers can achieve scalable and responsive chart implementations in Angular.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/CursorModifier.html",
                title: "The specific page for the SciChart.js API documentation for the CursorModifier to help you to get started",
                linkTitle: "CursorModifier documentation",
            },
        ],
        path: "chart-cursormodifier-crosshairs",
        metaKeywords: "cursor, modifier, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/TooltipsAndHittest/UsingCursorModifierTooltips",
        thumbnailImage: "javascript-chart-cursormodifier-crosshairs.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

export const usingCursorModifierTooltipsExampleInfo = createExampleInfo(metaData);
export default usingCursorModifierTooltipsExampleInfo;
