import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DModifyAxisBehaviorVerticalCharts",
        imagePath: "javascript-vertical-charts.jpg",
        description:
            "Demonstrates how to create a **rotated JavaScript Chart with vertical X-Axis** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **rotated JavaScript Chart with vertical X-Axis** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Vertical Charts",
                pageTitle: "JavaScript Vertical Charts",
                metaDescription:
                    "Demonstrates alignment of Axis to create a vertical chart with SciChart.js - JavaScript Charts.",
                markdownContent:
                    "# Vertical Charts Example - Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to create a rotated chart in vanilla JavaScript using SciChart.js. The chart is rendered vertically by configuring the X-Axis alignment to **Left** and the Y-Axis alignment to **Bottom**. This approach enables users to visualize data in a vertical orientation, offering a unique perspective for data analysis.\n\n## Technical Implementation\nThe implementation initializes a SciChartSurface asynchronously using the WebAssembly context provided by SciChart.js. Numeric axes are configured with specific alignment properties to rotate the chart, as detailed in the [Vertical Charts (Rotate, Transpose Axis) - SciChart](https://www.scichart.com/documentation/js/current/Axis%20Alignment%20-%20Create%20a%20Vertical%20Chart.html) guide. Data for the chart is generated using a random walk generator and visualized via a FastLineRenderableSeries which ensures high performance. Interactive features are added with modifiers such as ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier, following guidelines from the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).\n\n## Features and Capabilities\nThe chart takes advantage of SciChart.js capabilities such as real-time updates and advanced customizations. The use of the FastLineRenderableSeries significantly optimizes performance, a topic further explained in the [Performance Tips & Tricks | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) resource. Additionally, custom point markers like the EllipsePointMarker provide visual enhancements, while native text annotations offer user guidance directly on the chart.\n\n## Integration and Best Practices\nThis implementation is tailored for vanilla JavaScript environments, illustrating best practices for asynchronous initialization and resource management. The example includes a cleanup function to properly dispose of the SciChartSurface, ensuring effective memory management as described in the [Memory Best Practices | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html). Developers looking to integrate SciChart.js in vanilla JavaScript can refer to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide to further streamline their development process. By following these guidelines, this example encapsulates critical aspects of performance optimization, interactivity setup, and architectural best practices in vanilla JavaScript.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **rotated React Chart with vertical X-Axis** using SciChart.js, High Performance JavaScript Charts",
                title: "React Vertical Charts",
                pageTitle: "React Vertical Charts",
                metaDescription:
                    "Demonstrates alignment of Axis to create a vertical chart with SciChart.js - JavaScript Charts.",
                markdownContent:
                    "# React Vertical Charts\n\n## Overview\nThis example demonstrates how to create a rotated vertical chart using SciChart.js in a React application. By aligning the X axis to the left and the Y axis to the bottom, the chart is effectively rendered vertically. The example leverages the high performance rendering of SciChart.js along with a functional React component via the SciChartReact component.\n\n## Technical Implementation\nThe chart is initialized in a React component that renders a SciChartReact element with an initChart prop. This prop passes a function responsible for creating a SciChartSurface, setting up numeric axes with vertical alignment, and rendering a fast line series with a custom point marker. The implementation also includes a native text annotation to provide user guidance. Advanced interactivity is achieved by adding several modifiers for zooming and panning, as detailed in the [Tutorial on Adding Zooming and Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).\n\n## Features and Capabilities\nThe example optimizes performance through the use of FastLineRenderableSeries which ensures smooth rendering even with dynamic data. Capabilities such as real-time interactivity are enhanced by integrating user interaction modifiers like ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier. Detailed performance optimization guidance is available in the [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) article.\n\n## Integration and Best Practices\nIntegration in React is streamlined by using the SciChartReact component, as explained in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/). Vertical axis alignment is achieved by setting the axis alignment properties, a technique well documented in the [Vertical Charts (Rotate, Transpose Axis) - SciChart](https://www.scichart.com/documentation/js/current/Axis%20Alignment%20-%20Create%20a%20Vertical%20Chart.html) guide. Additionally, the example demonstrates best practices for initializing and configuring charts in React using the initChart prop, as outlined in the [Tutorial on Setting up a project with scichart-react](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html).\n",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **rotated Angular Chart with vertical X-Axis** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Vertical Charts",
                pageTitle: "Angular Vertical Charts",
                metaDescription:
                    "Demonstrates alignment of Axis to create a vertical chart with SciChart.js - JavaScript Charts.",
                markdownContent:
                    "# Angular Vertical Charts Example\n\n## Overview\nThis Angular example demonstrates how to create a **rotated chart** using SciChart.js. By setting the X-Axis alignment to **Left** and the Y-Axis alignment to **Bottom**, the chart is rendered vertically. This high performance example leverages Angular's standalone components, as described in the [Getting started with standalone components - Angular](https://angular.io/guide/standalone-components) documentation, and uses the [scichart-angular](https://classic.yarnpkg.com/en/package/scichart-angular) package for seamless integration.\n\n## Technical Implementation\nThe implementation utilizes a standalone Angular component that renders the SciChartAngularComponent with an initChart callback. Within this callback, a SciChartSurface is created along with numeric axes configured for a vertical display. Generated data from a random walk series is visualized with a FastLineRenderableSeries and enhanced by an EllipsePointMarker. A NativeTextAnnotation provides guidance, while interactive modifiers such as ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier add dynamic chart interactivity. Detailed axis configuration is explained in the [Vertical Charts (Rotate, Transpose Axis) - SciChart](https://www.scichart.com/documentation/js/current/Axis%20Alignment%20-%20Create%20a%20Vertical%20Chart.html) guide and interactive behaviors are outlined in the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) documentation.\n\n## Features and Capabilities\nThis example showcases **real-time update capabilities** and interactive chart features powered by SciChart.js. The chart’s configuration supports dynamic data rendering, advanced interactivity including zooming and panning, and enhanced visual styling with custom point markers and annotations, ensuring a robust and responsive data visualization experience.\n\n## Integration and Best Practices\nAngular integration is achieved by encapsulating the chart creation logic within a standalone component and initializing the chart via the initChart property. This pattern aligns with modern Angular practices for component-based design. Developers can further explore performance optimization and integration techniques by referring to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide and best practices in [Angular integration techniques](https://angular.io/guide/standalone-components). Memory management is efficiently handled through the lifecycle of the SciChartSurface, ensuring resources are properly disposed when no longer needed.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Axis%20Alignment%20-%20Create%20a%20Vertical%20Chart.html",
                title: "The specific page for the SciChart.js API documentation for Vertical Charts will help you to get started",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "vertical-charts",
        metaKeywords: "vertical, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ModifyAxisBehavior/VerticalCharts",
        thumbnailImage: "javascript-vertical-charts.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const verticalChartsExampleInfo = createExampleInfo(metaData);
