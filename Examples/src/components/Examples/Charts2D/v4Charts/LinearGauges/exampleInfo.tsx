import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "LinearGauges",
        id: "chart2D_v4Charts_LinearGauges",
        imagePath: "javascript-linear-gauges.jpg",
        description:
            "Demonstrates various **JavaScript Linear Gauges** using SciChart.js, combining rectangles and annotations to show simple values in compelling ways.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates various **JavaScript Linear Gauges** using SciChart.js, combining rectangles and annotations to show simple values in compelling ways.",
                title: "JavaScript Linear Gauges",
                pageTitle: "JavaScript Linear Gauges | JavaScript Charts",
                metaDescription: null,
                markdownContent:
                    "## Linear Gauges - JavaScript\n\n### Overview\nThis example demonstrates **linear gauge** visualization using SciChart.js, featuring multiple gauge styles with [ArrowAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/linearrowannotation.html) markers and [TextAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html) for non-linear labels. The implementation shows how to create professional dashboard gauges with custom scales.\n\n### Technical Implementation\nThe gauges use [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) with [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html) for rectangular segments. Value indicators are implemented via [LineArrowAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/linearrowannotation.html). For advanced scale customization, the example could be extended by overriding [ITickProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/itickprovider.html) on the axis.\n\n### Features and Capabilities\nKey features include vertical/horizontal gauge orientations, gradient fills, and dynamic value indicators. The implementation shows how to use [ECoordinateMode](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html) for precise annotation positioning and [IFillPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) for segmented coloring.\n\n### Integration and Best Practices\nThe vanilla JS implementation follows best practices for async initialization with proper cleanup. For production use, consider implementing custom [IAxisTickProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/iaxistickprovider.html) for non-linear gauge scales.",
            },
            react: {
                subtitle:
                    "Demonstrates various **React Linear Gauges** using SciChart.js, combining rectangles and annotations to show simple values in compelling ways.",
                title: "React Linear Gauges",
                pageTitle: "React Linear Gauges | JavaScript Charts",
                metaDescription: null,
                markdownContent:
                    "## Linear Gauges - React\n\n### Overview\nThis React example showcases **dashboard-style linear gauges** using the [SciChartReact](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartreact.html) component. It demonstrates React integration patterns for gauge components with animated indicators and custom scales.\n\n### Technical Implementation\nThe implementation uses [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) for gauge bodies and [LineArrowAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/linearrowannotation.html) for value pointers. React hooks manage gauge state, while [TextAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html) handles custom labels. For advanced implementations, consider creating a custom [TickProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/itickprovider.html) component.\n\n### Features and Capabilities\nThe example includes responsive gauges with both vertical and horizontal layouts. It demonstrates React state management for gauge values and uses [useEffect](https://react.dev/reference/react/useEffect) for clean animation handling. The [ECoordinateMode](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html) API ensures precise label positioning.\n\n### Integration and Best Practices\nFollow the [SciChart React Tutorial](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) for proper component integration. For production apps, consider memoizing gauge configurations and implementing custom tick providers for non-linear scales.",
            },
            angular: {
                subtitle:
                    "Demonstrates various **Angular Linear Gauges** using SciChart.js, combining rectangles and annotations to show simple values in compelling ways.",
                title: "Angular Linear Gauges",
                pageTitle: "Angular Linear Gauges | JavaScript Charts",
                metaDescription: null,
                markdownContent:
                    "## Linear Gauges - Angular\n\n### Overview\nThis Angular example demonstrates **enterprise-grade linear gauges** using the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package. It features standalone components with custom scale markers and annotation-based labels.\n\n### Technical Implementation\nThe gauges are implemented through Angular's [standalone component](https://angular.io/guide/standalone-components) architecture. [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) creates gauge bodies, while [LineArrowAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/linearrowannotation.html) serves as value indicators. For advanced implementations, create a custom [TickProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/itickprovider.html) service.\n\n### Features and Capabilities\nThe example showcases Angular's change detection working with SciChart's rendering pipeline. It includes responsive gauge layouts and demonstrates zone.js compatibility with animations. The [TextAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/textannotation.html) API handles custom scale labels.\n\n### Integration and Best Practices\nReference the [SciChart Angular Guide](https://www.scichart.com/documentation/js/current/scichart-angular.html) for proper component integration. Implement [OnDestroy](https://angular.io/api/core/OnDestroy) for chart cleanup and consider services for shared tick provider logic across multiple gauge components."
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Linear Gauges documentation will help you to get started",
                linkTitle: "JavaScript Linear Gauges Documentation",
            },
        ],
        path: "linear-gauges",
        metaKeywords: "histogram, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/LinearGauges",
        thumbnailImage: "javascript-linear-gauges.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

const LinearGaugesExampleInfo = createExampleInfo(metaData);
export default LinearGaugesExampleInfo;
