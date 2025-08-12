import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PhasorDiagramChart",
        id: "featuredApps_scientificCharts_PhasorDiagramChart",
        imagePath: "javascript-phasor-diagram-chart.jpg",
        description:
            "Demonstrates how to create a Phasor Diagram chart in SciChart.js, combining a Cartesian surface containing fifo Mountains, with a Polar subsurface with annotations depicting vectors.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Phasor Diagram** chart in SciChart.js, combining a Cartesian surface containing fifo Mountains, with a Polar subsurface with annotations depicting vectors.",
                title: "Phasor Diagram Chart",
                pageTitle: "Interactive Phasor Diagram chart",
                metaDescription: null,
                markdownContent:
                    "# Phasor Diagram Chart - JavaScript\n\n## Overview\nThis example demonstrates a **Phasor Diagram Chart** using SciChart.js in JavaScript, showcasing vector visualization with polar and cartesian coordinates. The implementation combines a polar chart for vector representation with cartesian projections for real-time analysis.\n\n## Technical Implementation\nThe chart uses [SciChartSurface.create()](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) to initialize the surface with WebAssembly. It features a [PolarNumericAxis](https://www.scichart.com/documentation/js/current/PolarNumericAxis.html) for angular/radial coordinates and [NumericAxis](https://www.scichart.com/documentation/js/current/NumericAxis.html) for cartesian projections. Vector annotations like [LineArrowAnnotation](https://www.scichart.com/documentation/js/current/LineArrowAnnotation.html) are made editable via [EDraggingGripPoint](https://www.scichart.com/documentation/js/current/EDraggingGripPoint.html).\n\n## Features and Capabilities\nThe example demonstrates real-time vector addition with animated rotation and cartesian projections. Key features include interactive vector manipulation, polar-to-cartesian coordinate conversion, and synchronized updates between polar and cartesian views. The [SplineMountainRenderableSeries](https://www.scichart.com/documentation/js/current/SplineMountainRenderableSeries.html) visualizes vector projections with FIFO buffering.\n\n## Integration and Best Practices\nThe implementation follows JavaScript best practices with async initialization and proper resource cleanup. Performance is optimized through WebGL rendering and efficient data updates using [XyDataSeries](https://www.scichart.com/documentation/js/current/XyDataSeries.html) with FIFO capacity.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **React Phasor Diagram** chart in SciChart.js, combining a Cartesian surface containing fifo Mountains, with a Polar subsurface with annotations depicting vectors.",
                title: "Phasor Diagram Chart",
                pageTitle: "Interactive Phasor Diagram chart",
                metaDescription: null,
                markdownContent:
                    "# Phasor Diagram Chart - React\n\n## Overview\nThis React example demonstrates a **Phasor Diagram Chart** using SciChart.js, visualizing vector operations through polar and cartesian coordinates. The implementation leverages the [SciChartReact](https://www.scichart.com/documentation/js/current/SciChartReact.html) component for seamless React integration.\n\n## Technical Implementation\nThe chart initializes via `<SciChartReact initChart={drawExample}>`, where `drawExample` creates a dual-view surface with [SciChartPolarSubSurface](https://www.scichart.com/documentation/js/current/SciChartPolarSubSurface.html). React hooks manage animation state, while [LineArrowAnnotation](https://www.scichart.com/documentation/js/current/LineArrowAnnotation.html) handles interactive vectors with [dragDelta subscriptions](https://www.scichart.com/documentation/js/current/AnnotationDragDelta.html).\n\n## Features and Capabilities\nThe component features real-time vector addition with animated rotation, synchronized polar/cartesian views, and interactive vector editing. The [RadianLabelProvider](https://www.scichart.com/documentation/js/current/RadianLabelProvider.html) formats polar axes, while [EAutoRange](https://www.scichart.com/documentation/js/current/EAutoRange.html) ensures proper scaling.\n\n## Integration and Best Practices\nThe example demonstrates React best practices with state management for animation controls and proper cleanup via `SciChartReact` lifecycle. Performance is optimized through WebGL rendering and efficient data updates using React's state hooks.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create an **Angular Phasor Diagram** chart in SciChart.js, combining a Cartesian surface containing fifo Mountains, with a Polar subsurface with annotations depicting vectors.",
                title: "Phasor Diagram Chart",
                pageTitle: "Interactive Phasor Diagram chart",
                metaDescription: null,
                markdownContent:
                    "# Phasor Diagram Chart - Angular\n\n## Overview\nThis Angular example showcases a **Phasor Diagram Chart** using SciChart.js, demonstrating vector visualization through polar coordinates and cartesian projections. The implementation uses the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package for Angular integration.\n\n## Technical Implementation\nThe chart is initialized via `drawExample()` in the component template using `<scichart-angular>`. The polar chart is created with [SciChartPolarSubSurface](https://www.scichart.com/documentation/js/current/SciChartPolarSubSurface.html), while vector interactions are handled through [LineArrowAnnotation](https://www.scichart.com/documentation/js/current/LineArrowAnnotation.html) with [EDraggingGripPoint](https://www.scichart.com/documentation/js/current/EDraggingGripPoint.html) configurations.\n\n## Features and Capabilities\nThe example features real-time vector operations with polar-to-cartesian projections, animated vector rotation, and interactive editing. The [PolarArcAnnotation](https://www.scichart.com/documentation/js/current/PolarArcAnnotation.html) visualizes angles between vectors, while [SplineMountainRenderableSeries](https://www.scichart.com/documentation/js/current/SplineMountainRenderableSeries.html) shows cartesian projections.\n\n## Integration and Best Practices\nThe implementation follows Angular best practices with standalone components and proper resource cleanup. Performance is optimized through WebAssembly rendering and efficient data updates using Angular's change detection strategy.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "Scichart.js Documentation",
            },
        ],
        path: "phasor-diagram-chart",
        metaKeywords: "polar, phasor, chart, interactive, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "FeaturedApps/ScientificCharts/PhasorDiagramChart",
        thumbnailImage: "javascript-phasor-diagram-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export const phasorDiagramChartExampleInfo = createExampleInfo(metaData);
export default phasorDiagramChartExampleInfo;
