import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "HeatmapRectangle",
        id: "chart2D_v4Charts_HeatmapRectangle",
        imagePath: "javascript-heatmap-rectangle-chart.jpg",
        description:
            "Creates a **JavaScript Heatmap Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Heatmap Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
                title: "JavaScript Heatmap Chart",
                pageTitle: "JavaScript Heatmap Chart | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Heatmap Rectangle Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create a **heatmap-style visualization** using rectangular series in SciChart.js. It replicates heatmap functionality by leveraging the [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) with a custom palette provider for color mapping.\n\n### Technical Implementation\nThe implementation uses an [XyzDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries.html) to store 3D data points, where Z-values represent heatmap intensity. A custom `HeatmapPaletteProvider` extends [DefaultPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/defaultpaletteprovider.html) to map values to colors using either gradient or discrete steps. The chart is initialized asynchronously with hidden axes, focusing purely on the heatmap visualization.\n\n### Features and Capabilities\nThe example showcases dynamic data generation with `generateExampleData()`, supporting real-time updates. Interactive features include [ZoomPanModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html), [ZoomExtentsModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/zoomextentsmodifier.html), and a custom tooltip via [CursorModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html). The color mapping system supports both gradient and discrete modes through the `noGradientColor` and `getGradientColor` functions.\n\n### Integration and Best Practices\nThe implementation follows JavaScript best practices with async initialization and proper resource cleanup. The heatmap data is efficiently transformed and flattened for optimal performance with large datasets. Developers can adjust the `heatmapWidth` and `heatmapHeight` parameters to control resolution.",
            },
            react: {
                subtitle:
                    "Creates a **React Heatmap Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
                title: "React FastRectangle Heatmap Chart",
                pageTitle: "React Heatmap Chart | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Heatmap Rectangle Chart - React\n\n### Overview\nThis React example creates a **heatmap visualization** using SciChart's [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) within a React component. The implementation leverages the `<SciChartReact/>` wrapper for seamless integration.\n\n### Technical Implementation\nThe chart is initialized via the `initChart` prop, which points to the `drawExample` function. This function creates a [SciChartSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) with hidden axes and configures the rectangular series with column modes set to `EColumnMode.Start` and `EColumnYMode.TopHeight`. The custom `HeatmapPaletteProvider` handles color mapping, supporting both gradient and discrete modes.\n\n### Features and Capabilities\nThe component demonstrates React-friendly heatmap rendering with interactive features including zooming, panning, and value inspection via tooltips. The `setChart` function allows dynamic toggling between gradient and discrete color modes. The implementation uses React's component lifecycle for efficient resource management.\n\n### Integration and Best Practices\nThe example follows React best practices by encapsulating chart logic in a separate function and using the [SciChartReact](https://www.scichart.com/documentation/js/current/typedoc/globals.html) component for integration. The className prop applies responsive styling through CSS modules. Developers can extend this pattern for state-controlled heatmap updates.",
            },
            angular: {
                subtitle:
                    "Creates an **Angular Heatmap Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
                title: "Angular Heatmap Chart",
                pageTitle: "Angular Heatmap Chart | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Heatmap Rectangle Chart - Angular\n\n### Overview\nThis Angular example demonstrates a **standalone component** that renders a heatmap using SciChart's rectangular series. The implementation uses the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package for seamless integration.\n\n### Technical Implementation\nThe component declares `drawExample` as an input function for the `<scichart-angular>` component. The chart surface is created asynchronously with WebAssembly, using [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) configured with `EColumnMode.Start` and `EColumnYMode.TopHeight`. The custom palette provider implements both gradient and discrete color mapping algorithms.\n\n### Features and Capabilities\nThe heatmap supports real-time data updates through the exposed `setChart` method. Interactive features include zooming, panning, and value inspection. The implementation demonstrates Angular's standalone component architecture while maintaining high performance through WebAssembly rendering.\n\n### Integration and Best Practices\nThe example follows Angular best practices with proper component encapsulation and async initialization. Developers can extend this pattern by connecting to Angular services for data updates. The standalone component approach simplifies integration into existing applications while maintaining clean separation of concerns.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Heatmap Chart documentation will help you to get started",
                linkTitle: "JavaScript Heatmap Chart Documentation",
            },
        ],
        path: "heatmap-rectangle-chart",
        metaKeywords: "heatmap, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/HeatmapRectangle",
        thumbnailImage: "javascript-heatmap-rectangle-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

const HeatmapRectangleExampleInfo = createExampleInfo(metaData);
export default HeatmapRectangleExampleInfo;
