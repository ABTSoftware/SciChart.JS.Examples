import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "HistogramChart",
        id: "chart2D_v4Charts_HistogramChart",
        imagePath: "javascript-histogram-chart.jpg",
        description:
            "Creates a **JavaScript Histogram Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Histogram Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
                title: "JavaScript Histogram Chart",
                pageTitle: "JavaScript Histogram Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# JavaScript Histogram Chart\n\n## Overview\nThis example demonstrates how to create a **Histogram Chart** using SciChart.js in vanilla JavaScript. The chart visualizes Europe's population distribution by age range using [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) with custom textures and data labels.\n\n## Technical Implementation\nThe chart is initialized asynchronously using `SciChartSurface.create()`. It uses [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html) to define rectangle positions with `columnXMode: EColumnMode.StartEnd` and `columnYMode: EColumnYMode.TopBottom`. A custom `StickFigureTextureOptions` class implements [ICustomTextureOptions](https://www.scichart.com/documentation/js/current/typedoc/interfaces/icustomtextureoptions.html) to create patterned fills.\n\n## Features and Capabilities\nThe example showcases population data aggregation into age ranges, engineering-format labels on the Y-axis, and interactive modifiers including [ZoomPanModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html) and [MouseWheelZoomModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/mousewheelzoommodifier.html). Custom corner radii and data labels enhance visual presentation.\n\n## Integration and Best Practices\nThe implementation follows JavaScript best practices with proper async/await initialization and includes a cleanup function for memory management. The data preparation demonstrates efficient aggregation techniques for histogram visualization.",
            },
            react: {
                subtitle:
                    "Creates a **React Histogram Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
                title: "React Histogram Chart",
                pageTitle: "React Histogram Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# React Histogram Chart\n\n## Overview\nThis React component demonstrates a **Histogram Chart** using SciChart.js, visualizing population distribution by age range. The example leverages the [SciChartReact](https://www.npmjs.com/package/scichart-react) wrapper component for seamless React integration.\n\n## Technical Implementation\nThe chart logic is encapsulated in `drawExample.ts`, which creates a [SciChartSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) with configured axes and a [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html). The React component simply passes this function to `<SciChartReact initChart={drawExample}>`.\n\n## Features and Capabilities\nThe implementation features custom texture patterns through `StickFigureTextureOptions`, data labels with engineering formatting, and responsive design via CSS modules. Interactive modifiers enable zooming and panning capabilities.\n\n## Integration and Best Practices\nThe example demonstrates React best practices by separating chart logic from presentation. The component is reusable and properly manages SciChart resources through the wrapper's lifecycle. For advanced usage, refer to [SciChart React Documentation](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).",
            },
            angular: {
                subtitle:
                    "Creates an **Angular Histogram Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill.",
                title: "Angular Histogram Chart",
                pageTitle: "Angular Histogram Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Angular Histogram Chart\n\n## Overview\nThis standalone Angular component showcases a **Histogram Chart** using SciChart.js to display population distribution data. The example uses the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package for Angular integration.\n\n## Technical Implementation\nThe chart is implemented in `drawExample.ts` and integrated via Angular's template syntax: `<scichart-angular [initChart]=\"drawExample\"></scichart-angular>`. The component uses [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) with custom textures and data labels.\n\n## Features and Capabilities\nThe chart features age-range aggregation, custom stick-figure textures, and engineering-format labels. Interactive modifiers like [ZoomExtentsModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/zoomextentsmodifier.html) enhance user experience.\n\n## Integration and Best Practices\nThe example follows Angular standalone component patterns and demonstrates proper resource cleanup. For more on Angular integration, see [Angular Chart Documentation](https://www.scichart.com/documentation/js/current/angular-chart-documentation.html).",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Histogram Chart documentation will help you to get started",
                linkTitle: "JavaScript Histogram Chart Documentation",
            },
        ],
        path: "histogram-chart",
        metaKeywords: "histogram, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/HistogramChart",
        thumbnailImage: "javascript-histogram-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

const HistogramChartExampleInfo = createExampleInfo(metaData);
export default HistogramChartExampleInfo;
