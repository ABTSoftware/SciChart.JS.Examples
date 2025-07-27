import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarStackedMountainChart",
        id: "chart2D_polarCharts_PolarStackedMountainChart",
        imagePath: "javascript-polar-stacked-mountain-chart.jpg",
        description:
            "Creates a **JavaScript Polar Stacked Mountain Chart** using with SciChart's powerful JavaScript Charts and its range of features.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Stacked Mountain Chart** using with SciChart's powerful JavaScript Charts and its range of features.",
                title: "JavaScript Polar Stacked Mountain Chart",
                pageTitle: "JavaScript Polar Stacked Mountain Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Stacked Mountain Chart – JavaScript\n\n## Overview\nThis example creates a **Polar Stacked Mountain Chart** in vanilla JavaScript using SciChart.js. It multiple stacked mountain series on a polar coordinate system, illustrating how to display radial data with smooth animations and interactive modifiers.\n\n## Technical Implementation\nAn asynchronous `SciChartPolarSurface.create()` call initializes the WebAssembly context and polar surface. Two axes are configured: a radial `PolarNumericAxis` and an angular `PolarNumericAxis`, each with custom ranges, label precision, and styling. A `PolarStackedMountainCollection` holds multiple `PolarStackedMountainRenderableSeries`, each constructed with an `XyDataSeries` that closes the loop by repeating the first data point for seamless stacking. The collection’s `WaveAnimation` animates series on render. Interactive behaviors—panning, mouse-wheel zoom, and zoom extents—are enabled via `PolarPanModifier`, `PolarMouseWheelZoomModifier`, and `PolarZoomExtentsModifier` respectively while a `PolarLegendModifier` provides series toggling and legend display.\n\n## Features and Capabilities\nThe chart supports **real-time updates** by updating each series’ `dataSeries`. Custom fill opacity and stroke settings allow clear stacking visualization. The legend enables users to toggle individual mountain series on or off for focused analysis.\n\n## Integration and Best Practices\nUse proper disposal of `sciChartSurface` to free WebAssembly resources when the chart is removed. Leverage CSS theming via `appTheme` to maintain consistent styling across your application. For deeper API details see the [Polar Stacked Mountain Series documentation](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-stacked-mountain-renderable-series/)."
            },
            react: {
                subtitle:
                    "Creates a **React Polar Stacked Mountain Chart** using with SciChart's powerful JavaScript Charts and its range of features.",
                title: "React Polar Stacked Mountain Chart",
                pageTitle: "React Polar Stacked Mountain Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Stacked Mountain Chart – React\n\n## Overview\nThis example demonstrates how to integrate a **Polar Stacked Mountain Chart** within a React application using the `` component. It visualizes multiple datasets on a polar coordinate system with stacked mountain series and animated transitions.\n\n## Technical Implementation\nThe `initChart` function passed to `` uses `SciChartPolarSurface.create()` to initialize the chart surface and WebAssembly context. Two polar axes (`PolarNumericAxis`) are added—one radial, one angular—configured for clockwise angular layout, precision labeling, and custom styling. A `PolarStackedMountainCollection` aggregates individual `PolarStackedMountainRenderableSeries`, each driven by `XyDataSeries` to close the loop. A `WaveAnimation` smoothly renders the collection. Chart interaction is provided by `PolarPanModifier`, `PolarMouseWheelZoomModifier`, `PolarZoomExtentsModifier`, and a `PolarLegendModifier` for toggling series visibility within the legend panel.\n\n## Features and Capabilities\nThe chart supports **dynamic data streaming** by updating the `XyDataSeries` of each mountain series. Customizable fill opacity and stroke thickness enable clear differentiation between stacked layers. The legend’s checkboxes allow end users to show or hide individual series in real time.\n\n## Integration and Best Practices\nUtilize the `` component to manage chart lifecycle and cleanup automatically. Define theming through `appTheme` for consistent look and feel. For detailed API reference, consult the [Polar Stacked Mountain Series guide](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-stacked-mountain-renderable-series/).",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Stacked Mountain Chart** using with SciChart's powerful JavaScript Charts and its range of features.",
                title: "Angular Polar Stacked Mountain Chart",
                pageTitle: "Angular Polar Stacked Mountain Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Stacked Mountain Chart – Angular\n\n## Overview\nThis standalone Angular component demonstrates a **Polar Stacked Mountain Chart** using SciChart.js. It displays multiple stacked mountain series on a polar surface with animations and interactive controls.\n\n## Technical Implementation\nWithin the `AppComponent`, `drawExample` is bound to the `` component’s `initChart` input. `SciChartPolarSurface.create()` initializes the plot surface and WebAssembly context. Two `PolarNumericAxis` instances configure radial and angular axes with specific visible ranges, label modes, and styling. A `PolarStackedMountainCollection` houses multiple `PolarStackedMountainRenderableSeries`, each using an `XyDataSeries` closed-loop dataset. A `WaveAnimation` animates series entry. Chart modifiers—`PolarPanModifier`, `PolarMouseWheelZoomModifier`, `PolarZoomExtentsModifier`—enable interactive navigation, while `PolarLegendModifier` provides legend checkboxes for series toggling.\n\n## Features and Capabilities\nSupports **real-time updates** by modifying each series’ `XyDataSeries`. Custom fill and stroke configurations allow clear layered visualization. The legend modifier offers user-controlled visibility of individual mountain layers.\n\n## Integration and Best Practices\nImplement proper cleanup by calling `sciChartSurface.delete()` in Angular’s lifecycle hooks. Leverage Angular’s standalone component pattern and dependency injection for theming with `appTheme`. Refer to the [Polar Stacked Mountain Series documentation](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-stacked-mountain-renderable-series/) for comprehensive API details.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Stacked Mountain Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Stacked Mountain Chart Documentation",
            },
        ],
        path: "polar-stacked-mountain-chart",
        metaKeywords: "polar, stacked, mountain, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarStackedMountainChart",
        thumbnailImage: "javascript-polar-stacked-mountain-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);