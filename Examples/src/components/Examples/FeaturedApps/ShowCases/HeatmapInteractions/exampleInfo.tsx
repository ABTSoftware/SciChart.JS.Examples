import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsShowCasesHeatmapInteractions",
        imagePath: "javascript-heatmap-interactions.jpg",
        description:
            "Demonstrates rich interactivity with custom modifiers using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates rich interactivity with custom modifiers using SciChart.js, High Performance JavaScript Charts",
                title: "Rich Interactions Showcase",
                pageTitle: "Rich Interactions Showcase",
                metaDescription:
                    "This demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!",
                markdownContent:
                    '# Heatmap Interactions with Vanilla JavaScript\n\n## Overview\nThis example, titled "Heatmap Interactions" (a more readable version of HeatmapInteractions), demonstrates a powerful real-time 2D wave simulation using SciChart.js implemented in vanilla JavaScript. It showcases advanced interactive features such as dynamic addition of input/output annotations and custom drag-and-drop behavior, enabling users to interact with heatmap data in real time.\n\n## Technical Implementation\nThe implementation extends the base class **ChartModifierBase2D** to create custom modifiers like AddIOModifier and PointDragModifier. These modifiers handle mouse events to add annotations and update data series, following patterns detailed in the [Custom Chart Modifier API](https://www.scichart.com/documentation/js/current/CustomChartModifierAPI.html). Coordinate transformations are managed with functions such as translateFromCanvasToSeriesViewRect, which convert canvas mouse coordinates into data coordinates via APIs described in the [Axis APIs - Convert Pixel to Data Coordinates](https://www.scichart.com/documentation/js/current/Axis%20APIs%20-%20Convert%20Pixel%20to%20Data%20Coordinates.html) documentation.\n\nInteractive annotations are used extensively; for instance, TextAnnotation prompts like "Add Input" and "Add Output" provide user interactivity. For more details on creating movable and interactive annotations, refer to the [TextAnnotation documentation](https://www.scichart.com/documentation/js/current/TextAnnotation.html).\n\nReal-time simulation is achieved by updating a UniformHeatmapDataSeries on a recurring timer, effectively simulating 2D wave propagation. This approach is well covered in the [Updating (Realtime) Heatmaps](https://www.scichart.com/documentation/js/current/Updating-Uniform-Heatmaps.html) documentation. Additionally, custom animations using GenericAnimation add fade-in help messages, ensuring smooth visual transitions; you can learn more about this in the [Generic Animations](https://www.scichart.com/documentation/js/current/Generic%20Animations.html) documentation.\n\n## Features and Capabilities\n- **Dynamic Annotation Handling:** Users can add or remove annotations interactively, with snapping behavior managed by properties like stepSize.\n- **Real-time Data Updates:** The heatmap is continuously updated to simulate wave propagation in real time.\n- **Drag and Drop Interaction:** Custom modifiers enable hit testing and dynamic updating of XyDataSeries data points; see [Custom ChartModifiers - Part 5](https://support.scichart.com/support/solutions/articles/101000519450-custom-chartmodifiers-part-5-select-and-drag-a-data-point) for more details.\n- **High DPI Optimization:** The implementation leverages DpiHelper.PIXEL_RATIO to ensure accurate interactions on high-resolution displays.\n\n## Integration and Best Practices\nThis example is built purely with vanilla JavaScript, avoiding additional frameworks such as Angular or React. Its modular structure separates chart initialization, modifier logic, and simulation updates, which aligns with best practices for maintainable and high-performance interactive chart applications. Developers are encouraged to consult the provided documentation links to gain deeper insights into customizing chart behavior and optimizing performance with SciChart.js.',
            },
            react: {
                subtitle:
                    "Demonstrates rich interactivity with custom modifiers using SciChart.js, High Performance JavaScript Charts",
                title: "Rich Interactions Showcase",
                pageTitle: "Rich Interactions Showcase",
                metaDescription:
                    "This demo showcases the incredible realtime performance of our React charts by updating the series with millions of data-points!",
                markdownContent:
                    "# Heatmap Interactions - React\n\n## Overview\nThis example demonstrates a highly interactive 2D wave simulation using SciChart.js integrated in a React application. It showcases dynamic heatmap updates along with interactive cross-sectional, input, and output chart features, all driven by custom modifiers and annotations.\n\n## Technical Implementation\nThe application uses React components such as SciChartReact and SciChartGroup to instantiate multiple synchronized charts. Custom modifiers like AddIOModifier and PointDragModifier enable advanced user interactions including hit-testing, drag-and-drop for updating data series, and on-the-fly annotation editing. The implementation leverages features from SciChart.js to manage high DPI scaling using DpiHelper (see [Retina Support and Browser Zoom](https://www.scichart.com/documentation/js/current/Retina%20Support%20and%20Browser%20Zoom.html)) ensuring performance across all devices.\n\n## Features and Capabilities\nThe example provides real-time updates via continuous simulation of heatmap data, interactive annotations for input/output configuration, and synchronized cross-sectional views. It also includes custom drag-and-drop capabilities to adjust data series, and utilizes efficient [real-time heatmap data updates](https://www.scichart.com/documentation/js/current/Updating-Uniform-Heatmaps.html) along with smooth data animations ([Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html)).\n\n## Integration and Best Practices\nThe React integration follows [best practices for React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/) by managing chart lifecycle state with useState and useRef. Developers benefit from the natural grouping of multiple SciChartReact components via SciChartGroup, which simplifies synchronization and state management. Additionally, the use of custom modifiers and annotations for interactive editing is aligned with advanced [custom chart modifiers and annotations](https://demo.scichart.com/react/editable-annotations) practices, making the overall implementation adaptable and highly performant.\n\nThis example is a comprehensive showcase of how to build rich, interactive, and real-time charting applications with SciChart.js in React.",
            },
            angular: {
                subtitle:
                    "Demonstrates rich interactivity with custom modifiers using SciChart.js, High Performance JavaScript Charts",
                title: "Rich Interactions Showcase",
                pageTitle: "Rich Interactions Showcase",
                metaDescription:
                    "This demo showcases the incredible realtime performance of our Angular charts by updating the series with millions of data-points!",
                markdownContent:
                    "# Heatmap Interactions Showcase in Angular\n\n## Overview\nThis example demonstrates a highly interactive 2D wave simulation implemented in Angular using SciChart.js. The application simulates dynamic heatmap data while incorporating multiple synchronized charts that include cross-sectional views, input drivers, and historical outputs. The simulation is enriched with interactive annotations and custom modifiers, allowing users to add, drag, and remove inputs and outputs seamlessly.\n\n## Technical Implementation\nThe Angular implementation leverages the SciChartAngularComponent and SciChartGroup to initialize and synchronize multiple charts. The charts are created through the function returned by getChartsInitializationApi(), which sets up the main heatmap chart, cross section chart, input chart, and history chart with customized axes and data series. Custom modifiers, such as the AddIOModifier and PointDragModifier, extend the ChartModifierBase2D to capture mouse events, perform hit testing, and implement drag-and-drop functionality. These custom modifiers enable users to interactively add annotations and update data in real-time. For instance, real-time heatmap updates are performed using a simulation loop with setTimeout, updating the UniformHeatmapDataSeries, and are implemented following the guidelines for [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html). High DPI support is achieved using DpiHelper, as documented in [Retina Support and Browser Zoom](https://www.scichart.com/documentation/js/current/Retina%20Support%20and%20Browser%20Zoom.html). Additionally, custom chart modifiers are built in line with the [Custom Chart Modifier API](https://www.scichart.com/documentation/js/current/CustomChartModifierAPI.html).\n\n## Features and Capabilities\nThe example provides several advanced features: \n- **Real-time Updates:** The 2D wave simulation continuously updates the heatmap data with dynamic visual effects, following techniques similar to those outlined in [Updating Uniform Heatmaps](https://www.scichart.com/documentation/js/current/Updating-Uniform-Heatmaps.html).\n- **Interactive Annotations:** Users can add, resize, and drag annotations such as inputs, outputs, and axis markers, with smooth animation effects powered by GenericAnimation ([Generic Animations](https://www.scichart.com/documentation/js/current/Generic%20Animations.html)).\n- **Hit Testing and Drag Events:** Through the implementation of a custom PointDragModifier, the example demonstrates precise hit testing and drag event management, ensuring that data points can be modified interactively as explained in [Custom ChartModifiers - Part 5 - Select and Drag a Data-Point](https://support.scichart.com/support/solutions/articles/101000519450-custom-chartmodifiers-part-5-select-and-drag-a-data-point).\n\n## Integration and Best Practices\nThis Angular integration showcases best practices by carefully managing chart lifecycle and synchronization. The use of SciChartGroup ensures that zooming, panning, and crosshair synchronization work seamlessly across multiple charts. The overall structure adheres to Angular component patterns and leverages dependency injection for configuration and theme management. Developers are encouraged to review [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) and [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) for further insights into performance optimization and optimal integration techniques.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "heatmap-interactions",
        metaKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/ShowCases/HeatmapInteractions",
        thumbnailImage: "javascript-heatmap-interactions.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const heatmapInteractionsExampleInfo = createExampleInfo(metaData);
