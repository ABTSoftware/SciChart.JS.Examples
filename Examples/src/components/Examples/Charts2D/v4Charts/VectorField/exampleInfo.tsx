import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "VectorField",
        id: "chart2D_v4Charts_VectorField",
        imagePath: "javascript-vector-field.jpg",
        description:
            "Creates a **JavaScript Vector Field** using our **FastLineSegmentRenderableSeries** paired with a custom **PaletteProvider** and optional arrow heads made with **FastTriangleRenderableSeries**",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Vector Field** using our **FastLineSegmentRenderableSeries** paired with a custom **PaletteProvider** and optional arrow heads made with **FastTriangleRenderableSeries**",
                title: "JavaScript Vector Field",
                pageTitle: "JavaScript Vector Field | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Vector Field Chart - JavaScript\n\n### Overview\nThis example demonstrates a **Vector Field Chart** implementation using SciChart.js in vanilla JavaScript. It visualizes mathematical vector fields with directional arrows, combining [FastLineSegmentRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinesegmentrenderableseries.html) for vector lines and [FastTriangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fasttrianglerenderableseries.html) for arrowheads.\n\n### Technical Implementation\nThe chart uses a [CentralAxesLayoutManager](https://www.scichart.com/documentation/js/current/typedoc/classes/centralaxeslayoutmanager.html) to center axes and calculates vector endpoints using polynomial transformations. A custom [LineSegmentPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/istrokepaletteprovider.html) applies gradient colors to line segments, while the `addArrowheads` utility generates directional markers.\n\n### Features and Capabilities\nKey features include dynamic vector field generation, color-coded line segments, and interactive modifiers like [ZoomPanModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html) and [CursorModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html) with custom tooltips. The implementation showcases WebGL-accelerated rendering of hundreds of vectors.\n\n### Integration and Best Practices\nThe example follows best practices for WASM initialization and resource cleanup. Developers can extend this pattern for scientific visualization by modifying the vector calculation logic in the drawExample function.",
            },
            react: {
                subtitle:
                    "Creates a **React Vector Field** using our **FastLineSegmentRenderableSeries** paired with a custom **PaletteProvider** and optional arrow heads made with **FastTriangleRenderableSeries**",
                title: "React Vector Field",
                pageTitle: "React Vector Field | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Vector Field Chart - React\n\n### Overview\nThis React implementation of a **Vector Field Chart** wraps the core SciChart.js visualization in a reusable [SciChartReact](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartreact.html) component. It demonstrates efficient integration of mathematical vector field visualization in a React application.\n\n### Technical Implementation\nThe chart configuration from drawExample.ts is passed via the initChart prop. React manages the component lifecycle while SciChart handles WebGL rendering. The solution uses [XyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) for vector data and implements a custom tooltip template through [CursorModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/cursormodifier.html).\n\n### Features and Capabilities\nThe component maintains all JavaScript version features including dynamic vector generation, gradient-colored segments, and interactive zoom/pan. The React wrapper adds responsive resizing and clean unmounting through SciChartReact's built-in lifecycle management.\n\n### Integration and Best Practices\nThis pattern follows React best practices by separating visualization logic (drawExample) from presentation (ChartComponent). For advanced use cases, consider using React context for theme propagation or memoizing calculation-heavy operations.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Vector Field** using our **FastLineSegmentRenderableSeries** paired with a custom **PaletteProvider** and optional arrow heads made with **FastTriangleRenderableSeries**",
                title: "Angular Vector Field",
                pageTitle: "Angular Vector Field | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Vector Field Chart - Angular\n\n### Overview\nThis Angular implementation showcases a standalone component rendering a **Vector Field Chart** using [SciChartAngular](https://www.npmjs.com/package/scichart-angular). It demonstrates Angular's dependency-free component architecture with SciChart's high-performance rendering.\n\n### Technical Implementation\nThe AppComponent passes the drawExample function to the [ScichartAngularComponent](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartangularcomponent.html) selector. Angular's change detection doesn't interfere with SciChart's WebGL rendering pipeline, maintaining optimal performance for complex vector field visualizations.\n\n### Features and Capabilities\nThe component preserves all core features including the [CentralAxesLayoutManager](https://www.scichart.com/documentation/js/current/typedoc/classes/centralaxeslayoutmanager.html) configuration, vector calculations, and interactive chart modifiers. The standalone component architecture enables easy integration into existing Angular applications.\n\n### Integration and Best Practices\nThis example follows Angular best practices by using standalone components and explicit function binding. For enterprise applications, consider creating an Angular service to manage vector data generation and chart state management.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Vector Field documentation will help you to get started",
                linkTitle: "JavaScript Vector Field Documentation",
            },
        ],
        path: "vector-field",
        metaKeywords: "vector, field, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/VectorField",
        thumbnailImage: "javascript-vector-field.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

const VectorFieldExampleInfo = createExampleInfo(metaData);
export default VectorFieldExampleInfo;
