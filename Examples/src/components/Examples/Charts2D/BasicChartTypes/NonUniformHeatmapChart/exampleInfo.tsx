import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "NonUniformHeatmapChart",
        id: "chart2D_basicCharts_NonUniformHeatmapChart",
        imagePath: "javascript-non-uniform-heatmap-chart.jpg",
        description:
            "This SciChart demo demonstrates how to create a **JavaScript Non Uniform Heatmap Chart** using SciChart.js our High Performance JavaScript Chart component.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "This SciChart demo demonstrates how to create a **JavaScript Non Uniform Heatmap Chart** using SciChart.js our High Performance JavaScript Chart component.",
                title: "JavaScript Non Uniform Heatmap Chart",
                pageTitle: "JavaScript Non Uniform Heatmap Chart | JavaScript Chart Library Examples",
                metaDescription:
                    "Create JavaScript Non Uniform Chart using high performance SciChart.js. Display Heatmap with variable cell sizes. Get free demo now.",
                markdownContent:
                    "## Non Uniform Heatmap Chart Example (JavaScript)\n\n### Overview\nThis example demonstrates how to create a **Non Uniform Heatmap Chart** using SciChart.js with JavaScript. The chart visualizes data on a non-uniform grid where each heatmap cell can have variable sizes and custom offsets. Developers benefit from advanced customization options such as dynamic cell offset mapping and configurable color gradients.\n\n### Technical Implementation\nThe implementation centers around an asynchronous initialization function called `drawExample` that creates a `SciChartSurface` using the WebAssembly context (`wasmContext`) for optimal performance. `NumericAxis` are added with adjustable ranges, and a `NonUniformHeatmapDataSeries` is constructed by mapping a 2D array of data to custom x and y cell offsets, defined via mapping functions. A detailed color mapping is achieved by configuring a `HeatmapColorMap` with gradient stops. The example also incorporates interactive modifiers like [ZoomPanModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html), [ZoomExtentsModifier](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html), and [MouseWheelZoomModifier](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) to enhance user interaction. For detailed guidance on creating such charts, consult the [Non-Uniform Heatmap Chart Type documentation](https://www.scichart.com/documentation/js/current/The-Non-Uniform-Heatmap-Chart-Type.html).\n\n### Features and Capabilities\nThis example features a rich set of customization options including: \n- Custom cell offset mapping functions for precise placement of heatmap cells\n- Advanced color mapping with configurable gradient stops to visually represent data variations\n- Integration of data labels for clearer presentation of individual cell values\n- Interactive tools that facilitate zooming and panning for enhanced data exploration\nThe color mapping capabilities are further detailed in the [Heatmap ColorMaps and Legends documentation](https://www.scichart.com/documentation/js/current/Uniform-Heatmap-Colormaps.html).\n\n### Integration and Best Practices\nThe chart is implemented entirely in JavaScript, ensuring that it is lightweight and can be integrated easily into any web project. The initialization function returns a destructor function to clean up the SciChartSurface, adhering to best practices for memory management as recommended in the [Memory Best Practices documentation](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html). This modular approach allows developers to instantiate and dispose of charts efficiently, ensuring optimal performance in production applications.",
            },
            react: {
                subtitle:
                    "This SciChart demo demonstrates how to create a **React Non Uniform Heatmap Chart** using SciChart.js our High Performance JavaScript Chart component.",
                title: "React Non Uniform Heatmap Chart",
                pageTitle: "React Non Uniform Heatmap Chart | JavaScript Chart Library Examples",
                metaDescription:
                    "Create React Non Uniform Chart using high performance SciChart.js. Display Heatmap with variable cell sizes. Get free demo now.",
                markdownContent:
                    "## React Non Uniform Heatmap Chart\n\n### Overview\nThis example demonstrates a **React** implementation of a **Non Uniform Heatmap Chart** using SciChart.js. It visualizes data with variable cell sizes and positions using a non-uniform grid, showcasing high-performance WebGL rendering and advanced chart customizations.\n\n### Technical Implementation\nThe chart is initialized via the `<SciChartReact/>` component by passing an initialization function that creates a `SciChartSurface`. Within the function, `NumericAxis` are defined and a non-uniform heatmap data series is constructed using the `NonUniformHeatmapDataSeries` class. Custom mapping functions are used to define varying x and y cell offsets, and a `HeatmapColorMap` is applied with gradient stops based on a predefined theme. Interactive modifiers, such as `ZoomPanModifier` and `MouseWheelZoomModifier`, are added to enhance user interactions. For detailed guidance on non-uniform heatmap customization, see the [Non-Uniform Heatmap Chart Documentation](https://www.scichart.com/documentation/js/current/The-Non-Uniform-Heatmap-Chart-Type.html).\n\n### Features and Capabilities\nThe example features precise control over cell offset mapping via custom `xCellOffsets` and `yCellOffsets` functions, allowing for variable cell sizes in the heatmap. It includes data labels on each cell and configurable opacity settings to enhance visual appeal. Advanced color map customization is demonstrated, enabling developers to finely tune the gradient and threshold values. Additional details on color map customization can be found in the [Heatmap ColorMaps and Legends](https://www.scichart.com/documentation/js/current/Uniform-Heatmap-Colormaps.html) documentation.\n\n### Integration and Best Practices\nThis implementation leverages the `<SciChartReact/>` component for seamless **React** integration, following [best practices for React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/) and ensuring a smooth developer experience. Performance optimization is achieved by utilizing the WebAssembly context (`wasmContext`) for efficient rendering, as highlighted in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guide. Furthermore, interactive chart modifiers are implemented to support robust zooming and panning functionality, with additional insights available in the [Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) tutorial.",
            },
            angular: {
                subtitle:
                    "This SciChart demo demonstrates how to create a **Angular Non Uniform Heatmap Chart** using SciChart.js our High Performance JavaScript Chart component.",
                title: "Angular Non Uniform Heatmap Chart",
                pageTitle: "Angular Non Uniform Heatmap Chart | JavaScript Chart Library Examples",
                metaDescription:
                    "Create Angular Non Uniform Chart using high performance SciChart.js. Display Heatmap with variable cell sizes. Get free demo now.",
                markdownContent:
                    "## Angular Non Uniform Heatmap Chart\n\n### Overview\nThis example demonstrates how to integrate SciChart.js into an Angular application using a standalone Angular component. The chart visualizes data with a non uniform heatmap where each cell can have variable sizes and offsets. It leverages Angular’s input binding to pass an initialization function to the `ScichartAngularComponent`, ensuring a smooth integration and dynamic chart creation.\n\n### Technical Implementation\nThe implementation is centered around the `drawExample` function which creates a `SciChartSurface` with a specific theme and performance optimizations provided via the WebAssembly context (`wasmContext`). Within the function, `NumericAxis` are created and added to the `SciChartSurface`. A `NonUniformHeatmapDataSeries` is then constructed using custom mapping functions for x and y cell offsets, enabling each heatmap cell to be placed precisely on the grid. The example further configures a `HeatmapColorMap` with gradient stops and data labels to enhance the visual representation. For more detailed information on non uniform heatmap charts, refer to the [Non-Uniform Heatmap Chart Type documentation](https://www.scichart.com/documentation/js/current/The-Non-Uniform-Heatmap-Chart-Type.html).\n\n### Features and Capabilities\nThe example provides several advanced features such as interactive zooming and panning using modifiers like `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier`. It supports dynamic customization of visual elements including opacity and color mapping, and includes data labels for each heatmap cell for clearer data visualization. The use of custom cell offset mapping ensures that developers can precisely control the layout of the heatmap. Additional insights on interactive chart controls can be obtained from the [Tutorial on Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).\n\n### Integration and Best Practices\nBy using the `ScichartAngularComponent`, the example adheres to Angular best practices for component-based architecture and input binding as described in [Accepting data with input properties - Angular](https://angular.dev/guide/components/inputs). The `drawExample` function is passed directly to the component as an input, demonstrating a clean and modular approach to chart initialization. Performance optimization is achieved by leveraging the WebAssembly context to handle intensive rendering operations, which aligns with guidelines from [Memory Best Practices | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html). For further guidance on Angular integration, developers may also review the [scichart-angular](https://www.npmjs.com/package/scichart-angular) and the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) resources.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The-Non-Uniform-Heatmap-Chart-Type.html",
                title: "The specific page for the JavaScript Non Uniform Heatmap Chart documentation will help you to get started",
                linkTitle: "JavaScript Non Uniform Heatmap Chart Documentation",
            },
        ],
        path: "non-uniform-heatmap-chart",
        metaKeywords: "error, bars, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/NonUniformHeatmapChart",
        thumbnailImage: "javascript-non-uniform-heatmap-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

const nonUniformHeatmapExampleInfo = createExampleInfo(metaData);
export default nonUniformHeatmapExampleInfo;
