import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "BoxPlotChart",
        id: "chart2D_v4Charts_BoxPlotChart",
        imagePath: "javascript-box-plot-chart.jpg",
        description:
            "Creates a **Box Plot Chart** using SciChart.js, using our new **FastBoxPlotRenderableSeries** chart type.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Box Plot Chart** using SciChart.js, using our new **FastBoxPlotRenderableSeries** chart type.",
                title: "JavaScript Box Plot Chart",
                pageTitle: "JavaScript Box Plot Chart | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Box Plot Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create a **Box Plot Chart** using SciChart.js in JavaScript, showcasing four distinct box plot visualizations in sub-surfaces. Each plot displays statistical data distribution through minimum, maximum, median, and quartile values.\n\n### Technical Implementation\nThe chart initializes asynchronously using `SciChartSurface.create()`, with four sub-surfaces created via `SciChartSubSurface`. Each surface uses a `CategoryAxis` for X-values and `NumericAxis` for Y-values. The box plots are rendered using [FastBoxPlotRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastboxplotrenderableseries.html) with [BoxPlotDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/boxplotdataseries.html) for data storage. Key configurations include `dataPointWidthMode` and custom styling for whiskers, caps, and median lines.\n\n### Features and Capabilities\nThe example highlights multiple box plots with varied datasets and orientations, including flipped coordinates. Each plot features distinct colors and styling, demonstrating customization options for [whiskers, caps, and median lines](https://www.scichart.com/documentation/js/current/The%20Box%20Plot%20Series%20Type.html).\n\n### Integration and Best Practices\nThe implementation follows best practices for asynchronous chart initialization and cleanup. Developers can extend this example by integrating dynamic data updates or additional interactive modifiers.",
            },
            react: {
                subtitle:
                    "Creates a **React Box Plot Chart** using SciChart.js, using our new **FastBoxPlotRenderableSeries** chart type.",
                title: "React Box Plot Chart",
                pageTitle: "React Box Plot Chart | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Box Plot Chart - React\n\n### Overview\nThis React example illustrates how to integrate a **Box Plot Chart** using SciChart.js, rendering four statistical visualizations in a grid layout. The example leverages the `<SciChartReact/>` component for seamless React integration.\n\n### Technical Implementation\nThe chart is initialized via the `initChart` prop, which references the `drawExample` function. This function creates a `SciChartSurface` with four sub-surfaces, each containing a [FastBoxPlotRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastboxplotrenderableseries.html). Data is configured using [BoxPlotDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/boxplotdataseries.html), with axes tailored for categorical and numeric data.\n\n### Features and Capabilities\nThe example showcases React-friendly chart lifecycle management and dynamic sub-surface positioning. Each box plot is styled independently, with options to customize [whiskers, caps, and median lines](https://www.scichart.com/documentation/js/current/The%20Box%20Plot%20Series%20Type.html).\n\n### Integration and Best Practices\nThe implementation adheres to React best practices, using the `SciChartReact` component for efficient rendering. Developers can explore further customization via [SciChart React documentation](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Box Plot Chart** using SciChart.js, using our new **FastBoxPlotRenderableSeries** chart type.",
                title: "Angular Box Plot Chart",
                pageTitle: "Angular Box Plot Chart | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Box Plot Chart - Angular\n\n### Overview\nThis Angular example demonstrates how to create a **Box Plot Chart** using SciChart.js within a standalone component. The example renders four box plots with distinct datasets and orientations.\n\n### Technical Implementation\nThe chart is initialized via the `drawExample` function, which is passed to the `[initChart]` input of the `<scichart-angular>` component. The function creates a `SciChartSurface` with four sub-surfaces, each configured with [CategoryAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/categoryaxis.html) and [NumericAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html). Box plots are rendered using [FastBoxPlotRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastboxplotrenderableseries.html).\n\n### Features and Capabilities\nThe example highlights Angular-specific integration patterns, including standalone component usage. Each box plot features customizable styling for [whiskers, caps, and median lines](https://www.scichart.com/documentation/js/current/The%20Box%20Plot%20Series%20Type.html), with one plot demonstrating flipped coordinates.\n\n### Integration and Best Practices\nThe implementation follows Angular best practices, leveraging the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package for seamless integration. Developers can extend this example by adding dynamic data binding or additional interactivity."
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Box Plot Chart documentation will help you to get started",
                linkTitle: "JavaScript Box Plot Chart Documentation",
            },
        ],
        path: "box-plot-chart",
        metaKeywords: "box-plot, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/BoxPlotChart",
        thumbnailImage: "javascript-box-plot-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

const BoxPlotChartExampleInfo = createExampleInfo(metaData);
export default BoxPlotChartExampleInfo;
