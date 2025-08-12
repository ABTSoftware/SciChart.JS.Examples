import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "GanttChart",
        id: "chart2D_v4Charts_GanttChart",
        imagePath: "javascript-gantt-chart.jpg",
        description:
            "Creates a **JavaScript Gantt Chart** using SciChart.js, using the new FastRectangleSeries to draw horizontal bars, with rounded corners and data labels coming from metadata",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Gantt Chart** using SciChart.js, using the new FastRectangleSeries to draw horizontal bars, with rounded corners and data labels coming from metadata",
                title: "JavaScript Gantt Chart",
                pageTitle: "JavaScript Gantt Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# JavaScript Gantt Chart Example\n\n## Overview\nThis example demonstrates how to create a **Gantt Chart** using SciChart.js in vanilla JavaScript. The implementation visualizes project tasks with start/end dates and completion percentages using [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) with [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html) for precise task positioning.\n\n## Technical Implementation\nThe chart uses a [CategoryAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/categoryaxis.html) for task names and [DateTimeNumericAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html) for timeline display. Tasks are rendered as rectangles with configurable corner radii, opacity, and data labels showing completion percentages. The implementation uses [EColumnMode.StartEnd](https://www.scichart.com/documentation/js/current/typedoc/enums/ecolumnmode.html) and [EColumnYMode.TopBottom](https://www.scichart.com/documentation/js/current/typedoc/enums/ecolumnymode.html) for precise rectangle positioning.\n\n## Features and Capabilities\nInteractive features include horizontal zoom/pan via [ZoomPanModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html) and tooltips showing task dates through a custom [TCursorTooltipDataTemplate](https://www.scichart.com/documentation/js/current/typedoc/interfaces/tcursortooltipdatatemplate.html). The chart efficiently handles task data conversion from Date objects to timestamps for rendering.\n\n## Integration and Best Practices\nThe example follows best practices for asynchronous chart initialization and includes proper cleanup. Developers can extend this by adding real-time updates or integrating with project management APIs.",
            },
            react: {
                subtitle:
                    "Creates a **React Gantt Chart** using SciChart.js, using the new FastRectangleSeries to draw horizontal bars, with rounded corners and data labels coming from metadata",
                title: "React Gantt Chart",
                pageTitle: "React Gantt Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# React Gantt Chart Example\n\n## Overview\nThis React implementation showcases a **Gantt Chart** using SciChart.js through the [SciChartReact](https://www.scichart.com/documentation/js/current/typedoc/globals.html) component. It visualizes project timelines with task completion percentages in a performant WebGL-rendered chart.\n\n## Technical Implementation\nThe chart is initialized via the `initChart` prop which creates a [SciChartSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) with configured axes and series. Task data is processed into [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html) format for the [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html). The implementation uses React's component lifecycle for efficient resource management.\n\n## Features and Capabilities\nThe component features interactive zooming (constrained to horizontal direction), task completion labels, and custom tooltips. The [CursorModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html) displays detailed task information on hover, while the reversed [CategoryAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/categoryaxis.html) ensures natural task ordering.\n\n## Integration and Best Practices\nThe example demonstrates proper React integration by encapsulating chart logic in a separate module. Developers can easily extend this by connecting to state management or adding dynamic updates while benefiting from SciChart's optimized rendering.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Gantt Chart** using SciChart.js, using the new FastRectangleSeries to draw horizontal bars, with rounded corners and data labels coming from metadata",
                title: "Angular Gantt Chart",
                pageTitle: "Angular Gantt Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Angular Gantt Chart Example\n\n## Overview\nThis Angular example creates a **Gantt Chart** using the [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular) to visualize project timelines. The standalone component approach demonstrates clean integration with Angular's architecture.\n\n## Technical Implementation\nThe chart configuration is delegated to the `drawExample` function which sets up the [SciChartSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) with [DateTimeNumericAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html) and customized [CategoryAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/categoryaxis.html). The [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) displays tasks with completion percentage labels.\n\n## Features and Capabilities\nThe implementation includes horizontal zooming via [ZoomPanModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html), task tooltips, and automatic axis ranging. The use of [EColumnMode.StartEnd](https://www.scichart.com/documentation/js/current/typedoc/enums/ecolumnmode.html) ensures accurate task duration representation.\n\n## Integration and Best Practices\nThe example follows Angular best practices by using standalone components and property binding. Developers can extend this by adding @Input properties for dynamic data or implementing Angular services for data management while maintaining high rendering performance.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Gantt Chart documentation will help you to get started",
                linkTitle: "JavaScript Gantt Chart Documentation",
            },
        ],
        path: "gantt-chart",
        metaKeywords: "gantt, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/GanttChart",
        thumbnailImage: "javascript-gantt-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

const GanttChartExampleInfo = createExampleInfo(metaData);
export default GanttChartExampleInfo;
