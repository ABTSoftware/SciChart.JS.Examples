import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

// FastRectangleRenderableSeries
// TreemapDataLabelProvider
// CustomFillProvider
const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "WaterfallChart",
        id: "chart2D_v4Charts_WaterfallChart",
        imagePath: "javascript-waterfall-chart.jpg",
        description:
            "Creates a **JavaScript Waterfall Chart** using SciChart.js's new **FastRectangleRenderableSeries** with the following features: a custom Treemap-like DataLabelProvider for rectangle labels and custom Fill PaletteProvider",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Waterfall Chart** using SciChart.js's new **FastRectangleRenderableSeries** with the following features: a custom Treemap-like DataLabelProvider for rectangle labels and custom Fill PaletteProvider",
                title: "JavaScript Waterfall Chart",
                pageTitle: "JavaScript Waterfall Chart | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Waterfall Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create a **Waterfall Chart** using SciChart.js in vanilla JavaScript. The chart visualizes cumulative profit data with colored rectangles indicating positive (teal) and negative (pink) values, using the [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) for high-performance rendering.\n\n### Technical Implementation\nThe chart uses an [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html) to define rectangle positions (prior/accu values) and a custom [IFillPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) to dynamically color rectangles based on profit values. The [TextLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html) maps indices to month labels, while a custom [RectangleSeriesDataLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/rectangleseriesdatalabelprovider.html) displays formatted cumulative values.\n\n### Features and Capabilities\nKey features include dynamic coloring based on data values, formatted engineering notation labels, and interactive zoom/pan with [ZoomPanModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html). The implementation showcases how to transform raw data into waterfall format using a custom data processing function.\n\n### Integration and Best Practices\nThe example follows best practices for WASM initialization with `SciChartSurface.create()` and includes proper cleanup. For performance, it uses a single renderable series with palette providers instead of multiple series.",
            },
            react: {
                subtitle:
                    "Creates a **React Waterfall Chart** using SciChart.js's new **FastRectangleRenderableSeries** with the following features: a custom Treemap-like DataLabelProvider for rectangle labels and custom Fill PaletteProvider",
                title: "React Waterfall Chart",
                pageTitle: "React Waterfall Chart | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Waterfall Chart - React\n\n### Overview\nThis React example creates a **Waterfall Chart** using SciChart.js, demonstrating how to integrate the powerful charting library within a React application via the [SciChartReact](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartreact.html) component.\n\n### Technical Implementation\nThe chart logic is encapsulated in `drawExample.ts`, which initializes the [SciChartSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) asynchronously. The React component simply passes this function to `<SciChartReact initChart={drawExample}>`. The implementation uses [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) with [EColumnMode.Mid](https://www.scichart.com/documentation/js/current/typedoc/enums/ecolumnmode.html) for centered columns and custom data labels.\n\n### Features and Capabilities\nThe chart features dynamic coloring through a custom [IFillPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html), multi-line data labels showing both cumulative and delta values, and responsive design through the `ChartWrapper` CSS class. Interactive modifiers enable zooming and panning.\n\n### Integration and Best Practices\nThe example shows proper React integration by separating chart logic from presentation. The async initialization pattern ensures optimal performance, while the contained component structure makes it easy to reuse. For more on React best practices, see [Creating a SciChart React Component](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Waterfall Chart** using SciChart.js's new **FastRectangleRenderableSeries** with the following features: a custom Treemap-like DataLabelProvider for rectangle labels and custom Fill PaletteProvider",
                title: "Angular Waterfall Chart",
                pageTitle: "Angular Waterfall Chart | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Waterfall Chart - Angular\n\n### Overview\nThis Angular example demonstrates how to create a **Waterfall Chart** using the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package. The standalone component integrates SciChart.js while maintaining Angular's component architecture.\n\n### Technical Implementation\nThe chart is initialized through the `<scichart-angular>` component, which accepts the `drawExample` function as input. The implementation uses [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) with [EColumnYMode.TopBottom](https://www.scichart.com/documentation/js/current/typedoc/enums/ecolumnymode.html) to define rectangle heights. Custom palette providers and label formatters enhance the visualization.\n\n### Features and Capabilities\nKey features include profit/loss coloring, engineering notation formatting, and interactive zoom/pan behavior. The chart efficiently handles data transformation from raw values to waterfall format while maintaining high performance through WebAssembly rendering.\n\n### Integration and Best Practices\nThe example follows Angular best practices by using standalone components and proper TypeScript typing. The async initialization pattern ensures smooth integration with Angular's change detection. For more on Angular integration, refer to the [scichart-angular documentation](https://www.scichart.com/documentation/js/current/guides/angular-chart.html).",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Waterfall Chart documentation will help you to get started",
                linkTitle: "JavaScript Waterfall Chart Documentation",
            },
        ],
        path: "waterfall-chart",
        metaKeywords: "waterfall, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/WaterfallChart",
        thumbnailImage: "javascript-waterfall-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

const WaterfallChartExampleInfo = createExampleInfo(metaData);
export default WaterfallChartExampleInfo;
