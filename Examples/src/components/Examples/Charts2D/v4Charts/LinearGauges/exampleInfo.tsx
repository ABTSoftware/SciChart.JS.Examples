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
                title: "JavaScript Linear Gauges Example",
                pageTitle: "JavaScript Linear Gauges",
                metaDescription:
                    "View the JavaScript Linear Gauge Chart example to combine rectangles & annotations. Create a linear gauge dashboard with animated indicators and custom scales.",
                markdownContent:
                    "## Linear Gauges - JavaScript\n\n### Overview\nThis example demonstrates **linear gauge** visualization using SciChart.js, featuring multiple gauge styles with [ArrowAnnotation](https://www.scichart.com/documentation/js/v5/typedoc/classes/linearrowannotation.html) markers and [TextAnnotation](https://www.scichart.com/documentation/js/v5/typedoc/classes/textannotation.html) for non-linear labels. The implementation shows how to create professional dashboard gauges with custom scales.\n\n### Technical Implementation\nThe gauges use [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastbandrenderableseries.html) with [XyxyDataSeries](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyxydataseries.html) for rectangular segments. Value indicators are implemented via [LineArrowAnnotation](https://www.scichart.com/documentation/js/v5/typedoc/classes/linearrowannotation.html). For advanced scale customization, the example could be extended by overriding [ITickProvider](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/itickprovider.html) on the axis.\n\n### Features and Capabilities\nKey features include vertical/horizontal gauge orientations, gradient fills, and dynamic value indicators. The implementation shows how to use [ECoordinateMode](https://www.scichart.com/documentation/js/v5/typedoc/enums/ecoordinatemode.html) for precise annotation positioning and [IFillPaletteProvider](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/ifillpaletteprovider.html) for segmented coloring.\n\n### Integration and Best Practices\nThe vanilla JS implementation follows best practices for async initialization with proper cleanup. For production use, consider implementing custom [IAxisTickProvider](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/iaxistickprovider.html) for non-linear gauge scales.",
            },
            react: {
                subtitle:
                    "Demonstrates various **React Linear Gauges** using SciChart.js, combining rectangles and annotations to show simple values in compelling ways.",
                title: "React Linear Gauges Example",
                pageTitle: "React Linear Gauges",
                metaDescription:
                    "View the React Linear Gauge Chart example to combine rectangles & annotations. Create a linear gauge dashboard with animated indicators and custom scales.",
                markdownContent:
                    "## Linear Gauges - React\n\n### Overview\nThis React example showcases **dashboard-style linear gauges** using the [SciChartReact](https://www.scichart.com/documentation/js/v5/typedoc/classes/scichartreact.html) component. It demonstrates React integration patterns for gauge components with animated indicators and custom scales.\n\n### Technical Implementation\nThe implementation uses [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastbandrenderableseries.html) for gauge bodies and [LineArrowAnnotation](https://www.scichart.com/documentation/js/v5/typedoc/classes/linearrowannotation.html) for value pointers. React hooks manage gauge state, while [TextAnnotation](https://www.scichart.com/documentation/js/v5/typedoc/classes/textannotation.html) handles custom labels. For advanced implementations, consider creating a custom [TickProvider](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/itickprovider.html) component.\n\n### Features and Capabilities\nThe example includes responsive gauges with both vertical and horizontal layouts. It demonstrates React state management for gauge values and uses [useEffect](https://react.dev/reference/react/useEffect) for clean animation handling. The [ECoordinateMode](https://www.scichart.com/documentation/js/v5/typedoc/enums/ecoordinatemode.html) API ensures precise label positioning.\n\n### Integration and Best Practices\nFollow the [SciChart React Tutorial](https://www.scichart.com/documentation/js/v5/get-started/tutorials-react/tutorial-01-setting-up-project-with-scichart-react/) for proper component integration. For production apps, consider memoizing gauge configurations and implementing custom tick providers for non-linear scales.",
            },
            angular: {
                subtitle:
                    "Demonstrates various **Angular Linear Gauges** using SciChart.js, combining rectangles and annotations to show simple values in compelling ways.",
                title: "Angular Linear Gauges Example",
                pageTitle: "Angular Linear Gauges",
                metaDescription:
                    "View the Angular Linear Gauge Chart example to combine rectangles & annotations. Create a linear gauge dashboard with animated indicators and custom scales.",
                markdownContent:
                    "## Linear Gauges - Angular\n\n### Overview\nThis Angular example demonstrates **enterprise-grade linear gauges** using the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package. It features standalone components with custom scale markers and annotation-based labels.\n\n### Technical Implementation\nThe gauges are implemented through Angular's [standalone component](https://angular.io/guide/standalone-components) architecture. [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastbandrenderableseries.html) creates gauge bodies, while [LineArrowAnnotation](https://www.scichart.com/documentation/js/v5/typedoc/classes/linearrowannotation.html) serves as value indicators. For advanced implementations, create a custom [TickProvider](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/itickprovider.html) service.\n\n### Features and Capabilities\nThe example showcases Angular's change detection working with SciChart's rendering pipeline. It includes responsive gauge layouts and demonstrates zone.js compatibility with animations. The [TextAnnotation](https://www.scichart.com/documentation/js/v5/typedoc/classes/textannotation.html) API handles custom scale labels.\n\n### Implement [OnDestroy](https://angular.io/api/core/OnDestroy) for chart cleanup and consider services for shared tick provider logic across multiple gauge components.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/fast-rectangle-renderable-series/",
                title: "This specific page in the JavaScript Rectangle Series Type documentation will help you to get started",
                linkTitle: "JavaScript Rectangle Series Type Documentation",
            },
        ],
        path: "linear-gauges",
        metaKeywords: "linear, gauge, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/LinearGauges",
        thumbnailImage: "javascript-linear-gauges.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

const LinearGaugesExampleInfo = createExampleInfo(metaData);
export default LinearGaugesExampleInfo;
