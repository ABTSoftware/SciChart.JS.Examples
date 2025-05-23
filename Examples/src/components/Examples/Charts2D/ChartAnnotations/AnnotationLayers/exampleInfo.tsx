import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DChartAnnotationsAnnotationLayers",
        imagePath: "javascript-chart-annotation-layers.jpg",
        description:
            "Demonstrates how Annotation layering a **JavaScript Chart** using SciChart.js, High Performance JavaScript Charts\nNotice the difference between annotations rendered to SVG and Canvas, as well as **annotationLayer** property effect.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how Annotation layering a **JavaScript Chart** using SciChart.js, High Performance JavaScript Charts\nNotice the difference between annotations rendered to SVG and Canvas, as well as **annotationLayer** property effect.",
                title: "JavaScript Chart Annotation Layers",
                pageTitle: "JavaScript Chart Annotation Layers",
                metaDescription: "Demonstrates how layering works a JavaScript Chart using SciChart.js Annotations API",
                markdownContent:
                    '# Annotation Layers with JavaScript\n\n### Overview\nThis example demonstrates how to build a rich, interactive chart using SciChart.js in a JavaScript setting. The "Annotation Layers" example focuses on organizing chart annotations into multiple layers such as `EAnnotationLayer.Background`, `BelowChart`, and `AboveChart`. This layering allows developers to clearly separate different types of visual data and interactions on the chart.\n\n### Technical Implementation\nThe chart is initialized using the asynchronous method `SciChartSurface.create()`, which sets up a new chart surface along with a WebAssembly context. `NumericAxis` are added and configured with custom grid line styles and grow-by ranges. Built-in chart modifiers like `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` are incorporated to enable interactive features such as zooming and panning. For detailed initialization techniques, refer to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation.\n\nDynamic annotation updates are implemented using the `sciChartSurface.preRender` event. This event subscription allows the example to adjust annotation properties immediately before each render cycle, ensuring annotations stay aligned with their associated chart elements. Developers looking for performance insights when updating annotations in real-time should review the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation.\n\n### Features and Capabilities\nThis example highlights several advanced features:\n\n- **Annotation Layers:** Annotations such as `BoxAnnotation`, `TextAnnotation`, and `NativeTextAnnotation` are assigned to different layers (Background, BelowChart, AboveChart) to control rendering order. More details can be found in the [Annotations API Overview](https://www.scichart.com/documentation/js/current/The%20Annotations%20API%20Overview.html).\n\n- **Interactive and Editable Annotations:** All annotations are marked as editable (using the `isEditable` property), which allows end users to interact with and modify annotations. For further reading, check out the [Editable Annotations](https://www.scichart.com/documentation/js/current/EditableAnnotations.html) guide.\n\n- **Mixed Annotation Types:** The example uses both SVG-based `TextAnnotation` and HTML-based `NativeTextAnnotation` to demonstrate versatility in text rendering, offering developers customization options based on their performance and styling needs. Additional context is available in the [Tutorial 06 - Adding Annotations](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html) documentation.\n\n### Integration and Best Practices\nAlthough implemented directly in JavaScript, the techniques shown here are easily adaptable to frameworks such as Angular or React, as seen in the additional source files provided. The example adheres to best practices by clearly separating chart initialization, annotation configuration, and interactive modifier integration. Developers seeking to integrate multiple annotation layers and renderable series in complex projects can learn more from the [SciChart.JS Changelog](https://www.scichart.com/changelog/scichart-js/), which details recent enhancements and integration strategies.\n\nOverall, this example efficiently demonstrates how to leverage SciChart.js for creating interactive, high-performance charts with advanced annotation capabilities using JavaScript.',
            },
            react: {
                subtitle:
                    "Demonstrates how Annotation layering a **React Chart** using SciChart.js, High Performance JavaScript Charts\nNotice the difference between annotations rendered to SVG and Canvas, as well as **annotationLayer** property effect.",
                title: "React Chart Annotation Layers",
                pageTitle: "React Chart Annotation Layers",
                metaDescription: "Demonstrates how layering works a React Chart using SciChart.js Annotations API",
                markdownContent:
                    "## Annotation Layers Example - React\n\n### Overview\nThis example demonstrates a SciChart.js chart implementation in a React application that focuses on multiple annotation layers. The chart features Annotations in the background, below chart, and above chart series to create a rich, interactive visualization.\n\n### Technical Implementation\nThe chart is created asynchronously via an async function that initializes the `SciChartSurface` using the WebAssembly engine provided by SciChart.js. Numeric axes and a fast line renderable series are added along with several chart modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` to enable dynamic zooming and panning. Multiple annotation types are configured using `BoxAnnotation`, `TextAnnotation`, and `NativeTextAnnotation`, each assigned to specific layers with the `EAnnotationLayer` property. A key aspect of this implementation is the subscription to the `sciChartSurface.preRender` event, which is used to update native text annotations’ positions in real-time, ensuring they remain aligned with their corresponding box annotations. This approach is in line with [best practices for React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/) as well as efficient asynchronous chart creation demonstrated in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).\n\n### Features and Capabilities\nThe example showcases several advanced capabilities including: \n- **Real-time Annotation Updates:** Using the `preRender` event to synchronize annotation positions.\n- **Interactive Chart Modifiers:** Integration of modifiers for zooming and panning.\n- **Editable Annotations:** Configurable annotations that can be adjusted interactively.\n\n### Integration and Best Practices\nThe SciChart.js integration is achieved through the `<SciChartReact/>` component, which simplifies embedding charts within React components. The asynchronous initialization ensures that the chart is rendered only after the WebAssembly context is available, improving performance. Developers are encouraged to review these resources to further optimize rendering performance and interactivity.\n\nThis example serves as a solid foundation for building highly interactive and performant charting solutions within a React application.",
            },
            angular: {
                subtitle:
                    "Demonstrates how Annotation layering a **Angular Chart** using SciChart.js, High Performance JavaScript Charts\nNotice the difference between annotations rendered to SVG and Canvas, as well as **annotationLayer** property effect.",
                title: "Angular Chart Annotation Layers",
                pageTitle: "Angular Chart Annotation Layers",
                metaDescription: "Demonstrates how layering works a Angular Chart using SciChart.js Annotations API",
                markdownContent:
                    "## Angular Chart Annotation Layers\n\n### Overview\nThis example demonstrates how to integrate SciChart.js into an Angular standalone component, showcasing advanced annotation layering techniques. The chart is designed to display high-performance 2D data visualization featuring multiple annotation layers, by rendering Annotations in the background, below the chart, and above the chart using the `EAnnotationLayer` enumeration.\n\n### Technical Implementation\nThe implementation uses the [scichart-angular](https://www.npmjs.com/package/scichart-angular) component to embed the chart into an Angular environment. A `SciChartSurface` is created and configured with `NumericAxis`, a `FastLineRenderableSeries`, and custom styling using an Angular-friendly theme. Dynamic annotations, both SVG and native, are added to the chart and linked to update automatically via the `sciChartSurface.preRender` event. More details on adding such dynamic annotations are available in the [Tutorial 06 - Adding Annotations](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html) guide.\n\n### Features and Capabilities\nThis example highlights several advanced features including real-time updates of annotations, interactive editable annotations, and multiple layers of annotation rendering (Background, Below Chart, Above Chart). The integration of chart modifiers such as [ZoomPanModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html), `MouseWheelZoomModifier`, and `ZoomExtentsModifier` enhances the user experience by enabling intuitive zooming and panning functionalities.\n\n### Integration and Best Practices\nThe angular integration leverages input property binding to initialize the chart through a dedicated function, ensuring that the charting component remains modular and easily replaceable. Best practices for setting up a SciChart.js project in Angular can be reviewed in the [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html) documentation. Additionally, the example demonstrates performance optimization by employing efficient WebGL rendering techniques and utilizing dynamic event handling to manage annotation positioning, while custom theming enhances visual clarity as described in the [Chart Styling - Creating a Custom Theme](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) documentation.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Annotations%20API%20Overview.html",
                title: "The specific page for the SciChart.js Annotations documentation will help you to get started",
                linkTitle: "Annotations API Documentation",
            },
        ],
        path: "annotation-layers",
        metaKeywords: "annotations, chart, api, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ChartAnnotations/AnnotationLayers",
        thumbnailImage: "javascript-chart-annotation-layers.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const annotationLayersExampleInfo = createExampleInfo(metaData);
