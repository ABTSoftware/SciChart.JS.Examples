import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarPartialArc",
        id: "chart2D_polarCharts_PolarPartialArc",
        imagePath: "javascript-polar-partial-chart.jpg",
        description:
            "Creates a **JavaScript Polar Partial Arc** using SciChart.js, which can bend from a full Polar Circle, all the way to a cartesian-like arc.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Partial Arc** using SciChart.js, which can bend from a full Polar Circle, all the way to a cartesian-like arc.",
                title: "JavaScript Polar Partial Arc",
                pageTitle: "JavaScript Polar Partial Arc | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Polar Partial Arc Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create a **partial polar chart** in JavaScript using SciChart.js, where the polar coordinate system is configured to display only a small arc segment. The chart mimics Cartesian coordinates by setting extreme values for [innerRadius](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#innerradius) and [totalAngle](https://www.scichart.com/documentation/js/v4/typedoc/classes/polaraxisbase.html#totalangle) properties.\n\n### Technical Implementation\nThe implementation uses [SciChartPolarSurface.create()](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) to initialize the chart with radial and angular axes. A [PolarLineRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polinelineerenderableseries.html) displays petal-shaped data, while modifiers like [PolarZoomExtentsModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html) enable interactivity. The animation transitions between partial and full polar views using [GenericAnimation](https://www.scichart.com/documentation/js/v4/typedoc/classes/genericanimation.html).\n\n### Features and Capabilities\nKey features include dynamic adjustment of polar chart parameters, smooth animations between view states, and interactive zoom/pan behavior. The example showcases how polar charts can visually approximate Cartesian coordinates when configured with specific axis properties.\n\n### Integration and Best Practices\nThe implementation follows best practices for asynchronous chart initialization and proper resource cleanup. Developers can extend this example by incorporating real-time data updates or additional polar series types as described in the [Polar Chart documentation](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/polar-chart-type).",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Partial Arc** using SciChart.js, which can bend from a full Polar Circle, all the way to a cartesian-like arc.",
                title: "React Polar Partial Arc",
                pageTitle: "React Polar Partial Arc | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Polar Partial Arc Chart - React\n\n### Overview\nThis React example demonstrates a **partial polar chart** using SciChart.js, configured through the [SciChartReact](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartreact.html) component. The chart displays a small arc segment of polar coordinates, visually resembling Cartesian axes.\n\n### Technical Implementation\nThe chart is initialized via an `initChart` function passed to SciChartReact, creating a [SciChartPolarSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) with customized [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) instances. The example includes interactive modifiers and animations that update component state through callbacks.\n\n### Features and Capabilities\nThe implementation features dynamic control over polar chart parameters, smooth animated transitions between view states, and real-time updates to React state. The [PolarLineRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polinelineerenderableseries.html) demonstrates efficient rendering of polar data.\n\n### Integration and Best Practices\nThis example follows React best practices by managing chart lifecycle through the SciChartReact component and demonstrating proper cleanup. For more complex implementations, refer to the [React integration guide](https://www.scichart.com/documentation/js/v4/getting-started/integrating-scichart-with-react.html).",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Partial Arc** using SciChart.js, which can bend from a full Polar Circle, all the way to a cartesian-like arc.",
                title: "Angular Polar Partial Arc",
                pageTitle: "Angular Polar Partial Arc | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Polar Partial Arc Chart - Angular\n\n### Overview\nThis Angular example showcases a **partial polar chart** using the [SciChart Angular](https://www.npmjs.com/package/scichart-angular) component. The chart demonstrates how polar coordinates can be configured to display a small arc segment, visually resembling Cartesian axes.\n\n### Technical Implementation\nThe chart is initialized through the `[initChart]` input binding to a standalone component. The implementation uses [SciChartPolarSurface.create()](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) with customized polar axes and includes interactive modifiers like [PolarZoomExtentsModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html).\n\n### Features and Capabilities\nThe example features smooth animations between partial and full polar views using [GenericAnimation](https://www.scichart.com/documentation/js/v4/typedoc/classes/genericanimation.html), and demonstrates Angular-friendly callback patterns for parameter updates. The petal-shaped data series illustrates polar coordinate plotting techniques.\n\n### Integration and Best Practices\nThis implementation follows Angular best practices by using standalone components and proper resource cleanup. For more advanced scenarios, see the [Angular integration documentation](https://www.scichart.com/documentation/js/v4/getting-started/integrating-scichart-with-angular.html)."
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Partial Arc documentation will help you to get started",
                linkTitle: "JavaScript Polar Partial Arc Documentation",
            },
        ],
        path: "polar-partial-arc",
        metaKeywords: "polar, label, polarPartialArc, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarPartialArc",
        thumbnailImage: "javascript-polar-partial-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
