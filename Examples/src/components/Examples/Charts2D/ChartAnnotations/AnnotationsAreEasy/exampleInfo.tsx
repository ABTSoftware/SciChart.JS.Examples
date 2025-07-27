import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "AnnotationsAreEasy",
        id: "chart2D_chartAnnotations_AnnotationsAreEasy",
        imagePath: "javascript-chart-annotations.jpg",
        description:
            "Demonstrates how to add Annotations (shapes, boxes, lines, text) to a **JavaScript Chart** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to add Annotations (shapes, boxes, lines, text) to a **JavaScript Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Chart Annotations",
                pageTitle: "JavaScript Chart Annotations",
                metaDescription:
                    "Demonstrates how to place Annotations (lines, arrows, markers, text) over a JavaScript Chart using SciChart.js Annotations API",
                markdownContent:
                    "## Annotations Are Easy - JavaScript\n\n### Overview\nThis JavaScript example demonstrates how SciChart.js can be used to integrate various annotation types such as text, lines, boxes, and custom SVG shapes into high-performance 2D charts. The example showcases robust chart annotation capabilities that empower developers to create dynamic and interactive visualizations.\n\n### Technical Implementation\nIn this example, a `SciChartSurface` is created with numeric X and Y axes configured with defined visible ranges. Annotation types including `TextAnnotation`, `NativeTextAnnotation`, `LineAnnotation`, `BoxAnnotation`, and `CustomAnnotation` are applied using both absolute and relative coordinate modes for precise placement as explained in the [Annotations API Documentation](https://www.scichart.com/documentation/js/current/The%20Annotations%20API%20Overview.html). Custom animations such as fade, typewriter, and rotation effects are implemented via the [Generic Animations | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/Generic%20Animations.html) API. Additionally, interactivity is enhanced using the `ZoomPanModifier`, enabling advanced zooming and panning behavior as detailed in the [ZoomPanModifier tutorial](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html). Custom SVG annotations, including a rocket icon and buy/sell markers, are leveraged to add unique graphical elements through the [CustomAnnotation](https://www.scichart.com/documentation/js/current/CustomAnnotation.html) functionality.\n\n### Features and Capabilities\nThe example features real-time update capabilities through smooth animations and dynamic content updates. It incorporates advanced features such as responsive layout via relative coordinate modes and sophisticated animation sequencing for engaging visual transitions. Performance optimizations are achieved by efficiently managing animation delays and rendering, in line with recommendations found in [Performance Tips](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n### Integration and Best Practices\nThis implementation follows modular design principles by clearly separating chart creation and annotation configuration. Using JavaScript ensures the setup remains lightweight and straightforward to integrate into web projects. Developers are encouraged to build upon these techniques to create highly interactive charting applications with SciChart.js, leveraging the streamlined process and the extensive customization options available.",
            },
            react: {
                subtitle:
                    "Demonstrates how to add Annotations (shapes, boxes, lines, text) to a **React Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "React Chart Annotations",
                pageTitle: "React Chart Annotations",
                metaDescription:
                    "Demonstrates how to place Annotations (lines, arrows, markers, text) over a React Chart using SciChart.js Annotations API",
                markdownContent:
                    "## Annotations Are Easy - React\n\n### Overview\nThis example demonstrates how to add a variety of annotations to a React-based chart using SciChart.js. The implementation showcases high-performance 2D charting, enabling developers to overlay text, lines, boxes, and SVG custom shapes with interactive behaviors and custom animations.\n\n### Technical Implementation\nIn this example the chart is initialized using the `<SciChartReact/>` component which accepts an `initChart` callback, a pattern that supports easy and modular integration in React applications. The chart is created by instantiating a `SciChartSurface` and defining numeric X and Y axes with specific visible ranges. Interactivity is achieved by incorporating a `ZoomPanModifier`, which is implemented as per best practices outlined in the [ZoomPanModifier documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html). Annotations such as `TextAnnotation`, `NativeTextAnnotation`, `LineAnnotation`, `BoxAnnotation`, and `CustomAnnotation` are added to the chart surface. Each annotation is precisely positioned using absolute and relative coordinates (using `ECoordinateMode.Relative`) with explicit anchor points. Custom SVG annotations are used to add graphics like rocket icons and trading markers, while images are incorporated using dynamic SVG generation. The example further enhances user experience by applying custom animations using the `GenericAnimation` API for fade, typewriter, and rotation effects. For a deeper dive into creating custom animations, refer to the [Generic Animations documentation](https://www.scichart.com/documentation/js/current/Generic%20Animations.html).\n\n### Features and Capabilities\nThis example highlights several advanced features and customizations including real-time annotation updates and complex animation sequencing. Animations are sequenced with precise delays to create engaging visual effects. Developers can define annotations using relative coordinate modes, which ensure that elements such as watermarks remain centered regardless of viewport changes. The incorporation of diverse annotation types demonstrates the flexibility of the SciChart.js Annotations API as outlined in the [Tutorial - Adding Annotations](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html).\n\n### Integration and Best Practices\nThe React integration is achieved by embedding the `<SciChartReact/>` component within a standard React component, following the patterns highlighted in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html). The example emphasizes using built-in interactivity modifiers and a modular annotation system that promotes maintainability and scalability. Performance optimization techniques are implicit in the careful structuring of animations and rendering of SVG elements, ensuring that even complex charts remain responsive. Developers are encouraged to explore additional interactivity options and performance improvements as detailed in the comprehensive [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) article.\n",
            },
            angular: {
                subtitle:
                    "Demonstrates how to add Annotations (shapes, boxes, lines, text) to a **Angular Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Chart Annotations",
                pageTitle: "Angular Chart Annotations",
                metaDescription:
                    "Demonstrates how to place Annotations (lines, arrows, markers, text) over a Angular Chart using SciChart.js Annotations API",
                markdownContent:
                    "## Annotations Are Easy - Angular\n\n### Overview\nThis Angular example demonstrates how to leverage the high-performance SciChart.js Annotations API to overlay a variety of annotation types – including text, lines, boxes, and custom SVG graphics – on a 2D chart. The example is implemented as a standalone Angular component using the `ScichartAngularComponent`, which simplifies integration and modular development.\n\n### Technical Implementation\nIn this sample, the chart is instantiated through the `SciChartSurface` created within an Angular component. Numeric X and Y axes are configured with defined visible ranges, and interactivity is added using the `ZoomPanModifier`. A diverse set of annotations is applied: `TextAnnotation` and `NativeTextAnnotation` provide textual data, while `LineAnnotation` and `BoxAnnotation` offer graphical lines and shapes. Additionally, `CustomAnnotation` objects are used to inject custom SVG content (including a rocket icon and buy/sell markers) and images via dynamically generated SVG strings. Annotations use both absolute and relative coordinate modes (using `ECoordinateMode.Relative`), ensuring a responsive layout that adapts to viewport changes. Developers seeking further insight into implementing such annotation techniques can refer to the [Tutorial 06 - Adding Annotations](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html) and [The Annotations API Overview](https://www.scichart.com/documentation/js/current/The%20Annotations%20API%20Overview.html).\n\n### Features and Capabilities\nThe example highlights several advanced features including custom animations powered by the `GenericAnimation` API. Effects such as typewriter, fade, and rotation animations are applied sequentially to create engaging visual transitions. These animations enhance user interaction and showcase the ability to perform dynamic updates on the chart elements. Moreover, the integration of custom SVG annotations demonstrates how to include branded graphics or custom markers directly within the chart. For more detailed examples on animation effects, see the [Angular Startup Animation | SciChart.js Demo](https://demo.scichart.com/angular/startup-animation).\n\n### Integration and Best Practices\nThis implementation makes use of Angular's standalone component architecture, following best practices for modern Angular development as suggested in the [Getting started with standalone components - Angular](https://angular.io/guide/standalone-components) guide. Integrating SciChart.js via the `ScichartAngularComponent` (available through [scichart-angular](https://www.npmjs.com/package/scichart-angular)) ensures a seamless setup and easier maintenance. Additionally, considerations for performance optimization are implicit in the example’s structured annotation rendering and efficient animation sequencing, aligning with recommendations from the [Memory Best Practices | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) article.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Annotations%20API%20Overview.html",
                title: "The specific page for the SciChart.js Annotations documentation will help you to get started",
                linkTitle: "Annotations API Documentation",
            },
        ],
        path: "chart-annotations",
        metaKeywords: "annotations, chart, api, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ChartAnnotations/AnnotationsAreEasy",
        thumbnailImage: "javascript-chart-annotations.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false
    };
//// End of computer generated metadata

const annotationsAreEasyExampleInfo = createExampleInfo(metaData);
export default annotationsAreEasyExampleInfo;
