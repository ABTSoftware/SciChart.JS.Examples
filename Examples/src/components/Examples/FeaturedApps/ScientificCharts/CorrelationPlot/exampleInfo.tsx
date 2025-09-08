import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "CorrelationPlot",
        id: "featuredApps_scientificCharts_CorrelationPlot",
        imagePath: "javascript-correlation-plot.jpg",
        description:
            "This example demonstrates a high performance Scatter chart grid with 5000 points per chart using the subcharts api in SciChart.js which can be used to create a **JavaScript Correlation Plot**",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "This example demonstrates a high performance Scatter chart grid with 5000 points per chart using the subcharts api in SciChart.js which can be used to create a **JavaScript Correlation Plot**",
                title: "JavaScript Correlation Plot",
                pageTitle: "JavaScript Correlation Plot | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Create JavaScript Correlation Plot with high performance SciChart.js. Easily render pre-defined point types. Supports custom shapes. Get your free trial now. ",
                markdownContent:
                    "# JavaScript Correlation Plot\n\n## Overview\nThis example demonstrates how to build a **Correlation Plot** in vanilla JavaScript using SciChart.js. A correlation plot is a powerful visualization tool used to show the correlation matrix between many variables, presented as a grid of sub-charts.\n\n## Technical Implementation\nThe core of this example is the use of the [Subcharts API](https://www.scichart.com/documentation/js/v4/2d-charts/subcharts-api/subcharts-api-overview/) to efficiently create and manage the grid of charts within a single `SciChartSurface`. Each individual chart in the matrix displays a relationship between two variables using an [XY Scatter Renderable Series](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/xy-scatter-renderable-series/).It uses randomly generated dataSets for each chart with a random correlation.\n\n## Features and Capabilities\nThe example demonstrates the programatic use of renderableSeries.getXRange and renderableSeries.getYRange to synchronise the y ranges for each row, and SciChartVerticalGroup to synchronise the chart sizes for the first column. The chart is fully interactive, supporting zooming and panning of individual charts and also the grid as a whole, when holding Ctrl.  This is achieved using modifiers on the main surface which different executeCondition configured.\n\n## Integration and Best Practices\nFor vanilla JavaScript integration, the chart is initialized within an `async` function that calls the `drawExample` module. This function handles the creation of the `SciChartSurface`. A `destructor` function is returned, which must be called to properly dispose of the chart surface and free up WebAssembly memory. This pattern ensures robust lifecycle management in any JavaScript application.",
            },
            react: {
                subtitle:
                    "This example demonstrates a high performance Scatter chart grid with 5000 points per chart using the subcharts api in SciChart.js which can be used to create a **React Correlation Plot**",
                title: "React Correlation Plot",
                pageTitle: "React Correlation Plot | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Create React Correlation Plot with high performance SciChart.js. Easily render pre-defined point types. Supports custom shapes. Get your free trial now. ",
                markdownContent:
                    "# React Correlation Plot\n\n## Overview\nThis example demonstrates how to build a **Correlation Plot** in a React application using SciChart.js. A correlation plot is a powerful visualization tool used to show the correlation matrix between many variables, presented as a grid of sub-charts.\n\n## Technical Implementation\nThe core of this example is the use of the [Subcharts API](https://www.scichart.com/documentation/js/v4/2d-charts/subcharts-api/subcharts-api-overview/) to efficiently create and manage the grid of charts within a single `SciChartSurface`. Each individual chart in the matrix displays a relationship between two variables using an [XY Scatter Renderable Series](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/xy-scatter-renderable-series/). It uses randomly generated dataSets for each chart with a random correlation.\n\n## Features and Capabilities\nThe example demonstrates the programatic use of renderableSeries.getXRange and renderableSeries.getYRange to synchronise the y ranges for each row, and SciChartVerticalGroup to synchronise the chart sizes for the first column. The chart is fully interactive, supporting zooming and panning of individual charts and also the grid as a whole, when holding Ctrl.  This is achieved using modifiers on the main surface which different executeCondition configured. \n\n## Integration and Best Practices\nIntegration into a React application is seamless using the `<SciChartReact>` component. The main chart configuration logic is encapsulated in the `drawExample` function, which is passed to the `initChart` prop. This approach ensures that the SciChart.js surface is correctly initialized and disposed of, aligning with React's component lifecycle and preventing memory leaks.",
            },
            angular: {
                subtitle:
                    "This example demonstrates a high performance Scatter chart grid using the subcharts api in SciChart.js which could be used to create a **Angular Correlation Plot**",
                title: "Angular Correlation Plot",
                pageTitle: "Angular Correlation Plot | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Create Angular Correlation Plot with high performance SciChart.js. Easily render pre-defined point types. Supports custom shapes. Get your free trial now. ",
                markdownContent:
                    "# Angular Correlation Plot\n\n## Overview\nThis example demonstrates how to build a **Correlation Plot** in an Angular application using SciChart.js. A correlation plot is a powerful visualization tool used to show the correlation matrix between many variables, presented as a grid of sub-charts.\n\n## Technical Implementation\nThe core of this example is the use of the [Subcharts API](https://www.scichart.com/documentation/js/v4/2d-charts/subcharts-api/subcharts-api-overview/) to efficiently create and manage the grid of charts within a single `SciChartSurface`. Each individual chart in the matrix displays a relationship between two variables using an [XY Scatter Renderable Series](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/xy-scatter-renderable-series/). It uses randomly generated dataSets for each chart with a random correlation.\n\n## Features and Capabilities\nThe example demonstrates the programatic use of renderableSeries.getXRange and renderableSeries.getYRange to synchronise the y ranges for each row, and SciChartVerticalGroup to synchronise the chart sizes for the first column. The chart is fully interactive, supporting zooming and panning of individual charts and also the grid as a whole, when holding Ctrl.  This is achieved using modifiers on the main surface which different executeCondition configured.\n\n## Integration and Best Practices\nIntegration into an Angular application is achieved using the `<scichart-angular>` component. The `drawExample` function, containing the chart's configuration logic, is bound to the `[initChart]` input property of the component. This declarative approach ensures that the SciChart.js surface is managed correctly within the Angular component lifecycle, handling initialization and disposal automatically.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Scatter%20Series%20Type.html",
                title: "This specific page in the JavaScript Correlation Plot documentation will help you to get started",
                linkTitle: "JavaScript Correlation Plot Documentation",
            },
        ],
        path: "correlation-plot",
        metaKeywords: "scatter, chart, subcharts, statistics, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/FeaturedApps/ScientificCharts/CorrelationPlot",
        thumbnailImage: "javascript-correlation-plot.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

const correlationPlotExampleInfo = createExampleInfo(metaData);
export default correlationPlotExampleInfo;
