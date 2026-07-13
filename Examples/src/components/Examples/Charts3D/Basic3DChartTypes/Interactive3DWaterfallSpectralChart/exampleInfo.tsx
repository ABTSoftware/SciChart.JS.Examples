import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "Interactive3DWaterfallSpectralChart",
        id: "chart3D_basic3DChartTypes_Interactive3DWaterfallSpectralChart",
        imagePath: "javascript-interactive-3d-waterfall-spectral-chart.jpg",
        description:
            "Creates an interactive **JavaScript 3D waterfall spectral chart** with two synchronized 2D cross-section charts.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates an interactive **JavaScript 3D waterfall spectral chart** with two synchronized 2D cross-section charts.",
                title: "JavaScript Interactive 3D Waterfall Spectral Chart",
                pageTitle: "JavaScript Interactive 3D Waterfall Spectral Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Build an interactive JavaScript 3D waterfall spectral chart with synchronized 2D cross-section charts using SciChart.js.",
                markdownContent:
                    "## Interactive 3D Waterfall Spectral Chart - JavaScript\n\n### Overview\nThis example combines a 3D spectral waterfall with two synchronized 2D cross-section charts. The top chart renders 50 stacked spectral slices using `PointLineRenderableSeries3D`, while the lower charts show the selected spectrum and the current cross-section slice.\n\n### Technical Implementation\nThe chart is initialized by creating a `SciChart3DSurface`, configuring a 3D camera with `CameraController`, and adding `MouseWheelZoomModifier3D`, `OrbitModifier3D`, `ResetCamera3DModifier`, and `SeriesSelectionModifier3D`. Spectral data is generated with an FFT pipeline based on `Radix2FFT`, and the lower charts are driven by the same series-selection and data-index state.\n\n### Related Example\nIf you need the 2D-only waterfall variant, see the [WaterfallChart](../../../Charts2D/v4Charts/WaterfallChart/README.md) example.\n",
            },
            react: {
                subtitle:
                    "Creates an interactive **React 3D waterfall spectral chart** with two synchronized 2D cross-section charts.",
                title: "React Interactive 3D Waterfall Spectral Chart",
                pageTitle: "React Interactive 3D Waterfall Spectral Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Build an interactive React 3D waterfall spectral chart with synchronized 2D cross-section charts using SciChart.js and SciChartReact.",
                markdownContent:
                    "## Interactive 3D Waterfall Spectral Chart in React\n\n### Overview\nThis React example renders the 3D spectral waterfall and the two lower 2D cross-section charts in a single synchronized layout. It uses `<SciChartReact/>` and `ChartGroupLoader` so the top 3D chart and the lower series/slice views are initialized together.\n\n### Technical Implementation\nThe implementation creates a `SciChart3DSurface`, sets a custom camera, and adds 3D modifiers for orbiting, zooming, and selection. The data is generated with `Radix2FFT`, then mapped into a stack of `PointLineRenderableSeries3D` series in the 3D scene. The lower charts read from the same shared selection state to display the selected spectrum and cross-section slice.\n\n### Related Example\nFor the 2D-only version, see the [WaterfallChart](../../../Charts2D/v4Charts/WaterfallChart/README.md) example.\n",
            },
            angular: {
                subtitle:
                    "Creates an interactive **Angular 3D waterfall spectral chart** with two synchronized 2D cross-section charts.",
                title: "Angular Interactive 3D Waterfall Spectral Chart",
                pageTitle: "Angular Interactive 3D Waterfall Spectral Chart | View 3D JavaScript Charts",
                metaDescription:
                    "Build an interactive Angular 3D waterfall spectral chart with synchronized 2D cross-section charts using SciChart.js.",
                markdownContent:
                    "## Interactive 3D Waterfall Spectral Chart in Angular\n\n### Overview\nThis Angular example renders the 3D spectral waterfall and the two synchronized 2D cross-section charts with `scichart-angular`. It keeps the stacked spectral slices and the 3D hover and selection behavior while also showing the selected spectrum and slice panels underneath.\n\n### Technical Implementation\nThe chart is created by binding a custom draw function to the `ScichartAngularComponent`. Inside that draw function, the example builds a `SciChart3DSurface`, configures the camera, generates FFT-based spectral data, and renders it as a series of `PointLineRenderableSeries3D` slices. The lower charts are initialized alongside the 3D surface and updated from the same selection state.\n\n### Related Example\nIf you are looking for the 2D-only bridge-style chart, see the [WaterfallChart](../../../Charts2D/v4Charts/WaterfallChart/README.md) example.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v5/3d-charts/chart-types/lines-3d-chart/",
                title: "SciChart.js 3D Line Chart Documentation",
                linkTitle: "JavaScript 3D Line Chart Documentation",
            },
        ],
        path: "interactive-3d-waterfall-spectral-chart",
        metaKeywords: "3d, waterfall, spectral, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts3D/Basic3DChartTypes/Interactive3DWaterfallSpectralChart",
        thumbnailImage: "javascript-interactive-3d-waterfall-spectral-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export const interactive3DWaterfallSpectralChartExampleInfo = createExampleInfo(metaData);
export default interactive3DWaterfallSpectralChartExampleInfo;
