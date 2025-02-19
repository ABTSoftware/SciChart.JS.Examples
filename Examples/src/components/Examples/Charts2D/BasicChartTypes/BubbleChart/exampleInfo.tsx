import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DBasicChartTypesBubbleChart",
        imagePath: "javascript-bubble-chart.jpg",
        description:
            "Demonstrates how to create a **JavaScript Bubble Chart** This is a JavaScript Chart type which draws point-markers (Ellipse, Square, Triangle, Circle) at X,Y locations",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Bubble Chart** This is a JavaScript Chart type which draws point-markers (Ellipse, Square, Triangle, Circle) at X,Y locations",
                title: "JavaScript Bubble Chart",
                pageTitle: "JavaScript Bubble Chart | Online JavaScript Chart Examples",
                metaDescription:
                    "Create a high performance JavaScript Bubble Chart with Sci-Chart. Demo shows how to draw point-markers at X,Y locations. Get your free demo now.",
                markdownContent:
                    "# Bubble Chart with Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to create a high-performance **Bubble Chart** using vanilla JavaScript and SciChart.js. It combines a smooth spline line series with a dynamic bubble series where each bubble’s size is determined by a third data value. The implementation leverages asynchronous chart initialization and WebAssembly for optimal rendering performance.\n\n## Technical Implementation\nThe chart is initialized asynchronously using [SciChartSurface.create](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html), which loads the WebAssembly context for efficient GPU-accelerated rendering. Data for the chart is managed using an **XyDataSeries** for the spline line and an **XyzDataSeries** for the bubble series, a design choice that allows the bubble sizes to be scaled automatically based on the Z-values. Smooth visual transitions are applied using [SweepAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/sweepanimation.html), and each bubble is rendered with an **EllipsePointMarker** for a consistent appearance. Additionally, a custom palette provider is implemented following the [PaletteProvider API](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html) guidelines to conditionally style bubbles based on their data values. Interactive capabilities are enhanced through modifiers such as **ZoomPanModifier**, **MouseWheelZoomModifier**, and **ZoomExtentsModifier**, details of which can be found in the [Interactive Zooming and Panning](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) documentation.\n\n## Features and Capabilities\nKey features of this implementation include real-time data visualization, dynamic bubble sizing, and smooth startup animations. The chart offers advanced interactivity with zooming and panning tools, providing users the ability to explore detailed datasets easily. The custom palette provider further enhances the chart by enabling per-point color customization based on specific data conditions, adding an extra layer of data insight.\n\n## Integration and Best Practices\nThis example adheres to best practices for modular chart initialization in plain JavaScript by isolating the rendering logic in a dedicated function. Its asynchronous setup ensures that the heavy lifting, such as WebAssembly loading, does not block the main thread, promoting a responsive user interface. Developers looking to optimize performance and maintainability in their web applications can benefit from the techniques demonstrated here, as detailed in the [Performance Tips for JavaScript Charts](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation.\n",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **React Bubble Chart** This is a JavaScript Chart type which draws point-markers (Ellipse, Square, Triangle, Circle) at X,Y locations",
                title: "React Bubble Chart",
                pageTitle: "React Bubble Chart | Online JavaScript Chart Examples",
                metaDescription:
                    "Create a high performance React Bubble Chart with Sci-Chart. Demo shows how to draw point-markers at X,Y locations. Get your free demo now.",
                markdownContent:
                    "# React Bubble Chart\n\n## Overview\nThis example demonstrates how to create a high performance **React Bubble Chart** using SciChart.js. The chart visualizes data by combining a smooth spline line series with a dynamic bubble series, where each bubble's size is determined by its associated data value. Interactive zoom and pan features enhance the user experience.\n\n## Technical Implementation\nThe chart is initialized asynchronously through an initChart function that is passed to the [SciChartReact component](https://www.scichart.com/blog/react-charts-with-scichart-js/). In the implementation, a SciChartSurface is created with numeric X and Y axes. Data is structured using an XY data series for the spline line and an XYZ data series for the bubble chart, where the Z value defines the bubble size. Animations are applied using SweepAnimation, and a custom palette provider adjusts bubble colors conditionally. For further guidance, refer to [Tutorial 02 - Creating a Chart with scichart-react](https://www.scichart.com/documentation/js/current/Tutorial02CreatingChartsWithInitChart.html).\n\n## Features and Capabilities\nThe example showcases advanced features including conditionally styled bubble markers via a custom palette provider, smooth animated transitions, and interactive chart modifiers such as zooming, panning, and mouse wheel zoom. The bubble series leverages the XYZ data series to represent data intensity, a concept detailed in the [Bubble Series Type documentation](https://www.scichart.com/documentation/js/current/The%20Bubble%20Series%20Type.html).\n\n## Integration and Best Practices\nEmbracing React best practices, the example integrates SciChart.js through the SciChartReact component, ensuring a modular and maintainable approach. Asynchronous WebGL initialization optimizes performance while providing a responsive user interface. Developers are encouraged to explore further details on React integration and performance optimization techniques in the [SciChart React tutorials](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html).",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Angular Bubble Chart** This is a JavaScript Chart type which draws point-markers (Ellipse, Square, Triangle, Circle) at X,Y locations",
                title: "Angular Bubble Chart",
                pageTitle: "Angular Bubble Chart | Online JavaScript Chart Examples",
                metaDescription:
                    "Create a high performance Angular Bubble Chart with Sci-Chart. Demo shows how to draw point-markers at X,Y locations. Get your free demo now.",
                markdownContent:
                    "# Angular Bubble Chart\n\n## Overview\nThis example demonstrates how to create an **Angular Bubble Chart** using SciChart.js. The implementation employs the [scichart-angular](https://classic.yarnpkg.com/en/package/scichart-angular) component to seamlessly integrate advanced charting capabilities into an Angular application. The chart combines a smooth spline line series with a dynamic bubble series, where the bubble sizes are determined by associated data values.\n\n## Technical Implementation\nThe chart is initialized asynchronously using [SciChartSurface.create](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html), which sets up the numeric X and Y axes. Data is managed via an **XyDataSeries** for the spline line and an **XyzDataSeries** for the bubble chart, allowing bubbles to be scaled based on their Z-values. Interactive behaviors are added through modifiers such as ZoomPanModifier, MouseWheelZoomModifier, and ZoomExtentsModifier, as outlined in [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html). Animations are applied using SweepAnimation to create smooth drawing transitions. Additionally, a custom palette provider is implemented following the guidelines of the [IPointMarkerPaletteProvider API documentation](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmarkerpaletteprovider.html) and [The PaletteProvider API](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html) to conditionally style the bubble markers.\n\n## Features and Capabilities\nThe example showcases real-time data visualisation with dynamic bubble sizing, providing an interactive and engaging user experience. Key features include animated series updates, advanced interactive modifiers, and a customizable visual style through the use of a palette provider. Developers can see these capabilities in action by referencing the [Angular Bubble Chart Demo](https://demo.scichart.com/angular/bubble-chart).\n\n## Integration and Best Practices\nBy leveraging the [scichart-angular](https://classic.yarnpkg.com/en/package/scichart-angular) framework, this implementation adheres to Angular best practices for component design and asynchronous operations. The setup ensures optimal performance and maintainability, with a clear separation of chart initialization and UI integration. For further details on project configuration and efficient usage of SciChart.js in Angular, refer to [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html).",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Bubble%20Series%20Type.html",
                title: "This specific page in the JavaScript Bubble Chart documentation will help you to get started",
                linkTitle: "JavaScript Bubble Chart Documentation",
            },
        ],
        path: "bubble-chart",
        metaKeywords: "bubble, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/BubbleChart",
        thumbnailImage: "javascript-bubble-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const bubbleChartExampleInfo = createExampleInfo(metaData);
