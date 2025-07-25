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
                markdownContent: "# Polar Pie Chart - JavaScript\n\n## Overview\nThis example demonstrates how to create a **polar pie chart** in JavaScript using SciChart.js, simulating pie segments with [PolarColumnRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) on a [SciChartPolarSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html). The chart visualizes framework popularity data with colored segments.\n\n## Technical Implementation\nThe implementation uses [XyxDataSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyxdataseries.html) with metadata for segment coloring via [MetadataPaletteProvider](https://www.scichart.com/documentation/js/v4/typedoc/classes/metadatapaletteprovider.html). The [EColumnMode.StartWidth](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnmode.html#startwidth) property enables pie-like segments by defining angular widths.\n\n## Features and Capabilities\nThe chart includes interactive modifiers like [PolarZoomExtentsModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html) and [PolarPanModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpanmodifier.html). Segments are colored individually through metadata, and the chart supports real-time updates.\n\n## Integration and Best Practices\nThe vanilla JavaScript implementation shows proper async initialization and cleanup. For production, consider implementing dynamic data updates following [SciChart's performance guidelines](https://www.scichart.com/documentation/js/v4/MemoryBestPractices.html).",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Pie Chart** usinginhart.js, using the **PolarColumnRenderableSeries** with a **XyxDataSeries**.",
                title: "React Polar Pie Chart",
                pageTitle: "React Polar Pie Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Pie Chart - React\n\n## Overview\nThis React example creates a polar pie chart using SciChart's [SciChartReact](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartreact.html) component. It displays framework popularity data as colored segments in a polar coordinate system.\n\n## Technical Implementation\nThe chart uses [PolarColumnRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) with [MetadataPaletteProvider](https://www.scichart.com/documentation/js/v4/typedoc/classes/metadatapaletteprovider.html) for segment coloring. The React component follows best practices with async initialization via the `initChart` prop.\n\n## Features and Capabilities\nFeatures include interactive zoom/pan with [PolarMouseWheelZoomModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmousewheelzoommodifier.html) and dynamic theming. The implementation demonstrates React-specific patterns for chart lifecycle management.\n\n## Integration and Best Practices\nThe example shows proper integration with React's component model. For larger applications, consider the patterns in [SciChart's React integration guide](https://www.scichart.com/documentation/js/v4/TutorialReusableReactComponent.html).",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Pie Chart** usiiniChart.js, using the **PolarColumnRenderableSeries** with a **XyxDataSeries**.",
                title: "Angular Polar Pie Chart",
                pageTitle: "Angular Polar Pie Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Pie Chart - Angular\n\n## Overview\nThis Angular example demonstrates creating a polar pie chart using the [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular). The standalone component displays framework popularity data as colored segments.\n\n## Technical Implementation\nThe chart is initialized through the `drawExample` function passed to the Angular component. It uses [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) with [EPolarAxisMode](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolaraxismode.html) for polar coordinates.\n\n## Features and Capabilities\nThe implementation features segment coloring via metadata and includes interactive modifiers. The Angular component demonstrates proper property binding and standalone component usage.\n\n## Integration and Best Practices\nThe example follows Angular best practices for component integration. For production apps, refer to [SciChart's Angular performance guidelines](https://www.scichart.com/documentation/js/v4/MemoryBestPractices.html) and consider implementing OnDestroy for cleanup."
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
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
