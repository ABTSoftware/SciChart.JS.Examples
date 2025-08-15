import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "MultipleZoomPanModifiers",
        id: "chart2D_zoomAndPanAChart_MultipleChartModifiers",
        imagePath: "zoom-pan-multiple-modifiers.jpg",
        description:
            "Demonstrates different **Zoom and Pan Modifiers on a JavaScript Chart** including Mousewheel, Pinchzoom, Rubber-band zoom.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates different **Zoom and Pan Modifiers on a JavaScript Chart** including Mousewheel, Pinchzoom, Rubber-band zoom.",
                title: "Zoom and Pan with JavaScript Chart multiple Modifiers",
                pageTitle: "Zoom and Pan with JavaScript Chart multiple Modifiers",
                metaDescription:
                    "Demonstrates how to use multiple Zoom and Pan Modifiers on a JavaScript Chart with SciChart.js",
                markdownContent:
                    "## Multiple Zoom Pan Modifiers - JavaScript\n\n### Overview\nThis example demonstrates a JavaScript implementation of a SciChart.js chart that integrates multiple zoom and pan modifiers to deliver an interactive data visualization experience. The primary purpose is to showcase how various zooming and panning behaviors can be combined on a single chart for enhanced user interaction.\n\n### Technical Implementation\nThe chart is initialized in an asynchronous function called `drawExample` which uses `SciChartSurface.create()` to set up the main chart surface along with configured X and Y axes (using `NumericAxis` that support custom number ranges and label formatting. Chart series are added using the `FastLineRenderableSeries]` and enhanced with custom point markers like the `EllipsePointMarker`. Multiple zoom and pan chart modifiers are then attached to the chart: the [RubberBandXyZoomModifier](https://www.scichart.com/documentation/js/current/RubberBandXyZoomModifier.html) (which leverages an elastic easing function and is triggered with the right mouse button), the [ZoomPanModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html) (providing both pan and pinch zoom functionality on touch devices), the [MouseWheelZoomModifier](https://www.scichart.com/documentation/js/current/MouseWheelZoomModifier.html), and the [ZoomExtentsModifier](https://www.scichart.com/documentation/js/current/ZoomExtentsModifier.html). This careful integration of modifiers ensures they work in concert without conflicts, thus enabling robust interactive behaviors.\n\n### Features and Capabilities\nThe example highlights several advanced features including real-time animated zooming with easing transitions, comprehensive panning via mouse drag and pinch gestures, and interactive zoom extents triggered on double-click. In addition, it adds instructional annotations using both `TextAnnotation` and `NativeTextAnnotation` to guide the user. These capabilities combine to deliver a highly interactive charting experience that is both visually dynamic and functionally rich.\n\n### Integration and Best Practices\nDevelopers can follow best practices for integrating SciChart.js into JavaScript applications by referring to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. The implementation also demonstrates effective resource management by leveraging the WebAssembly context (`wasmContext`) for high performance, and it properly cleans up resources via `sciChartSurface.delete()`. Additional performance optimization strategies and memory management best practices can be found in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) documentation.\n\n### Performance Considerations\nThe example benefits from the performance advantages offered by WebAssembly for rendering, which is essential for managing multiple renderable series and complex user interactions simultaneously. Advanced easing animations, such as elastic easing, are integrated to provide smooth animated transitions during zoom operations, further enhancing the overall user experience.",
            },
            react: {
                subtitle:
                    "Demonstrates different **Zoom and Pan Modifiers on a React Chart** including Mousewheel, Pinchzoom, Rubber-band zoom.",
                title: "Zoom and Pan with React Chart multiple Modifiers",
                pageTitle: "Zoom and Pan with React Chart multiple Modifiers",
                metaDescription:
                    "Demonstrates how to use multiple Zoom and Pan Modifiers on a React Chart with SciChart.js",
                markdownContent:
                    "## Multiple Zoom Pan Modifiers - React\n\n### Overview\nThis example demonstrates how to create a high-performance, interactive chart in a React environment using SciChart.js. The chart showcases multiple zoom and pan behaviors including rubber-band zoom, pinch zoom, mouse-wheel zoom, and double-click zoom-to-fit. Data is dynamically generated via Fourier series, and the visual display is enriched with annotations to guide user interactions.\n\n### Technical Implementation\nThe implementation leverages the `<SciChartReact/>` component which integrates SciChart.js into React applications. The core of the example is defined in the drawExample function where a `SciChartSurface` is instantiated with configurable numeric axes and real-time series data. Multiple chart modifiers are added: the `RubberBandXyZoomModifier` (triggered on the right mouse button) applies an elastic easing function for smooth zoom animations, while the `ZoomPanModifier` (with pinch zoom enabled), `MouseWheelZoomModifier`, and `ZoomExtentsModifier` further enhance user interactivity. Developers can find more details on this approach in the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) guide and explore zoom and pan specifics via the [SciChart.js Zooming and Panning documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html).\n\n### Features and Capabilities\nThe chart features advanced zooming and panning capabilities that include rubber-band and pinch zoom along with mouse-wheel interactions and double-click zoom extents. It also incorporates animated transitions using an elastic easing function for a seamless user experience. Annotations, both text and native, are implemented to provide contextual instructions and enhance the user interface. Learn more about these advanced features on the [SciChart.js Demo for Multiple Modifiers](https://www.scichart.com/demo/react/zoom-pan-multiple-modifiers).\n\n### Integration and Best Practices\nThe example is implemented as a React component, using the `<SciChartReact/>` wrapper to initialize and render the chart. This encapsulates the chart creation process and allows for efficient resource management. Developers are encouraged to follow best practices for memory management by properly disposing of the `SciChartSurface` when unmounting components. For additional guidance on building robust React components with SciChart.js, see the [How to Make Charts in React from Scratch? - SciChart](https://www.scichart.com/blog/how-to-make-charts-in-react/) article and related [resource management tips](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html).",
            },
            angular: {
                subtitle:
                    "Demonstrates different **Zoom and Pan Modifiers on a Angular Chart** including Mousewheel, Pinchzoom, Rubber-band zoom.",
                title: "Zoom and Pan with Angular Chart multiple Modifiers",
                pageTitle: "Zoom and Pan with Angular Chart multiple Modifiers",
                metaDescription:
                    "Demonstrates how to use multiple Zoom and Pan Modifiers on a Angular Chart with SciChart.js",
                markdownContent:
                    '# Zoom and Pan with Angular Chart Multiple Modifiers\n\n### Overview\nThis example, titled "Multiple Zoom Pan Modifiers", demonstrates how to integrate SciChart.js within an Angular application using the scichart-angular component. The purpose is to showcase advanced interactive features on a chart, including multiple zoom and pan behaviors such as rubber-band zoom, mouse-wheel zoom, pinch zoom (via the `ZoomPanModifier`) and double-click zoom-to-fit.\n\n### Technical Implementation\nThe chart is created in an Angular component by invoking a drawExample function that instantiates a `SciChartSurface` with numeric axes configured for optimal data presentation (using properties like `growBy`, `labelFormat`, and `labelPrecision`). Data series are generated using Fourier series and rendered with customizable `FastLineRenderableSeries`. Interactivity is enhanced by adding multiple modifiers: a `RubberBandXyZoomModifier` (triggered on a right-click with an elastic easing function), a `ZoomPanModifier` with pinch zoom enabled, a `MouseWheelZoomModifier`, and a `ZoomExtentsModifier` that smoothly animates the transition to full extents. Detailed documentation on these interactive modifiers can be found in the [SciChart.js Zooming and Panning documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html).\n\n### Features and Capabilities\nThe example effectively demonstrates advanced charting capabilities including real-time data rendering and custom annotations for user guidance. With animated elastic zoom effects and multi-device touch support, users experience seamless chart interactions.\n\n### Integration and Best Practices\nIntegrating SciChart.js with Angular is streamlined through the [scichart-angular](https://www.npmjs.com/package/scichart-angular) component, which simplifies chart initialization and resource management. Best practices involve configuring axis properties correctly and ensuring proper disposal of the `SciChartSurface` to optimize performance. Developers can learn more about Angular integration and efficient project setup from the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide, and review resource management techniques in the [Memory Best Practices in SciChart.js](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) documentation.',
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/ZoomPanModifier.html",
                title: "Zoom and Pan Modifier Documentation",
                linkTitle: "SciChart.js Zooming and Panning documentation",
            },
        ],
        path: "zoom-pan-multiple-modifiers",
        metaKeywords: "zoom, pan, pinch, touch, scale, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ZoomingAndPanning/MultipleZoomPanModifiers",
        thumbnailImage: "zoom-pan-multiple-modifiers.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

export const zoomAndPanWithMultipleChartModifiersExampleInfo = createExampleInfo(metaData);
export default zoomAndPanWithMultipleChartModifiersExampleInfo;
