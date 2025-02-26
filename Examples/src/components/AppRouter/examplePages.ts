import React from "react";
import { TPage } from "./pages";
import { TFrameworkTemplate } from "../../helpers/shared/Helpers/frameworkParametrization";
import { TDocumentationLink } from "../../helpers/types/ExampleDescriptionTypes";
import { EPageLayout, GalleryItem } from "../../helpers/types/types";

declare var require: any;

export type TExampleInfo = {
    /**
     * Example title
     */
    title: TFrameworkTemplate;
    /**
     * Meta title
     */
    pageTitle: TFrameworkTemplate;
    path: string;

    /**
     * Content shown below title on example page
     */
    subtitle: (frameworkName: string) => React.ReactElement | string;
    /**
     * Page meta description
     */
    metaDescription: TFrameworkTemplate;

    /**
     * The first link is used in the docs button in the header
     */
    documentationLinks: TDocumentationLink[];

    // If this example has been created on scichart.com
    onWebsite?: boolean;
    /**
     * OPTIONAL: If provided, use these items as a See Also. If not, they will be auto-generated from similar items
     * in the top level menu. See {@link getSeeAlsoGalleryItems}
     */
    seeAlso?: GalleryItem[];

    /**
     * Page meta keywords
     */
    metaKeywords: string;
    thumbnailImage?: string;
    // path to actual folder for CodeSandbox
    filepath: string;
    // additional module dependencies
    extraDependencies?: Record<string, string>;
    codeSandBoxNotWorking?: boolean;
    sandboxConfig?: Record<string, any>;
    /**
     * Markdown content for the page, will help with SEO and editing
     */
    markdownContent?: TFrameworkTemplate;
    pageLayout?: EPageLayout;
};

export type TExamplePage = TPage & TExampleInfo;

function asRecord<T extends Record<string, TExamplePage>>(arg: T): T & Record<string, TExamplePage> {
    return arg;
}

