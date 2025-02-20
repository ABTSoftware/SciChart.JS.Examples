import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsShowCasesPopulationPyramid",
        imagePath: "javascript-population-pyramid.jpg",
        description:
            "Population Pyramid of Europe and Africa using SciChart.js High Performance JavaScript Charts. This also demonstrates the use of DataLabelLayoutManager to Modify the positions of data labels from different series to prevent overlap",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Population Pyramid of Europe and Africa using SciChart.js High Performance JavaScript Charts. This also demonstrates the use of DataLabelLayoutManager to Modify the positions of data labels from different series to prevent overlap",
                title: "JavaScript Population Pyramid",
                pageTitle: "JavaScript Population Pyramid",
                metaDescription: "Population Pyramid of Europe and Africa",
                markdownContent:
                    "# Population Pyramid Example in Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to create a high-performance population pyramid chart using SciChart.js in Vanilla JavaScript. It visualizes demographic data for regions such as Africa and Europe using stacked column charts with synchronized axes, all implemented without any additional frameworks.\n\n## Technical Implementation\nThe chart is initialized by creating a SciChartSurface along with a WebAssembly context (wasmContext), leveraging techniques described in the [Creating a new SciChartSurface and loading Wasm](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) documentation. NumericAxis instances are configured with custom properties and their visible ranges are synchronized as detailed in the [Axis Ranging - Setting and Getting VisibleRange](https://www.scichart.com/documentation/js/current/Axis%20Ranging%20-%20Setting%20and%20Getting%20VisibleRange.html) guide. A custom data label layout manager is implemented to avoid overlapping labels, following strategies explained in [Data Label Positioning](https://www.scichart.com/documentation/js/current/DataLabelPositioning.html). The population pyramid is constructed by combining StackedColumnRenderableSeries into a StackedColumnCollection, as described in [The Stacked Column Series Type](https://www.scichart.com/documentation/js/current/The%20Stacked%20Column%20Series%20Type.html). Additionally, smooth series transitions are achieved using WaveAnimation, as covered by the [Animations API](https://www.scichart.com/documentation/js/current/Animations%20API.html).\n\n## Features and Capabilities\nThe example supports interactive zooming and panning through modifiers such as ZoomExtentsModifier and MouseWheelZoomModifier, providing an engaging user experience noted in [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html). It also includes advanced capabilities like selective legend configuration and the synchronization of dual axes for male and female data series within the stacked column chart.\n\n## Integration and Best Practices\nIn this Vanilla JavaScript implementation, resource cleanup is handled by calling sciChartSurface.delete(), following best practices outlined in [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html). Although SciChart.js can be integrated with frameworks like Angular and React, this example focuses solely on Vanilla JavaScript, offering a lightweight yet powerful solution for building real-time, high-performance charts with extensive customization options.",
            },
            react: {
                subtitle:
                    "Population Pyramid of Europe and Africa using SciChart.js High Performance JavaScript Charts. This also demonstrates the use of DataLabelLayoutManager to Modify the positions of data labels from different series to prevent overlap",
                title: "React Population Pyramid",
                pageTitle: "React Population Pyramid",
                metaDescription: "Population Pyramid of Europe and Africa",
                markdownContent:
                    "# React Population Pyramid Example\n\n## Overview\nThis example demonstrates a population pyramid chart implemented in a React application using SciChart.js. It visualizes demographic data for Europe and Africa, showcasing a highly interactive chart with animated stacked column series and custom data label management to avoid overlapping. The project leverages the [SciChart React component](https://www.scichart.com/blog/react-charts-with-scichart-js/) for seamless integration with React.\n\n## Technical Implementation\nThe implementation uses the SciChart.js API in a React environment by invoking the drawExample function via the SciChartReact component. The code initializes a chart with two y-axes for male and female data and a single x-axis representing age groups. The example also implements a custom data label layout manager to modify overlapping label positions, in line with techniques outlined in the [Data Label Positioning documentation](https://www.scichart.com/documentation/js/current/DataLabelPositioning.html). Additionally, the chart introduces a wave animation effect on the stacked column series, which is explained in the [JavaScript Stacked Column Chart](https://www.scichart.com/example/javascript-chart/javascript-stacked-column-chart/) example.\n\n## Features and Capabilities\nThe example features real-time animation for both male and female data series with stacked column collections. It employs dynamic legends, zooming, and panning modifiers such as ZoomExtentsModifier and MouseWheelZoomModifier to enhance user interactivity. The axes are synchronized so that any changes in the visible range of one are reflected in the other, following best practices described in the [Synchronizing Multiple Charts documentation](https://www.scichart.com/documentation/js/current/Synchronizing%20Multiple%20Charts.html). This ensures a coherent presentation of comparative data across the two populations.\n\n## Integration and Best Practices\nThe React integration leverages the SciChartReact component to instantiate and render the chart within a React component, ensuring maintainability and separation of concerns. Developers can refer to the [Creating a React Dashboard with SciChart.js, SciChart-React and DeepSeek R1](https://www.scichart.com/blog/creating-a-react-dashboard-with-scichart-js-scichart-react-and-deepseek-r1/) for further insights on integrating SciChart.js in React applications. The example also highlights performance optimization techniques through the efficient use of WebGL and a custom data label layout manager to handle overlapping labels without sacrificing performance. Additionally, theming is applied using a custom appTheme, the approach for which is documented in the [Using Theme Manager - JavaScript Chart - SciChart](https://www.scichart.com/example/javascript-chart/javascript-chart-themes/) article.\n",
            },
            angular: {
                subtitle:
                    "Population Pyramid of Europe and Africa using SciChart.js High Performance JavaScript Charts. This also demonstrates the use of DataLabelLayoutManager to Modify the positions of data labels from different series to prevent overlap",
                title: "Angular Population Pyramid",
                pageTitle: "Angular Population Pyramid",
                metaDescription: "Population Pyramid of Europe and Africa",
                markdownContent:
                    "# Angular Population Pyramid Example\n\n## Overview\nThis Angular example demonstrates a highly interactive Population Pyramid chart using SciChart.js. The chart visualizes demographic data for Europe and Africa by displaying separate stacked column series for male and female populations. A custom data label layout manager is implemented to prevent overlapping labels, ensuring that the demographic data remains clear and easily interpretable.\n\n## Technical Implementation\nThe chart is initialized within an Angular standalone component by leveraging the SciChartAngularComponent. The example creates an X axis for age groups and two Y axes that represent male and female populations respectively. These Y axes are synchronized using Angular event subscriptions, a process detailed in the [Synchronizing Multiple Charts](https://www.scichart.com/documentation/js/current/Synchronizing%20Multiple%20Charts.html) documentation. A custom data label layout manager is used to dynamically adjust label positions to avoid overlap; this approach aligns with the best practices outlined in the [Data Label Positioning](https://www.scichart.com/documentation/js/current/DataLabelPositioning.html) guide. Additionally, the integration of wave animations for the stacked column series is optimized for performance, as described in the [Animations API](https://www.scichart.com/documentation/js/current/Animations%20API.html).\n\n## Features and Capabilities\nThe example offers robust interactive capabilities including real-time zooming via both the MouseWheelZoomModifier and ZoomExtentsModifier, as outlined in the [MouseWheelZoomModifier](https://www.scichart.com/documentation/js/current/MouseWheelZoomModifier.html) documentation. The dual Y-axis design ensures that male and female data are presented in a comparative manner while keeping both axes in sync. The implementation also supports dynamic legends with selective series inclusion, reinforcing clarity and user control over the displayed data.\n\n## Integration and Best Practices\nThis implementation follows Angular best practices by using property binding to initialize the chart in a standalone component, as referenced in the [Getting started with standalone components](https://angular.io/guide/standalone-components) documentation and the [scichart-angular - Yarn](https://www.npmjs.com/package/scichart-angular) package. By combining efficient WebGL rendering with custom layout mechanisms, developers can achieve high-performance charts even with complex datasets. The approach not only adheres to modern Angular integration patterns but also demonstrates efficient techniques for managing interactive chart features and ensuring consistent, synchronized axes. Detailed examples of dual-axis configuration and event-driven synchronization can be found in the [Synchronizing Multiple Charts](https://www.scichart.com/documentation/js/current/Synchronizing%20Multiple%20Charts.html) documentation.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "population-pyramid",
        metaKeywords:
            "population, react, column, stacked, animation, labels, engineering, pyramid, europe, africa, javascript, chart, webgl, canvas",
        onWebsite: false,
        filepath: "FeaturedApps/ShowCases/PopulationPyramid",
        thumbnailImage: "javascript-population-pyramid.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const populationPyramidExampleInfo = createExampleInfo(metaData);
