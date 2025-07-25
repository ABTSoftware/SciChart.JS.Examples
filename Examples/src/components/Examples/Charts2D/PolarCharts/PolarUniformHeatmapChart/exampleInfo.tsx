import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarUniformHeatmapChart",
        id: "chart2D_polarCharts_PolarUniformHeatmapChart",
        imagePath: "javascript-polar-uniform-heatmap-chart.jpg",
        description:
            "Creates a **JavaScript Polar Uniform Heatmap Chart** using SciChart's powerful JavaScript Charts and its range of features.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Uniform Heatmap Chart** using SciChart's powerful JavaScript Charts and its range of features.",
                title: "JavaScript Polar Uniform Heatmap Chart",
                pageTitle: "JavaScript Polar Uniform Heatmap Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# JavaScript Polar Uniform Heatmap Chart\n\n## Overview\nThis example demonstrates a **Polar Uniform Heatmap Chart** in JavaScript using SciChart.js, visualizing intensity data in a circular coordinate system. The implementation features a heatmap with radial and angular axes, color gradients, and interactive modifiers.\n\n## Technical Implementation\nThe chart is created using `SciChartPolarSurface.create()` with a `PolarUniformHeatmapRenderableSeries` for heatmap rendering. Data is generated via `generateHeatmapData()` which produces a 2D array of normalized values. The heatmap uses a `HeatmapColorMap` with custom gradient stops for color representation. Polar axes are configured with `PolarNumericAxis` for radial (`EPolarAxisMode.Radial`) and angular (`EPolarAxisMode.Angular`) dimensions.\n\n## Features and Capabilities\nKey features include interactive modifiers like `PolarPanModifier`, `PolarZoomExtentsModifier`, and `PolarMouseWheelZoomModifier` for navigation. The heatmap legend is rendered separately using `HeatmapLegend.create()`, sharing the same color map for consistency. The example showcases performance-optimized rendering of 300x500 data points.\n\n## Integration and Best Practices\nThe implementation follows async initialization patterns for WebAssembly loading. Best practices include shared color mapping between chart and legend, and proper axis configuration for polar coordinates. For advanced usage, refer to the [Polar Uniform Heatmap documentation](https://www.scichart.com/documentation/js/current/PolarUniformHeatmapSeriesType.html).",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Uniform Heatmap Chart** using SciChart's powerful JavaScript Charts and its range of features.",
                title: "React Polar Uniform Heatmap Chart",
                pageTitle: "React Polar Uniform Heatmap Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# React Polar Uniform Heatmap Chart\n\n## Overview\nThis React example showcases a **Polar Uniform Heatmap Chart** using SciChart.js, integrating the heatmap visualization into a React component. The implementation combines the polar heatmap with a standalone legend component.\n\n## Technical Implementation\nThe chart is rendered using `SciChartReact` component with `initChart={drawExample}` prop. The heatmap surface and legend are separate instances, both using the shared `COLOR_MAP` for consistent coloring. The main chart features polar axes configured with `innerRadius` and `totalAngle` properties to control the circular layout.\n\n## Features and Capabilities\nThe example demonstrates React-specific integration patterns while maintaining all JavaScript features: heatmap rendering, polar coordinate system, and interactive modifiers. The legend is positioned absolutely within the component layout, showcasing React's composition capabilities.\n\n## Integration and Best Practices\nThe implementation uses SciChart's React wrapper (`scichart-react`) for seamless integration. Best practices include proper component structure for chart and legend separation, and responsive styling. For React-specific guidance, see [SciChart React documentation](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Uniform Heatmap Chart** using SciChart's powerful JavaScript Charts and its range of features.",
                title: "Angular Polar Uniform Heatmap Chart",
                pageTitle: "Angular Polar Uniform Heatmap Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Angular Polar Uniform Heatmap Chart\n\n## Overview\nThis Angular example demonstrates a **Polar Uniform Heatmap Chart** using SciChart.js in a standalone component. The implementation follows Angular's component-based architecture while leveraging SciChart's high-performance rendering.\n\n## Technical Implementation\nThe chart is integrated via `ScichartAngularComponent` with `[initChart]` input bound to the `drawExample` function. The Angular component maintains a clean template structure while delegating chart creation to SciChart's API. The example could be extended to include the heatmap legend as a separate component.\n\n## Features and Capabilities\nThe Angular implementation preserves all core features: polar heatmap rendering, color mapping, and interactive modifiers. The standalone component approach demonstrates modern Angular practices while utilizing SciChart's WebAssembly-powered rendering.\n\n## Integration and Best Practices\nThe example showcases Angular-SciChart integration using the `scichart-angular` package. Best practices include proper component initialization and potential use of Angular services for data generation. For Angular-specific setup, refer to [SciChart Angular documentation](https://www.scichart.com/documentation/js/current/angular-chart-examples.html).",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Uniform Heatmap Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Uniform Heatmap Chart Documentation",
            },
        ],
        path: "polar-uniform-heatmap-chart",
        metaKeywords: "polar, heatmap, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarUniformHeatmapChart",
        thumbnailImage: "javascript-polar-uniform-heatmap-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
