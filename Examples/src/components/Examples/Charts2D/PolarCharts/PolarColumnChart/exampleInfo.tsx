import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarColumnChart",
        id: "chart2D_polarCharts_PolarColumnChart",
        imagePath: "javascript-polar-column-chart.jpg",
        description:
            "Creates a **JavaScript Polar Column Chart** using the **PolarColumnRenderableSeries**, with the following features: DataLabels, Gradient fill, startup animations.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Column Chart** using the **PolarColumnRenderableSeries**, with the following features: DataLabels, Gradient fill, startup animations.",
                title: "JavaScript Polar Column Chart",
                pageTitle: "JavaScript Polar Column Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Polar Column Chart - JavaScript\n\n## Overview\nThis example demonstrates how to create a **Polar Column Chart** using SciChart.js in JavaScript. The chart visualizes data as vertical bars in a polar coordinate system, ideal for cyclic or angular data patterns. The implementation uses [PolarColumnRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) with customizable styling and animations.\n\n## Technical Implementation\nThe chart is initialized asynchronously with `SciChartPolarSurface.create()`, configuring radial and angular axes via [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html). Data is provided through [XyDataSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html), and columns are styled with a linear gradient fill and white borders. Interactive modifiers like [PolarZoomExtentsModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html) enhance usability.\n\n## Features and Capabilities\nKey features include radial column positioning, gradient fills, and [WaveAnimation](https://www.scichart.com/documentation/js/v4/typedoc/classes/waveanimation.html) for smooth transitions. The example also showcases axis customization, including inner radius for a donut effect and angular label alignment.\n\n## Integration and Best Practices\nThe implementation follows best practices for asynchronous chart initialization and cleanup. Developers can extend this example with real-time data updates or custom palette providers as described in the [Polar Chart documentation](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-chart).",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Column Chart** using the **PolarColumnRenderableSeries**, with the following features: DataLabels, Gradient fill, startup animations.",
                title: "React Polar Column Chart",
                pageTitle: "React Polar Column Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Polar Column Chart - React\n\n## Overview\nThis React example showcases a **Polar Column Chart** using the `SciChartReact` component. It renders columns in a polar layout with gradient fills and animations, demonstrating seamless integration with React's component lifecycle.\n\n## Technical Implementation\nThe chart is initialized via the `initChart` prop, which creates a [SciChartPolarSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) and configures axes with [EPolarAxisMode](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolaraxismode.html). Data labels are positioned parallel to columns using [EPolarLabelMode](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolarlabelmode.html). The implementation leverages React's async patterns for efficient rendering.\n\n## Features and Capabilities\nNotable features include dynamic gradient fills, configurable column widths, and interactive modifiers like [PolarMouseWheelZoomModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmousewheelzoommodifier.html). The chart supports real-time updates and follows React best practices for performance.\n\n## Integration and Best Practices\nThe example uses the [SciChartReact](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartreact.html) wrapper for simplified integration. For advanced use cases, refer to the [React Charts documentation](https://www.scichart.com/documentation/js/v4/typedoc/modules/scichart_react).",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Column Chart** using the **PolarColumnRenderableSeries**, with the following features: DataLabels, Gradient fill, startup animations.",
                title: "Angular Polar Column Chart",
                pageTitle: "Angular Polar Column Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Polar Column Chart - Angular\n\n## Overview\nThis Angular example demonstrates a **Polar Column Chart** using the `scichart-angular` component. It features radial columns with gradient fills and smooth animations, showcasing Angular's standalone component architecture.\n\n## Technical Implementation\nThe chart is initialized by passing the `drawExample` function to the `[initChart]` input of `scichart-angular`. The implementation configures polar axes with [EAxisAlignment](https://www.scichart.com/documentation/js/v4/typedoc/enums/eaxisalignment.html) and applies a [WaveAnimation](https://www.scichart.com/documentation/js/v4/typedoc/classes/waveanimation.html) for visual appeal.\n\n## Features and Capabilities\nKey features include customizable column styling, radial data distribution, and interactive zoom/pan behavior via [PolarPanModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpanmodifier.html). The example highlights Angular's dependency injection and change detection compatibility.\n\n## Integration and Best Practices\nThe example follows Angular best practices for component architecture and chart lifecycle management. For deeper integration patterns, consult the [scichart-angular documentation](https://www.npmjs.com/package/scichart-angular).",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Column Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Column Chart Documentation",
            },
        ],
        path: "polar-column-chart",
        metaKeywords: "polar, column, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarColumnChart",
        thumbnailImage: "javascript-polar-column-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
