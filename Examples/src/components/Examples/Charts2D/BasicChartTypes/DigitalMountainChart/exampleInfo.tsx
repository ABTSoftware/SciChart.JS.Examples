import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "DigitalMountainChart",
        id: "chart2D_basicCharts_DigitalMountainChart",
        imagePath: "javascript-digital-mountain-chart.jpg",
        description:
            "For Digital Mountain Charts, you can use this demonstration to see how to create a **JavaScript Digital Mountain Chart** using SciChart.js, and its powerful JavaScript Chart Library.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "For Digital Mountain Charts, you can use this demonstration to see how to create a **JavaScript Digital Mountain Chart** using SciChart.js, and its powerful JavaScript Chart Library.",
                title: "JavaScript Digital Mountain Chart",
                pageTitle: "JavaScript Digital Mountain Chart | JavaScript Chart Example",
                metaDescription:
                    "Create JavaScript Digital Mountain Chart with a stepped-line visual effect. Get your free trial of SciChart's 5-star rated JavaScript Chart Component now.",
                markdownContent:
                    "## Digital Mountain Chart in JavaScript\n\n### Overview\nThis example demonstrates how to create a high-performance digital mountain chart using SciChart.js with JavaScript. It renders a stepped-line (digital) mountain series with gradient fills and smooth wave animations, providing an engaging data visualization experience in a WebGL-powered environment.\n\n### Technical Implementation\nThe chart is initialized by creating a `SciChartSurface` using the native JavaScript API, as explained in the [Tutorial 01 - Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html) guide. Numeric axes are configured with the `NumericAxis` class and fine-tuned with the `NumberRange` `growBy` property ([NumericAxis API Documentation](https://www.scichart.com/documentation/js/current/NumericAxis.html)) to ensure proper spacing. A digital mountain series is built using `FastMountainRenderableSeries` with the `isDigitalLine` property set to true, and its visual appeal is enhanced via a gradient fill defined by `GradientParams` ([GradientParams API Documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/gradientparams.html)). The series also incorporates a [WaveAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/waveanimation.html) effect to create dynamic startup animations. Interactive modifiers such as `ZoomExtentsModifier`, `RubberBandXyZoomModifier`, and `MouseWheelZoomModifier` are added to enable intuitive zooming and panning, following guidelines from the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) documentation.\n\n### Features and Capabilities\nKey features include real-time data simulation via a random walk generator, digital stepped-line rendering for clear data visualization, and a custom gradient fill that transitions seamlessly to transparency. These enhancements, combined with smooth wave animations, deliver an engaging and high-fidelity charting experience.\n\n### Integration and Best Practices\nThis JavaScript example emphasizes direct instantiation and granular control over chart components without any abstraction layers such as builder APIs. It implements a robust resource management strategy by returning a destructor function to clean up the `SciChartSurface`, which aligns with best practices for performance optimization as described in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) guide. This approach facilitates maintainability and efficient resource management in WebGL-based applications.\n",
            },
            react: {
                subtitle:
                    "For Digital Mountain Charts, you can use this demonstration to see how to create a **React Digital Mountain Chart** using SciChart.js, and its powerful JavaScript Chart Library.",
                title: "React Digital Mountain Chart",
                pageTitle: "React Digital Mountain Chart | JavaScript Chart Example",
                metaDescription:
                    "Create React Digital Mountain Chart with a stepped-line visual effect. Get your free trial of SciChart's 5-star rated JavaScript Chart Component now.",
                markdownContent:
                    "## React Digital Mountain Chart - SciChart.js\n\n### Overview\nThis example demonstrates how to create a **React Digital Mountain Chart** using SciChart.js. The chart renders a digital mountain series with a stepped-line visual effect, enhanced by wave animation and a linear gradient fill. Data is generated via a random walk, simulating realistic trends in a high-performance WebGL environment.\n\n### Technical Implementation\nThe chart is integrated into a React application using the [SciChartReact component](https://www.scichart.com/blog/react-charts-with-scichart-js/), which initializes the chart through a prop-based method. Within the initialization function, a `SciChartSurface` is created and configured with `NumericAxis` for both X and Y dimensions. A `FastMountainRenderableSeries` is constructed with digital line rendering and a gradient defined via `GradientParams`. Additional technical details can be found in the [Digital Mountain Series Documentation](https://www.scichart.com/documentation/js/current/The%20Digital%20(Step)%20Mountain%20Series%20Type.html).\n\n### Features and Capabilities\nThe example incorporates advanced features such as a `WaveAnimation` effect with fade to deliver a compelling visual presentation. Interactive modifiers including `ZoomExtentsModifier`, `RubberBandXyZoomModifier`, and `MouseWheelZoomModifier` are added to enable intuitive data exploration. These features are optimized for performance, which is essential for handling real-time data updates, as discussed in the [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).\n\n### Integration and Best Practices\nReact integration is accomplished via a prop-based chart initialization pattern that ensures a clean and reusable component design, as highlighted in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html). Best practices are observed by leveraging WebGL rendering for high fidelity performance and incorporating interactive chart modifiers for enhanced usability. This approach mirrors advanced implementations like those in the [React Mountain Chart example](https://scichart.com/demo/react/mountain-chart), providing a robust foundation for building interactive data visualizations in React.",
            },
            angular: {
                subtitle:
                    "For Digital Mountain Charts, you can use this demonstration to see how to create a **Angular Digital Mountain Chart** using SciChart.js, and its powerful JavaScript Chart Library.",
                title: "Angular Digital Mountain Chart",
                pageTitle: "Angular Digital Mountain Chart | JavaScript Chart Example",
                metaDescription:
                    "Create Angular Digital Mountain Chart with a stepped-line visual effect. Get your free trial of SciChart's 5-star rated JavaScript Chart Component now.",
                markdownContent:
                    "## Angular Digital Mountain Chart\n\n### Overview\nThis example demonstrates how to integrate a high-performance WebGL chart into an Angular application using SciChart.js. The chart renders a digital mountain series based on a simulated random walk data set, showcasing a stepped-line visual effect with gradient fills and smooth wave animations. For further details on the digital mountain series, refer to the [Digital Mountain Chart Documentation](https://www.scichart.com/documentation/js/current/The%20Digital%20(Step)%20Mountain%20Series%20Type.html).\n\n### Technical Implementation\nThe chart is implemented within an Angular standalone component that leverages the [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular). The component initializes the chart by passing a dedicated function that creates a `SciChartSurface`, configures *`NumericAxis`, and adds a `FastMountainRenderableSeries` configured for digital line rendering (via the `isDigitalLine` property). The series is augmented with a [WaveAnimation](https://www.scichart.com/documentation/js/current/Series%20Startup%20Animations.html) and a gradient fill constructed from `GradientParams`. This approach uses direct instantiation of the SciChart.js classes rather than a builder API, providing granular control over the chart configuration.\n\n### Features and Capabilities\nThe example includes robust interactive features such as `ZoomExtentsModifier`, `RubberBandXyZoomModifier`, and `MouseWheelZoomModifier` that enable intuitive zooming and panning. The visual capabilities are enhanced with gradient fills and dynamic animations, creating an engaging user experience. These interactive modifiers, combined with the high-performance rendering of SciChart.js, allow for real-time data presentation and exploration.\n\n### Integration and Best Practices\nBy utilizing Angular standalone components as outlined in the [Angular Standalone Components](https://angular.io/guide/standalone-components) guide, the integration remains modular and maintainable. The usage of external libraries follows recommended Angular practices as seen in [Angular Integration Techniques](https://angular.schule/blog/2019-02-third-party-libraries-and-widgets/). The component lifecycle is managed according to the [Angular lifecycle hooks](https://angular.io/guide/lifecycle-hooks), ensuring proper initialization and resource management. Additionally, adopting [Angular performance optimization](https://davembush.medium.com/angular-performance-optimization-5ec630d2b8f1) techniques aids in handling the computational demands of a WebGL-based chart, ensuring a smooth, high-fidelity user experience.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Digital%20(Step)%20Mountain%20Series%20Type.html",
                title: "Digital Mountain Chart",
                linkTitle: "JavaScript Digital Mountain Chart Documentation",
            },
        ],
        path: "digital-mountain-chart",
        metaKeywords: "digital, mountain, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/DigitalMountainChart",
        thumbnailImage: "javascript-digital-mountain-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false
    };
//// End of computer generated metadata

const digitalMountainChartExampleInfo = createExampleInfo(metaData);
export default digitalMountainChartExampleInfo;
