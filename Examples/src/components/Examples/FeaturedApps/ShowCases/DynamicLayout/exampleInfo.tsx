import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "DynamicLayout",
        id: "featuredApps_showcases_dynamicLayout",
        imagePath: "javascript-dynamic-layout.jpg",
        description:
            "Demonstrates a custom modifier which can convert from single chart to grid layout and back using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates a custom modifier which can convert from single chart to grid layout and back using SciChart.js, High Performance JavaScript Charts",
                title: "Dynamic Layout Showcase",
                pageTitle: "Dynamic Layout Showcase",
                metaDescription:
                    "Demonstrates a custom modifier which can convert from single chart to grid layout and back.",
                markdownContent:
                    "## Dynamic Chart Layout in JavaScript with SciChart\n\n### Overview\nThis example demonstrates how to create a dynamic chart layout using SciChart.js with JavaScript. The primary purpose is to switch between a single chart view and a grid layout where each series is displayed as a sub-chart. The example includes a custom chart modifier that implements smooth animated transitions between layouts using the SciChart.js API.\n\n### Technical Implementation\nThe custom chart modifier (implemented in `GridLayoutModifier.ts`) watches a boolean property and, when toggled, calculates grid positions using relative coordinates. It uses the parent surface’s JSON definition (via the `.toJSON()` method) to configure sub-charts. The modifier leverages the `GenericAnimation` and the `DoubleAnimator.interpolate` method along with easing functions such as `easing.outCubic` to animate layout transitions smoothly. This approach allows each sub-chart to animate from a full-size position into its respective grid cell, and vice versa.\n\nDevelopers can refer to the [Custom Chart Modifier API](https://www.scichart.com/documentation/js/current/CustomChartModifierAPI.html) for additional details on extending chart behavior. Moreover, the example shows how to convert the overall chart state into a JSON configuration and then reapply it to each sub-chart, following best practices for dynamic layout updates.\n\n### Features and Capabilities\n- **Dynamic Layout Switching:** The modifier enables users to flip between a single chart view and a grid layout where each series appears in its sub-chart. This grid layout uses relative coordinate modes and configurable padding to create visually distinct sub-charts. For more details on customizing sub-chart positioning, see the [SubCharts Positioning](https://www.scichart.com/documentation/js/current/SubChartPositioning.html) documentation.\n\n- **Smooth Animations:** Utilizing [GenericAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/genericanimation.html) with interpolation via `DoubleAnimator`, the chart animates transitions between layouts. This provides a polished user experience during dynamic updates.\n\n- **Data Series Sharing:** The implementation shares dataSeries between the parent surface and sub-charts, ensuring that the underlying data remains synchronized while the series on the parent chart are hidden during grid mode. This approach is in line with best practices for managing dynamic series control in SciChart.js.\n\n### Integration and Best Practices\nEven though SciChart.js supports multiple frameworks, this example focuses on the JavaScript implementation. The example avoids using builder APIs or hooks and instead relies entirely on standard JavaScript techniques combined with SciChart.js’s powerful API. For further insights on dynamic layout techniques and real-time chart updates, refer to [Creating Re-usable Chart Groups with SubCharts](https://www.scichart.com/documentation/js/current/SubChartsWorkedExampleReusableChartGroups.html) the [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/) guide.\n\nAdditionally, the interpolation techniques used for animating numerical values are essential for creating smooth visual transitions. Developers interested in understanding how interpolation works in this context can review the documentation for [Animations API](https://www.scichart.com/documentation/js/current/Animations%20API.html) for more technical details.\n\nThis example serves as a solid reference for implementing dynamic grid layouts and animated transitions in real-time charts using SciChart.js with JavaScript.",
            },
            react: {
                subtitle:
                    "Demonstrates a custom modifier which can convert from single chart to grid layout and back using SciChart.js, High Performance JavaScript Charts",
                title: "Dynamic Layout Showcase",
                pageTitle: "Dynamic Layout Showcase",
                metaDescription:
                    "Demonstrates a custom modifier which can convert from single chart to grid layout and back.",
                markdownContent:
                    "## Dynamic Chart Layout in React\n\n### Overview\nThis example demonstrates a dynamic layout switcher built with SciChart.js and React. The implementation features a custom chart modifier that converts a single chart into a grid layout and back, providing an interactive charting experience with smooth animated transitions using the [SubCharts API](https://www.scichart.com/documentation/js/current/WhatIsTheSubChartsAPI.html) to create the grid layout with nested charts.\n\n### Technical Implementation\nThe example integrates the `<SciChartReact/>` component from the scichart-react package with React's context API using the `useContext` hook for state management. A custom modifier, implemented as `GridLayoutModifier` in TypeScript, is responsible for converting the parent chart into a series of sub-charts arranged in a grid. Animated layout transitions are managed with the `GenericAnimation` class, ensuring that sub-charts adjust their positions and styles smoothly. For further details on React integration with SciChart, refer to [React Charts with SciChart.js: Introducing \"SciChart React\"](https://www.scichart.com/blog/react-charts-with-scichart-js/).\n\n### Features and Capabilities\nKey features include dynamic switching between a single chart view and a grid layout that displays individual charts per data series. Each sub-chart is animated during the transition, enhancing the interactivity and user experience. The smooth animations are supported by advanced chart animation capabilities demonstrated in the [React Generic Animation](https://scichart.com/demo/react/generic-animation) demo, while the custom modifier follows guidelines from the [Custom Chart Modifier API](https://www.scichart.com/documentation/js/current/CustomChartModifierAPI.html).\n\n### Integration and Best Practices\nThe example integrates Material-UI's `ToggleButtonGroup` to provide an interactive chart toolbar, showcasing how to combine modern UI components with `<SciChartReact/>` for dynamic layout updates. React’s context API plays a crucial role in sharing the `SciChartSurface` state between components, a technique well explained in [Mastering React's useContext Hook: Simplifying State Management](https://medium.com/zestgeek/mastering-reacts-usecontext-hook-simplifying-state-management-65894e6dc431). Additionally, by enabling dynamic grid and single chart layouts, the implementation reflects modern performance optimization practices in rendering multiple animated sub-charts as illustrated in the [Dynamic Layout Showcase | SciChart.js Demo](https://scichart.com/demo/react/dynamic-layout). Please also refer to [the SubCharts API](https://www.scichart.com/documentation/js/current/WhatIsTheSubChartsAPI.html)",
            },
            angular: {
                subtitle:
                    "Demonstrates a custom modifier which can convert from single chart to grid layout and back using SciChart.js, High Performance JavaScript Charts",
                title: "Dynamic Layout Showcase",
                pageTitle: "Dynamic Layout Showcase",
                metaDescription:
                    "Demonstrates a custom modifier which can convert from single chart to grid layout and back.",
                markdownContent:
                    "## Dynamic Chart Layout in Angular\n\n### Overview\nThis example demonstrates a dynamic chart layout that converts a single chart into a grid layout and back. It leverages a custom chart modifier, the `GridLayoutModifier`, to animate transitions and reconfigure sub-charts for rich and interactive visualizations using SciChart.js in an Angular context.\n\n### Technical Implementation\nThe implementation uses the `GridLayoutModifier` to split the parent chart into multiple sub-charts based on the number of data series. Calculations determine the appropriate number of rows and columns, and each sub-chart is configured dynamically using a JSON representation of the chart (via `sciChartSurface.toJSON(true)`). This approach facilitates integration into Angular services for state management and dependency injection. Smooth animated transitions are implemented using `GenericAnimation`, while customization of the modifier follows the guidelines outlined in the [Custom Chart Modifier API](https://www.scichart.com/documentation/js/current/CustomChartModifierAPI.html).\n\n### Features and Capabilities\nThe example provides real-time dynamic layout switching between a single chart and a grid layout where each data series is displayed in its own animated sub-chart. The animations interpolate properties such as position, opacity, and borders to create a fluid user experience. Performance is optimized by disabling unnecessary grid lines and reusing data series across sub-charts, aligning with techniques described in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation.\n\n### Integration and Best Practices\nFor Angular applications, encapsulating chart initialization and state management within Angular components and services is essential. This approach leverages Angular's dependency injection system to share the SciChart surface state efficiently. Additionally, design patterns demonstrated in the [SubCharts re-usable Chart Groups](https://www.scichart.com/documentation/js/current/SubChartsWorkedExampleReusableChartGroups.html) documentation can be adapted to Angular to ensure responsive chart configurations and optimal rendering performance. For further insights into implementing animated transitions in an Angular context, developers are encouraged to review the techniques in the [Angular Style Animation](https://scichart.com/demo/angular/style-animation) demo.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "dynamic-layout",
        metaKeywords: "subcharts, layout, demo, chart, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "FeaturedApps/ShowCases/DynamicLayout",
        thumbnailImage: "javascript-dynamic-layout.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

export const dynamicLayoutExampleInfo = createExampleInfo(metaData);
export default dynamicLayoutExampleInfo;