const examplePaths: Record<string, { path: string; exportName: string }> = {
    chart2D_basicCharts_BandSeriesChart: {
        path: "../Examples/Charts2D/BasicChartTypes/BandSeriesChart/exampleInfo.tsx",
        exportName: "bandSeriesChartExampleInfo",
    },
    chart2D_basicCharts_SplineBandChart: {
        path: "../Examples/Charts2D/BasicChartTypes/SplineBandSeriesChart/exampleInfo.tsx",
        exportName: "splineBandSeriesChartExampleInfo",
    },
    chart2D_basicCharts_DigitalBandSeriesChart: {
        path: "../Examples/Charts2D/BasicChartTypes/DigitalBandSeriesChart/exampleInfo.tsx",
        exportName: "digitalBandSeriesChartExampleInfo",
    },
    chart2D_basicCharts_FanChart: {
        path: "../Examples/Charts2D/BasicChartTypes/FanChart/exampleInfo.tsx",
        exportName: "fanChartExampleInfo",
    },
    chart2D_basicCharts_BubbleChart: {
        path: "../Examples/Charts2D/BasicChartTypes/BubbleChart/exampleInfo.tsx",
        exportName: "bubbleChartExampleInfo",
    },
    chart2D_basicCharts_CandlestickChart: {
        path: "../Examples/Charts2D/BasicChartTypes/CandlestickChart/exampleInfo.tsx",
        exportName: "candlestickChartExampleInfo",
    },
    chart2D_basicCharts_OhlcChart: {
        path: "../Examples/Charts2D/BasicChartTypes/OhlcChart/exampleInfo.tsx",
        exportName: "ohlcChartExampleInfo",
    },
    chart2D_basicCharts_ColumnChart: {
        path: "../Examples/Charts2D/BasicChartTypes/ColumnChart/exampleInfo.tsx",
        exportName: "columnChartExampleInfo",
    },
    chart2D_basicCharts_ImpulseChart: {
        path: "../Examples/Charts2D/BasicChartTypes/ImpulseChart/exampleInfo.tsx",
        exportName: "impulseChartExampleInfo",
    },
    chart2D_basicCharts_ErrorBarsChart: {
        path: "../Examples/Charts2D/BasicChartTypes/ErrorBarsChart/exampleInfo.tsx",
        exportName: "errorBarsChartExampleInfo",
    },
    chart2D_basicCharts_HeatmapChart: {
        path: "../Examples/Charts2D/BasicChartTypes/HeatmapChart/exampleInfo.tsx",
        exportName: "heatmapChartExampleInfo",
    },
    chart2D_basicCharts_ContourChart: {
        path: "../Examples/Charts2D/BasicChartTypes/ContoursChart/exampleInfo.tsx",
        exportName: "contourChartExampleInfo",
    },
    chart2D_basicCharts_LineChart: {
        path: "../Examples/Charts2D/BasicChartTypes/LineChart/exampleInfo.tsx",
        exportName: "lineChartExampleInfo",
    },
    chart2D_basicCharts_SplineLineChart: {
        path: "../Examples/Charts2D/BasicChartTypes/SplineLineChart/exampleInfo.tsx",
        exportName: "splineLineChartExampleInfo",
    },
    chart2D_basicCharts_DigitalLineChart: {
        path: "../Examples/Charts2D/BasicChartTypes/DigitalLineChart/exampleInfo.tsx",
        exportName: "digitalLineChartExampleInfo",
    },
    chart2D_basicCharts_MountainChart: {
        path: "../Examples/Charts2D/BasicChartTypes/MountainChart/exampleInfo.tsx",
        exportName: "mountainChartExampleInfo",
    },
    chart2D_basicCharts_SplineMountainChart: {
        path: "../Examples/Charts2D/BasicChartTypes/SplineMountainChart/exampleInfo.tsx",
        exportName: "splineMountainChartExampleInfo",
    },
    chart2D_basicCharts_DigitalMountainChart: {
        path: "../Examples/Charts2D/BasicChartTypes/DigitalMountainChart/exampleInfo.tsx",
        exportName: "digitalMountainChartExampleInfo",
    },
    chart2D_basicCharts_ScatterChart: {
        path: "../Examples/Charts2D/BasicChartTypes/ScatterChart/exampleInfo.tsx",
        exportName: "scatterChartExampleInfo",
    },
    chart2D_basicCharts_DonutChart: {
        path: "../Examples/Charts2D/BasicChartTypes/DonutChart/exampleInfo.tsx",
        exportName: "donutChartExampleInfo",
    },
    chart2D_basicCharts_PieChart: {
        path: "../Examples/Charts2D/BasicChartTypes/PieChart/exampleInfo.tsx",
        exportName: "pieChartExampleInfo",
    },
    chart2D_basicCharts_RealtimeMountainChart: {
        path: "../Examples/Charts2D/BasicChartTypes/RealTimeMountainChart/exampleInfo.tsx",
        exportName: "realTimeMountainChartExampleInfo",
    },
    chart2D_chartAnnotations_AnnotationsAreEasy: {
        path: "../Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy/exampleInfo.tsx",
        exportName: "annotationsAreEasyExampleInfo",
    },
    chart2D_chartAnnotations_AnnotationLayers: {
        path: "../Examples/Charts2D/ChartAnnotations/AnnotationLayers/exampleInfo.tsx",
        exportName: "annotationLayersExampleInfo",
    },
    chart2D_chartAnnotations_TradeMarkers: {
        path: "../Examples/Charts2D/ChartAnnotations/TradeMarkers/exampleInfo.tsx",
        exportName: "tradeMarkerAnnotationsExampleInfo",
    },
    chart2D_featuredApps_RealtimeGhostedTraces: {
        path: "../Examples/FeaturedApps/PerformanceDemos/RealtimeGhostedTraces/exampleInfo.tsx",
        exportName: "realtimeGhostedTracesExampleInfo",
    },
    chart2D_createStockCharts_MultiPaneStockCharts: {
        path: "../Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts/exampleInfo.tsx",
        exportName: "multiPaneStockChartsExampleInfo",
    },
    chart2D_createStockCharts_RealtimeTickingStockCharts: {
        path: "../Examples/Charts2D/CreateStockCharts/RealtimeTickingStockCharts/exampleInfo.tsx",
        exportName: "realtimeTickingStockChartsExampleInfo",
    },
    chart2D_legends_ChartLegendsAPI: {
        path: "../Examples/Charts2D/Legends/ChartLegendsAPI/exampleInfo.tsx",
        exportName: "chartLegendsAPIExampleInfo",
    },
    chart2D_modifyAxisBehavior_MultipleXAxes: {
        path: "../Examples/Charts2D/ModifyAxisBehavior/MultipleXAxes/exampleInfo.tsx",
        exportName: "multipleXAxesExampleInfo",
    },
    chart2D_modifyAxisBehavior_SecondaryYAxes: {
        path: "../Examples/Charts2D/ModifyAxisBehavior/SecondaryYAxes/exampleInfo.tsx",
        exportName: "secondaryYAxesExampleInfo",
    },
    chart2D_modifyAxisBehavior_VerticalCharts: {
        path: "../Examples/Charts2D/ModifyAxisBehavior/VerticalCharts/exampleInfo.tsx",
        exportName: "verticalChartsExampleInfo",
    },
    chart2D_modifyAxisBehavior_CentralAxes: {
        path: "../Examples/Charts2D/ModifyAxisBehavior/CentralAxes/exampleInfo.tsx",
        exportName: "centralAxesExampleInfo",
    },
    chart2D_modifyAxisBehavior_StaticAxis: {
        path: "../Examples/Charts2D/ModifyAxisBehavior/StaticAxis/exampleInfo.tsx",
        exportName: "staticAxisExampleInfo",
    },
    chart2D_modifyAxisBehavior_VerticallyStackedAxes: {
        path: "../Examples/Charts2D/ModifyAxisBehavior/VerticallyStackedAxes/exampleInfo.tsx",
        exportName: "verticallyStackedAxesExampleInfo",
    },
    chart2D_basicCharts_StackedColumnChart: {
        path: "../Examples/Charts2D/BasicChartTypes/StackedColumnChart/exampleInfo.tsx",
        exportName: "stackedColumnChartExampleInfo",
    },
    chart2D_basicCharts_StackedColumnSideBySide: {
        path: "../Examples/Charts2D/BasicChartTypes/StackedColumnSideBySide/exampleInfo.tsx",
        exportName: "stackedColumnSideBySideExampleInfo",
    },
    chart2D_basicCharts_StackedMountainChart: {
        path: "../Examples/Charts2D/BasicChartTypes/StackedMountainChart/exampleInfo.tsx",
        exportName: "stackedMountainChartExampleInfo",
    },
    chart2D_stylingAndTheming_UsePointMarkers: {
        path: "../Examples/Charts2D/StylingAndTheming/UsePointMarkers/exampleInfo.tsx",
        exportName: "usePointMarkersExampleInfo",
    },
    chart2D_stylingAndTheming_UsingThemeManager: {
        path: "../Examples/Charts2D/StylingAndTheming/UsingThemeManager/exampleInfo.tsx",
        exportName: "usingThemeManagerExampleInfo",
    },
    chart2D_stylingAndTheming_CustomTheme: {
        path: "../Examples/Charts2D/StylingAndTheming/CreateACustomTheme/exampleInfo.tsx",
        exportName: "createACustomThemeExampleInfo",
    },
    chart2D_stylingAndTheming_StylingInCode: {
        path: "../Examples/Charts2D/StylingAndTheming/StylingInCode/exampleInfo.tsx",
        exportName: "stylingInCodeExampleInfo",
    },
    chart2D_stylingAndTheming_PerPointColoring: {
        path: "../Examples/Charts2D/StylingAndTheming/PerPointColoring/exampleInfo.tsx",
        exportName: "perPointColoringExampleInfo",
    },
    chart2D_stylingAndTheming_DashedLineStyling: {
        path: "../Examples/Charts2D/StylingAndTheming/DashedLineStyling/exampleInfo.tsx",
        exportName: "dashedLineStylingExampleInfo",
    },
    chart2D_stylingAndTheming_TransparentBackground: {
        path: "../Examples/Charts2D/StylingAndTheming/TransparentBackground/exampleInfo.tsx",
        exportName: "transparentBackgroundExampleInfo",
    },
    chart2D_tooltipsAndHittest_HitTestApi: {
        path: "../Examples/Charts2D/TooltipsAndHittest/HitTestAPI/exampleInfo.tsx",
        exportName: "hitTestApiExampleInfo",
    },
    chart2D_tooltipsAndHittest_UsingRolloverModifierTooltips: {
        path: "../Examples/Charts2D/TooltipsAndHittest/UsingRolloverModifierTooltips/exampleInfo.tsx",
        exportName: "usingRolloverModifierTooltipsExampleInfo",
    },
    chart2D_tooltipsAndHittest_SeriesSelection: {
        path: "../Examples/Charts2D/TooltipsAndHittest/SeriesSelection/exampleInfo.tsx",
        exportName: "seriesSelectionExampleInfo",
    },
    chart2D_tooltipsAndHittest_UsingCursorModifierTooltips: {
        path: "../Examples/Charts2D/TooltipsAndHittest/UsingCursorModifierTooltips/exampleInfo.tsx",
        exportName: "usingCursorModifierTooltipsExampleInfo",
    },
    chart3D_basic3DChartTypes_Bubble3DChart: {
        path: "../Examples/Charts3D/Basic3DChartTypes/Bubble3DChart/exampleInfo.tsx",
        exportName: "bubble3DChartExampleInfo",
    },
    chart3D_basic3DChartTypes_SurfaceMesh3DChart: {
        path: "../Examples/Charts3D/Basic3DChartTypes/SurfaceMesh3DChart/exampleInfo.tsx",
        exportName: "surfaceMesh3DChartExampleInfo",
    },
    chart3D_basic3DChartTypes_PointLine3DChart: {
        path: "../Examples/Charts3D/Basic3DChartTypes/PointLine3DChart/exampleInfo.tsx",
        exportName: "pointLine3DChartExampleInfo",
    },
    chart3D_basic3DChartTypes_Column3DChart: {
        path: "../Examples/Charts3D/Basic3DChartTypes/Column3DChart/exampleInfo.tsx",
        exportName: "column3DChartExampleInfo",
    },
    featuredApps_Load500By500: {
        path: "../Examples/FeaturedApps/PerformanceDemos/Load500By500/exampleInfo.tsx",
        exportName: "load500By500ExampleInfo",
    },
    featuredApps__performanceDemos_RealtimePerformanceDemo: {
        path: "../Examples/FeaturedApps/PerformanceDemos/RealtimePerformanceDemo/exampleInfo.tsx",
        exportName: "realtimePerformanceDemoExampleInfo",
    },
    featuredApps_VitalSignsMonitorDemo: {
        path: "../Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo/exampleInfo.tsx",
        exportName: "vitalSignsMonitorDemoExampleInfo",
    },
    featuredApps_LiDAR3DPointCloudDemo: {
        path: "../Examples/FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo/exampleInfo.tsx",
        exportName: "lidar3DPointCloudExampleInfo",
    },
    featuredApps_AudioAnalyzerDemo: {
        path: "../Examples/FeaturedApps/ScientificCharts/AudioAnalyzer/exampleInfo.tsx",
        exportName: "audioAnalyzerExampleInfo",
    },
    featuredApps_InteractiveWaterfallChartDemo: {
        path: "../Examples/FeaturedApps/ScientificCharts/InteractiveWaterfallChart/exampleInfo.tsx",
        exportName: "waterfallChartExampleInfo",
    },
    featuredApps_TenorCurvesDemo: {
        path: "../Examples/FeaturedApps/ScientificCharts/TenorCurves3D/exampleInfo.tsx",
        exportName: "tenorCurvesExampleInfo",
    },
    featuredApps_Load1MillionPoints: {
        path: "../Examples/FeaturedApps/PerformanceDemos/Load1MillionPoints/exampleInfo.tsx",
        exportName: "loadOneMillionPointsExampleInfo",
    },
    chart2D_zoomAndPan_DragAxisToScale: {
        path: "../Examples/Charts2D/ZoomingAndPanning/DragAxisToScale/exampleInfo.tsx",
        exportName: "dragAxisToScaleExampleInfo",
    },
    chart2D_zoomAndPan_RealtimeZoomPan: {
        path: "../Examples/Charts2D/ZoomingAndPanning/RealtimeZoomPan/exampleInfo.tsx",
        exportName: "realtimeZoomPanExampleInfo",
    },
    chart2D_zoomAndPan_MultipleChartModifiers: {
        path: "../Examples/Charts2D/ZoomingAndPanning/MultipleZoomPanModifiers/exampleInfo.tsx",
        exportName: "zoomAndPanWithMultipleChartModifiersExampleInfo",
    },
    chart2D_animations_DataAnimation: {
        path: "../Examples/Charts2D/Animations/DataAnimation/exampleInfo.tsx",
        exportName: "dataAnimationExampleInfo",
    },
    chart2D_animations_StyleAnimation: {
        path: "../Examples/Charts2D/Animations/StyleAnimation/exampleInfo.tsx",
        exportName: "styleAnimationExampleInfo",
    },
    chart2D_animations_StartupAnimation: {
        path: "../Examples/Charts2D/Animations/StartupAnimation/exampleInfo.tsx",
        exportName: "startupAnimationExampleInfo",
    },
    chart2D_animations_GenericAnimation: {
        path: "../Examples/Charts2D/Animations/GenericAnimation/exampleInfo.tsx",
        exportName: "genericAnimationExampleInfo",
    },
    chart2D_tooltipsAndHittest_DataPointSelection: {
        path: "../Examples/Charts2D/TooltipsAndHittest/DatapointSelection/exampleInfo.tsx",
        exportName: "dataPointSelectionExampleInfo",
    },
    chart2D_zoomAndPan_Overview: {
        path: "../Examples/Charts2D/ZoomingAndPanning/OverviewModifier/exampleInfo.tsx",
        exportName: "overviewExampleInfo",
    },
    chart2D_modifyAxis_DrawBehindAxes: {
        path: "../Examples/Charts2D/ModifyAxisBehavior/DrawBehindAxes/exampleInfo.tsx",
        exportName: "drawBehindAxesExampleInfo",
    },
    chart2D_basicCharts_NonUniformHeatmapChart: {
        path: "../Examples/Charts2D/BasicChartTypes/NonUniformHeatmapChart/exampleInfo.tsx",
        exportName: "nonUniformHeatmapExampleInfo",
    },
    featuredApps_AxisTypes: {
        path: "../Examples/FeaturedApps/FeatureDemos/AxisTypes/exampleInfo.tsx",
        exportName: "axisTypesExampleInfo",
    },
    chart2D_createStockCharts_SubChartStockCharts: {
        path: "../Examples/Charts2D/CreateStockCharts/SubChartStockCharts/exampleInfo.tsx",
        exportName: "subChartStockChartsExampleInfo",
    },
    featuredApps_AxisLayout: {
        path: "../Examples/FeaturedApps/FeatureDemos/AxisLayout/exampleInfo.tsx",
        exportName: "axisLayoutExampleInfo",
    },
    featuredApps_SubChartsAPI: {
        path: "../Examples/FeaturedApps/FeatureDemos/SubChartsAPI/exampleInfo.tsx",
        exportName: "subchartsGridExampleInfo",
    },
    featuredApps_WebsocketBigData: {
        path: "../Examples/FeaturedApps/ShowCases/WebsocketBigData/exampleInfo.tsx",
        exportName: "websocketBigDataDemoExampleInfo",
    },
    featuredApps_ServerTrafficDashboard: {
        path: "../Examples/FeaturedApps/ShowCases/ServerTrafficDashboard/exampleInfo.tsx",
        exportName: "serverTrafficDashboardDemoExampleInfo",
    },
    featuredApps_OilAndGasDashboard: {
        path: "../Examples/FeaturedApps/ShowCases/OilAndGasDashboard/exampleInfo.tsx",
        exportName: "oilAndGasExplorerDashboard",
    },
    chart2D_stylingAndTheming_DataLabels: {
        path: "../Examples/Charts2D/StylingAndTheming/DataLabels/exampleInfo.tsx",
        exportName: "datalabelsExampleInfo",
    },
    chart2D_zoomAndPan_VirtualizedDataOverview: {
        path: "../Examples/Charts2D/ZoomingAndPanning/VirtualizedDataWithOverview/exampleInfo.tsx",
        exportName: "virtualizedDataOverviewExampleInfo",
    },
    featuredApps_HeatmapInteractions: {
        path: "../Examples/FeaturedApps/ShowCases/HeatmapInteractions/exampleInfo.tsx",
        exportName: "heatmapInteractionsExampleInfo",
    },
    chart2D_createStockCharts_DepthChart: {
        path: "../Examples/Charts2D/CreateStockCharts/DepthChart/exampleInfo.tsx",
        exportName: "depthChartExampleInfo",
    },
    chart2D_basicCharts_TextChart: {
        path: "../Examples/Charts2D/BasicChartTypes/TextSeriesChart/exampleInfo.tsx",
        exportName: "textChartExampleInfo",
    },
    featuredApps_ChartTitle: {
        path: "../Examples/FeaturedApps/FeatureDemos/ChartTitle/exampleInfo.tsx",
        exportName: "chartTitleExampleInfo",
    },
    chart2D_chartAnnotations_BackgroundAnnotations: {
        path: "../Examples/Charts2D/ChartAnnotations/BackgroundAnnotations/exampleInfo.tsx",
        exportName: "backgroundAnnotationsExampleInfo",
    },
    chart3D_basic3DChartTypes_RealtimeSurfaceMesh3DChart: {
        path: "../Examples/Charts3D/Basic3DChartTypes/RealtimeSurfaceMesh3DChart/exampleInfo.tsx",
        exportName: "realtimeSurfaceMesh3DChartExampleInfo",
    },
    featuredApps_DynamicLayout: {
        path: "../Examples/FeaturedApps/ShowCases/DynamicLayout/exampleInfo.tsx",
        exportName: "dynamicLayoutExampleInfo",
    },
    chart2D_tooltipsAndHittest_UsingVerticalSliceModifier: {
        path: "../Examples/Charts2D/TooltipsAndHittest/UsingVerticalSliceModifier/exampleInfo.tsx",
        exportName: "usingVerticalSliceModifierExampleInfo",
    },
    chart2D_multiChart_SyncMultiChart: {
        path: "../Examples/Charts2D/MultiChart/SyncMultiChart/exampleInfo.tsx",
        exportName: "syncMultiChartExampleInfo",
    },
    featuredApps_EventMarkers: {
        path: "../Examples/FeaturedApps/ShowCases/EventMarkers/exampleInfo.tsx",
        exportName: "eventMarkersExampleInfo",
    },
    chart2D_stylingAndTheming_MultiplePointMarkers: {
        path: "../Examples/Charts2D/StylingAndTheming/MultiStyleSeries/exampleInfo.tsx",
        exportName: "multiplePointMarkersExampleInfo",
    },
    featuredApps_PopulationPyramid: {
        path: "../Examples/FeaturedApps/ShowCases/PopulationPyramid/exampleInfo.tsx",
        exportName: "populationPyramidExampleInfo",
    },
    chart2D_createStockCharts_UserAnnotatedStockChart: {
        path: "../Examples/Charts2D/CreateStockCharts/UserAnnotatedStockChart/exampleInfo.tsx",
        exportName: "userAnnotatedStockChartExampleInfo",
    },
    chart2D_basicCharts_SmoothStackedMountainChart: {
        path: "../Examples/Charts2D/BasicChartTypes/SmoothStackedMountainChart/exampleInfo.tsx",
        exportName: "smoothStackedMountainChartExampleInfo",
    },
    chart2D_stylingAndTheming_LineSplittingThresholds: {
        path: "../Examples/Charts2D/StylingAndTheming/LineSplittingThresholds/exampleInfo.tsx",
        exportName: "lineSplittingThresholdsExampleInfo",
    },
};

/// <reference types="webpack-env" />

// Create a webpack context for files ending with "exampleInfo.tsx" (or .js/.ts)
const examplesContext = require.context("../Examples", true, /exampleInfo(\.js|\.ts|\.tsx)?$/);

// Convert a module path to the key expected by the context.
const loadModule = (modulePath: string) => {
    const relativePath = "./" + modulePath.replace(/^(\.\.\/)+Examples\//, "");
    return examplesContext(relativePath);
};

function buildExamplesPages(paths: Record<string, { path: string; exportName: string }>): Record<string, TExamplePage> {
    return Object.keys(paths).reduce((acc, key) => {
        const { path, exportName } = paths[key];
        const mod = loadModule(path);
        const moduleExport = mod[exportName];
        if (!moduleExport.filepath) {
            moduleExport.filepath = path;
        }
        acc[key] = { id: key, ...moduleExport };
        return acc;
    }, {} as Record<string, TExamplePage>);
}

export const EXAMPLES_PAGES = buildExamplesPages(examplePaths);

//console.log("got examples page>>> ", EXAMPLES_PAGES);
console.log("EXAMPLES loaded");
