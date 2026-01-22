import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarWindroseColumnChart",
        id: "chart2D_polarCharts_PolarWindroseColumnChart",
        imagePath: "javascript-polar-windrose-column-chart.jpg",
        description:
            "Creates a **JavaScript Windrose Column Chart** using SciChart.js, via **PolarStackedColumnRenderableSeries** and a custom axis LabelProvider for cardinal directions.",
        tips: [],
        alsoKnownAs:
            "This plot type is Known As: **Wind Rose Chart** and **Wind Direction Chart** or **Wind Speed Chart**.",
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Windrose Column Chart** using SciChart.js, via **PolarStackedColumnRenderableSeries** and a custom axis LabelProvider for cardinal directions.",
                title: "JavaScript Windrose Plot | Polar Stacked Radial Column Chart",
                pageTitle: "JavaScript Windrose Plot | Polar Stacked Radial Column Chart",
                metaDescription:
                    "View the JavaScript Windrose Chart example to display directional data with stacked columns in a polar layout. Try the polar chart demo with customizable labels",
                markdownContent:
                    "## Polar Windrose Column Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create a **Polar Windrose Column Chart** using SciChart.js in JavaScript. The chart visualizes directional data with stacked columns in a polar coordinate system, commonly used for wind speed/direction analysis.\n\n### Technical Implementation\nThe chart uses [SciChartPolarSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html) with [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) for radial and angular axes. A custom [CustomNESWLabelProvider](https://www.scichart.com/documentation/js/v4/typedoc/classes/numericlabelprovider.html) displays compass directions. Data is generated via `getBiasedRandomWalkInBounds` function to create realistic wind patterns.\n\n### Features and Capabilities\nThe implementation uses [PolarStackedColumnCollection](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedcolumncollection.html) with multiple [PolarStackedColumnRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedcolumnrenderableseries.html) for stacked visualization. Interactive features include [PolarPanModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpanmodifier.html) and [PolarZoomExtentsModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html).\n\n### Integration and Best Practices\nThe example follows async initialization pattern with proper cleanup. Developers can extend this by adding real-time data updates or customizing the [WaveAnimation](https://www.scichart.com/documentation/js/v4/typedoc/classes/waveanimation.html) effects.",
            },
            react: {
                subtitle:
                    "Creates a **React Windrose Column Chart** using SciChart.js, via **PolarStackedColumnRenderableSeries** and a custom axis LabelProvider for cardinal directions.",
                title: "React Windrose Plot | React Polar Stacked Radial Column Chart",
                pageTitle: "React Windrose Plot | React Polar Stacked Radial Column Chart",
                metaDescription:
                    "View the React Windrose Chart example to display directional data with stacked columns in a polar layout. Try the polar chart demo with customizable labels.",
                markdownContent:
                    "## Polar Windrose Column Chart - React\n\n### Overview\nThis React example showcases a **Polar Windrose Column Chart** using SciChart.js, wrapped in a reusable component. The chart displays directional data with stacked columns in a polar layout.\n\n### Technical Implementation\nThe implementation uses [SciChartReact](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartreact.html) component with an `initChart` prop pointing to the `drawExample` function. The polar surface configuration matches the JavaScript version, using [EPolarAxisMode](https://www.scichart.com/documentation/js/v4/typedoc/enums/epolaraxismode.html) for axis setup.\n\n### Features and Capabilities\nThe chart features compass-direction labels via custom label provider and stacked columns with distinct colors. The [PolarMouseWheelZoomModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarmousewheelzoommodifier.html) enables intuitive zooming.\n\n### Integration and Best Practices\nThe example demonstrates React best practices by encapsulating chart logic in a separate function and using CSS modules for styling. For performance, consider memoizing the `initChart` callback in production apps.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Windrose Column Chart** using SciChart.js, via **PolarStackedColumnRenderableSeries** and a custom axis LabelProvider for cardinal directions.",
                title: "Angular Windrose Plot | Angular Polar Stacked Radial Column Chart",
                pageTitle: "Angular Windrose Plot | Angular Polar Stacked Radial Column Chart",
                metaDescription:
                    "View the Angular Windrose Chart example to display directional data with stacked columns in a polar layout. Try the polar chart demo with customizable labels.",
                markdownContent:
                    "## Polar Windrose Column Chart - Angular\n\n### Overview\nThis Angular standalone component demonstrates a **Polar Windrose Column Chart** using SciChart.js. The chart visualizes multi-series directional data in a polar coordinate system.\n\n### Technical Implementation\nThe component uses [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular) with the same `drawExample` function as other frameworks. The angular-specific setup includes proper TypeScript typing and standalone component architecture.\n\n### Features and Capabilities\nThe chart maintains all features from the JavaScript version including [PolarStackedColumnCollection](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarstackedcolumncollection.html) and custom label formatting. The [NumberRange](https://www.scichart.com/documentation/js/v4/typedoc/classes/numberrange.html) ensures proper axis scaling.\n\n### Integration and Best Practices\nThe example follows Angular best practices by using standalone components and proper TypeScript types. For production use, consider implementing [OnDestroy](https://angular.io/api/core/OnDestroy) for cleanup.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Windrose Column Chart documentation will help you to get started",
                linkTitle: "JavaScript Windrose Column Chart Documentation",
            },
        ],
        path: "polar-windrose-column-chart",
        metaKeywords: "polar, windrose, radial, column, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarWindroseColumnChart",
        thumbnailImage: "javascript-polar-windrose-column-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
