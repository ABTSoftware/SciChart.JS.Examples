import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarRangeColumnChart",
        id: "chart2D_polarCharts_PolarRangeColumnChart",
        imagePath: "javascript-polar-range-column-chart.jpg",
        description:
            "Creates a **JavaScript Polar Range Column Chart** using SciChart.js, with y/y1 values for each column, using the **XyyDataSeries**",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Range Column Chart** using SciChart.js, with y/y1 values for each column, using the **XyyDataSeries**",
                title: "JavaScript Polar Range Column Chart",
                pageTitle: "JavaScript Polar Range Column Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Polar Range Column Chart - JavaScript\n\n## Overview\nThis example renders a **Polar Range Column Chart** visualizing monthly minimum and maximum surface temperatures using SciChart.js. It a polar surface with radial and angular axes to display a donut-style column series.\n\n## Technical Implementation\nThe chart is initialized via `SciChartPolarSurface.create()`, applying `PolarNumericAxis` for the radial axis ([documentation](https://www.scichart.com/documentation/js/v4/2d-charts/axis-api/axis-types/polar-numeric-axis/) [1]) and `PolarCategoryAxis` for the angular axis to map 12 months evenly around the circle ([layout guide](https://www.scichart.com/documentation/js/v4/2d-charts/axis-api/multi-axis-and-layout/polar-chart-layout/) [2]). A `PolarColumnRenderableSeries` is configured with an `XyyDataSeries` supplying `yValues` (min) and `y1Values` (max), and animated via `SweepAnimation`.\n\n## Features and Capabilities\nReal-time updates can be achieved by updating the data series. Interactive modifiers include `PolarPanModifier`, `PolarZoomExtentsModifier`, and `PolarMouseWheelZoomModifier` for smooth panning, zooming, and mouse-wheel control.\n\n## Integration and Best Practices\nUse `SciChartSurface.delete()` to clean up WebAssembly resources when disposing. For performance, enable `zoomExtentsToInitialRange` on axes and minimize redraws by batching data updates.",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Range Column Chart** using SciChart.js, with y/y1 values for each column, using the **XyyDataSeries**",
                title: "React Polar Range Column Chart",
                pageTitle: "React Polar Range Column Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Polar Range Column Chart - React\n\n## Overview\nThis React example showcases a **Polar Range Column Chart** using SciChart.js and the `SciChartReact` component. It displays monthly minimum and maximum temperatures within a circular polar layout.\n\n## Technical Implementation\nThe `` wrapper invokes `drawExample`, which calls `SciChartPolarSurface.create()` to configure a radial `PolarNumericAxis` ([API reference](https://www.scichart.com/documentation/js/v4/2d-charts/axis-api/axis-types/polar-numeric-axis/) [1]) and an angular `PolarCategoryAxis`. Data is bound to a `PolarColumnRenderableSeries` via `XyyDataSeries`, animated with `SweepAnimation`. Interactive modifiers (`Pan`, `ZoomExtents`, `MouseWheelZoom`) are added to enhance UX.\n\n## Features and Capabilities\nSupports dynamic data updates by manipulating the `XyyDataSeries` at runtime. Custom styling of columns is achieved through fill and stroke properties, and innerRadius creates a donut effect.\n\n## Integration and Best Practices\nLeverage React’s component lifecycle to manage chart creation and disposal—initialize in `useEffect` and call `sciChartSurface.delete()` on unmount. Batch data updates to reduce re-renders and ensure WebAssembly contexts are reused.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Range Column Chart** using SciChart.js, with y/y1 values for each column, using the **XyyDataSeries**",
                title: "Angular Polar Range Column Chart",
                pageTitle: "Angular Polar Range Column Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Polar Range Column Chart - Angular\n\n## Overview\nThis Angular standalone component demonstrates a **Polar Range Column Chart** built with SciChart.js, visualizing monthly temperature ranges in a polar coordinate system.\n\n## Technical Implementation\nThe component passes `drawExample` to ``, triggering `SciChartPolarSurface.create()` to set up a radial `PolarNumericAxis` ([documentation](https://www.scichart.com/documentation/js/v4/2d-charts/axis-api/axis-types/polar-numeric-axis/) [1]) and `PolarCategoryAxis`. A `PolarColumnRenderableSeries` utilizes an `XyyDataSeries` for low/high values and is animated via `SweepAnimation`. ChartModifiers add pan, zoom extents, and mouse-wheel zoom.\n\n## Features and Capabilities\nEnables real-time data streaming by updating the underlying data series. Column appearance and animation duration are customizable.\n\n## Integration and Best Practices\nUse Angular’s lifecycle hooks to initialize the chart asynchronously and implement a destructor invoking `sciChartSurface.delete()`. Apply `zoomExtentsToInitialRange` to maintain initial view and minimize redraw overhead.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Range Column Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Range Column Chart Documentation",
            },
        ],
        path: "polar-reange-column-chart",
        metaKeywords: "polar, range, xyxy, column, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarRangeColumnChart",
        thumbnailImage: "javascript-polar-range-column-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
