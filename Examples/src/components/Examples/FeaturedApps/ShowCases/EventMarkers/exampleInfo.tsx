import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsShowCasesEventMarkers",
        imagePath: "javascript-draggable-event-markers.jpg",
        description:
            "Demonstrates how to repurpose a Candlestick Series into dragabble, labled, event markers, using SciChart.js High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to repurpose a Candlestick Series into dragabble, labled, event markers, using SciChart.js High Performance JavaScript Charts",
                title: "Dragabble Event Markers",
                pageTitle: "Dragabble Event Markers",
                metaDescription:
                    "Demonstrates how to repurpose a Candlestick Series into dragabble, labled, event markers",
                markdownContent:
                    '## Draggable Event Markers on JavaScript Charts\n\n### Overview\nThis example, "Event Markers", demonstrates advanced charting features using SciChart.js with JavaScript. It showcases key techniques such as custom chart modifiers, data label customization, custom hit testing, axis range synchronization, interactive annotations, and performance optimizations.\n\n### Technical Implementation\nThe chart is created by instantiating a `SciChartSurface` with multiple axes and renderable series including `FastLineRenderableSeries` for a primary line chart and `FastCandlestickRenderableSeries` for event markers. A custom modifier, implemented by extending the `CustomChartModifier2D` API, enables selection and drag interactions on candlestick event markers. For more details on creating such custom modifiers, see the [Custom Chart Modifier API](https://www.scichart.com/documentation/js/current/AddingDataLabels.html).\n\nCustom data labels are generated via an overridden `DataLabelProvider`, which dynamically calculates label positions and text by based on open and close values. Developers can refer to the [DataLabel API documentation](https://www.scichart.com/documentation/js/current/CustomLabelProvider_DynamicDates.html) for similar implementations.\n\nIn addition, the example overrides the default hit testing behavior with custom logic that accounts for multiple overlapping series. This enables precise interaction with the candlestick markers and demonstrates techniques found in the [RenderableSeries Hit-Test API demo](https://scichart.com/demo/react/chart-hit-test-on-click).\n\nThe implementation also includes performance optimizations by utilizing `FastLineRenderableSeries` and applying a `SweepAnimation` for series startup, as described in the [Series Startup Animations](https://www.scichart.com/documentation/js/current/Series%20Startup%20Animations.html) documentation. The `getDataPointWidth()` method is overridden to ensure fixed pixel width rendering for event markers, supporting custom rendering requirements.\n\n### Features and Capabilities\nThis example offers dynamic update capabilities through a drag-enabled custom chart modifier that updates the underlying `OhlcDataSeries`. Axis range synchronization is implemented whereby the `axis.visibleRange` of a hidden event axis is kept in sync with the main axis, ensuring consistent display during zoom and pan operations. Interactive annotations are integrated to let users select and drag markers, and the overall implementation follows best practices for resource management by returning a destructor function for proper disposal of the SciChartSurface. For guidance on resource cleanup, see the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) page.\n\n### Integration and Best Practices\nThe JavaScript integration is self-contained: the chart is created within an asynchronous initialization function that returns a cleanup function to properly dispose of the chart when necessary. This pattern ensures efficient memory management and aligns with best practices outlined in the SciChart documentation. Additionally, the combination of custom annotations and modifiers demonstrates how to build interactive and highly configurable chart components. Developers are encouraged to explore further customizations, such as advanced zooming and data streaming, by consulting the [Editable Annotations](https://www.scichart.com/documentation/js/current/EditableAnnotations.html) documentation. Overall, the implementation serves as a solid foundation for integrating advanced SciChart.js features using JavaScript.',
            },
            react: {
                subtitle:
                    "Demonstrates how to repurpose a Candlestick Series into dragabble, labled, event markers, using SciChart.js High Performance JavaScript Charts",
                title: "Dragabble Event Markers",
                pageTitle: "Dragabble Event Markers",
                metaDescription:
                    "Demonstrates how to repurpose a Candlestick Series into dragabble, labled, event markers",
                markdownContent:
                    "## Dragabble Event Markers (React)\n\n### Overview\nThis React example demonstrates how to transform a `FastCandlestickRenderableSeries` into draggable event markers within a SciChart.js chart. The purpose is to showcase interactive editing where users can select and drag individual event markers, making use of custom annotations and hit testing for a seamless experience.\n\n### Technical Implementation\nThe chart is initialized using the `<SciChartReact/>` component, which calls a custom draw function to set up axes, series, and modifiers. A custom chart modifier (`CandleDragModifier`) enables drag and drop interactions by listening to mouse events and updating the underlying data series. Custom hit testing is implemented to accurately detect user interactions with event markers. For additional technical context on creating similar custom interactions, refer to the [Custom ChartModifiers documentation](https://www.scichart.com/documentation/js/current/CustomChartModifierAPI.html) guide.\n\n### Features and Capabilities\nThe example offers real-time update capabilities and advanced features such as custom data labels, where the `DataLabelProvider` dynamically computes label text (for example, displaying the difference between open and close values) as shown in the [Custom DataLabel Formatting with getText() - SciChart](https://www.scichart.com/documentation/js/current/DataLabelFormattingAdvanced.html) documentation. Smooth transitions are achieved using sweep animations, and the use of WebGL enhances performance when rendering large data sets.\n\n### Integration and Best Practices\nIntegration with React is streamlined using the `<SciChartReact/>` component, which simplifies chart initialization in a React environment as detailed in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/). The example also demonstrates how to synchronize multiple axes, including hidden ones for event markers, ensuring consistent zooming and panning. Custom hit testing further refines the user experience, enabling precise manipulation of chart elements as explained in the [Hit-Test API  demo](https://scichart.com/demo/react/chart-hit-test-on-click) resource.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to repurpose a Candlestick Series into dragabble, labled, event markers, using SciChart.js High Performance JavaScript Charts",
                title: "Dragabble Event Markers",
                pageTitle: "Dragabble Event Markers",
                metaDescription:
                    "Demonstrates how to repurpose a Candlestick Series into dragabble, labled, event markers",
                markdownContent:
                    "## Dragabble Chart Event Markers in Angular\n\n### Overview\nThis Angular example demonstrates how to repurpose a candlestick series into draggable, labeled event markers within a SciChart.js chart. The example integrates SciChart.js into an Angular standalone component using the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package, providing a seamless way to embed high performance charts into Angular applications.\n\n### Technical Implementation\nThe implementation initializes a `SciChartSurface` with distinct axes for the main chart and the event markers. It synchronizes the axes by subscribing to `axis.visibleRangeChanged`, ensuring that both the primary and event axes remain in lock-step. A custom chart modifier, named `CandleDragModifier`, is implemented using the [Custom Chart Modifier API](https://www.scichart.com/documentation/js/current/CustomChartModifierAPI.html) provided by SciChart.js. This modifier enables precise selection via custom hit testing and allows users to drag event markers, updating the underlying data in real-time. The example also demonstrates advanced techniques such as dynamically attaching and detaching annotations, a process further explained in the [Tutorial 06 - Adding Annotations](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html) documentation.\n\n### Features and Capabilities\nThis example boasts real-time update capabilities and smooth rendering through sweep animations and WebGL enhancements. Custom data labels are generated using a tailored `DataLabelProvider` that formats text based on computed values from the data series. Advanced features include synchronized axis ranges and custom hit testing logic, which together create an interactive experience where event markers can be selected, dragged, and visually highlighted.\n\n### Integration and Best Practices\nDevelopers can leverage the best practices for Angular integration outlined in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide to deploy similar solutions. The example emphasizes efficient resource management and performance optimization, as detailed in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation. Furthermore, it showcases advanced interactivity through custom hit testing and modifier interactions, ensuring that the charts remain responsive and user-friendly in complex scenarios.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "dragabble-event-markers",
        metaKeywords: "events, drag, edit, datalabels, , layout, demo, chart, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "FeaturedApps/ShowCases/EventMarkers",
        thumbnailImage: "javascript-draggable-event-markers.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const eventMarkersExampleInfo = createExampleInfo(metaData);
