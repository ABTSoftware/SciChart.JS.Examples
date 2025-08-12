import exp from "constants";
import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "OilAndGasDashboard",
        id: "featuredApps_showcases_oilandgasdashboard",
        imagePath: "javascript-oil-gas-explorer-dashboard-charts.jpg",
        description:
            "This is an example of the kind of complex, multi-chart dashboards used in the oil and gas industry.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "This is an example of the kind of complex, multi-chart dashboards used in the oil and gas industry.",
                title: "Oil & Gas Explorer JavaScript Dashboard",
                pageTitle: "Oil & Gas Explorer JavaScript Dashboard",
                metaDescription: "Demonstrates how to create Oil and Gas Dashboard",
                markdownContent:
                    "## Oil And Gas Dashboard (JavaScript)\n\n### Overview\nThis example demonstrates an Oil And Gas Dashboard built using SciChart.js with a focus on a JavaScript implementation. The dashboard renders multiple 2D and 3D charts, incorporating interactive legends, custom SVG grid backgrounds, and synchronized zooming and panning across charts. Its purpose is to showcase high-performance data visualization techniques tailored for the Oil And Gas industry.\n\n### Technical Implementation\nThe implementation modularizes chart initialization by separating each chart into dedicated modules. This design promotes a clean separation of concerns and easier maintainability. Multiple vertical 2D charts are synchronized using the powerful [SciChartVerticalGroup](https://www.scichart.com/documentation/js/current/SynchronizingVerticalCharts.html) feature, ensuring that interactions such as zooming, panning, and crosshair tracking are coordinated across charts.\n\nEnhanced interactivity is achieved through the integration of the [RolloverModifier](https://www.scichart.com/documentation/js/current/RolloverModifier.html), which provides real-time tooltips and crosshair cursors. This modifier is configured to share a common modifier group across the vertical charts, delivering a unified user experience.\n\nThe dashboard also applies a custom SVG grid background to the shale chart by embedding inline SVG within its container. This approach allows for detailed customization of grid lines and background patterns, contributing to the overall aesthetic and clarity of the visualization. Further performance considerations, such as leveraging WebGL rendering for handling large datasets, are discussed in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation.\n\n### Features and Capabilities\n**Chart Grouping and Synchronization:** Multiple vertical charts are grouped and synchronized using the `SciChartVerticalGroup`, which ensures consistent zooming and panning behaviors. Additional technical details are available in the [Synchronizing Vertical Charts](https://www.scichart.com/documentation/js/current/SynchronizingVerticalCharts.html) documentation.\n\n**Advanced Chart Modifiers:** The use of the `RolloverModifier` enriches the user interaction experience by providing dynamic, real-time tooltips and crosshair indicators. Developers can refer to the [RolloverModifier API Documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifier.html) for further customization options.\n\n**Custom Theming and Styling:** Custom themes are implemented to control colors and styles across both 2D and 3D charts. This includes customization of grid strokes, legend text, and series colors. Techniques for theming are well documented in the [Using Theme Manager](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) guide.\n\n### Integration and Best Practices\nEven though this example is built with JavaScript, it demonstrates integration practices that also apply to frameworks like React. For instance, developers can apply responsive design principles using media query techniques similar to those described in Material UI’s [useMediaQuery](https://mui.com/material-ui/react-use-media-query/?srsltid=AfmBOoq2OPMf1y-sOmU6C7UZyFRTWvKZirts5xtJReSh1vdznCO-Zr8_). The modular design of the chart initializations, along with techniques for synchronizing chart views, provides a solid foundation for building complex dashboards. Detailed guidance on linking multiple charts is available in the [Linking Multiple Charts](https://www.scichart.com/documentation/js/current/Tutorial%2009%20-%20Linking%20Multiple%20Charts.html) resource.\n\n### Conclusion\nThis Oil And Gas Dashboard example illustrates a high-performance, modular approach to creating synchronized 2D and 3D charts using SciChart.js in a JavaScript environment. By leveraging features such as chart grouping, advanced modifiers, custom theming, and performance optimizations, developers can build interactive and responsive dashboards with rich data visualization capabilities. Further details and best practices can be explored in the corresponding documentation links.",
            },
            react: {
                subtitle:
                    "This is an example of the kind of complex, multi-chart dashboards used in the oil and gas industry.",
                title: "Oil & Gas Explorer React Dashboard",
                pageTitle: "Oil & Gas Explorer React Dashboard",
                metaDescription: "Demonstrates how to create Oil and Gas Dashboard",
                markdownContent:
                    "## Oil And Gas Explorer React Dashboard\n\n### Overview\nThis example demonstrates a complex multi-chart dashboard tailored for the oil and gas industry using React. The dashboard integrates both 2D and 3D charts to deliver an advanced visualization experience, enabling users to explore various datasets through a responsive and interactive interface.\n\n### Technical Implementation\nThe implementation utilizes React functional components along with the `<SciChartReact/>` component, part of [scichart-react](https://www.scichart.com/blog/react-charts-with-scichart-js/) to instantiate individual chart instances. Multiple chart initializers are employed, including several 2D charts and one 3D chart, each configured through dedicated initialization functions. A key feature is the use of the `SciChartVerticalGroup` to group selected 2D charts for synchronized zooming, panning, and rollover interactions – a technique detailed in the [Synchronizing Multiple Charts documentation](https://www.scichart.com/documentation/js/current/Synchronizing%20Multiple%20Charts.html). React hooks such as useMediaQuery and useTheme from Material-UI are used to detect screen size changes and render a responsive layout, ensuring optimal performance on both desktop and mobile devices.\n\n### Features and Capabilities\nThe dashboard features advanced customization such as detailed theming via custom theme objects defined in a separate module, which provides a consistent look and feel across all charts. Interactive capabilities are enhanced through the integration of modifiers like the `RolloverModifier` for improved tooltip and crosshair functionality. This combination of multiple advanced charts with synchronized interactions delivers a robust platform for real-time data exploration.\n\n### Integration and Best Practices\nThis example follows best practices for React integration by leveraging components such as `<SciChartReact/>` for chart instantiation and `ChartGroupLoader` for managing multiple chart instances efficiently. Responsive design is achieved through the intelligent use of [useMediaQuery](https://medium.com/@dwinTech/responsive-design-with-usemediaquery-in-react-8bccf35f306f) which conditionally renders sidebars according to screen size. Performance optimization is further enhanced by grouping charts using `SciChartVerticalGroup`, a practice that aligns with recommendations in multi-chart dashboard implementations found on the [SciChart React GitHub repository](https://github.com/ABTSoftware/scichart-react). Overall, this example showcases how to build a highly interactive, responsive, and themed dashboard using SciChart.js in a React environment.",
            },
            angular: {
                subtitle:
                    "This is an example of the kind of complex, multi-chart dashboards used in the oil and gas industry.",
                title: "Oil & Gas Explorer Angular Dashboard",
                pageTitle: "Oil & Gas Explorer Angular Dashboard",
                metaDescription: "Demonstrates how to create Oil and Gas Dashboard",
                markdownContent:
                    "## Oil & Gas Explorer Angular Dashboard\n\n### Overview\nThis example demonstrates a complex multi-chart dashboard built for Angular applications targeting the oil and gas industry. It showcases the integration of multiple 2D and 3D charts to deliver an advanced, interactive visualization experience within an Angular framework.\n\n### Technical Implementation\nThe dashboard takes advantage of Angular’s lifecycle management to initialize and destroy SciChart.js charts efficiently in line with best practices outlined in [Angular Lifecycle Hooks](https://angular.io/guide/lifecycle-hooks). A key implementation detail is the grouping of individual 2D charts using the `SciChartVerticalGroup`, which facilitates synchronized zooming, panning, and rollover interactions as described in the [Synchronizing Multiple Charts](https://www.scichart.com/documentation/js/current/Synchronizing%20Multiple%20Charts.html) documentation. The example also applies responsive design strategies to adjust the layout based on screen size, ensuring optimal performance and usability on both desktop and mobile environments.\n\n### Features and Capabilities\nThis dashboard includes real-time data interaction capabilities and employs advanced chart features such as interactive modifiers like the `RolloverModifier` to enhance tooltip and crosshair functionality. The theming and styling of the charts are managed via a dedicated theme module, allowing for a consistent and branded user experience, which aligns with techniques discussed in [Using Theme Manager - JavaScript Chart - SciChart](https://www.scichart.com/example/javascript-chart/javascript-chart-themes/).\n\n### Integration and Best Practices\nThe implementation adheres to Angular integration best practices by utilizing dependency injection for managing themes and services responsible for chart initialization. Each chart component is designed to be modular and easily maintainable, a strategy that supports long-term scalability and performance optimization. This design approach, combined with the efficient use of chart grouping and responsive layout management, offers valuable insights into constructing high-performance, interactive dashboards within an Angular environment. Further insights into Angular integration with high-performance JavaScript charts can be found in the [Advanced JavaScript Chart and Graph Library | SciChart JS](https://www.scichart.com/javascript-chart-features/) resource.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "oil-and-gas-dashboard-showcase",
        metaKeywords: "oil gas vertical chart javascript chart performance",
        onWebsite: true,
        filepath: "FeaturedApps/ShowCases/OilAndGasDashboard",
        thumbnailImage: "javascript-oil-gas-explorer-dashboard-charts.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "max-width",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

export const oilAndGasExplorerDashboard = createExampleInfo(metaData);
export default oilAndGasExplorerDashboard;
