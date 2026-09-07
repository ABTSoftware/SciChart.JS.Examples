import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata = {
    reactComponent: "ParallelCoordinatesChart",
    id: "chart2D_basicCharts_ParallelCoordinatesChart",
    imagePath: "javascript-parallel-coordinates-chart.jpg",
    description:
        "Demonstrates a Parallel Coordinate Plot (PCP) in SciChart.js: one vertical axis per dimension of a multivariate dataset, with each record drawn as a polyline crossing every axis. Includes axis reordering, range highlighting, record selection and a hover tooltip, in both a multi-series and a high performance single-series mode.",
    tips: [],
    frameworks: {
        javascript: {
            subtitle:
                "Demonstrates a JavaScript Parallel Coordinate Plot, which visualises multivariate data as polylines crossing one vertical axis per dimension. Switch between a multi-series chart and a single-series chart of 100,000 records.",
            title: "JavaScript Parallel Coordinate Plot",
            pageTitle: "JavaScript Parallel Coordinate Plot",
            metaDescription:
                "Create a high performance JavaScript Parallel Coordinate Plot with SciChart.js. Visualise multivariate data with one axis per dimension, reorder axes, highlight ranges and select records, with up to 100,000 records on screen.",
            markdownContent:
                "## JavaScript Parallel Coordinate Plot\n\nA Parallel Coordinate Plot (PCP) places one vertical axis per dimension of a multivariate dataset and draws each record as a polyline crossing every axis, which makes correlations and clusters between the dimensions easy to spot.\n\nThis example builds the plot on top of standard SciChart.js building blocks: a stacked axis layout (one `NumericAxis` or `CategoryAxis` per dimension), `FastLineRenderableSeries` / `SplineLineRenderableSeries` for the record polylines and a set of custom chart modifiers for the interactions.\n\nUse the **Select Chart** menu to switch between the two modes:\n\n-   **Multi-Series** — one renderable series per record. Best when you need per-record styling, hover and click selection.\n-   **Single-Series** — all 100,000 records drawn by a single series with NaN gaps between them, for maximum performance. Selection and range highlighting are done with a `PaletteProvider`.\n\nThe **Interactions** switches turn the individual modifiers on and off. Pan, rubber-band zoom, axis reorder and range highlight all use the left-drag gesture, so only one of them can be active at a time.",
        },
        react: {
            subtitle:
                "Demonstrates a React Parallel Coordinate Plot, which visualises multivariate data as polylines crossing one vertical axis per dimension. Switch between a multi-series chart and a single-series chart of 100,000 records.",
            title: "React Parallel Coordinate Plot",
            pageTitle: "React Parallel Coordinate Plot | SciChart.js Demo",
            metaDescription:
                "Create a high performance React Parallel Coordinate Plot with SciChart.js. Visualise multivariate data with one axis per dimension, reorder axes, highlight ranges and select records, with up to 100,000 records on screen.",
            markdownContent:
                "## React Parallel Coordinate Plot\n\nA Parallel Coordinate Plot (PCP) places one vertical axis per dimension of a multivariate dataset and draws each record as a polyline crossing every axis, which makes correlations and clusters between the dimensions easy to spot.\n\nThis example builds the plot on top of standard SciChart.js building blocks: a stacked axis layout (one `NumericAxis` or `CategoryAxis` per dimension), `FastLineRenderableSeries` / `SplineLineRenderableSeries` for the record polylines and a set of custom chart modifiers for the interactions.\n\nUse the **Select Chart** menu to switch between the two modes:\n\n-   **Multi-Series** — one renderable series per record. Best when you need per-record styling, hover and click selection.\n-   **Single-Series** — all 100,000 records drawn by a single series with NaN gaps between them, for maximum performance. Selection and range highlighting are done with a `PaletteProvider`.\n\nThe **Interactions** switches turn the individual modifiers on and off. Pan, rubber-band zoom, axis reorder and range highlight all use the left-drag gesture, so only one of them can be active at a time.",
        },
    },
    documentationLinks: [
        {
            href: "https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/multi-axis-and-layout/vertically-stacked-axis-layout/",
            title: "SciChart.js multi axis and layout documentation",
            linkTitle: "Multi Axis & Layout",
        },
        {
            href: "https://www.scichart.com/documentation/js/v5/2d-charts/chart-modifier-api/custom-modifiers/custom-modifiers-overview/",
            title: "SciChart.js custom chart modifiers documentation",
            linkTitle: "Custom Modifiers",
        },
    ],
    path: "parallel-coordinates-chart",
    metaKeywords: "parallel coordinate plot, parallel coordinates chart, multivariate, javascript, react",
    onWebsite: true,
    filepath: "Charts2D/BasicChartTypes/ParallelCoordinatesChart",
    thumbnailImage: "javascript-parallel-coordinates-chart.jpg",
    sandboxConfig: {},
    markdownContent: null,
    pageLayout: "max-width",
    extraDependencies: {},
    isNew: true,
    alsoKnownAs: "This chart type is also known as a **Parallel Coordinates Chart** or a **PCP**",
};

export default createExampleInfo(metaData);
