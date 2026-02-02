import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "DragAxisToScale",
        id: "chart2D_zoomAndPanAChart_DragAxisToScale",
        imagePath: "drag-axis-on-javascript-charts-to-scale-or-pan.jpg",
        description:
            "Demonstrates how to **scale or pan the Axis on a JavaScript Chart** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to **scale or pan the Axis on a JavaScript Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Drag JavaScript Chart Axis to Scale or Pan",
                pageTitle: "Drag JavaScript Chart Axis to Scale or Pan",
                metaDescription:
                    "Demonstrates how to Zoom, Scale or Pan individual Axis on a JavaScript Chart with SciChart.js AxisDragModifiers",
                markdownContent:
                    "## Drag Axis To Scale - JavaScript\n\n### Overview\nThis example demonstrates how to implement axis-drag interactivity with SciChart.js using JavaScript. The chart features dual X-axes and dual Y-axes which allow users to pan the view by dragging the X-Axis and to scale the chart by dragging the Y-Axis. It is designed to showcase how to create responsive and dynamic charts with advanced interactivity features.\n\n### Technical Implementation\nThe implementation begins by initializing a `SciChartSurface` using JavaScript as described in the [Tutorial 01 - Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html). Custom axes are added using `NumericAxis`, with properties such as `axisAlignment` and custom label formatting applied via a custom `labelProvider` (see [Custom LabelProviders: Readable Numbers - SciChart](https://www.scichart.com/documentation/js/current/CustomLabelProvider_Numeric.html)). The data series, built with `XyDataSeries`, are generated algorithmically (sine wave data) to simulate dynamic charting. Drag interactions are enabled through the use of [XAxisDragModifier](https://www.scichart.com/documentation/js/current/XAxisDragModifier.html) for panning and [YAxisDragModifier](https://www.scichart.com/documentation/js/current/YAxisDragModifier.html) for scaling. Additionally, a `ZoomExtentsModifier` ensures the chart automatically zooms to fit all data upon initialization.\n\n### Features and Capabilities\n**Multiple Axes Integration:** The example cleanly integrates multiple axes by assigning unique IDs and specific alignments (top, bottom, left, right) so that each axis can be independently manipulated.\n\n**Interactive Dragging:** Users can directly interact with the chart by dragging the axes. The X-Axis drag is set to panning mode and the Y-Axis drag is set to scaling mode, delivering an intuitive data exploration experience.\n\n**Custom Label Formatting and Theming:** The axes utilize custom label formatting to display numbers in a clear and readable format. The overall chart styling is achieved with the `SciChartJsNavyTheme`, which provides a modern dark visual appearance. More details on customizing themes can be found in the [Chart Styling - ThemeManager API](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20ThemeManager%20API.html).\n\n### Integration and Best Practices\nThis JavaScript implementation emphasizes high performance by leveraging the underlying WebAssembly context (wasmContext) for efficient rendering. Developers interested in further optimizing their charts are encouraged to review the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) which detail best practices for rendering and memory management. The example also demonstrates how to apply interactive modifiers in a way that maintains chart responsiveness—an essential aspect when building real-world, data-intensive web applications.",
            },
            react: {
                subtitle:
                    "Demonstrates how to **scale or pan the Axis on a React Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Drag React Chart Axis to Scale or Pan",
                pageTitle: "Drag React Chart Axis to Scale or Pan",
                metaDescription:
                    "Demonstrates how to Zoom, Scale or Pan individual Axis on a React Chart with SciChart.js AxisDragModifiers",
                markdownContent:
                    "## Drag Axis To Scale - React\n\n### Overview\nThis example demonstrates how to implement interactive axis scaling and panning within a React application using SciChart.js. The chart is configured with two X-axes and two Y-axes, where the top and bottom X-axes enable panning and the left and right Y-axes support scaling. The high-performance WebGL rendering of SciChart.js ensures a smooth, responsive experience.\n\n### Technical Implementation\nIn this example the chart is initialized using the `<SciChartReact/>` component, which passes a custom draw function that creates a `SciChartSurface`, multiple `NumericAxis` instances, `FastLineRenderableSeries`, and `XyDataSeries`. `YAxisDragModifier` and `XAxisDragModifier` instances are added to allow for panning on the X-Axis and scaling on the Y-Axis. Customization of axis alignment, numeric formatting, and theming with `SciChartJsNavyTheme` enables a tailored interaction experience. A `ZoomExtentsModifier` is also added to reset the view and zoom-to-fit via double-click.\n\n### Features and Capabilities\nThe chart demonstrates several key features: **real-time axis interaction** through dragging to pan and scale, a multi-axis configuration with independent axis settings, and dual renderable series showcasing dynamic data generation. The integration of `FastLineRenderableSeries` and `XyDataSeries` emphasizes efficient rendering capabilities, aligning with performance optimization strategies outlined in the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) guide.\n\n### Integration and Best Practices\nBy leveraging `<SciChartReact/>` for initialization, this example follows best practices for embedding SciChart.js into React applications. The implementation emphasizes proper resource management and lifecycle considerations consistent with recommendations found in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html). Developers are encouraged to explore additional interaction and performance optimization techniques to further enhance real-time charting experiences in React. This comprehensive example provides a solid foundation for building interactive, high-performance charts with SciChart.js in the React ecosystem.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to **scale or pan the Axis on a Angular Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Drag Angular Chart Axis to Scale or Pan",
                pageTitle: "Drag Angular Chart Axis to Scale or Pan",
                metaDescription:
                    "Demonstrates how to Zoom, Scale or Pan individual Axis on a Angular Chart with SciChart.js AxisDragModifiers",
                markdownContent:
                    "## Drag Angular Chart Axis to Scale or Pan\n\n### Overview\nThis example demonstrates how to integrate SciChart.js within an Angular application using the `ScichartAngularComponent` to create an interactive chart where users can pan and scale axes by simply dragging them. The example highlights the use of multiple numeric axes and renderable series to achieve high performance, real-time charting in Angular.\n\n### Technical Implementation\nThe chart is initialized through a standalone Angular component that imports the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package. A custom function, defined in the drawExample module, creates a `SciChartSurface` and configures two X-axes and two Y-axes with unique alignments and numeric formatting. For interactive panning and scaling, the example adds an [XAxisDragModifier](https://www.scichart.com/documentation/js/current/XAxisDragModifier.html) (configured for panning) and a [YAxisDragModifier](https://www.scichart.com/documentation/js/current/YAxisDragModifier.html) (configured for scaling). The inclusion of the `ZoomExtentsModifier` provides zoom-to-fit capabilities through double-click interactions.\n\n### Features and Capabilities\nThis implementation supports real-time axis interactions and dynamic data updates through two distinct line series, each with its own axis configuration. The chart showcases advanced features like dual axis scaling and panning, alongside custom numeric formatting and theming via the `SciChartJsNavyTheme`. These features ensure a smooth and responsive user experience, even with detailed and large datasets.\n\n### Integration and Best Practices\nBy leveraging a standalone Angular component and a custom chart initialization function, this example adheres to best practices for integrating SciChart.js into Angular. Developers seeking to embed high-performance charts in their Angular projects can refer to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide and the [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html) for more detailed setup instructions. Additional resources on [Axis customization](https://www.scichart.com/documentation/js/current/NumericAxis.html) further assist in tailoring the chart experience to specific requirements.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/YAxisDragModifier.html",
                title: "SciChart.js Drag Axis to Scale Documentation page",
                linkTitle: "SciChart.js Axis Drag documentation",
            },
        ],
        path: "chart-drag-axis-to-scale-pan",
        metaKeywords: "drag, axis, scale, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "Charts2D/ZoomingAndPanning/DragAxisToScale",
        thumbnailImage: "drag-axis-on-javascript-charts-to-scale-or-pan.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false
    };
//// End of computer generated metadata

export const dragAxisToScaleExampleInfo = createExampleInfo(metaData);
export default dragAxisToScaleExampleInfo;
