import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DModifyAxisBehaviorDrawBehindAxes",
        imagePath: "javascript-draw-behind-axes.jpg",
        description:
            "Demonstrates how to create a **JavaScript Chart with transparent axes** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Chart with transparent axes** using SciChart.js, High Performance JavaScript Charts",
                title: "Draw JavaScript Chart Behind Axis",
                pageTitle: "Draw JavaScript Chart Behind Axis",
                metaDescription:
                    "Demonstrates the option of the transparent Axes customization on a JavaScript Chart using SciChart.js.",
                markdownContent:
                    "# Draw Behind Axes in Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to create a high performance chart with series rendered behind the axes using SciChart.js in a vanilla JavaScript environment. By setting the drawSeriesBehindAxis property to true, the chart achieves a unique transparent axis effect that enhances visual clarity and differentiates the data series from the axes.\n\n## Technical Implementation\nThe chart is initialized asynchronously using SciChartSurface.create as explained in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. In the drawExample module, the SciChartSurface is configured with a custom theme, title styling using Thickness.fromString for padding, and essential properties such as drawSeriesBehindAxis to display the series behind the numeric axes. The numeric axes themselves are configured with properties like visibleRange, growBy, and custom axisBorder settings as detailed in the [NumericAxis API Documentation for SciChart.js](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html). Two FastLineRenderableSeries are added to the chart using XyDataSeries and configured with the ELineDrawMode.PolyLine mode which is optimized for high performance rendering, as discussed in the [FastLineRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html) documentation. Additionally, interactive modifiers such as ZoomPanModifier and MouseWheelZoomModifier are included to enable dynamic zooming and panning capabilities as illustrated in the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) guide.\n\n## Features and Capabilities\nThe core feature of this example is the dynamic rendering customization controlled by the drawSeriesBehindAxis property, which allows series to be drawn either behind the axes for enhanced visual layering or clipped at the viewport edge. This technique provides both aesthetic appeal and functional clarity when interpreting data trends. The implementation also demonstrates efficient data handling through the use of XyDataSeries and ensures interactivity with built-in WebGL based zoom and pan functionality, taking advantage of SciChart.js performance optimizations as outlined in the [Performance Tips & Tricks | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n## Integration and Best Practices\nBy leveraging a standalone vanilla JavaScript implementation, the example illustrates how to maintain clear separation of concerns in chart initialization, axis configuration, and series rendering. This approach enables developers to easily integrate SciChart.js into existing JavaScript projects without reliance on additional frameworks or hooks. For further customization and to ensure optimal rendering performance, developers are encouraged to review the relevant documentation links provided above, which offer both conceptual and practical guidance on configuring SciChartSurface options, styling, and interactive behavior.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **React Chart with transparent axes** using SciChart.js, High Performance JavaScript Charts",
                title: "Draw React Chart Behind Axis",
                pageTitle: "Draw React Chart Behind Axis",
                metaDescription:
                    "Demonstrates the option of the transparent Axes customization on a React Chart using SciChart.js.",
                markdownContent:
                    "# Draw Behind Axes in React\n\n## Overview\nThis example demonstrates how to render a high performance SciChart.js chart in a React application with series drawn behind the axes. The chart illustrates transparent axes and the dynamic update of chart properties by toggling between drawing series behind the axes and clipping series at the viewport edge.\n\n## Technical Implementation\nThe implementation leverages the SciChartReact component for React integration, allowing developers to initialize the chart by passing an initChart callback function. The chart instance is accessed through React’s useRef hook, following best practices as described in [How to Make Charts in React from Scratch? - SciChart](https://www.scichart.com/blog/how-to-make-charts-in-react/). The onInit callback provides direct access to the SciChartSurface instance, enabling runtime customization of axes, borders, and series properties as detailed in [Tutorial 02 - Creating a Chart with scichart-react](https://www.scichart.com/documentation/js/current/Tutorial02CreatingChartsWithInitChart.html).\n\n## Features and Capabilities\nThe example showcases real-time update capabilities by toggling the drawSeriesBehindAxis property using Material UI’s Toggle Button Group ([Toggle Button React component - Material UI - MUI](https://mui.com/material-ui/react-toggle-button/?srsltid=AfmBOopRCXagePHMKiRWx3NRestEntRVsT0IG35pDCVt7EgsxbZmsHyP)). Advanced features such as dynamic updating of axis borders and chart titles are implemented, ensuring that changing the toggle state immediately reflects on the visual representation of the chart. Furthermore, developers can refer to the [Modify Axis Behavior - SciChart](https://www.scichart.com/examples/modify-axis-behavior-2d-charts-wpf-chart/) documentation for further customization options.\n\n## Integration and Best Practices\nIn this React-based implementation, the integration of SciChart.js is streamlined through the SciChartReact component that encapsulates complex WebGL rendering logic. This approach not only simplifies the React component lifecycle but also improves performance by minimizing unnecessary re-renders. Developers are encouraged to leverage [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) for additional insights into efficient component design. Overall, this example highlights best practices in runtime chart customization, dynamic state management using useState and useRef, and seamless UI integration with Material UI, which together provide a solid foundation for building advanced, performant charts in React.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Angular Chart with transparent axes** using SciChart.js, High Performance JavaScript Charts",
                title: "Draw Angular Chart Behind Axis",
                pageTitle: "Draw Angular Chart Behind Axis",
                metaDescription:
                    "Demonstrates the option of the transparent Axes customization on a Angular Chart using SciChart.js.",
                markdownContent:
                    "# Draw Behind Axes in Angular\n\n## Overview\nThis example demonstrates how to integrate SciChart.js into an Angular application using a standalone Angular component. The example shows how to render a high performance chart with series drawn behind the axes, and it provides interactive runtime updates to toggle between drawing series behind the axes or clipping them at the viewport edge.\n\n## Technical Implementation\nThe chart is initialized using an initChart callback which is passed to the scichart-angular component. This callback sets up the SciChartSurface with customized numeric axes, multiple FastLineRenderableSeries, and various chart modifiers such as ZoomPanModifier and MouseWheelZoomModifier. The implementation leverages the Angular integration of SciChart.js as demonstrated in the [scichart-angular - Yarn](https://www.npmjs.com/package/scichart-angular) package, and follows patterns similar to those described in [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html). Additionally, the example sets the drawSeriesBehindAxis property of the SciChartSurface to control whether series are rendered behind the axes, as detailed in the [SciChart.js Draw Behind Axes Documentation page](https://www.scichart.com/documentation/js/current/webframe.html#Axis%20Layout%20-%20Inside%20and%20Central%20Axis.html).\n\n## Features and Capabilities\nThe example provides real-time update capabilities through a toggle interface implemented with Material UI’s ToggleButtonGroup. Users can dynamically switch the rendering mode, which not only updates the chart title and the border properties of the axes, but also demonstrates advanced customization features such as axis formatting and series styling. The numeric axes are configured with properties including growBy, visibleRange, and custom axis borders, following guidelines similar to those found in the [Numeric Axis Documentation](https://www.scichart.com/documentation/js/current/NumericAxis.html).\n\n## Integration and Best Practices\nBy utilizing a standalone component design, the integration of SciChart.js is streamlined and optimized for Angular environments. The use of an initChart callback for initializing the chart enables clear separation of concerns, making it easier to manage complex chart configurations. Developers are encouraged to review the [I2DSurfaceOptions API Documentation](https://www.scichart.com/documentation/js/current/typedoc/interfaces/i2dsurfaceoptions.html) for further customization of chart properties and consult performance optimization techniques discussed in various [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) to ensure high performance rendering in real world applications.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Axis%20Layout%20-%20Inside%20and%20Central%20Axis.html",
                title: "SciChart.js Draw Behind Axes Documentation page",
                linkTitle: "Central Axis documentation",
            },
        ],
        path: "draw-behind-axes",
        metaKeywords: "multiple, axis, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ModifyAxisBehavior/DrawBehindAxes",
        thumbnailImage: "javascript-draw-behind-axes.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const drawBehindAxesExampleInfo = createExampleInfo(metaData);
