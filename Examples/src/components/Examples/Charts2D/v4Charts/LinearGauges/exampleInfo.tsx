import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "LinearGauges",
        id: "chart2D_v4Charts_LinearGauges",
        imagePath: "javascript-linear-gauges.jpg",
        description:
            "Demonstrates various **JavaScript Linear Gauges** using SciChart.js, combining rectangles and annotations to show simple values in compelling ways.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates various **JavaScript Linear Gauges** using SciChart.js, combining rectangles and annotations to show simple values in compelling ways.",
                title: "JavaScript Linear Gauges",
                pageTitle: "JavaScript Linear Gauges | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Linear Gauges - JavaScript\n\n## Overview\nThis example demonstrates how to create **Linear Gauges** using SciChart.js in vanilla JavaScript. The implementation showcases six different gauge variations using [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) with [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html) to define rectangular regions.\n\n## Technical Implementation\nEach gauge is created by configuring a `SciChartSurface` with hidden axes and using `FastRectangleRenderableSeries` with `EColumnMode.StartEnd` and `EColumnYMode.TopBottom` modes. The gauges implement custom color palettes through [IFillPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) for segmented coloring. Annotations like [TextAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html) and [LineArrowAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/linearrowannotation.html) provide labels and indicators.\n\n## Features and Capabilities\nThe example demonstrates vertical and horizontal gauge orientations, gradient fills, dynamic value indicators, and segmented color zones. Gauge 6 features animated transitions between different value sets using `setInterval` for periodic updates. The implementation leverages WebGL acceleration through SciChart's WASM engine for high performance rendering.\n\n## Integration and Best Practices\nThe vanilla JS implementation follows best practices for async initialization with `SciChartSurface.create()` and proper cleanup via `sciChartSurface.delete()`. The modular gauge creation pattern allows for easy extension and customization of individual gauge components.",
            },
            react: {
                subtitle:
                    "Demonstrates various **React Linear Gauges** using SciChart.js, combining rectangles and annotations to show simple values in compelling ways.",
                title: "React Linear Gauges",
                pageTitle: "React Linear Gauges | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Linear Gauges - React\n\n## Overview\nThis React example showcases six configurable **Linear Gauges** using SciChart.js through the `SciChartReact` component. The implementation demonstrates how to integrate SciChart's high-performance charting into React applications with proper lifecycle management.\n\n## Technical Implementation\nThe gauges are implemented using a factory pattern that returns initialization functions for each gauge variation. The React component uses `SciChartReact` with an `initChart` prop that references these functions. Each gauge utilizes [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) with custom [palette providers](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) for segmented coloring. The component manages chart instances through React's state management.\n\n## Features and Capabilities\nThe example includes vertical and horizontal gauges with different styling approaches: solid color segments, gradient fills, and animated value indicators. Gauge 6 demonstrates real-time updates through React's reconciliation with SciChart's WebGL rendering. The implementation uses SciChart's [theme system](https://www.scichart.com/documentation/js/current/theming-and-styling.html) for consistent styling across components.\n\n## Integration and Best Practices\nThe example follows React best practices by using the `ChartGroupLoader` component for async initialization and cleanup. The grid layout is implemented with CSS Grid for responsive sizing. For production use, consider extracting gauge configurations into separate files and implementing memoization for performance optimization.",
            },
            angular: {
                subtitle:
                    "Demonstrates various **Angular Linear Gauges** using SciChart.js, combining rectangles and annotations to show simple values in compelling ways.",
                title: "Angular Linear Gauges",
                pageTitle: "Angular Linear Gauges | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Linear Gauges - Angular\n\n## Overview\nThis Angular example demonstrates how to integrate SciChart's **Linear Gauges** into an Angular application using the `scichart-angular` package. The implementation showcases six gauge variations in a responsive grid layout.\n\n## Technical Implementation\nThe gauges are created through a shared initialization API exposed via component input binding. The Angular component uses standalone imports and directly binds the gauge creation functions to the `[initChart]` property of `scichart-angular`. Each gauge configuration leverages [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) with [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html) for rectangular segment definition.\n\n## Features and Capabilities\nThe example includes both vertical and horizontal gauge orientations with different value ranges and styling approaches. The implementation demonstrates Angular's change detection working with SciChart's WebGL rendering pipeline. Gauge 6 features animated transitions that work seamlessly within Angular's zone.js environment.\n\n## Integration and Best Practices\nThe example follows Angular best practices by using standalone components and proper input binding. The grid layout is implemented with CSS Grid for responsive behavior. For production applications, consider implementing `OnDestroy` for proper chart cleanup and using Angular services for gauge configuration management.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Linear Gauges documentation will help you to get started",
                linkTitle: "JavaScript Linear Gauges Documentation",
            },
        ],
        path: "linear-gauges",
        metaKeywords: "histogram, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/LinearGauges",
        thumbnailImage: "javascript-linear-gauges.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

const LinearGaugesExampleInfo = createExampleInfo(metaData);
export default LinearGaugesExampleInfo;
