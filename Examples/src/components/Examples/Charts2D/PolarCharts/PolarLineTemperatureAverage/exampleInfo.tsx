import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarLineTemperatureAverage",
        id: "chart2D_polarCharts_PolarLineTemperatureAverage",
        imagePath: "javascript-polar-line-temperature.jpg",
        description:
            "Creates a **JavaScript Polar Line Temperature Average** using the **PolarLineRenderableSeries** and a custom palette provider for its coloring, on a **PolarCategoryAxis** xAxis.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Line Temperature Average** using the **PolarLineRenderableSeries** and a custom palette provider for its coloring, on a **PolarCategoryAxis** xAxis.",
                title: "JavaScript Polar Line Temperature Average",
                pageTitle: "JavaScript Polar Line Temperature Average | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "## Polar Line Temperature Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create a **Polar Line Chart** visualizing 30 years of temperature data using SciChart.js. The chart displays monthly temperature variations in a circular layout, with the last 5 years highlighted using a gradient effect.\n\n### Technical Implementation\nThe chart uses [SciChartPolarSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) with [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) for radial values and [PolarCategoryAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcategoryaxis.html) for angular months. Temperature data is plotted using [PolarLineRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html) with [XyDataSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html). The implementation features [SweepAnimation](https://www.scichart.com/documentation/js/v4/typedoc/enums/eanimationtype.html) for smooth transitions and [PaletteFactory](https://www.scichart.com/documentation/js/v4/typedoc/classes/palettefactory.html) for gradient highlighting.\n\n### Features and Capabilities\nThe chart includes interactive modifiers like [PolarZoomExtentsModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html) and [PolarPanModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpanmodifier.html), with data split across two [PolarLegendModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlegendmodifier.html) instances for better readability. The radial axis is configured with temperature ranges (12-17°C) and angular axis shows months.\n\n### Integration and Best Practices\nThe example follows best practices for async initialization and cleanup. Developers can extend this by adding real-time updates or customizing the [EPolarAxisMode](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolaraxismode.html) settings for different polar chart variations.",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Line Temperature Average** using the **PolarLineRenderableSeries** and a custom palette provider for its coloring, on a **PolarCategoryAxis** xAxis.",
                title: "React Polar Line Temperature Average",
                pageTitle: "React Polar Line Temperature Average | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "## Polar Line Temperature Chart - React\n\n### Overview\nThis React implementation showcases a polar temperature chart using the [SciChartReact](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartreact.html) component. It visualizes 30 years of monthly temperature data in a circular format with React-specific integration.\n\n### Technical Implementation\nThe chart is initialized via the `initChart` prop passed to `<SciChartReact/>`, creating a [SciChartPolarSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) with polar axes. The component handles WASM context creation and cleanup automatically. Temperature series use [PolarLineRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html) with React-compatible animation via [EAnimationType](https://www.scichart.com/documentation/js/v4/typedoc/enums/eanimationtype.html).\n\n### Features and Capabilities\nThe example features dual legends ([PolarLegendModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlegendmodifier.html)) for better data organization and interactive zoom/pan with [PolarMouseWheelZoomModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmousewheelzoommodifier.html). Recent years (2019-2024) are highlighted using gradient strokes from [PaletteFactory](https://www.scichart.com/documentation/js/v4/typedoc/classes/palettefactory.html).\n\n### Integration and Best Practices\nThe implementation demonstrates proper React integration patterns, including theme usage via `appTheme` and efficient series rendering. Developers can extend this by adding React state management for dynamic data updates or customizing the [ELegendPlacement](https://www.scichart.com/documentation/js/v4/typedoc/enums/elegendplacement.html) options.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Line Temperature Average** using the **PolarLineRenderableSeries** and a custom palette provider for its coloring, on a **PolarCategoryAxis** xAxis.",
                title: "Angular Polar Line Temperature Average",
                pageTitle: "Angular Polar Line Temperature Average | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "## Polar Line Temperature Chart - Angular\n\n### Overview\nThis Angular example demonstrates a polar temperature chart using the [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular). The standalone component displays 30 years of temperature data with Angular-specific integration patterns.\n\n### Technical Implementation\nThe chart is initialized by passing the `drawExample` function to the `<scichart-angular>` component. The implementation uses [SciChartPolarSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) with Angular's change detection strategy. Temperature series are configured with [PolarLineRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html) and animated via [EAnimationType.Sweep](https://www.scichart.com/documentation/js/v4/typedoc/enums/eanimationtype.html).\n\n### Features and Capabilities\nThe chart includes Angular-compatible interactivity with [PolarZoomExtentsModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html) and dual [PolarLegendModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlegendmodifier.html) instances. The [EPolarAxisMode](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolaraxismode.html) configuration ensures proper radial/angular axis alignment.\n\n### Integration and Best Practices\nThe example follows Angular standalone component best practices, with clean separation of chart logic. Developers can extend this by implementing [Input()](https://angular.io/api/core/Input) properties for dynamic data binding or adding [NgZone](https://angular.io/api/core/NgZone) optimization for performance-critical updates."
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Line Temperature Average documentation will help you to get started",
                linkTitle: "JavaScript Polar Line Temperature Average Documentation",
            },
        ],
        path: "polar-line-temperature-average",
        metaKeywords: "polar, line, temperature, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarLineTemperatureAverage",
        thumbnailImage: "javascript-polar-line-temperature.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
