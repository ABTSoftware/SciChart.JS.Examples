import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DTooltipsAndHittestHitTestAPI",
        imagePath: "javascript-chart-hit-test-on-click.jpg",
        description:
            "Demonstrates how to add **Hit-Test on click behavior** to a chart using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to add **Hit-Test on click behavior** to a chart using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Chart Hit-Test API",
                pageTitle: "JavaScript Chart Hit-Test API",
                metaDescription:
                    "Demonstrates Hit-Testing a JavaScript Chart - point and click on the chart and get feedback about what data-points were clicked",
                markdownContent:
                    '# Hit Test API Example (Vanilla JavaScript)\n\n## Overview\nThis example demonstrates the advanced hit testing functionality provided by SciChart.js using vanilla JavaScript. It enables users to click on the chart to evaluate different hit test methods such as **hitTestDataPoint**, **hitTestXSlice**, and **hitTest**. The example provides interactive visual feedback via dynamic annotations and smooth animations.\n\n## Technical Implementation\nThe implementation begins by configuring a [SciChartSurface](https://www.scichart.com/documentation/js/current/SciChartSurface.html) with a custom theme and title settings. It installs a mouse event listener directly onto the canvas to capture click events. The event coordinates are adjusted using [DpiHelper.PIXEL_RATIO](https://www.scichart.com/documentation/js/current/typedoc/classes/dpihelper.html) to ensure correct mapping on high DPI and retina displays. Based on the chosen hit test method, the corresponding method from the [RenderableSeries Hit-Test API](https://www.scichart.com/documentation/js/current/Hit-Test%20API.html) is invoked to determine if the mouse position targets a data point or line segment.\n\n## Features and Capabilities\n- **Interactive Hit Testing**: Switchable methods allow testing with different approaches such as "hitTestDataPoint", which finds the nearest data point, or "hitTestXSlice", which focuses on vertical slices of the chart.\n- **Visual Feedback and Annotations**: The example makes use of dynamic annotations like [TextAnnotation](https://www.scichart.com/documentation/js/current/TextAnnotation.html) and [LineAnnotation](https://www.scichart.com/documentation/js/current/LineAnnotation.html) to visually indicate hit test results, highlighting successes with messages like **Hit!** or **miss...**.\n- **Smooth Animations**: Animations are implemented using [FadeAnimation](https://www.scichart.com/documentation/js/current/Generic%20Animations.html) and [GenericAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/genericanimation.html) to ensure that annotations appear and disappear smoothly.\n\n## Integration and Best Practices\nThis example follows best practices for integrating event listeners with the SciChartSurface canvas in vanilla JavaScript. It carefully converts mouse event coordinates to chart coordinates, a technique detailed in guides on [mouse event coordinate conversion](https://support.scichart.com/support/solutions/articles/101000519458-how-to-add-mouse-interactions-to-scichart). Additionally, performance is optimized by choosing the most appropriate hit test method depending on the scenario, a concept further explored in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation.\n\nOverall, the example provides a comprehensive demonstration of SciChart.js capabilities for interactive and animated hit testing—delivering high-performance charting without relying on additional frameworks. Developers looking to build similar interactive charts in vanilla JavaScript can refer to the linked documentation for deeper technical insights.',
            },
            react: {
                subtitle:
                    "Demonstrates how to add **Hit-Test on click behavior** to a chart using SciChart.js, High Performance JavaScript Charts",
                title: "React Chart Hit-Test API",
                pageTitle: "React Chart Hit-Test API",
                metaDescription:
                    "Demonstrates Hit-Testing a React Chart - point and click on the chart and get feedback about what data-points were clicked",
                markdownContent:
                    '# Hit Test API (React)\n\n## Overview\nThis example demonstrates the implementation of hit test functionality in a SciChart.js chart within a React application. It allows users to interact with the chart by clicking on it and switching between different hit-test methods, such as hit-testing the nearest data point, using an x-slice, or testing the series body.\n\n## Technical Implementation\nThe example uses the SciChartReact component from SciChart-React to initialize a SciChartSurface and efficiently render high-performance charts. The hit-test logic is implemented through custom event listeners attached to the SciChartSurface canvas, which process mouse click events. Depending on the selected mode, methods like hitTestDataPoint, hitTestXSlice, or hitTest are invoked. This operation utilizes key components such as the DpiHelper for HiDPI support, as described in the [SciChart.js Hit-Test API documentation](https://www.scichart.com/documentation/js/current/Hit-Test%20API.html) and [DpiHelper API](https://www.scichart.com/documentation/js/current/typedoc/classes/dpihelper.html).\n\n## Features and Capabilities\nThe example offers real-time updates and visual feedback based on the hit-test results. It dynamically renders annotations and animated scatter points to indicate whether a hit was successful or not. Furthermore, the integration of Material-UI ToggleButtonGroup enables users to switch between different hit testing methods, ensuring the chart remains interactive and responsive. This advanced handling is complemented by animated transitions, demonstrating effective use of the [GenericAnimation](https://www.scichart.com/documentation/js/current/Generic%20Animations.html) and [FadeAnimation](https://www.scichart.com/documentation/js/current/Generic%20Animations.html) features available in SciChart.js.\n\n## Integration and Best Practices\nThe React integration adheres to best practices by using hooks such as useState and useRef for state management and control updates in the chart component. This helps maintain efficient cleanup and memory management as new annotations and renderable series are dynamically added and removed. Developers interested in best practices for integrating SciChart.js with React can refer to resources like the [React Charts with SciChart.js: Introducing "SciChart React"](https://www.scichart.com/blog/react-charts-with-scichart-js/) post and [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).',
            },
            angular: {
                subtitle:
                    "Demonstrates how to add **Hit-Test on click behavior** to a chart using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Chart Hit-Test API",
                pageTitle: "Angular Chart Hit-Test API",
                metaDescription:
                    "Demonstrates Hit-Testing a Angular Chart - point and click on the chart and get feedback about what data-points were clicked",
                markdownContent:
                    "# Angular Chart Hit Test API\n\n## Overview\nThis example demonstrates how to incorporate hit testing functionality in SciChart.js charts within an Angular application. It allows users to interact with the chart by clicking on it to trigger various hit test methods such as hit-testing the nearest data point (first by X then by Y), testing within a vertical X-slice, or hit-testing the entire series body. The implementation leverages the high-performance capabilities of SciChart.js to deliver responsive, real-time visual feedback. For more details on the hit test API, see the [SciChart.js Hit-Test API documentation](https://www.scichart.com/documentation/js/current/Hit-Test%20API.html).\n\n## Technical Implementation\nThe core functionality is implemented in TypeScript where mouse click events are captured on the SciChartSurface canvas. The example calculates the precise hit coordinates by taking into account high DPI support via the DpiHelper, ensuring accurate mapping of mouse coordinates to the chart’s data space. Depending on the selected hit test method, the appropriate API function (such as hitTestDataPoint, hitTestXSlice, or hitTest) is invoked to determine the closest data point or series segment. The resulting HitTestInfo is then visualised using temporary scatter series and animated annotations. This approach is crucial for performance and is detailed in the [Retina Support and Browser Zoom](https://www.scichart.com/documentation/js/current/Retina%20Support%20and%20Browser%20Zoom.html) documentation.\n\n## Features and Capabilities\nThe example is designed to handle dynamic updates and offers multiple methods for hit testing, providing real-time visual feedback that highlights whether a hit was successful or not. Interactive elements such as toggle buttons allow users to switch between hit test methods on the fly, demonstrating advanced features such as animated annotations and fade-out transitions. These performance optimisations are supported by the chart’s efficient rendering engine as outlined in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) section of the documentation.\n\n## Integration and Best Practices\nIntegrating SciChart.js within an Angular application, the example follows Angular best practices by handling event subscriptions and state updates in a controlled manner. The use of Angular services and component state management ensures that changes to the hit test method are properly handled and that resources such as annotations and renderable series are cleaned up after use. Developers can refer to the [Angular Lifecycle Hooks](https://angular.io/guide/lifecycle-hooks) for more insights on managing component lifecycles when integrating external libraries, and best practices for event handling can be observed as discussed in various community resources such as [Angular2 Unit Test Mouse Events on Stack Overflow](https://stackoverflow.com/questions/45326847/angular2-unit-test-mouse-events). Additionally, the design emphasizes the separation of concerns by having a dedicated visualization function for hit test results, promoting maintainability and modularity.\n\nBy following these techniques, the example serves as an excellent reference for developers looking to integrate sophisticated hit test capabilities in Angular applications using SciChart.js, ensuring a blend of performance, interactivity, and adherence to Angular best practices.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Hit-Test%20API.html",
                title: "SciChart.js Hit-Test API documentation",
                linkTitle: "Hit-Test API documentation",
            },
        ],
        path: "chart-hit-test-on-click",
        metaKeywords: "hit, test, api, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/TooltipsAndHittest/HitTestAPI",
        thumbnailImage: "javascript-chart-hit-test-on-click.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const hitTestApiExampleInfo = createExampleInfo(metaData);
