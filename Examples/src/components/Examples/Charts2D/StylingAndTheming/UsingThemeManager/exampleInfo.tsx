import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DStylingAndThemingUsingThemeManager",
        imagePath: "javascript-chart-themes.jpg",
        description: "Demonstrates the **light and dark theme** in SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates the **light and dark theme** in SciChart.js, High Performance JavaScript Charts",
                title: "Using Theme Manager in JavaScript Chart",
                pageTitle: "Using Theme Manager in JavaScript Chart",
                metaDescription:
                    "Demonstrates our Light and Dark Themes for JavaScript Charts with SciChart.js ThemeManager API",
                markdownContent:
                    "## Themeing JavaScript Charts with SciChart.js\n\n### Overview\nThis example demonstrates how to leverage SciChart.js in a JavaScript environment to initialize and render multiple chart surfaces, each with its own distinct theme. The implementation showcases the use of built-in themes such as Navy (`SciChartJsNavyTheme`), Light (`SciChartJSLightTheme`), and Dark (`SciChartJSDarkv2Theme`) alongside a `customTheme` created by merging properties from a built-in theme (see `IThemeProvider`) using the spread operator. This approach is ideal for developers looking to customize chart appearances while maintaining high performance in data visualization projects.\n\n### Technical Implementation\nThe code uses asynchronous programming with async/await to create multiple chart surfaces concurrently via `Promise.all()`. Each chart is initialized using the `SciChartSurface.create()` method, which accepts a theme object (for example, `SciChartJsNavyTheme`, `SciChartJSLightTheme`, or a custom theme) and returns a chart instance. Animated line series are rendered using the `EAnimationType.Sweep` animation option, and annotations (like `TextAnnotation` with relative coordinate modes) are used to add titles to the charts. For further details on initializing charts with specific themes, see [Chart Styling - ThemeManager API](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20ThemeManager%20API.html), and for asynchronous setup, refer to [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/).\n\n### Features and Capabilities\nThe example illustrates several advanced capabilities including animated line series, custom theming, and efficient resource management through proper clean-up of `SciChartSurface` instances. The custom theme creation leverages JavaScript’s spread operator to extend a built-in theme with new properties, an approach detailed in [Chart Styling - Creating a Custom Theme](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html). Additionally, performance optimization techniques, such as asynchronous surface creation and proper disposal of resources, are important for maintaining optimal performance; more information is available in [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n### Integration and Best Practices\nThis example integrates SciChart.js directly into a JavaScript application without relying on frameworks like React, managing DOM elements and resource disposal explicitly. Developers are encouraged to adopt best practices for memory and resource management, as outlined in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) documentation, to ensure that chart surfaces are properly disposed of when no longer needed.\n\nBy following these techniques, the example provides a comprehensive guide to creating themed, animated, and high-performance charts with SciChart.js using JavaScript.",
            },
            react: {
                subtitle:
                    "Demonstrates the **light and dark theme** in SciChart.js, High Performance JavaScript Charts",
                title: "Using Theme Manager in React Chart",
                pageTitle: "Using Theme Manager in React Chart",
                metaDescription:
                    "Demonstrates our Light and Dark Themes for React Charts with SciChart.js ThemeManager API",
                markdownContent:
                    '## Themeing React Charts with SciChart.js\n\n### Overview\nThis example, "Using Theme Manager in React Chart", demonstrates how to implement multiple themed charts within a React application using SciChart.js. The sample illustrates the application of built-in and custom themes to create visually distinct charts with animated line series rendered using WebGL for high performance.\n\n### Technical Implementation\nThe implementation leverages the `<SciChartReact/>` component to integrate SciChart surfaces within React. Each chart is asynchronously initialized by functions defined in the `drawExample` function. These functions set up `NumericAxis`, add a `TextAnnotation` for titles, and render multiple line series with sweep animations. The example uses React hooks such as `useState` for managing the chart initialization functions. This showcases [best practices for React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/) with SciChart.js.\n\n### Features and Capabilities\nThe example supports multiple themes including Navy (`SciChartJsNavyTheme`), Light (`SciChartJSLightTheme`), and Dark (`SciChartJSDarkv2Theme`) alongside a `customTheme` created by merging properties from a built-in theme (see `IThemeProvider`) using the spread operator. The `customTheme`, created by modifying the `SciChartJSLightTheme`, adjusts properties such as axis colors, grid lines, and stroke palettes. All themes support smooth animations on data series using the sweep animation type that provides a fluid visual experience. This approach aligns with [advanced theming techniques](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) outlined in SciChart documentation.\n\n### Integration and Best Practices\nKey integration points in the example include the use of tss-react/mui for styling and a `ChartGroupLoader` container for grouping multiple `<SciChartReact/>` components in a responsive grid layout. The charts are created asynchronously and cleaned up properly, demonstrating efficient asynchronous operations and cleanup in React environments. Developers can refer to the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) tutorial for more insights on performance optimization and [custom theming strategies](https://demo.scichart.com/react/chart-custom-themes) to tailor their implementations. Additionally, the example illustrates proper usage of React hooks and encourages the adoption of these best practices to build highly performant, data-rich web applications.\n\nFor further details on SciChart.js theming and its integration with React, visit the [SciChart.js ThemeManager Documentation](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20ThemeManager%20API.html).',
            },
            angular: {
                subtitle:
                    "Demonstrates the **light and dark theme** in SciChart.js, High Performance JavaScript Charts",
                title: "Using Theme Manager in Angular Chart",
                pageTitle: "Using Theme Manager in Angular Chart",
                metaDescription:
                    "Demonstrates our Light and Dark Themes for Angular Charts with SciChart.js ThemeManager API",
                markdownContent:
                    '## Themeing Angular Charts with SciChart.js\n\n### Overview\nThis Angular example, "Using Theme Manager in Angular Chart", demonstrates how to integrate SciChart.js ThemeManager API within an Angular application to render multiple themed charts. The example showcases four distinct themes – Navy (`SciChartJsNavyTheme`), Light (`SciChartJSLightTheme`), and Dark (`SciChartJSDarkv2Theme`) alongside a `customTheme` created by merging properties from a built-in theme (see `IThemeProvider`) – applied to high performance 2D charts that feature animated line series and numeric axes.\n\n### Technical Implementation\nThe implementation leverages asynchronous initialization patterns typically used in Angular. A central API function asynchronously creates a `SciChartSurface` by configuring numeric axes, adding text annotations, and rendering multiple animated line series using the sweep animation type. Custom theming is achieved by extending the base `SciChartJSLightTheme`, modifying properties such as axis colors, grid styles, and stroke palettes. This procedure follows the guidelines outlined in the [Creating a Custom Theme](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) documentation, and it aligns well with typical asynchronous patterns described in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide.\n\n### Features and Capabilities\nThe example provides robust theming capabilities by enabling the dynamic application of multiple themes. Each chart is constructed with three animated line series that benefit from the efficient WebGL rendering engine. The responsive layout ensures that the charts adapt to various screen sizes, offering a smooth user experience while maximizing performance as highlighted in the [Performance Tips](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation.\n\n### Integration and Best Practices\nThe Angular integration emphasizes proper lifecycle management, including efficient resource cleanup which is essential for maintaining performance in data-rich applications. Developers can refer to the [Angular Lifecycle Hooks](https://angular.io/guide/lifecycle-hooks) for guidance on initializing and disposing of components appropriately. The use of asynchronous chart creation functions not only improves performance but also aligns with modern Angular best practices for handling dynamic content. Additionally, the implementation makes use of responsive grid layouts to enhance the user interface, underscoring practical techniques for integrating advanced charting solutions in Angular.\n\nFor further details on SciChart.js theming, please see the [SciChart.js ThemeManager Documentation](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20ThemeManager%20API.html).',
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20ThemeManager%20API.html",
                title: "SciChart.js ThemeManager Documentation",
                linkTitle: "The ThemeManager documentation",
            },
        ],
        path: "chart-themes",
        metaKeywords: "theme, provider, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/StylingAndTheming/UsingThemeManager",
        thumbnailImage: "javascript-chart-themes.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const usingThemeManagerExampleInfo = createExampleInfo(metaData);
