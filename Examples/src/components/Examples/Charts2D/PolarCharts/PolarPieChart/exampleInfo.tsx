import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarPieChart",
        id: "chart2D_polarCharts_PolarPieChart",
        imagePath: "javascript-polar-pie-chart.jpg",
        description:
            "Creates a **JavaScript Polar Pie Chart** in SciChart.js, using the **PolarColumnRenderableSeries** with a **XyxDataSeries**.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Pie Chart** in SciChart.js, using the **PolarColumnRenderableSeries** with a **XyxDataSeries**.",
                title: "JavaScript Polar Pie Chart",
                pageTitle: "JavaScript Polar Pie Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "## Polar Pie Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create a polar pie chart using SciChart.js in JavaScript. The implementation visualizes the popularity of JavaScript frameworks as pie segments in a polar coordinate system, leveraging the **PolarColumnRenderableSeries** to simulate pie chart behavior.\n\n### Technical Implementation\nThe chart is initialized asynchronously using `SciChartPolarSurface.create()`, with radial and angular axes configured via **PolarNumericAxis**. Data is processed to calculate cumulative values for each segment using `xValues` and `x1Values`, with **EColumnMode.StartEnd** defining segment boundaries. Colors and labels are applied through **MetadataPaletteProvider** and custom metadata.\n\n### Features and Capabilities\nThe example showcases polar chart capabilities with pie-like segments, using **EPolarLabelMode.Perpendicular** for label positioning and interactive modifiers like **PolarPanModifier** and **PolarZoomExtentsModifier**. The **MetadataPaletteProvider** dynamically colors segments based on metadata.\n\n### Integration and Best Practices\nThe implementation follows best practices for async initialization and cleanup. Developers can extend this example by integrating real-time data updates or customizing segment styling via metadata.",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Pie Chart** usinginhart.js, using the **PolarColumnRenderableSeries** with a **XyxDataSeries**.",
                title: "React Polar Pie Chart",
                pageTitle: "React Polar Pie Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "## Polar Pie Chart - React\n\n### Overview\nThis example illustrates a polar pie chart implementation in React using the **SciChartReact** component. It visualizes framework popularity data as segmented pie slices in a polar coordinate system.\n\n### Technical Implementation\nThe chart is initialized via the `initChart` prop, which calls `drawExample` to create a **SciChartPolarSurface**. Segment data is calculated cumulatively, with **PolarColumnRenderableSeries** configured to use **EColumnMode.StartEnd** for pie-like segments. Labels and colors are managed through metadata and **MetadataPaletteProvider**.\n\n### Features and Capabilities\nThe chart features dynamic labeling with **EPolarLabelMode.Perpendicular** and interactive controls including zoom/pan modifiers. The React integration ensures seamless lifecycle management through the **SciChartReact** wrapper component.\n\n### Integration and Best Practices\nThe example demonstrates optimal React integration patterns, with async initialization and automatic cleanup. Developers can extend this by adding state management for dynamic data updates or customizing the theme via React context.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Pie Chart** usiiniChart.js, using the **PolarColumnRenderableSeries** with a **XyxDataSeries**.",
                title: "Angular Polar Pie Chart",
                pageTitle: "Angular Polar Pie Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "## Polar Pie Chart - Angular\n\n### Overview\nThis example showcases a polar pie chart in Angular using the **ScichartAngularComponent**. It renders framework popularity data as angular segments in a polar coordinate system with standalone component architecture.\n\n### Technical Implementation\nThe chart is initialized by passing `drawExample` to the **ScichartAngularComponent**. The implementation uses **PolarNumericAxis** for radial/angular axes and **PolarColumnRenderableSeries** with **EColumnMode.StartEnd** to create pie segments. Metadata drives segment colors and labels via **MetadataPaletteProvider**.\n\n### Features and Capabilities\nThe chart includes interactive modifiers like **PolarMouseWheelZoomModifier** and customized labels with **EPolarLabelMode.Perpendicular**. Angular's standalone component system ensures clean integration with minimal boilerplate.\n\n### Integration and Best Practices\nThe example follows Angular best practices with async initialization and proper resource cleanup. Developers can enhance it by adding input properties for dynamic data binding or leveraging Angular services for data management.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Pie Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Pie Chart Documentation",
            },
        ],
        path: "polar-pie-chart",
        metaKeywords: "polar, pie, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarPieChart",
        thumbnailImage: "javascript-polar-pie-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
