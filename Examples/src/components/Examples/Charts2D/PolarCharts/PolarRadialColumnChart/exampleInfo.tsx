import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarRadialColumnChart",
        id: "chart2D_polarCharts_PolarRadialColumnChart",
        imagePath: "javascript-polar-radial-column-chart.jpg",
        description:
            "Creates a **JavaScript Radial Column Chart** using SciChart.js, by switching radial and angular axes in between one another, thus creating a Vertical / Radial Chart.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Radial Column Chart** using SciChart.js, by switching radial and angular axes in between one another, thus creating a Vertical / Radial Chart.",
                title: "JavaScript Radial Column Chart",
                pageTitle: "JavaScript Radial Column Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Radial Column Chart - JavaScript\n\n## Overview\nThis example demonstrates how to render a **Polar Radial Column Chart** using SciChart.js in vanilla JavaScript. plots radial columns with custom color palettes and interactive zooming to visualize angular data series.\n\n## Technical Implementation\nAn asynchronous call to [SciChartPolarSurface.create](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) initializes the polar surface. Two `PolarNumericAxis` instances represent the **radial** and **angular** axes configured via `polarAxisMode` and `innerRadius` properties for a donut effect. Column data points are supplied through `XyDataSeries` and rendered using `PolarColumnRenderableSeries` with a custom `PaletteProvider` to override stroke and fill colors based on thresholds.\n\n## Features and Capabilities\nReal-time updates can be achieved by modifying the underlying `XyDataSeries`. The chart supports animated startup via `WaveAnimation` and advanced styling through `dataLabels` with `EColumnDataLabelPosition.Inside`.\n\n## Integration and Best Practices\nUse `sciChartSurface.delete()` to free memory when disposing charts. Modifiers like `PolarArcZoomModifier` and `PolarZoomExtentsModifier` enable intuitive arc-zoom and fit-to-view behaviors as detailed in the [PolarArcZoomModifier docs](https://www.scichart.com/documentation/js/v4/2d-charts/chart-modifier-api/polar-modifiers/polar-arc-zoom-modifier/). Ensure proper WASM loading before initialization."
            },
            react: {
                subtitle:
                    "Creates a **React Radial Column Chart** using SciChart.js, by switching radial and angular axes in between one another, thus creating a Vertical / Radial Chart.",
                title: "React Radial Column Chart",
                pageTitle: "React Radial Column Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Radial Column Chart - React\n\n## Overview\nThis React example renders a **Polar Radial Column Chart** within the `` component. It showcases radial column series with dynamic palette coloring and interactive zoom modifiers in a React application.\n\n## Technical Implementation\nChart creation is handled by passing `drawExample` to `SciChartReact`’s `initChart` prop. Inside `drawExample`, `SciChartPolarSurface.create` sets up the surface. Axes are configured using `PolarNumericAxis` with `EPolarAxisMode.Radial` and `EPolarAxisMode.Angular` for radial and angular measurements. A `PolarColumnRenderableSeries` leverages `XyDataSeries` for data and a `ColumnPaletteProvider` extends `DefaultPaletteProvider` to apply conditional coloring.\n\n## Features and Capabilities\nInteractive behaviors include `PolarArcZoomModifier`, `PolarZoomExtentsModifier`, and `PolarMouseWheelZoomModifier` for arc-based zooming and mouse-wheel control. Animated series entry is enabled via `WaveAnimation` for enhanced UX.\n\n## Integration and Best Practices\nLeverage the React wrapper from [scichart-react](https://github.com/ABTSoftware/scichart-react) to manage lifecycle and WASM dependencies. Ensure cleanup by calling `sciChartSurface.delete()` on component unmount. Use hooks or effects to handle asynchronous chart initialization and disposal."
            },
            angular: {
                subtitle:
                    "Creates a **Angular Radial Column Chart** using SciChart.js, by switching radial and angular axes in between one another, thus creating a Vertical / Radial Chart.",
                title: "Angular Radial Column Chart",
                pageTitle: "Angular Radial Column Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Radial Column Chart - Angular\n\n## Overview\nThis Angular standalone component demonstrates a **Polar Radial Column Chart** using SciChart.js. It visualizes angular data in radial columns with custom labeling and zooming.\n\n## Technical Implementation\nThe `AppComponent` uses `` with `initChart` bound to `drawExample`. Within `drawExample`, a `SciChartPolarSurface` is created, and two `PolarNumericAxis` instances configure radial and angular axes. Data is provided by `XyDataSeries`, and rendering is performed by `PolarColumnRenderableSeries` with a `ColumnPaletteProvider` for threshold-based coloring.\n\n## Features and Capabilities\nThe chart features animated rendering (`WaveAnimation`), data labels positioned inside columns (`EColumnDataLabelPosition.Inside`), and interactive modifiers including `PolarArcZoomModifier` and `PolarMouseWheelZoomModifier` for focused arc zooming and scroll zoom.\n\n## Integration and Best Practices\nUse Angular’s lifecycle hooks to initialize and dispose the chart. Ensure `SciChartSurface.delete()` is invoked in `ngOnDestroy` to prevent memory leaks. Consult the SciChart JS Angular integration guide for detailed setup and WASM configuration.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Radial Column Chart documentation will help you to get started",
                linkTitle: "JavaScript Radial Column Chart Documentation",
            },
        ],
        path: "polar-radial-column-chart",
        metaKeywords: "polar, radial, column, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarRadialColumnChart",
        thumbnailImage: "javascript-polar-radial-column-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
