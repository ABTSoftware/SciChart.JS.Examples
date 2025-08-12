import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarModifiers",
        id: "chart2D_zoomAndPanAChart_PolarModifiers",
        imagePath: "polar-modifiers.jpg",
        description:
            "This demo displays all of SciChart's Polar Chart **Modifier** types.\n TIP: If the `PolarZoomExtents` modifier is on, just double-click to reset your zoom / rotation.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "This demo displays all of SciChart's Polar Chart **Modifier** types.\n TIP: If the `PolarZoomExtents` modifier is on, just double-click to reset your zoom / rotation.",
                title: "Polar Modifiers JavaScript Chart",
                pageTitle: "Polar Modifiers JavaScript Chart",
                metaDescription: null,
                markdownContent:
                    "# Polar Modifiers Chart - JavaScript\n\n## Overview\nThis example demonstrates how to create an interactive **Polar Chart** with multiple modifiers using SciChart.js in JavaScript. The implementation showcases a polar scatter plot with triangle markers and various interactive tools like zooming, panning, and cursor tracking.\n\n## Technical Implementation\nThe chart is initialized using `SciChartPolarSurface.create()` with a radial `PolarNumericAxis` and angular `PolarNumericAxis`. The data is plotted using `PolarXyScatterRenderableSeries` with triangle point markers. The example implements seven polar modifiers: `PolarArcZoomModifier`, `PolarCursorModifier`, `PolarDataPointSelectionModifier`, `PolarLegendModifier`, `PolarMouseWheelZoomModifier`, `PolarPanModifier`, and `PolarZoomExtentsModifier`. These are added to the surface via `chartModifiers.add()`.\n\n## Features and Capabilities\nThe chart features dynamic modifier toggling with conflict detection between incompatible modifiers like pan and arc zoom. It includes a central text annotation that updates to show instructions for the active modifier. The polar axes are configured with custom styling including grid lines and start angles for radial orientation.\n\n## Integration and Best Practices\nThe implementation follows JavaScript best practices with async initialization and proper resource cleanup. Developers can extend this example by adding more series types or customizing the modifier behaviors further.",
            },
            react: {
                subtitle:
                    "This demo displays all of SciChart's Polar Chart **Modifier** types.\n TIP: If the `PolarZoomExtents` modifier is on, just double-click to reset your zoom / rotation.",
                title: "Polar Modifiers React Chart",
                pageTitle: "Polar Modifiers React Chart",
                metaDescription: null,
                markdownContent:
                    "# Polar Modifiers Chart - React\n\n## Overview\nThis React example demonstrates an interactive **Polar Chart** with toggleable modifiers using SciChart's React wrapper. The component provides a UI panel to enable/disable different chart interactions while displaying active modifier instructions.\n\n## Technical Implementation\nThe chart is wrapped in the `SciChartReact` component with the `drawExample` initialization function. React state manages the active modifiers and detects conflicts between incompatible interactions. The left panel contains checkboxes for each modifier type, styled with Material-UI components. The implementation uses the `useState` hook to track modifier states and handle toggle events.\n\n## Features and Capabilities\nThe example showcases dynamic modifier management with real-time feedback. When users toggle modifiers, the central annotation updates with usage instructions. Conflict detection warns users about incompatible modifier combinations. The responsive layout maintains chart visibility across screen sizes.\n\n## Integration and Best Practices\nThis demonstrates React best practices including component composition, state management, and clean integration with SciChart's API. The example can be extended by adding custom modifier configurations or integrating with larger data management systems.",
            },
            angular: {
                subtitle:
                    "This demo displays all of SciChart's Polar Chart **Modifier** types.\n TIP: If the `PolarZoomExtents` modifier is on, just double-click to reset your zoom / rotation.",
                title: "Polar Modifiers Angular Chart",
                pageTitle: "Polar Modifiers Angular Chart",
                metaDescription: null,
                markdownContent:
                    "# Polar Modifiers Chart - Angular\n\n## Overview\nThis Angular example creates an interactive **Polar Chart** with SciChart's Angular component. The standalone component demonstrates polar chart initialization and modifier management in an Angular application context.\n\n## Technical Implementation\nThe chart is integrated using the `ScichartAngularComponent` with the `drawExample` function passed as an input. The template uses minimal markup to host the chart surface. Angular's standalone component architecture simplifies the integration without requiring additional modules.\n\n## Features and Capabilities\nThe implementation includes all polar chart features from the core example: radial/angular axes configuration, scatter series with custom markers, and multiple interactive modifiers. The Angular wrapper maintains full functionality while providing framework-specific lifecycle management.\n\n## Integration and Best Practices\nThis demonstrates Angular best practices including standalone components and proper chart resource management. Developers can extend this example by adding Angular-specific controls or integrating with Angular services for data management.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/ZoomPanModifier.html",
                title: "Zoom and Pan Modifier Documentation",
                linkTitle: "SciChart.js Zooming and Panning Documentation",
            },
        ],
        path: "polar-modifiers",
        metaKeywords: "polar, modifiers, zoom, scale, pan, scale, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ZoomingAndPanning/PolarModifiers",
        thumbnailImage: "polar-modifiers.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export const PolarModifiersExampleInfo = createExampleInfo(metaData);
export default PolarModifiersExampleInfo;
