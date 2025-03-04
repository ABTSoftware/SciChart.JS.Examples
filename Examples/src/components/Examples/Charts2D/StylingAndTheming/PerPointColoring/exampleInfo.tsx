import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DStylingAndThemingPerPointColoring",
        imagePath: "javascript-chart-color-points-individually-with-paletteprovider.jpg",
        description:
            "Demonstrates how create **JavaScript Charts with per-point coloring** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how create **JavaScript Charts with per-point coloring** using SciChart.js, High Performance JavaScript Charts",
                title: "Coloring Series per-point using the PaletteProvider",
                pageTitle: "Coloring Series per-point using the PaletteProvider",
                metaDescription:
                    "Demonstrates per-point coloring in JavaScript chart types with SciChart.js PaletteProvider API",
                markdownContent:
                    "## Per Point Coloring - Vanilla JavaScript\n\n### Overview\nThis example demonstrates how to implement **per-point coloring** for both line and scatter series using SciChart.js with vanilla JavaScript. It highlights dynamic color assignment based on threshold values and interactive annotations for real-time updates, making it ideal for high performance and visually rich charting applications.\n\n### Technical Implementation\nThe chart is asynchronously initialized using [SciChartSurface.create and loading Wasm](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html), ensuring that the WebAssembly context is properly loaded. Numeric axes are configured with options such as maxAutoTicks and growBy as described in the [NumericAxis API](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html), while a random walk data series is generated for visual demonstration, which aligns with techniques seen in [Generating a Smooth Random Trend](https://stackoverflow.com/questions/22058195/generating-a-smooth-random-trend-random-walk-in-javascript). Custom implementations of the **IStrokePaletteProvider** and **IPointMarkerPaletteProvider** are used to override default coloring on a per-data-point basis. These providers use the [PaletteProvider API documentation](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html) and [Per-Point Colouring of Scatter Charts](https://www.scichart.com/documentation/js/current/Per-Point%20Colouring%20of%20Scatter%20Charts.html) to determine colors dynamically based on each data point’s y-value.\n\n### Features and Capabilities\nThe example includes interactive annotations, such as draggable horizontal lines that update threshold levels in real-time. This interactivity is implemented to demonstrate how threshold changes can immediately affect the rendering of per-point colors, ensuring that the visualization remains responsive and informative. Performance is optimized by using efficient color conversion through methods like parseColorToUIntArgb and by processing color updates only when necessary.\n\n### Integration and Best Practices\nBeing implemented in vanilla JavaScript, this example avoids framework-specific constructs such as hooks or the builder API, allowing for easy integration into any HTML page. Developers are encouraged to follow [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) to ensure proper resource cleanup, such as deleting the SciChartSurface when it is no longer needed. This straightforward approach provides a solid foundation for incorporating advanced charting capabilities in a lightweight, easy-to-maintain JavaScript project.",
            },
            react: {
                subtitle:
                    "Demonstrates how create **React Charts with per-point coloring** using SciChart.js, High Performance JavaScript Charts",
                title: "Coloring Series per-point using the PaletteProvider",
                pageTitle: "Coloring Series per-point using the PaletteProvider",
                metaDescription:
                    "Demonstrates per-point coloring in JavaScript chart types with SciChart.js PaletteProvider API",
                markdownContent:
                    "## Per Point Coloring - React\n\n### Overview\nThis example demonstrates how to create a high performance chart in React using SciChart.js with **per-point coloring**. In this implementation, both line and scatter series are rendered with data points whose colors are dynamically updated based on predefined threshold values. The example highlights how to integrate SciChart.js into React applications using the SciChartReact component, following [best practices for React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/).\n\n### Technical Implementation\nThe chart is initialized by passing an asynchronous chart drawing function to the SciChartReact component. This function creates the SciChartSurface, configures numeric axes, and generates a random walk data series. Custom **PaletteProvider** implementations are used to determine the color for each data point based on its y-value. The line series uses a stroke palette provider while the scatter series uses a point marker palette provider. Both these providers return color values in ARGB format as required by SciChart.js. For additional technical details on the PaletteProvider API, review the [PaletteProvider documentation](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html).\n\n### Features and Capabilities\nThis example highlights several advanced features: \n- **Per-Point Coloring**: Dynamic recoloring of series elements (both line and scatter) based on custom logic.\n- **Interactive Annotations**: Draggable horizontal line annotations update threshold levels in real-time, which in turn update the chart’s color palette.\n- **Integrated Data Labeling**: Data labels are conditionally displayed and styled, ensuring clarity even when points are densely packed.\nThese capabilities provide a comprehensive demonstration of how to leverage SciChart.js for interactive and visually rich charting experiences in React.\n\n### Integration and Best Practices\nThe implementation shows how to seamlessly integrate SciChart.js within a React framework by using the SciChartReact component to encapsulate chart initialization logic. This ensures that chart configuration and rendering follow React’s declarative model while benefiting from SciChart.js’s performance optimizations and WebGL rendering capabilities. Developers are encouraged to refer to the [React Charts with SciChart.js tutorial](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html) for project setup and more advanced integration techniques. Additionally, performance optimization techniques such as reducing re-rendering and efficient resource management are highlighted, aligning with the advice provided in the [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) article.\n",
            },
            angular: {
                subtitle:
                    "Demonstrates how create **Angular Charts with per-point coloring** using SciChart.js, High Performance JavaScript Charts",
                title: "Coloring Series per-point using the PaletteProvider",
                pageTitle: "Coloring Series per-point using the PaletteProvider",
                metaDescription:
                    "Demonstrates per-point coloring in JavaScript chart types with SciChart.js PaletteProvider API",
                markdownContent:
                    "## Per Point Coloring - Angular\n\n### Overview\nThis Angular example demonstrates how to implement per point coloring for both line and scatter series using SciChart.js. The example utilizes the SciChartAngularComponent and Angular standalone components to integrate the chart seamlessly into an Angular application.\n\n### Technical Implementation\nThe chart is asynchronously initialized by calling SciChartSurface.create, which loads the required WebAssembly context as detailed in the [Creating a new SciChartSurface and loading Wasm](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) documentation. Numeric axes are configured and a random walk data series is generated. Custom implementations of the PaletteProvider interfaces are used to override stroke and point marker colors on a per-data-point basis. This technique leverages the [The PaletteProvider API documentation](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html) for dynamic color assignment based on defined threshold values.\n\n### Features and Capabilities\nThe example features interactive annotations, including draggable horizontal lines that update threshold levels in real-time. This behavior is implemented using editable annotations, as explained in the [Editable Annotations](https://www.scichart.com/documentation/js/current/EditableAnnotations.html) guide. Performance is optimized by processing color updates on each data point efficiently, ensuring high performance even with dynamic chart updates.\n\n### Integration and Best Practices\nDevelopers can easily integrate this version of SciChart.js in Angular by utilizing the standalone Angular component provided by the scichart-angular package, available on [scichart-angular - Yarn](https://www.npmjs.com/package/scichart-angular). The example also follows the best practices outlined in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide, ensuring that asynchronous initialization and component-based structuring lead to maintainable and efficient code. This approach enables seamless event handling and real-time updates in Angular applications.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html",
                title: "The PaletteProvider API documentation",
                linkTitle: "SciChart.js PaletteProvider documentation",
            },
        ],
        path: "chart-color-points-individually-with-paletteprovider",
        metaKeywords: "palette, provider, api, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/StylingAndTheming/PerPointColoring",
        thumbnailImage: "javascript-chart-color-points-individually-with-paletteprovider.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const perPointColoringExampleInfo = createExampleInfo(metaData);
