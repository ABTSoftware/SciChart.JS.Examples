import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarUniformHeatmapUltrasound",
        id: "chart2D_polarCharts_PolarUniformHeatmapUltrasound",
        imagePath: "javascript-polar-uniform-heatmap-ultrasound-chart.jpg",
        description:
            "Creates a **JavaScript Polar Ultrasound Heatmap** in SciChart.js, by taking a 2D array of data points as hex values between **00** and **FF**, and displaying them in a polar heatmap.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Ultrasound Heatmap** in SciChart.js, by taking a 2D array of data points as hex values between **00** and **FF**, and displaying them in a polar heatmap.",
                title: "JavaScript Polar Ultrasound Heatmap",
                pageTitle: "JavaScript Polar Ultrasound Heatmap | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Polar Uniform Heatmap Ultrasound Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create a **Polar Uniform Heatmap** in JavaScript using SciChart.js, specifically designed for medical ultrasound visualization. The chart displays fetal ultrasound data at 31 weeks in a polar coordinate system, with intensity values mapped to a color gradient.\n\n### Technical Implementation\nThe implementation uses [PolarUniformHeatmapRenderableSeries](https://www.scichart.com/documentation/js/current/PolarUniformHeatmapRenderableSeries.html) to render heatmap data loaded from a CSV file. The chart features custom angular and radial axes configured with [PolarNumericAxis](https://www.scichart.com/documentation/js/current/PolarNumericAxis.html), limited to a 60-degree sector (Math.PI/3) starting at 240 degrees. Data is parsed from hexadecimal values in the CSV using a custom `parseCSV` function.\n\n### Features and Capabilities\nThe heatmap uses a transparent-to-white gradient defined by [HeatmapColorMap](https://www.scichart.com/documentation/js/current/HeatmapColorMap.html) with medical measurement annotations via [LineArrowAnnotation](https://www.scichart.com/documentation/js/current/LineArrowAnnotation.html). Interactive features include [PolarMouseWheelZoomModifier](https://www.scichart.com/documentation/js/current/PolarMouseWheelZoomModifier.html), [PolarZoomExtentsModifier](https://www.scichart.com/documentation/js/current/PolarZoomExtentsModifier.html), and [PolarPanModifier](https://www.scichart.com/documentation/js/current/PolarPanModifier.html) for navigation.",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Ultrasound Heatmap** in SciChart.js, by taking a 2D array of data points as hex values between **00** and **FF**, and displaying them in a polar heatmap.",
                title: "React Polar Ultrasound Heatmap",
                pageTitle: "React Polar Ultrasound Heatmap | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Polar Uniform Heatmap Ultrasound Chart - React\n\n### Overview\nThis React implementation showcases a polar heatmap for ultrasound visualization using SciChart.js. The example demonstrates seamless integration of medical imaging data within a React component through the [SciChartReact](https://www.scichart.com/documentation/js/current/SciChartReact.html) wrapper.\n\n### Technical Implementation\nThe chart is initialized via the `drawExample` function passed to `SciChartReact`'s `initChart` prop. The polar surface is configured with specialized axes and a [UniformHeatmapDataSeries](https://www.scichart.com/documentation/js/current/UniformHeatmapDataSeries.html) containing ultrasound intensity values. The React component handles the chart lifecycle automatically, including cleanup when unmounted.\n\n### Features and Capabilities\nThe example highlights medical-specific features including anatomical measurement annotations and a sector-limited polar view. The implementation leverages SciChart's [WebGL rendering](https://www.scichart.com/documentation/js/current/WebGLRendering.html) for high-performance visualization of large ultrasound datasets, with interactive navigation tools for detailed examination.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Ultrasound Heatmap** in SciChart.js, by taking a 2D array of data points as hex values between **00** and **FF**, and displaying them in a polar heatmap.",
                title: "Angular Polar Ultrasound Heatmap",
                pageTitle: "Angular Polar Ultrasound Heatmap | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Polar Uniform Heatmap Ultrasound Chart - Angular\n\n### Overview\nThis Angular example demonstrates integration of a polar ultrasound heatmap using the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package. The standalone component renders fetal ultrasound data in a 60-degree polar sector with measurement annotations.\n\n### Technical Implementation\nThe chart is initialized through the `drawExample` function bound to the `[initChart]` input of `ScichartAngularComponent`. The implementation uses [SciChartPolarSurface](https://www.scichart.com/documentation/js/current/SciChartPolarSurface.html) with custom-configured axes and a [PolarUniformHeatmapRenderableSeries](https://www.scichart.com/documentation/js/current/PolarUniformHeatmapRenderableSeries.html) for data visualization.\n\n### Features and Capabilities\nThe component showcases medical imaging capabilities including adjustable opacity and precise angular control via [EPolarAxisMode](https://www.scichart.com/documentation/js/current/EPolarAxisMode.html) settings. The example follows Angular best practices for chart lifecycle management and demonstrates effective use of standalone components for chart integration.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Ultrasound Heatmap documentation will help you to get started",
                linkTitle: "JavaScript Polar Ultrasound Heatmap Documentation",
            },
        ],
        path: "polar-uniform-heatmap-ultrasound",
        metaKeywords: "polar, heatmap, uniform, ultrasound, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarUniformHeatmapUltrasound",
        thumbnailImage: "javascript-polar-uniform-heatmap-ultrasound-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
