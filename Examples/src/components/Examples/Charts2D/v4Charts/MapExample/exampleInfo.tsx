import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "MapExample",
        id: "chart2D_v4Charts_MapExample",
        imagePath: "javascript-map-demo.jpg",
        description:
            "Demonstrates how to create a **Choropleth map**, a type of thematic map where areas are shaded or patterned in proportion to the value of a variable being represented, using our **FastTriangleRenderableSeries**.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Choropleth map**, a type of thematic map where areas are shaded or patterned in proportion to the value of a variable being represented, using our **FastTriangleRenderableSeries**.",
                title: "Choropleth map",
                pageTitle: "Choropleth map | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a **JavaScript Choropleth map**, a type of thematic map where areas are shaded or patterned in proportion to the value of a variable being represented, using our **FastTriangleRenderableSeries**.",
                markdownContent:
                    "# Map Example - JavaScript\n\n## Overview\nThis JavaScript example demonstrates how to create an interactive map of Australia using SciChart.js. It visualizes geographic data with [FastTriangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fasttrianglerenderableseries.html) for terrain coloring and [FastLineRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastlinerenderableseries.html) for state outlines.\n\n## Technical Implementation\nThe implementation uses triangulation to convert geographic coordinates into renderable triangles with [ETriangleSeriesDrawMode.List](https://www.scichart.com/documentation/js/current/typedoc/enums/etriangleseriesdrawmode.html) mode. Data is loaded from predefined arrays and styled based on population density metrics. The chart includes interactive modifiers like [ZoomPanModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html) for navigation. This example fetches **australiaConverted.json** from server. **australiaConverted.json** is array of objects and each object contains 'name', 'outline' and 'areaData'.\n\n -   `name` is string that contains name of the location \n\n -   `outline` is array of arrays that represent longitude and latitude of points that represent outline of area\n\n -   `areaData` is array of arrays that represent series of coordinate points that form triangles used by SciChart's `FastTriangleRenderableSeries` to create shapes that represent area\n\n   **areaData** is generated using poly2tri - https://github.com/r3mi/poly2tri.js, a 2D constrained Delaunay triangulation library from `GeoJSON` representation of Australia map \n\n##\n\n## Features and Capabilities\nThe example shows dynamic recoloring of states based on selected metrics (population, area, or density) using a custom interpolation function. City markers are displayed using [FastBubbleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbubblerenderableseries.html) with data labels.\n\n## Integration and Best Practices\nThe implementation follows JavaScript best practices with async chart initialization and proper surface disposal. The aspect ratio preservation logic ensures correct map proportions during resizing.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **React Choropleth map**, a type of thematic map where areas are shaded or patterned in proportion to the value of a variable being represented, using our **FastTriangleRenderableSeries**.",
                title: "Choropleth map",
                pageTitle: "Choropleth map | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a **React Choropleth map**, a type of thematic map where areas are shaded or patterned in proportion to the value of a variable being represented, using our **FastTriangleRenderableSeries**.",
                markdownContent:
                    "# Map Example - React\n\n## Overview\nThis React example showcases an interactive Australia map using SciChart.js, wrapped in a [SciChartReact](https://www.npmjs.com/package/scichart-react) component. It demonstrates geographic data visualization with React hooks integration.\n\n## Technical Implementation\nThe chart uses [FastTriangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fasttrianglerenderableseries.html) in List draw mode to render state polygons. The React component passes the `drawExample` function to SciChartReact for initialization. State management for metric selection is handled externally. This example fetches **australiaConverted.json** from server. **australiaConverted.json** is array of objects and each object contains 'name', 'outline' and 'areaData'.\n\n -   `name` is string that contains name of the location \n\n -   `outline` is array of arrays that represent longitude and latitude of points that represent outline of area\n\n -   `areaData` is array of arrays that represent series of coordinate points that form triangles used by SciChart's `FastTriangleRenderableSeries` to create shapes that represent area\n\n   **areaData** is generated using poly2tri - https://github.com/r3mi/poly2tri.js, a 2D constrained Delaunay triangulation library from `GeoJSON` representation of Australia map \n\n##\n\n## Features and Capabilities\nThe implementation features dynamic data binding for metric visualization and preserves aspect ratio during resizing. City markers with interactive labels are implemented using [EllipsePointMarker](https://www.scichart.com/documentation/js/current/typedoc/classes/ellipsepointmarker.html).\n\n## Integration and Best Practices\nThe example demonstrates proper React integration by separating chart logic from presentation. The async initialization pattern follows SciChart's [React integration guidelines](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Angular Choropleth map**, a type of thematic map where areas are shaded or patterned in proportion to the value of a variable being represented, using our **FastTriangleRenderableSeries**.",
                title: "Choropleth map",
                pageTitle: "Choropleth map | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a **Angular Choropleth map**, a type of thematic map where areas are shaded or patterned in proportion to the value of a variable being represented, using our **FastTriangleRenderableSeries**.",
                markdownContent:
                    "# Map Example - Angular\n\n## Overview\nThis Angular standalone component displays an interactive Australia map using [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular). It demonstrates geographic visualization with Angular's component architecture.\n\n## Technical Implementation\nThe chart configuration is encapsulated in `drawExample.ts`, which is passed to the Angular component. The implementation uses [NumericAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html) for coordinate mapping and [XyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) for geographic data. This example fetches **australiaConverted.json** from server. **australiaConverted.json** is array of objects and each object contains 'name', 'outline' and 'areaData'.\n\n -   `name` is string that contains name of the location \n\n -   `outline` is array of arrays that represent longitude and latitude of points that represent outline of area\n\n -   `areaData` is array of arrays that represent series of coordinate points that form triangles used by SciChart's `FastTriangleRenderableSeries` to create shapes that represent area\n\n   **areaData** is generated using poly2tri - https://github.com/r3mi/poly2tri.js, a 2D constrained Delaunay triangulation library from `GeoJSON` representation of Australia map \n\n## Features and Capabilities\nThe component supports dynamic metric switching with preserved aspect ratio. It combines triangle series for filled states, line series for borders, and bubble series for city markers, demonstrating [SciChart's multi-series capabilities](https://www.scichart.com/documentation/js/current/Chart%20Types.html).\n\n## Integration and Best Practices\nThe example follows Angular best practices using standalone components and proper chart disposal. The async initialization pattern aligns with [SciChart's Angular documentation](https://www.scichart.com/documentation/js/current/angular-charts.html).",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Band%20Series%20type.html",
                title: "The specific page for the JavaScript Digital Line Chart documentation will help you to get started",
                linkTitle: "JavaScript Band Chart Documentation",
            },
        ],
        path: "map-example",
        metaKeywords: "band, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/MapExample",
        thumbnailImage: "javascript-map-demo.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

const eampleInfo = createExampleInfo(metaData);
export default eampleInfo;
