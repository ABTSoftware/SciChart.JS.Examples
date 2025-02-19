import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DChartAnnotationsDragHorizontalThreshold",
        imagePath: "javascript-chart-drag-horizontal-threshold.jpg",
        description:
            "Demonstrates interaction by dragging vertical and horizontal line thresholds on a mountain chart. As the thresholds move, the chart colour updates. The vertical mountain fill is done using a separate renderableSeries and a dataFilter which reshapes the data to draw only the portion above the threshold.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates interaction by dragging vertical and horizontal line thresholds on a mountain chart. As the thresholds move, the chart colour updates. The vertical mountain fill is done using a separate renderableSeries and a dataFilter which reshapes the data to draw only the portion above the threshold.",
                title: "JavaScript Mountain Chart Draggable Thresholds",
                pageTitle: "JavaScript Mountain Chart Draggable Thresholds",
                metaDescription:
                    "Demonstrates how to add draggable thresholds which change the series color in the chart in SciChart.js",
                markdownContent:
                    "# Drag Horizontal Threshold - Vanilla JavaScript\n\n## Overview\nThis example demonstrates an interactive mountain chart built using **vanilla JavaScript** and SciChart.js. It highlights dynamic interaction by using draggable annotations that adjust both visual thresholds and underlying data filters.\n\n## Technical Implementation\nThe chart is initialized asynchronously via SciChartSurface.create, which sets up the WebAssembly context for high-performance rendering. A custom data filter, implemented as the **ThresholdFilter** class by extending XyFilterBase, processes the data to display only regions above a specified threshold. Additionally, the custom palette provider (**XThresholdPaletteProvider**) overrides fill colors based on x-values relative to a defined threshold. These components work together to update chart visuals in real time as users interact with the graphic elements. For more details, refer to the [Creating a Custom Filter](https://www.scichart.com/documentation/js/current/Creating%20a%20Custom%20Filter.html) and [The PaletteProvider API](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html) documentation.\n\n## Features and Capabilities\nThis example includes several advanced features: \n- **Interactive Draggable Annotations:** Both horizontal and vertical lines are made draggable using onDrag event handlers, enabling dynamic modification of threshold values. See [Editable Annotations](https://www.scichart.com/documentation/js/current/EditableAnnotations.html) for additional insights.\n- **Dynamic Chart Updates:** As the user moves the threshold lines, the chart updates immediately using SciChartSurface.invalidateElement, ensuring real-time feedback.\n- **High-Performance Rendering:** Utilizing FastMountainRenderableSeries along with WebGL capabilities and optimized data handling ensures smooth performance even with high data volumes. Developers can explore related techniques in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) guide.\n\n## Integration and Best Practices\nThis implementation follows best practices for integrating SciChart.js in a vanilla JavaScript environment. The separation of data filtering and visual elements into bespoke components (i.e., ThresholdFilter and XThresholdPaletteProvider) allows for modular, maintainable code. Developers are encouraged to refer to [Creating a new SciChartSurface and loading Wasm](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) for more context on initializing the chart with WebAssembly and to leverage interactive modifiers such as ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier for an enhanced user experience.\n",
            },
            react: {
                subtitle:
                    "Demonstrates interaction by dragging vertical and horizontal line thresholds on a mountain chart. As the thresholds move, the chart colour updates. The vertical mountain fill is done using a separate renderableSeries and a dataFilter which reshapes the data to draw only the portion above the threshold.",
                title: "React Mountain Chart Draggable Thresholds",
                pageTitle: "React Mountain Chart Draggable Thresholds",
                metaDescription:
                    "Demonstrates how to add draggable thresholds which change the series color in the chart in SciChart.js",
                markdownContent:
                    "# Draggable Horizontal Threshold - React\n\n## Overview\nThis example demonstrates how to integrate SciChart.js with a React application to create an interactive mountain chart with draggable horizontal and vertical thresholds. The chart updates in real time as users drag the annotations and dynamically modifies the underlying data through a custom data filter, showcasing a powerful blend of interactivity and performance.\n\n## Technical Implementation\nThe React integration is achieved using the SciChartReact component with an initChart callback that draws the chart using SciChartSurface. Interactive annotations are implemented with onDrag event handlers to update both the chart visuals and the custom data filtering logic provided by the ThresholdFilter class. This filter, which extends SciChart's XyFilterBase, ensures that only data above a dynamically adjustable threshold is displayed. For more detail on integrating React with SciChart.js, refer to the [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) guide. Additionally, the custom filtering logic follows the practices described in [Creating a Custom Filter](https://www.scichart.com/documentation/js/current/Creating%20a%20Custom%20Filter.html).\n\n## Features and Capabilities\nThe example offers real-time chart updates through interactive draggable annotations that adjust horizontal and vertical thresholds. A custom palette provider dynamically modifies the fill color of chart regions based on the defined thresholds, using techniques explained in [The PaletteProvider API](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html). High-performance rendering is ensured through the use of FastMountainRenderableSeries, which optimizes the rendering of large datasets.\n\n## Integration and Best Practices\nThis implementation exemplifies best practices for integrating SciChart.js within a React environment by leveraging core React concepts along with the powerful SciChartReact component. The use of interactive modifiers like ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier further enhances the user experience by enabling efficient zooming and panning. Developers can explore advanced React integration and performance optimization techniques in the SciChart ecosystem by consulting the [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) article and the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) documentation.\n\nThis example serves as a comprehensive reference for developers looking to create scalable, interactive charting applications in React using SciChart.js.",
            },
            angular: {
                subtitle:
                    "Demonstrates interaction by dragging vertical and horizontal line thresholds on a mountain chart. As the thresholds move, the chart colour updates. The vertical mountain fill is done using a separate renderableSeries and a dataFilter which reshapes the data to draw only the portion above the threshold.",
                title: "Angular Mountain Chart Draggable Thresholds",
                pageTitle: "Angular Mountain Chart Draggable Thresholds",
                metaDescription:
                    "Demonstrates how to add draggable thresholds which change the series color in the chart in SciChart.js",
                markdownContent:
                    "# Angular Mountain Chart Draggable Thresholds\n\n## Overview\n\nThis example demonstrates interaction by dragging vertical and horizontal line thresholds on a mountain chart. Moving these thresholds dynamically updates the series colors on the chart, showcasing advanced interactivity in an Angular application using the SciChartAngularComponent.\n\n## Technical Implementation\n\nThe chart is initialized via an initChart callback passed to the SciChartAngularComponent. A custom data filter, implemented as the **ThresholdFilter** class, processes the data to display only the regions above a dynamically adjustable threshold. In tandem, a custom palette provider (**XThresholdPaletteProvider**) adjusts the fill color dynamically based on the x-value relative to a defined threshold. Interactive annotations are made draggable with onDrag event handlers that update the chart in real time, following techniques described in the [Editable Annotations documentation](https://www.scichart.com/documentation/js/current/EditableAnnotations.html). The example also leverages interactive chart modifiers such as ZoomPanModifier and MouseWheelZoomModifier, which enhance the user experience as detailed in the [ZoomPanModifier documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html).\n\n## Features and Capabilities\n\nKey features include real-time visual updates as users drag the threshold lines, dynamic color rendering through a custom palette provider, and selective data filtering using the ThresholdFilter. These capabilities enable the chart to efficiently handle complex datasets while remaining responsive, as supported by the high-performance rendering provided through FastMountainRenderableSeries.\n\n## Integration and Best Practices\n\nThis example follows best practices for Angular integration by encapsulating chart logic within the SciChartAngularComponent and passing functionality via the initChart callback. The efficient use of custom filters and dynamic palette providers minimizes performance overhead, ensuring smooth interaction even with large datasets. Developers can explore additional integration tips by referring to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide and by reviewing Angular integration patterns discussed in resources such as the [Angular Component Callback guidelines](https://stackoverflow.com/questions/35328652/angular-pass-callback-function-to-child-component-as-input-similar-to-angularjs).\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Annotations%20API%20Overview.html",
                title: "The specific page for the SciChart.js Annotations documentation will help you to get started",
                linkTitle: "Annotations API Documentation",
            },
        ],
        path: "chart-drag-horizontal-threshold",
        metaKeywords: "trade, markers, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ChartAnnotations/DragHorizontalThreshold",
        thumbnailImage: "javascript-chart-drag-horizontal-threshold.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const dragHorizontalThresholdExampleInfo = createExampleInfo(metaData);
