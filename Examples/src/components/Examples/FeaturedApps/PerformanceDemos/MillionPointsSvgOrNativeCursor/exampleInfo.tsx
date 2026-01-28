import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "Load1MillionWithSvgCursor",
        id: "featuredApps_performanceDemos_Load1MillionWithSvgCursor",
        imagePath: "javascript-million-points-svg-cursor.jpg",
        description:
            "Demonstrates the **Decoupled Render Loop** in SciChart.js. Keep your cursors smooth (60 FPS) even when the chart is under heavy load.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates the **Decoupled Render Loop**. Even with **1 Million Points** and a complex Gradient Palette causing frame drops on the main chart, the **SVG Cursor** remains smooth at 60 FPS because it does not trigger a WebGL redraw.",
                title: "High Performance SVG Cursor & Rollover",
                pageTitle: "High Performance SVG Cursor & Rollover",
                metaDescription:
                    "Demonstrates how to use the SVG render layer in SciChart.js to maintain smooth cursor interaction on heavy charts with millions of points.",
                markdownContent:
                    '## High Performance SVG Cursor - JavaScript\n\n### Overview\nWhen rendering massive datasets (like the **1 Million Point Scatter chart** in this demo), the WebGL rendering engine may drop below 60 FPS due to the sheer volume of data and pixel shading required. We have made it possible to use paletteProvider with much bigger datasets while retaining performance.  And even if you push this to its limit, you can still get smooth tooltip behaviour thanks to SVG cursor.\n\nIn standard charting libraries, the Cursor or Tooltip is often part of the main render loop. This means if the chart draws at 15 FPS, your mouse cursor lags at 15 FPS. \n\n**SciChart.js solves this with a Decoupled Render Loop.**\n\n### The Solution: SVG vs Native\nThis demo allows you to toggle between `isSvgOnly: true` (SVG Mode) and `isSvgOnly: false` (Native Mode) on the Cursor and Rollover Modifiers.\n\n\n\n* **Native Mode:** The crosshairs and tooltips are drawn on the main canvas (or composited). Every mouse move triggers a full chart re-render. If the data is heavy, the cursor feels "heavy" and laggy.\n* **SVG Mode:** The modifiers draw to a separate HTML/SVG layer floating above the WebGL canvas. Moving the mouse updates the SVG layer **without invalidating the WebGL scene**. \n\n**Result:** The chart might be static or updating slowly, but your interaction remains buttery smooth at 60 FPS.\n\n### Technical Implementation\nThe key property is `isSvgOnly` on the modifier options:\n\n```javascript\nnew CursorModifier({\n    isSvgOnly: true, // Independent render loop\n    showTooltip: true,\n    // ...\n});\n```\n\nWe also implement a custom `GradientPaletteProvider` which calculates color per-point based on Y-Value. This simulates a "heavy" rendering load to better illustrate the performance benefits of the SVG cursor.',
            },
            react: {
                subtitle:
                    "Demonstrates the **Decoupled Render Loop**. Even with **1 Million Points** and a complex Gradient Palette causing frame drops on the main chart, the **SVG Cursor** remains smooth at 60 FPS because it does not trigger a WebGL redraw.",
                title: "High Performance SVG Cursor & Rollover",
                pageTitle: "High Performance SVG Cursor & Rollover",
                metaDescription:
                    "Demonstrates how to use the SVG render layer in SciChart.js to maintain smooth cursor interaction on heavy charts with millions of points.",
                markdownContent:
                    '## High Performance SVG Cursor - React\n\n### Overview\nWhen rendering massive datasets (like the **1 Million Point Scatter chart** in this demo), the WebGL rendering engine may drop below 60 FPS due to the sheer volume of data and pixel shading required. We have made it possible to use paletteProvider with much bigger datasets while retaining performance.  And even if you push this to its limit, you can still get smooth tooltip behaviour thanks to SVG cursor.\n\nIn standard charting libraries, the Cursor or Tooltip is often part of the main render loop. This means if the chart draws at 15 FPS, your mouse cursor lags at 15 FPS. \n\n**SciChart.js solves this with a Decoupled Render Loop.**\n\n### The Solution: SVG vs Native\nThis demo allows you to toggle between `isSvgOnly: true` (SVG Mode) and `isSvgOnly: false` (Native Mode) on the Cursor and Rollover Modifiers.\n\n\n\n* **Native Mode:** The crosshairs and tooltips are drawn on the main canvas (or composited). Every mouse move triggers a full chart re-render. If the data is heavy, the cursor feels "heavy" and laggy.\n* **SVG Mode:** The modifiers draw to a separate HTML/SVG layer floating above the WebGL canvas. Moving the mouse updates the SVG layer **without invalidating the WebGL scene**. \n\n**Result:** The chart might be static or updating slowly, but your interaction remains buttery smooth at 60 FPS.\n\n### Integration\nThis example uses the `<SciChartReact/>` component. The modifiers are updated dynamically using a reference to the chart controls. Note how the `rebuildActiveModifier` function in the source code switches between `CursorModifier` and `RolloverModifier` while preserving the `isSvgOnly` state.',
            },
            angular: {
                subtitle:
                    "Demonstrates the **Decoupled Render Loop**. Even with **1 Million Points** and a complex Gradient Palette causing frame drops on the main chart, the **SVG Cursor** remains smooth at 60 FPS because it does not trigger a WebGL redraw.",
                title: "High Performance SVG Cursor & Rollover",
                pageTitle: "High Performance SVG Cursor & Rollover",
                metaDescription:
                    "Demonstrates how to use the SVG render layer in SciChart.js to maintain smooth cursor interaction on heavy charts with millions of points.",
                markdownContent:
                    '## High Performance SVG Cursor - Angular\n\n### Overview\nWhen rendering massive datasets (like the **1 Million Point Scatter chart** in this demo), the WebGL rendering engine may drop below 60 FPS due to the sheer volume of data and pixel shading required. We have made it possible to use paletteProvider with much bigger datasets while retaining performance.  And even if you push this to its limit, you can still get smooth tooltip behaviour thanks to SVG cursor.\n\nIn standard charting libraries, the Cursor or Tooltip is often part of the main render loop. This means if the chart draws at 15 FPS, your mouse cursor lags at 15 FPS. \n\n**SciChart.js solves this with a Decoupled Render Loop.**\n\n### The Solution: SVG vs Native\nThis demo allows you to toggle between `isSvgOnly: true` (SVG Mode) and `isSvgOnly: false` (Native Mode) on the Cursor and Rollover Modifiers.\n\n\n\n* **Native Mode:** The crosshairs and tooltips are drawn on the main canvas (or composited). Every mouse move triggers a full chart re-render. If the data is heavy, the cursor feels "heavy" and laggy.\n* **SVG Mode:** The modifiers draw to a separate HTML/SVG layer floating above the WebGL canvas. Moving the mouse updates the SVG layer **without invalidating the WebGL scene**. \n\n**Result:** The chart might be static or updating slowly, but your interaction remains buttery smooth at 60 FPS.\n\n### Technical Implementation\nThe key property is `isSvgOnly` on the modifier options:\n\n```typescript\nnew CursorModifier({\n    isSvgOnly: true, // Independent render loop\n    showTooltip: true,\n    // ...\n});\n```\n\nWe also implement a custom `GradientPaletteProvider` which calculates color per-point based on Y-Value. This simulates a "heavy" rendering load to better illustrate the performance benefits of the SVG cursor.',
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/CursorModifier.html",
                title: "Cursor Modifier Documentation",
                linkTitle: "CursorModifier API",
            },
            {
                href: "https://www.scichart.com/documentation/js/current/RolloverModifier.html",
                title: "Rollover Modifier Documentation",
                linkTitle: "RolloverModifier API",
            },
            {
                href: "https://www.scichart.com/documentation/js/current/PaletteProvider%20API.html",
                title: "Palette Provider API Documentation",
                linkTitle: "Palette Provider API",
            },
        ],
        path: "performance-1m-points-svg-cursor",
        metaKeywords:
            "performance, cursor, svg, native, 1 million, scatter, gradient, palette, render loop, javascript, webgl",
        onWebsite: true,
        filepath: "FeaturedApps/PerformanceDemos/MillionPointsSvgOrNativeCursor",
        thumbnailImage: "javascript-million-points-svg-cursor.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

const loadOneMillionPointsExampleInfo = createExampleInfo(metaData);
export default loadOneMillionPointsExampleInfo;
