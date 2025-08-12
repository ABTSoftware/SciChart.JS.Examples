import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "FeatureAxisTypes",
        id: "featuredApps_featureDemos_axisTypes",
        imagePath: "javascript-axis-types.jpg",
        description:
            "Demonstrates the Numeric, Category, Date and Logarithmic axis types available SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates the Numeric, Category, Date and Logarithmic axis types available SciChart.js, High Performance JavaScript Charts",
                title: "Axis Types",
                pageTitle: "Axis Types",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent:
                    "## Axis Types Example in JavaScript\n\n### Overview\nThis example demonstrates how to configure and integrate different axis types in SciChart.js using JavaScript. It combines a variety of axes including a `CategoryAxis` with string text labels provided by a `TextLabelProvider`, a `NumericAxis` for numerical data with prefix and postfix formatting, a `DateTimeNumericAxis` that auto-formats dates based on the date range, and a `LogarithmicAxis` for log-scaled data.\n\n### Technical Implementation\nThe chart is constructed by creating a new `SciChartSurface` along with a WebAssembly context using the function `SciChartSurface.create()`. Multiple axes are programmatically added by instantiating their respective classes, for example, the `CategoryAxis` and `DateTimeNumericAxis` (see [DateTimeNumericAxis](https://www.scichart.com/documentation/js/current/DateTimeNumericAxis.html) for details). A custom palette provider (`AxisTypesPaletteProvider`) is implemented by overriding methods such as `overrideFillArgb`, in line with the guidelines provided in the [PaletteProvider documentation](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html).\n\n### Features and Capabilities\nThe example emphasizes high-performance rendering using fast renderable series like `FastColumnRenderableSeries` and `FastLineRenderableSeries`; these components are optimized for large datasets as described in the [FastColumnRenderableSeries documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/fastcolumnrenderableseries.html). It also demonstrates asynchronous data integration, where real-time data is fetched and appended to `XyDataSeries` ([DataSeries Append/Update](https://www.scichart.com/documentation/js/current/DataSeries_AppendInsertUpdateRemove.html)), ensuring the chart remains responsive. Additionally, interactive chart modifiers such as `ZoomPanModifier`, `MouseWheelZoomModifier`, and `ZoomExtentsModifier` are incorporated to support dynamic zooming and panning functions (refer to [Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) for more information).\n\n### Integration and Best Practices\nAlthough this example is implemented in JavaScript, it is designed to be easily integrated into other frameworks, as seen in the accompanying React integration via the `<SciChartReact/>` component. Developers are encouraged to follow performance optimization techniques such as leveraging WebGL and WebAssembly for rapid rendering—topics covered in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation. Furthermore, custom axis labeling is achieved using the `TextLabelProvider`, enabling developers to fully customize how string labels are displayed on a `CategoryAxis` (see [TextLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html) for additional context). Overall, the example illustrates advanced features like real-time updates and custom styling, providing a comprehensive foundation for building high-performance financial charting applications with SciChart.js.",
            },
            react: {
                subtitle:
                    "Demonstrates the Numeric, Category, Date and Logarithmic axis types available SciChart.js, High Performance JavaScript Charts",
                title: "Axis Types",
                pageTitle: "Axis Types",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent:
                    "## Axis Types Example - React\n\n### Overview\nThis example demonstrates the integration of SciChart.js within a React application using the `<SciChartReact/>` component. It showcases multiple axis types including `CategoryAxis`, `NumericAxis`, `DateTimeNumericAxis` and `LogarithmicAxis`. Custom axis labeling is implemented using the `TextLabelProvider` to display arbitrary string text labels, and a custom palette provider (`AxisTypesPaletteProvider`) is used for dynamic coloring of columns.\n\n### Technical Implementation\nThe chart is initialized in a React component via the `<SciChartReact/>` element, which encapsulates the setup within React lifecycle methods. All axis types are instantiated directly and configured with specific properties such as custom font sizes, alignments, and prefixes/postfixes for labels. Developers can refer to the [SciChart.js Axis Documentation](https://www.scichart.com/documentation/js/current/StartHere-AxisOverview.html) for a detailed explanation on the various axis types. Custom axis labeling is achieved through the TextLabelProvider as explained in the [Axis LabelProviders Documentation](https://www.scichart.com/documentation/js/current/Axis%20Label%20Formatting%20-%20LabelProvider%20API.html). Additionally, the example utilizes a custom palette provider by extending `IStrokePaletteProvider` and `IFillPaletteProvider` for dynamic series styling.\n\n### Features and Capabilities\nThe example includes several advanced features and capabilities such as real-time data updates that fetch and render data asynchronously, interactive chart behaviors with zoom, pan and mouse wheel actions, and multi-axis configurations that allow parallel display of datasets with different scales. Real-time updates are managed in a React-friendly way, consolidating state management with SciChart.js’s high-performance WebGL rendering, ensuring smooth updates even with large datasets, as detailed in the [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) guide.\n\n### Integration and Best Practices\nThe integration with React follows best practices by utilizing the `<SciChartReact/>` component which ensures proper initialization and cleanup through React’s lifecycle, as discussed in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html). Furthermore, the example employs performance optimization techniques by leveraging WebGL rendering capabilities, as outlined in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation. Developers building production-grade charting solutions in React can benefit from the modular design of this example which promotes reusability and efficient resource management, making it easier to integrate complex chart configurations within larger applications. For further insights into the integration of SciChart.js with React, check out [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/).",
            },
            angular: {
                subtitle:
                    "Demonstrates the Numeric, Category, Date and Logarithmic axis types available SciChart.js, High Performance JavaScript Charts",
                title: "Axis Types",
                pageTitle: "Axis Types",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent:
                    "## Axis Types Angular\n\n### Overview\nThe Axis Types Angular example demonstrates how to integrate SciChart.js into an Angular application to build highly customizable and interactive charts. This example leverages multiple axis types—including `NumericAxis`, `CategoryAxis`, `DateTimeNumericAxis`, and `LogarithmicAxis` — to provide tailored data visualizations that can easily accommodate different data formats.\n\n### Technical Implementation\nIn this example, SciChart.js components are directly instantiated and configured within an Angular context using `ScichartAngularComponent`. The chart initializes various renderable series and axes with custom configurations such as a [TextLabelProvider](https://www.scichart.com/documentation/js/current/Axis%20Label%20Formatting%20-%20LabelProvider%20API.html) to display string labels on the x-Axis, and a bespoke palette provider (`AxisTypesPaletteProvider`) that dynamically colors column series elements. The asynchronous fetching and updating of data series simulate real-time updates, following techniques similar to those outlined in the [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) guide. Additionally, Angular’s dependency injection and lifecycle hooks are employed to ensure proper initialization and disposal of SciChart instances, thereby enhancing performance and maintainability.\n\n### Features and Capabilities\n- **Multi-Axis Setup:** The example demonstrates the simultaneous use of several axis types to display diverse datasets, offering customizations such as label prefixes, postfixes, and precise formatting.\n- **Real-Time Updates:** Asynchronous data fetches and dynamic zoom functionalities provide smooth real-time data streaming and visualization, ensuring charts remain responsive even with frequent updates.\n- **Custom Styling:** Through implementation of a custom palette provider, the chart supports dynamic styling, which enhances visual coherence and adapts to theme changes.\n- **Performance Optimizations:** Leveraging SciChart.js’s high-performance WebGL rendering, the example maintains efficient re-rendering and minimal update overhead. For further performance tuning, see the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation.\n\n### Integration and Best Practices\nThis example highlights best practices for integrating SciChart.js with Angular. Utilizing the [scichart-angular package](https://www.npmjs.com/package/scichart-angular) allows for seamless embedding of high-performance charts within Angular components, while the use of Angular’s dependency injection facilitates easy management of chart instances. Moreover, following Angular’s lifecycle management guidelines—as explained in [Component Lifecycle - Angular](https://angular.io/guide/lifecycle-hooks)—ensures that chart resources are appropriately allocated and cleaned up, thereby preventing memory leaks and enhancing overall application efficiency. Together, these practices support the creation of scalable, maintainable, and high-performance charting solutions in Angular.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/StartHere-AxisOverview.html",
                title: "SciChart.js Axis Documentation",
                linkTitle: "Scichart.js Axis Documentation",
            },
        ],
        path: "axis-types",
        metaKeywords: "text, axis, date, logarithmic, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/FeatureDemos/AxisTypes",
        thumbnailImage: "javascript-axis-types.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

export const axisTypesExampleInfo = createExampleInfo(metaData);
export default axisTypesExampleInfo;
