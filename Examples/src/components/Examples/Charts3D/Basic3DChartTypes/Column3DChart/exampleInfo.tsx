import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "Column3DChart",
        id: "chart3D_basic3DChartTypes_Column3DChart",
        imagePath: "javascript-3d-column-chart.jpg",
        description:
            "The SciChart.js **JavaScript 3D Column Chart** uses uses XYZ data and can show sparse or grid based columns, with indivdual column coloring and a variety of column shapes.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "The SciChart.js **JavaScript 3D Column Chart** uses uses XYZ data and can show sparse or grid based columns, with indivdual column coloring and a variety of column shapes.",
                title: "JavaScript Column 3D Chart",
                pageTitle: "JavaScript 3D Column Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Create detailed JavaScript 3D Column Chart using SciChart's 5-star rated JavaScript chart library. Supports large datasets",
                markdownContent:
                    '# Column 3D Chart with JavaScript\n\n### Overview\nThis example, titled "Column 3D Chart", demonstrates how to create and dynamically update a fully interactive 3D column chart using SciChart.js in JavaScript. The example showcases how to configure a 3D chart environment without the need for additional frameworks or hooks.\n\n### Technical Implementation\nThe implementation begins by creating a SciChart3DSurface along with a WebAssembly context using the method [SciChart3DSurface.create()](https://www.scichart.com/documentation/js/current/Creating%20your%20first%20SciChartSurface3D.html). The camera is configured using a [CameraController](https://www.scichart.com/documentation/js/current/The%20SciChartSurface%20Camera.html) along with [Vector3](https://www.scichart.com/documentation/js/current/typedoc/classes/vector3.html) to set the position and target of the 3D view. Three numeric axes are created using [NumericAxis3D](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis3d.html) to define the chart’s X, Y, and Z dimensions. Data is managed with an [XyzDataSeries3D](https://www.scichart.com/documentation/js/current/typedoc/classes/xyzdataseries3d.html) and displayed through a [ColumnRenderableSeries3D](https://www.scichart.com/documentation/js/current/typedoc/classes/columnrenderableseries3d.html). The code also implements dynamic data updates with functions that interpolate colors (using functions such as parseColorToTArgb and toHex) and update metadata for thousands of points. Interaction is enhanced by enabling modifiers such as [MouseWheelZoomModifier3D](https://www.scichart.com/documentation/js/current/typedoc/classes/mousewheelzoommodifier3d.html) and [OrbitModifier3D](https://www.scichart.com/documentation/js/current/OrbitModifier3D.html) which facilitate zooming and orbiting in the 3D scene.\n\n### Features and Capabilities\nThis example highlights key features including real-time dynamic data updates, advanced visualization customization like switching between different 3D point marker types (Cylinder, Cube, Pyramid, Sphere), and fine control over column dimensions via properties such as dataPointWidthX and dataPointWidthZ. Different color modes are available (X, XZ, Height, Series) which enable developers to adjust the visual appearance of the chart by dynamically assigning metadata colors based on position or value.\n\n### Integration and Best Practices\nThe example is implemented entirely in plain JavaScript, ensuring simplicity and ease of integration into any web application without the overhead of frameworks like React. The initialization process leverages [SciChart3DSurface.create()](https://www.scichart.com/documentation/js/current/Creating%20your%20first%20SciChartSurface3D.html) for optimal setup and includes performance optimizations through efficient data-series updates and the use of a WebAssembly context. Developers are encouraged to refer to the [API documentation for SciChart.js](https://www.scichart.com/documentation/js/current/typedoc/index.html) and the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guide for additional techniques on optimizing performance in 3D charts.',
            },
            react: {
                subtitle:
                    "The SciChart.js **React 3D Column Chart** uses uses XYZ data and can show sparse or grid based columns, with indivdual column coloring and a variety of column shapes.",
                title: "React Column 3D Chart",
                pageTitle: "React 3D Column Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Create detailed React 3D Column Chart using SciChart's 5-star rated JavaScript chart library. Supports large datasets",
                markdownContent:
                    "## React Column 3D Chart\n\n### Overview\nThis example demonstrates a 3D Column Chart built with SciChart.js and integrated into a **React** application. It visualizes XYZ data as a grid of 3D columns with adjustable shapes and personalized coloring, providing an interactive way to explore data. For more insights on integrating SciChart with React, refer to the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) article.\n\n### Technical Implementation\nThe chart is initialized asynchronously using the `<SciChartReact/>` component, which creates a SciChart3DSurface with numeric axes and interactive modifiers like Mouse Wheel Zoom and Orbit. The implementation harnesses **React hooks** such as useRef and useState to manage chart instances and update properties in real time. The dynamic updates, such as changing column shapes and color modes, are implemented by updating the renderable series properties directly. Developers looking to build reusable chart components in React can explore [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) for further details.\n\n### Features and Capabilities\nThis example includes several advanced features such as real-time color interpolation based on data values, adjustable point width via a slider, and the ability to switch between different column marker types (Cylinder, Cube, Pyramid, Sphere). These capabilities provide users with interactive customization options, ensuring that the chart’s visualization adapts dynamically to state changes. For discussions on dynamic chart updates with React, see the insights on [Dynamic Chart Updates using React Hooks](https://stackoverflow.com/questions/67634503/updating-colors-dynamically-using-react-hooks).\n\n### Integration and Best Practices\nThe integration follows best practices by utilizing the `<SciChartReact/>` component for seamless asynchronous initialization and effective state management with React hooks. The use of useRef enables direct manipulation of the chart instance for performance improvements, while the React state is used to control interactive elements, ensuring efficient re-rendering. Additional guidance on performance optimization can be found in the article on [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/), and further elaboration on managing React component state is available via the [useRef documentation](https://react.dev/reference/react/useRef).",
            },
            angular: {
                subtitle:
                    "The SciChart.js **Angular 3D Column Chart** uses uses XYZ data and can show sparse or grid based columns, with indivdual column coloring and a variety of column shapes.",
                title: "Angular Column 3D Chart",
                pageTitle: "Angular 3D Column Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Create detailed Angular 3D Column Chart using SciChart's 5-star rated JavaScript chart library. Supports large datasets",
                markdownContent:
                    "## Angular Column 3D Chart\n\n### Overview\nThis example demonstrates an interactive **3D Column Chart** built with SciChart.js and integrated within an **Angular** application. The chart renders a grid of 3D columns using XYZ data, allowing for dynamic updates in column shape and color modes. Developers can refer to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide for an overview of setting up SciChart in Angular projects.\n\n### Technical Implementation\nThe implementation initializes the 3D chart asynchronously using SciChart.js, creating a SciChart3DSurface with numeric axes and attaching interactive modifiers such as Mouse Wheel Zoom and Orbit as described in the [MouseWheelZoomModifier Documentation](https://www.scichart.com/documentation/js/current/MouseWheelZoomModifier.html). The chart is configured using asynchronous functions to ensure that the WebGL context and chart surface are fully loaded before any updating of the data series occurs. For guidance on asynchronous chart initialization and setup, developers can consult the [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html).\n\n### Features and Capabilities\nThe example offers real-time update capabilities where dynamic changes such as modifying the column marker type and adjusting the data point width are applied instantly to the chart. The code employs dynamic color interpolation to change column colors based on data values, a process aligned with the documented techniques in the [Append, Insert, Update, Remove | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/DataSeries_AppendInsertUpdateRemove.html). Additionally, it uses TypeScript enums to seamlessly configure various options for column shapes (Cylinder, Cube, Pyramid, Sphere) and color modes, enhancing code readability and maintainability.\n\n### Integration and Best Practices\nAlthough the example sources include components that appear in React, the Angular integration focuses on leveraging SciChart.js within an Angular project by using asynchronous initialization and Angular Material controls for user interaction. The integration uses Angular Material form controls to adjust chart settings such as column shape and color mode, following best practices outlined in resources like [Integrating Angular ChartJs and Angular Material](https://kenoleon.github.io/Front-End-Web-Dev-UI-UX/integrating-angularjs-chartjs). Performance optimizations are inherent in the design, ensuring that updates do not hinder the interactivity of the 3D chart. Developers are encouraged to explore additional performance optimization techniques in the SciChart.js ecosystem to further enhance real-time interactivity.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/TheColumn3DChartType.html",
                title: "SciChart.js 3D Column Chart Documentation",
                linkTitle: "JavaScript 3D Column Chart Documentation",
            },
        ],
        path: "3d-column-chart",
        metaKeywords: "3d, column, chart, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "Charts3D/Basic3DChartTypes/Column3DChart",
        thumbnailImage: "javascript-3d-column-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false
    };
//// End of computer generated metadata

export const column3DChartExampleInfo = createExampleInfo(metaData);
export default column3DChartExampleInfo;
