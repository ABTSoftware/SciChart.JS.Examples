import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DStylingAndThemingDataLabels",
        imagePath: "javascript-datalabels-chart.jpg",
        description: "Shows how you can add **Data Labels** to a chart using SciChart.js",
        tips: [],
        frameworks: {
            javascript: {
                subtitle: "Shows how you can add **Data Labels** to a chart using SciChart.js",
                title: "Data Labels",
                pageTitle: "Data Labels",
                metaDescription: "Show data labels on JavaScript Chart. Get your free demo now.",
                markdownContent:
                    "## Data Labels - JavaScript\n\n### Overview\nThis example demonstrates advanced customization of **data labels** in a SciChart.js chart using JavaScript. The implementation sets up a `SciChartSurface` with numeric axes and multiple renderable series to showcase how dynamic label styling and metadata-driven text labels can enhance data visualization.\n\n### Technical Implementation\nThe chart is constructed by first creating a `SciChartSurface` and adding numeric X and Y axes. Three renderable series are configured: a column series with dynamic label colors using a custom function in the `DataLabelProvider`, a spline series that extracts label text from metadata via a custom `metaDataSelector` (see [Getting Labels from Metadata](https://www.scichart.com/documentation/js/current/DataLabelsFromMetadata.html)), and a line series that conditionally displays labels only at peak values using a customized getText function as detailed in [Custom DataLabel Formatting with getText()](https://www.scichart.com/documentation/js/current/DataLabelFormattingAdvanced.html). Interactive modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` are incorporated to enable smooth zooming and panning, which can be explored further in [Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).\n\n### Features and Capabilities\nThe example illustrates several advanced features including conditional label styling based on data values, metadata-driven labels, and performance optimizations achieved by showing labels only when there is sufficient space. In addition, custom point markers like `EllipsePointMarker` are used to clearly highlight data points. Dynamic color styling is applied using the `parseColorToUIntArgb()` function, aligning with techniques described in [Data Label Colouring](https://www.scichart.com/documentation/js/current/DataLabelColouring.html).\n\n### Integration and Best Practices\nThis implementation adheres to best practices in resource management by encapsulating chart creation within an asynchronous function that returns a cleanup mechanism for disposing of the `SciChartSurface`. Developers leveraging JavaScript can refer to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide to understand proper initialization and disposal of chart resources. The example’s modular approach ensures that chart configuration remains maintainable and scalable while enabling advanced interactive visualization through integrated chart modifiers.",
            },
            react: {
                subtitle: "Shows how you can add **Data Labels** to a chart using SciChart.js",
                title: "Data Labels",
                pageTitle: "Data Labels",
                metaDescription: "Show data labels on React Chart. Get your free demo now.",
                markdownContent:
                    "## Data Labels - React\n\n### Overview\nThis example demonstrates how to create a chart with advanced **Data Labels** customization using SciChart.js in a **React** application. The example shows how to add data labels to various series types such as column, spline, and line series, and illustrates how labels can be dynamically configured based on data values and metadata.\n\n### Technical Implementation\nThe chart is initialized through the `<SciChartReact/>` component, which leverages an `initChart` callback (implemented in the drawExample function) to set up axes, series, and custom data labels. The example employs the `DataLabelProvider` to define label styles and dynamic colors based on data values, and uses custom callback functions to format text (see [Custom DataLabel Formatting with getText() - SciChart](https://www.scichart.com/documentation/js/current/DataLabelFormattingAdvanced.html) and [Adding DataLabels to a Chart Series - SciChart](https://www.scichart.com/documentation/js/current/AddingDataLabels.html) for detailed documentation). The configuration of the chart follows the practices highlighted in [Tutorial 02 - Creating a Chart with scichart-react](https://www.scichart.com/documentation/js/current/Tutorial02CreatingChartsWithInitChart.html), ensuring a clear separation of chart logic and React component structure.\n\n### Features and Capabilities\nThe example showcases several advanced features: \n+ Dynamic label styling where label colors change based on the Y-value.\n+ Metadata-driven labels where text is derived from additional data properties.\n+ Custom logic to display labels only for peaks in a large dataset, thereby optimizing label readability and performance.\n\nThese capabilities are enhanced by interactive annotations and chart modifiers such as zooming and panning, contributing to a highly interactive experience.\n\n### Integration and Best Practices\nThe integration leverages the `<SciChartReact/>` component to seamlessly embed high performance SciChart.js charts in a React application. Developers can follow the best practices outlined in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) and [Tutorial 01 - Setting up a project with scichart-react and config object](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html) for guidance on setting up chart components and optimizing performance. The use of efficient data series and interactive modifiers ensures the chart remains responsive even with large datasets, making it an excellent reference for building robust data visualization applications.\n",
            },
            angular: {
                subtitle: "Shows how you can add **Data Labels** to a chart using SciChart.js",
                title: "Data Labels",
                pageTitle: "Data Labels",
                metaDescription: "Show data labels on Angular Chart. Get your free demo now.",
                markdownContent:
                    "## Data Labels - Angular\n\n### Overview\nThis example demonstrates how to integrate SciChart.js into an Angular application to render charts with advanced **Data Labels** customization. The implementation uses a standalone Angular component with the scichart-angular package to initialize the chart via a callback function, ensuring a smooth and modular integration.\n\n### Technical Implementation\nThe chart is constructed by creating a `SciChartSurface` within an Angular standalone component as described in [Getting started with standalone components](https://angular.io/guide/standalone-components). Axes and multiple renderable series are set up where each series applies custom data labels through the `DataLabelProvider`. For instance, the column series dynamically assigns label colors based on Y-value conditions, while spline and line series utilize metadata and custom functions to format labels, an approach detailed in [Adding DataLabels to a Chart Series](https://www.scichart.com/documentation/js/current/AddingDataLabels.html). Interactive modifiers such as zoom, pan, and mouse wheel zoom are added to enhance the user experience, ensuring the chart remains responsive under various data densities.\n\n### Features and Capabilities\nThe example showcases several advanced features including conditional label styling, metadata-driven text for labels, and dynamic label display triggered by data peaks and zoom level. These capabilities follow best practices outlined in the [SciChart.js DataLabels API Documentation](https://www.scichart.com/documentation/js/current/AddingDataLabels.html) and further elaborated in the [Getting Labels from Metadata](https://www.scichart.com/documentation/js/current/DataLabelsFromMetadata.html) documentation.\n\n### Integration and Best Practices\nThis solution leverages Angular’s component binding to pass the chart initialization function efficiently while managing dependencies with modern Angular patterns. Developers can expand this approach by reviewing [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) for comprehensive setup guidance. Interactive annotations are also incorporated using SciChart’s API, which aligns with techniques from [Tutorial 06 - Adding Annotations](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html). This integration strategy promotes performance optimization in handling large datasets and ensures robust resource management through appropriate component lifecycle practices.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/AddingDataLabels.html",
                title: "SciChart.js DataLabels API Documentation",
                linkTitle: "Common RenderableSeries Properties",
            },
        ],
        path: "datalabels",
        metaKeywords: "data labels, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/StylingAndTheming/DataLabels",
        thumbnailImage: "javascript-datalabels-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const datalabelsExampleInfo = createExampleInfo(metaData);
