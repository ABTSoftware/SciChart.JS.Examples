import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarGaugeFifoDashboard",
        id: "chart2D_polarCharts_PolarGaugeFifoDashboard",
        imagePath: "javascript-polar-gauge-fifo-chart.jpg",
        description:
            "Creates a **JavaScript Realtime Radial Gauges and Fifo Scrolling Charts Dashboard** using SciChart.js, which displays Polar Gauge Charts for the current values, and a cartesian historical FIFO view.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Realtime Radial Gauges and Fifo Scrolling Charts Dashboard** using SciChart.js, which displays Polar Gauge Charts for the current values, and a cartesian historical FIFO view.",
                title: "JavaScript Realtime Radial Gauges and Fifo Scrolling Charts Dashboard",
                pageTitle:
                    "JavaScript Realtime Radial Gauges and Fifo Scrolling Charts Dashboard | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Realtime Radial Gauges and Fifo Scrolling Charts Dashboard - React\n\n## Overview\nThis React example demonstrates a dynamic dashboard featuring **polar gauge charts** and **FIFO (First-In-First-Out) line charts** using SciChart.js. The implementation combines [SciChartPolarSubSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsubsurface.html) for gauge visualization with [SciChartSubSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartsubsurface.html) for real-time data streaming.\n\n## Technical Implementation\nThe dashboard uses React's `SciChartReact` component with an `initChart` function that creates two polar gauges and two FIFO charts. The gauges are built using [PolarArcAnnotation](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html) for the arc segments and [NativeTextAnnotation](https://www.scichart.com/documentation/js/v4/typedoc/classes/nativetextannotation.html) for centered values. The FIFO charts utilize [XyDataSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) with `fifoCapacity` for efficient memory management.\n\n## Features and Capabilities\nKey features include:\n- **Real-time updates** with smooth gauge needle animations\n- **Color thresholds** that change based on value ranges (green/orange/pink)\n- **Optimized rendering** through WebGL acceleration\n- **Responsive layout** using relative positioning with [Rect](https://www.scichart.com/documentation/js/v4/typedoc/classes/rect.html) coordinates\n\n## Integration and Best Practices\nThe example follows React best practices by:\n- Using the [SciChartReact wrapper](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartreact.html) for proper lifecycle management\n- Implementing efficient updates with `requestAnimationFrame`\n- Separating gauge and chart logic into reusable functions\n- Providing cleanup via `sciChartSurface.delete()`",
            },
            react: {
                subtitle:
                    "Creates a **React Realtime Radial Gauges and Fifo Scrolling Charts Dashboard** using SciChart.js, which displays Polar Gauge Charts for the current values, and a cartesian historical FIFO view.",
                title: "React Realtime Radial Gauges and Fifo Scrolling Charts Dashboard",
                pageTitle:
                    "React Realtime Radial Gauges and Fifo Scrolling Charts Dashboard | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Realtime Radial Gauges and Fifo Scrolling Charts Dashboard - JavaScript\n\n## Overview\nThis vanilla JavaScript implementation showcases a dashboard with **interactive polar gauges** and **real-time FIFO charts** using SciChart.js. The example highlights the library's capability to create sophisticated visualizations without framework dependencies.\n\n## Technical Implementation\nThe core components are:\n- [SciChartPolarSubSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsubsurface.html) for gauge rendering\n- [FastLineRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastlinerenderableseries.html) for high-performance streaming\n- [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) with `EPolarAxisMode` configuration\n\n## Features and Capabilities\nNotable aspects include:\n- **Animated transitions** using frame-by-frame updates\n- **Data optimization** through FIFO buffers (100-point capacity)\n- **Color-coded thresholds** with dynamic value evaluation\n- **Modular architecture** with separate gauge and chart creation functions\n\n## Integration and Best Practices\nKey integration points:\n- Proper WASM context initialization\n- Efficient memory management with `fifoCapacity`\n- Clean disposal via `sciChartSurface.delete()`\n- Performance optimization through batched updates",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Realtime Radial Gauges and Fifo Scrolling Charts Dashboard** using SciChart.js, which displays Polar Gauge Charts for the current values, and a cartesian historical FIFO view.",
                title: "Angular Realtime Radial Gauges and Fifo Scrolling Charts Dashboard",
                pageTitle:
                    "Angular Realtime Radial Gauges and Fifo Scrolling Charts Dashboard | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Realtime Radial Gauges and Fifo Scrolling Charts Dashboard - Angular\n\n## Overview\nThis Angular example demonstrates how to integrate SciChart's **polar gauge** and **FIFO chart** components in a standalone application. The implementation leverages Angular's component architecture with SciChart's high-performance rendering.\n\n## Technical Implementation\nThe solution uses:\n- [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular) for Angular integration\n- [PolarArcAnnotation](https://www.scichart.com/documentation/js/v4/typedoc/classes/polararcannotation.html) for gauge segments\n- [DateTimeNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/datetimenumericaxis.html) for time-series data\n\n## Features and Capabilities\nHighlights include:\n- **Real-time data binding** between components\n- **Responsive design** using relative surface positioning\n- **Type-safe configuration** with Angular's TypeScript support\n- **Performance optimization** through WebAssembly rendering\n\n## Integration and Best Practices\nAngular-specific considerations:\n- Proper use of standalone components\n- Async initialization pattern\n- Memory management with ngOnDestroy\n- Efficient change detection strategies",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Realtime Radial Gauges and Fifo Scrolling Charts Dashboard documentation will help you to get started",
                linkTitle: "JavaScript Realtime Radial Gauges and Fifo Scrolling Charts Dashboard Documentation",
            },
        ],
        path: "polar-gauge-fifo-dashboard",
        metaKeywords: "polar, column, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarGaugeFifoDashboard",
        thumbnailImage: "javascript-polar-gauge-fifo-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
