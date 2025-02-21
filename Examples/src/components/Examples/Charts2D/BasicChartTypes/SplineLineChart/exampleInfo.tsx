import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DBasicChartTypesSplineLineChart",
        imagePath: "javascript-spline-smoothed-line-chart.jpg",
        description:
            "Demonstrates how to create a **JavaScript Spline Line Chart** using SciChart.js, our feature-rich JavaScript Chart Library",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Spline Line Chart** using SciChart.js, our feature-rich JavaScript Chart Library",
                title: "JavaScript Spline Line Chart",
                pageTitle: "JavaScript Spline Line Chart | JavaScript Chart Library",
                metaDescription:
                    "Discover how to create a JavaScript Spline Line Chart with SciChart. Demo includes algorithm for smoother lines. Get your free trial now.",
                markdownContent:
                    "# Vanilla JavaScript Spline Line Chart\n\n## Overview\nThis example demonstrates how to implement a high-performance spline line chart using SciChart.js in a pure vanilla JavaScript environment. The chart displays three distinct series: a fast line series for original data, a spline line series with smooth interpolation, and an advanced Bezier-transformed series with interactive curvature adjustments.\n\n## Technical Implementation\nThe implementation begins by initializing a SciChartSurface via an asynchronous factory method, as detailed in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. Numeric X and Y axes are added, with axis scaling managed through properties such as growBy; further specifics are available in the [NumericAxis API Documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html). Data is provided to the chart using XyDataSeries structures, and series animations are implemented via [WaveAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/waveanimation.html) to achieve dynamic transitions. The example further enhances the visual output by using the SplineLineRenderableSeries with adjustable interpolation points for smooth curve rendering and employs a Bezier render data transform, which allows for runtime adjustments of the smoothing curvature through interactive axis marker annotations—more details can be found in the [Spline Line Chart Documentation](https://www.scichart.com/documentation/js/current/The%20Spline%20(Smoothed)%20Line%20Series%20Type.html).\n\n## Features and Capabilities\nThis example not only illustrates real-time data updates and animated transitions but also demonstrates advanced customization capabilities. Interactive modifiers such as zooming, panning, and mouse wheel zooming are integrated to enhance user experience, with additional insights available in the [ZoomPanModifier API Documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html). Custom point markers, created using the EllipsePointMarker class, add clarity to data points while maintaining consistent visual styling.\n\n## Integration and Best Practices\nFollowing best practices, the chart’s resources are properly managed by disposing of the SciChartSurface with its delete() method, ensuring efficient WebGL context management and avoiding memory leaks; these strategies are outlined in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) documentation. This vanilla JavaScript implementation serves as a robust example of how to integrate SciChart.js into a project while leveraging its advanced charting features and interactive capabilities for a seamless data visualization experience.\n",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **React Spline Line Chart** using SciChart.js, our feature-rich JavaScript Chart Library",
                title: "React Spline Line Chart",
                pageTitle: "React Spline Line Chart | JavaScript Chart Library",
                metaDescription:
                    "Discover how to create a React Spline Line Chart with SciChart. Demo includes algorithm for smoother lines. Get your free trial now.",
                markdownContent:
                    "# React Spline Line Chart\n\n## Overview\nThe React Spline Line Chart example demonstrates how to integrate SciChart.js into a React application using the SciChartReact component. The example showcases a traditional fast line series, a smoothed spline line series, and an enhanced Bezier line series. It leverages advanced features such as animated series with WaveAnimation, dynamic data transforms for smoothing using BezierRenderDataTransform, and interactive annotations to adjust chart parameters in real-time.\n\n## Technical Implementation\nThe chart creation logic is encapsulated in a dedicated function called drawExample which is initialized via the SciChartReact component in the index.tsx file. This function creates a SciChartSurface, adds numeric axes and multiple renderable series, and configures interactive modifiers such as zoom, pan, and mouse wheel zoom. The implementation makes use of SciChart.js components such as FastLineRenderableSeries and SplineLineRenderableSeries, along with custom point markers (EllipsePointMarker) and animation (WaveAnimation). Developers can learn more about these features in the [Spline Line Chart Documentation](https://www.scichart.com/documentation/js/current/The%20Spline%20(Smoothed)%20Line%20Series%20Type.html) and the [Tutorial for setting up SciChart React](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html).\n\n## Features and Capabilities\nThe example not only compares a standard fast line series against a spline line series but also demonstrates advanced smoothing techniques with BezierRenderDataTransform. Users can interactively modify the curvature of the Bezier smoothing via an axis marker annotation. Each series is animated using WaveAnimation, which provides a dynamic transition effect. Custom point markers, enhanced series customization, and interactive modifiers enrich the visualization and allow for real-time updates. This level of customization is further detailed in the [JavaScript Spline Line Chart Demo](https://demo.scichart.com/javascript/spline-line-chart).\n\n## Integration and Best Practices\nIntegration with React is achieved through the SciChartReact component, which simplifies the creation, update, and cleanup processes for the SciChartSurface within the React lifecycle. This approach follows [best practices for React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/) and ensures optimal performance by efficiently managing WebGL contexts. Additionally, developers are encouraged to explore interactive modifiers like ZoomPanModifier and MouseWheelZoomModifier for improved user interaction along with annotation features for dynamic chart adjustments. The example emphasizes performance optimization techniques that are crucial for rendering multiple series in a React environment, as outlined in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Angular Spline Line Chart** using SciChart.js, our feature-rich JavaScript Chart Library",
                title: "Angular Spline Line Chart",
                pageTitle: "Angular Spline Line Chart | JavaScript Chart Library",
                metaDescription:
                    "Discover how to create a Angular Spline Line Chart with SciChart. Demo includes algorithm for smoother lines. Get your free trial now.",
                markdownContent:
                    "# Angular Spline Line Chart\n\n## Overview\nThis example demonstrates how to create an **Angular Spline Line Chart** using SciChart.js. It leverages the standalone Angular component from the [scichart-angular package](https://www.npmjs.com/package/scichart-angular) to integrate a high-performance WebGL chart into an Angular application. The chart displays a standard fast line series alongside a smoothed spline line series, and includes an advanced Bezier line series with interactive annotations for dynamic curvature adjustment.\n\n## Technical Implementation\nThe implementation initializes a SciChartSurface by binding the chart creation function via Angular’s property binding ([initChart]) on the scichart-angular component. It sets up numeric X and Y axes and adds three renderable series: a fast line series with animated point markers using **WaveAnimation**, a spline line series with customizable smoothing controlled by the number of interpolation points, and a Bezier-transformed series that enables runtime curvature adjustments through an interactive axis marker annotation. For further technical details on setting up a SciChart.js project, refer to the [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html).\n\n## Features and Capabilities\nThis example showcases real-time updates and advanced data visualization capabilities. It includes smooth animated transitions for each series, interactive chart modifiers such as zooming, panning, and mouse wheel zooming, and a legend for enhanced data interpretation. The integration of advanced smoothing techniques using a custom Bezier render data transform along with dynamic annotation-driven interactions exemplifies the level of customization available in SciChart.js, as further detailed in the [Advanced JavaScript Chart and Graph Library features](https://www.scichart.com/javascript-chart-features/).\n\n## Integration and Best Practices\nThe example follows best practices for Angular integration by utilizing standalone components and data binding for clean and maintainable code. The SciChartSurface lifecycle is effectively managed within the Angular context, ensuring optimal performance and resource cleanup in line with recommendations from the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guide. Developers can also explore best practices for Angular standalone components in the [Explore Angular Standalone Components: Complete Guide](https://terralogic.com/angular-standalone-components/) to maximize performance and maintainability in their own projects.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Spline%20(Smoothed)%20Line%20Series%20Type.html",
                title: "Spline Line Chart",
                linkTitle: "JavaScript Spline Line Chart Documentation",
            },
        ],
        path: "spline-line-chart",
        metaKeywords: "spline, smoothed, line, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/SplineLineChart",
        thumbnailImage: "javascript-spline-smoothed-line-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const splineLineChartExampleInfo = createExampleInfo(metaData);
