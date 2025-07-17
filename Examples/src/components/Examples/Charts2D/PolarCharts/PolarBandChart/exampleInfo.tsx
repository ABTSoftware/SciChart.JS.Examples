import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarBandChart",
        id: "chart2D_polarCharts_PolarBandChart",
        imagePath: "javascript-polar-band-chart.jpg",
        description: "Creates a **JavaScript Polar Band Chart** using SciChart.js",
        tips: [],
        frameworks: {
            javascript: {
                subtitle: "Create a **JavaScript Polar Band Chart** using SciChart.js",
                title: "JavaScript Polar Band Chart",
                pageTitle: "JavaScript Polar Band Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "JavaScript Polar Band Chart demo by SciChart supports gradient fill and paletteproviders for more custom coloring options. Get your free demo now.",
                markdownContent:
                    "# SciChart.js Polar Band Chart Example Overview\n\nThis example demonstrates how to create a Polar Band Chart using SciChart.js, showcasing two distinct PolarBandRenderableSeries instances: one with linear interpolation and another without. It highlights the configuration of polar axes and interactive chart modifiers.\n\n## Key SciChart.js Features Demonstrated\n\n*   Polar Chart Surface: Initialization of a SciChartPolarSurface for rendering polar charts.\n*   Polar Numeric Axes:\n    *   Configuration of a Radial Y-Axis (EPolarAxisMode.Radial) with a custom innerRadius to create a donut-like appearance.\n    *   Configuration of an Angular X-Axis (EPolarAxisMode.Angular) with custom startAngle and flippedCoordinates for clockwise rotation.\n    *   Demonstrates polarLabelMode for label orientation.\n*   Polar Band Renderable Series:\n    *   Creation of two PolarBandRenderableSeries using XyyDataSeries which requires X, Y, and Y1 values to define the upper and lower bounds of the band.\n    *   Illustrates the difference between interpolated (interpolateLine: true) and non-interpolated (interpolateLine: false) band series, affecting how points are connected.\n*   Chart Modifiers: Integration of interactive modifiers for enhanced user experience:\n    *   Polar Pan Modifier: Enables dragging to pan the chart.\n    *   Polar Zoom Extents Modifier: Allows zooming to the full data extents.\n    *   Polar Mouse Wheel Zoom Modifier: Provides zooming functionality via the mouse wheel.\n    *   Polar Legend Modifier: Displays a chart legend, allowing users to toggle the visibility of individual series.\n*   Animations: Application of SweepAnimation to the renderable series for a dynamic chart loading effect.\n\n## Relevant Documentation\n\nFor more information on Polar Charts and PolarBandRenderableSeries, refer to the official SciChart.js documentation: Polar Line Renderable Series",
            },
            react: {
                subtitle: "Create a **React Polar Band Chart** using SciChart.js",
                title: "React Polar Band Chart",
                pageTitle: "React Polar Band Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "React Polar Band Chart demo by SciChart supports gradient fill and paletteproviders for more custom coloring options. Get your free demo now.",
                markdownContent:
                    "# SciChart.js Polar Band Chart Example Overview\n\nThis example demonstrates how to create a Polar Band Chart using SciChart.js, showcasing two distinct PolarBandRenderableSeries instances: one with linear interpolation and another without. It highlights the configuration of polar axes and interactive chart modifiers.\n\n## Key SciChart.js Features Demonstrated\n\n*   Polar Chart Surface: Initialization of a SciChartPolarSurface for rendering polar charts.\n*   Polar Numeric Axes:\n    *   Configuration of a Radial Y-Axis (EPolarAxisMode.Radial) with a custom innerRadius to create a donut-like appearance.\n    *   Configuration of an Angular X-Axis (EPolarAxisMode.Angular) with custom startAngle and flippedCoordinates for clockwise rotation.\n    *   Demonstrates polarLabelMode for label orientation.\n*   Polar Band Renderable Series:\n    *   Creation of two PolarBandRenderableSeries using XyyDataSeries which requires X, Y, and Y1 values to define the upper and lower bounds of the band.\n    *   Illustrates the difference between interpolated (interpolateLine: true) and non-interpolated (interpolateLine: false) band series, affecting how points are connected.\n*   Chart Modifiers: Integration of interactive modifiers for enhanced user experience:\n    *   Polar Pan Modifier: Enables dragging to pan the chart.\n    *   Polar Zoom Extents Modifier: Allows zooming to the full data extents.\n    *   Polar Mouse Wheel Zoom Modifier: Provides zooming functionality via the mouse wheel.\n    *   Polar Legend Modifier: Displays a chart legend, allowing users to toggle the visibility of individual series.\n*   Animations: Application of SweepAnimation to the renderable series for a dynamic chart loading effect.\n\n## Relevant Documentation\n\nFor more information on Polar Charts and PolarBandRenderableSeries, refer to the official SciChart.js documentation: Polar Line Renderable Series",
            },
            angular: {
                subtitle: "Create a **Angular Polar Band Chart** using SciChart.js",
                title: "Angular Polar Band Chart",
                pageTitle: "Angular Polar Band Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Angular Polar Band Chart demo by SciChart supports gradient fill and paletteproviders for more custom coloring options. Get your free demo now.",
                markdownContent:
                    "# SciChart.js Polar Band Chart Example Overview\n\nThis example demonstrates how to create a Polar Band Chart using SciChart.js, showcasing two distinct PolarBandRenderableSeries instances: one with linear interpolation and another without. It highlights the configuration of polar axes and interactive chart modifiers.\n\n## Key SciChart.js Features Demonstrated\n\n*   Polar Chart Surface: Initialization of a SciChartPolarSurface for rendering polar charts.\n*   Polar Numeric Axes:\n    *   Configuration of a Radial Y-Axis (EPolarAxisMode.Radial) with a custom innerRadius to create a donut-like appearance.\n    *   Configuration of an Angular X-Axis (EPolarAxisMode.Angular) with custom startAngle and flippedCoordinates for clockwise rotation.\n    *   Demonstrates polarLabelMode for label orientation.\n*   Polar Band Renderable Series:\n    *   Creation of two PolarBandRenderableSeries using XyyDataSeries which requires X, Y, and Y1 values to define the upper and lower bounds of the band.\n    *   Illustrates the difference between interpolated (interpolateLine: true) and non-interpolated (interpolateLine: false) band series, affecting how points are connected.\n*   Chart Modifiers: Integration of interactive modifiers for enhanced user experience:\n    *   Polar Pan Modifier: Enables dragging to pan the chart.\n    *   Polar Zoom Extents Modifier: Allows zooming to the full data extents.\n    *   Polar Mouse Wheel Zoom Modifier: Provides zooming functionality via the mouse wheel.\n    *   Polar Legend Modifier: Displays a chart legend, allowing users to toggle the visibility of individual series.\n*   Animations: Application of SweepAnimation to the renderable series for a dynamic chart loading effect.\n\n## Relevant Documentation\n\nFor more information on Polar Charts and PolarBandRenderableSeries, refer to the official SciChart.js documentation: Polar Line Renderable Series",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Band Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Band Chart Documentation",
            },
        ],
        path: "polar-band-chart",
        metaKeywords: "polar, band, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarBandChart",
        thumbnailImage: "javascript-polar-band-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
