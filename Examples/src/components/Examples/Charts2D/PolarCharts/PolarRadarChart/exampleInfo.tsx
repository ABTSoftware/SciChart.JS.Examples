import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarRadarChart",
        id: "chart2D_polarCharts_PolarRadarChart",
        imagePath: "javascript-polar-radar-chart.jpg",
        description:    
            "Creates a **JavaScript Polar Radar Chart**, also known as a **Spider Chart** using SciChart.js, which expresses the complexity, memory usage, stability, adaptability, scalability, and cache efficiency of two popular sorting algorithms",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Radar Chart**, also known as a **Spider Chart** using SciChart.js, which expresses the complexity, memory usage, stability, adaptability, scalability, and cache efficiency of two popular sorting algorithms",
                title: "JavaScript Polar Radar Chart",
                pageTitle: "JavaScript Polar Radar Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# JavaScript Polar Radar Chart\n\n## Overview\nThis example shows how to build a **Polar Radar Chart** in vanilla JavaScript with SciChart.js, comparing attributes like complexity and scalability of Quick Sort and Bubble Sort using polar series representations.\n\n## Technical Implementation\nThe chart uses async creation of SciChartPolarSurface, setting up PolarNumericAxis and PolarCategoryAxis with custom gridlines and labels. It employs PolarMountainRenderableSeries and PolarLineRenderableSeries backed by XyDataSeries, incorporating optimizations like native text and precise label formatting for efficient rendering, as explained in the [Polar Radar Chart guide](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-radar-chart/).\n\n## Features and Capabilities\nIt enables real-time data updates through series manipulation and offers custom features including fade animations, ellipse point markers, and modifiers like PolarMouseWheelZoomModifier for interactive zooming and panning.\n\n## Integration and Best Practices\nIn JavaScript, implement async initialization with a destructor for resource cleanup to prevent memory leaks. Adhere to modular configuration for scalable code, leveraging direct API calls for fine-tuned performance.",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Radar Chart**, also known as a **Spider Chart** using SciChart.js, which expresses the complexity, memory usage, stability, adaptability, scalability, and cache efficiency of two popular sorting algorithms",
                title: "React Polar Radar Chart",
                pageTitle: "React Polar Radar Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# React Polar Radar Chart\n\n## Overview\nThis example demonstrates how to create a high-performance **Polar Radar Chart** in React using SciChart.js, visualizing the complexity, memory usage, stability, adaptability, scalability, and cache efficiency of Quick Sort and Bubble Sort algorithms through polar series.\n\n## Technical Implementation\nThe chart is initialized asynchronously via the SciChartReact component, creating a SciChartPolarSurface with a custom theme. It configures a PolarNumericAxis for radial values and a PolarCategoryAxis for angular labels, adding PolarMountainRenderableSeries and PolarLineRenderableSeries with XyDataSeries for data visualization. Performance is optimized through WebGL rendering and native text usage, as detailed in the [Polar Radar Chart documentation](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-radar-chart/).\n\n## Features and Capabilities\nThe chart supports real-time updates via data series modifications and includes advanced customizations like fade animations, point markers, and interactive modifiers such as PolarPanModifier, PolarZoomExtentsModifier, and PolarLegendModifier for enhanced user interaction.\n\n## Integration and Best Practices\nIntegration in React uses the SciChartReact wrapper for seamless chart lifecycle management, ensuring proper initialization and cleanup. Follow best practices for async setup and theming to maintain performance in dynamic applications."
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Radar Chart**, also known as a **Spider Chart** using SciChart.js, which expresses the complexity, memory usage, stability, adaptability, scalability, and cache efficiency of two popular sorting algorithms",
                title: "Angular Polar Radar Chart",
                pageTitle: "Angular Polar Radar Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Radar Chart - Angular\n\n## Overview\nThis example shows how to integrate a Polar Radar Chart into an Angular standalone component using SciChart Angular. It displays comparative metrics of sorting algorithms on a radial framework.\n\n## Technical Implementation\nWithin the Angular AppComponent, drawExample is passed to <scichart-angular> for async initialization.`SciChartPolarSurface.create()`sets up the chart and WASM context. A PolarNumericAxis and PolarCategoryAxis configure radial polygons and angular categories, with start angles at 12 o’clock. Two XyDataSeries complete the radar loops and render as PolarMountainRenderableSeries and PolarLineRenderableSeries with fade-in animations. Modifiers (PolarPanModifier, PolarZoomExtentsModifier, PolarMouseWheelZoomModifier, PolarLegendModifier) enrich interactivity.Polar Radar Chart docs\n\n## Features and Capabilities\nUtilizes WebGL for high throughput, supports animated transitions, transparent fills, and interactive legend controls. Charts can be updated in real time by updating the data series.\n\n## Integration and Best Practices\nDeclare drawExample in the component class, and ensure sciChartSurface.delete() is invoked on component destruction. Use Angular’s standalone component pattern for modularity, and apply useNativeText to optimize label rendering on high-DPI devices.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Radar Chart documentation will help you to get started",
                linkTitle: "# Angular Polar Radar Chart\n\n## Overview\nThis example illustrates creating a **Polar Radar Chart** in Angular using SciChart.js, displaying comparative metrics of sorting algorithms such as Quick Sort and Bubble Sort in a polar format.\n\n## Technical Implementation\nThe chart is set up asynchronously in an Angular component, utilizing SciChartPolarSurface with themed styling. It adds specialized axes like PolarNumericAxis and PolarCategoryAxis, rendering data via PolarMountainRenderableSeries and PolarLineRenderableSeries with XyDataSeries, optimized for performance with dashed gridlines and native text, per the [Polar Radar Chart documentation](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-radar-chart/).\n\n## Features and Capabilities\nSupports real-time capabilities by updating data series and includes advanced options like animations, custom point markers, and modifiers including PolarLegendModifier for interactive legends and zooming.\n\n## Integration and Best Practices\nAngular integration employs the ScichartAngularComponent for declarative chart embedding, ensuring efficient async handling and cleanup. Use standalone components for modular design and optimize with proper theming for high-performance applications."
            },
        ],
        path: "polar-radar-chart",
        metaKeywords: "polar, radar, spider, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarRadarChart",
        thumbnailImage: "javascript-polar-radar-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
