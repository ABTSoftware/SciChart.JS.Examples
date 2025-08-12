import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarLineChart",
        id: "chart2D_polarCharts_PolarLineChart",
        imagePath: "javascript-polar-line-chart.jpg",
        description:
            "Creates many **JavaScript Polar Line Charts** using SciChart.js, with the following features: data labels, line interpolation, pointMarkers, gradient palette stroke, startup animations.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates many **JavaScript Polar Line Charts** using SciChart.js, with the following features: data labels, line interpolation, pointMarkers, gradient palette stroke, startup animations.",
                title: "JavaScript Polar Line Chart",
                pageTitle: "JavaScript Polar Line Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Polar Line Chart - JavaScript\n\n## Overview\nThis example demonstrates how to create a **Polar Line Chart** using SciChart.js in JavaScript. The implementation showcases multiple polar line series with various configurations including interpolation, point markers, and palette providers for dynamic styling.\n\n## Technical Implementation\nThe chart is initialized using `SciChartPolarSurface.create()` with common configuration options for both angular and radial axes. The example includes six distinct polar line configurations:\n1. Basic polar lines with simple data\n2. Mathematical function traces (rose curve, butterfly curve)\n3. Interpolated lines with point markers\n4. Y-value based palette providers for threshold coloring\n5. Data labels with custom styling\n6. X-value based palette providers for segment coloring\n\nEach configuration uses [PolarLineRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html) with [XyDataSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/xydataseries.html) for data storage. Interactive features are added via [PolarZoomExtentsModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html) and [PolarPanModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpanmodifier.html).\n\n## Features and Capabilities\nThe example highlights advanced polar chart capabilities including:\n- [Interpolation](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarlinerenderableseriesoptions.html#interpolateline) for smooth curves\n- Custom [palette providers](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarlinerenderableseriesoptions.html#paletteprovider) for dynamic coloring\n- [Data labels](https://www.scichart.com/documentation/js/v4/typedoc/interfaces/ipolarlinerenderableseriesoptions.html#datalabels) with various positioning options\n- Mathematical function plotting in polar coordinates",
            },
            react: {
                subtitle:
                    "Creates many **React Polar Line Charts** using SciChart.js, with the following features: data labels, line interpolation, pointMarkers, gradient palette stroke, startup animations.",
                title: "React Polar Line Chart",
                pageTitle: "React Polar Line Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Polar Line Chart - React\n\n## Overview\nThis React example demonstrates how to integrate SciChart's **Polar Line Chart** capabilities into a React application using the `SciChartReact` component. The implementation showcases multiple polar line configurations with React-friendly initialization patterns.\n\n## Technical Implementation\nThe chart is initialized through the `<SciChartReact/>` component's `initChart` prop, which receives an async function that creates and configures the polar surface. The example follows React best practices by:\n- Using theme constants for consistent styling\n- Encapsulating common axis options\n- Providing clean initialization API with multiple chart variations\n\nThe implementation leverages [SciChartPolarSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) with [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) for coordinate system setup. Animation effects are achieved using [SweepAnimation](https://www.scichart.com/documentation/js/v4/typedoc/classes/sweepanimation.html).\n\n## Features and Capabilities\nThe React implementation showcases:\n- Multiple polar line series with shared theme\n- Custom [RadianLabelProvider](https://www.scichart.com/documentation/js/v4/typedoc/classes/radianlabelprovider.html) for angular axis\n- Dynamic data generation for mathematical functions\n- Clean component architecture following [React integration guidelines](https://www.scichart.com/documentation/js/v4/TutorialReusableReactComponent.html)",
            },
            angular: {
                subtitle:
                    "Creates many **Angular Polar Line Containing simple coordinate pairs, enhanced harts** using SciChart.js, with the following features: data labels, line interpolation, pointMarkers, gradient palette stroke, startup animations.",
                title: "Angular Polar Line Chart",
                pageTitle: "Angular Polar Line Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Polar Line Chart - Angular\n\n## Overview\nThis Angular example demonstrates how to create a **Polar Line Chart** using SciChart's Angular component. The implementation showcases polar line series with various configurations in a standalone Angular component.\n\n## Technical Implementation\nThe chart is configured using the `ScichartAngularComponent` with an `initChart` input property that points to the initialization function. Key aspects include:\n- Standalone component architecture\n- Clean separation of chart configuration from component logic\n- Proper resource cleanup with surface disposal\n\nThe example uses [PolarLineRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarlinerenderableseries.html) with various customization options, including [EllipsePointMarker](https://www.scichart.com/documentation/js/v4/typedoc/classes/ellipsepointmarker.html) for data points. Interactive features are enabled through [PolarMouseWheelZoomModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmousewheelzoommodifier.html) and other polar-specific modifiers.\n\n## Features and Capabilities\nThe Angular implementation highlights:\n- Custom palette providers for dynamic line coloring\n- Angular-specific integration patterns\n- Performance optimization through [WebAssembly rendering](https://www.scichart.com/documentation/js/v4/WebAssembly.html)\n- Clean component architecture following [Angular best practices](https://angular.io/guide/standalone-components)",
            },
        },
        documentationLinks: [
            {
                href: "http://stagingdemo2.scichart.com/documentation/docs/2d-charts/chart-types/polar-line-renderable-series/",
                title: "This specific page in the JavaScript Polar Line Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Line Chart Documentation",
            },
        ],
        path: "polar-line-chart",
        metaKeywords: "polar, line, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarLineChart",
        thumbnailImage: "javascript-polar-line-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
