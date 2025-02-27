import React from "react";
import { EPageLayout, GalleryItem } from "../../helpers/types/types";
import { TPage } from "./pages";
import { TFrameworkTemplate } from "../../helpers/shared/Helpers/frameworkParametrization";
import { TDocumentationLink } from "../../helpers/types/ExampleDescriptionTypes";
/*
import { bandSeriesChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/BandSeriesChart/exampleInfo";
import { splineBandSeriesChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/SplineBandSeriesChart/exampleInfo";
import { digitalBandSeriesChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/DigitalBandSeriesChart/exampleInfo";
import { fanChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/FanChart/exampleInfo";
import { bubbleChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/BubbleChart/exampleInfo";
import { candlestickChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/CandlestickChart/exampleInfo";
import { ohlcChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/OhlcChart/exampleInfo";
import { columnChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/ColumnChart/exampleInfo";
import { impulseChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/ImpulseChart/exampleInfo";
import { errorBarsChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/ErrorBarsChart/exampleInfo";
import { heatmapChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/HeatmapChart/exampleInfo";
import { contourChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/ContoursChart/exampleInfo";
import { lineChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/LineChart/exampleInfo";
import { splineLineChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/SplineLineChart/exampleInfo";
import { digitalLineChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/DigitalLineChart/exampleInfo";
import { mountainChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/MountainChart/exampleInfo";
import { splineMountainChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/SplineMountainChart/exampleInfo";
import { digitalMountainChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/DigitalMountainChart/exampleInfo";
import { scatterChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/ScatterChart/exampleInfo";
import { donutChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/DonutChart/exampleInfo";
import { pieChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/PieChart/exampleInfo";
import { realTimeMountainChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/RealTimeMountainChart/exampleInfo";
import { annotationsAreEasyExampleInfo } from "../Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy/exampleInfo";
import { annotationLayersExampleInfo } from "../Examples/Charts2D/ChartAnnotations/AnnotationLayers/exampleInfo";
import { tradeMarkerAnnotationsExampleInfo } from "../Examples/Charts2D/ChartAnnotations/TradeMarkers/exampleInfo";
import { realtimeGhostedTracesExampleInfo } from "../Examples/FeaturedApps/PerformanceDemos/RealtimeGhostedTraces/exampleInfo";
import { multiPaneStockChartsExampleInfo } from "../Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts/exampleInfo";
import { realtimeTickingStockChartsExampleInfo } from "../Examples/Charts2D/CreateStockCharts/RealtimeTickingStockCharts/exampleInfo";
import { chartLegendsAPIExampleInfo } from "../Examples/Charts2D/Legends/ChartLegendsAPI/exampleInfo";
import { multipleXAxesExampleInfo } from "../Examples/Charts2D/ModifyAxisBehavior/MultipleXAxes/exampleInfo";
import { secondaryYAxesExampleInfo } from "../Examples/Charts2D/ModifyAxisBehavior/SecondaryYAxes/exampleInfo";
import { verticalChartsExampleInfo } from "../Examples/Charts2D/ModifyAxisBehavior/VerticalCharts/exampleInfo";
import { centralAxesExampleInfo } from "../Examples/Charts2D/ModifyAxisBehavior/CentralAxes/exampleInfo";
import { staticAxisExampleInfo } from "../Examples/Charts2D/ModifyAxisBehavior/StaticAxis/exampleInfo";
import { verticallyStackedAxesExampleInfo } from "../Examples/Charts2D/ModifyAxisBehavior/VerticallyStackedAxes/exampleInfo";
import { stackedColumnChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/StackedColumnChart/exampleInfo";
import { stackedColumnSideBySideExampleInfo } from "../Examples/Charts2D/BasicChartTypes/StackedColumnSideBySide/exampleInfo";
import { stackedMountainChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/StackedMountainChart/exampleInfo";
import { usePointMarkersExampleInfo } from "../Examples/Charts2D/StylingAndTheming/UsePointMarkers/exampleInfo";
import { usingThemeManagerExampleInfo } from "../Examples/Charts2D/StylingAndTheming/UsingThemeManager/exampleInfo";
import { createACustomThemeExampleInfo } from "../Examples/Charts2D/StylingAndTheming/CreateACustomTheme/exampleInfo";
import { stylingInCodeExampleInfo } from "../Examples/Charts2D/StylingAndTheming/StylingInCode/exampleInfo";
import { perPointColoringExampleInfo } from "../Examples/Charts2D/StylingAndTheming/PerPointColoring/exampleInfo";
import { dashedLineStylingExampleInfo } from "../Examples/Charts2D/StylingAndTheming/DashedLineStyling/exampleInfo";
import { transparentBackgroundExampleInfo } from "../Examples/Charts2D/StylingAndTheming/TransparentBackground/exampleInfo";
import { hitTestApiExampleInfo } from "../Examples/Charts2D/TooltipsAndHittest/HitTestAPI/exampleInfo";
import { usingRolloverModifierTooltipsExampleInfo } from "../Examples/Charts2D/TooltipsAndHittest/UsingRolloverModifierTooltips/exampleInfo";
import { seriesSelectionExampleInfo } from "../Examples/Charts2D/TooltipsAndHittest/SeriesSelection/exampleInfo";
import { usingCursorModifierTooltipsExampleInfo } from "../Examples/Charts2D/TooltipsAndHittest/UsingCursorModifierTooltips/exampleInfo";
import { bubble3DChartExampleInfo } from "../Examples/Charts3D/Basic3DChartTypes/Bubble3DChart/exampleInfo";
import { surfaceMesh3DChartExampleInfo } from "../Examples/Charts3D/Basic3DChartTypes/SurfaceMesh3DChart/exampleInfo";
import { pointLine3DChartExampleInfo } from "../Examples/Charts3D/Basic3DChartTypes/PointLine3DChart/exampleInfo";
import { load500By500ExampleInfo } from "../Examples/FeaturedApps/PerformanceDemos/Load500By500/exampleInfo";
import { realtimePerformanceDemoExampleInfo } from "../Examples/FeaturedApps/PerformanceDemos/RealtimePerformanceDemo/exampleInfo";
import { vitalSignsMonitorDemoExampleInfo } from "../Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo/exampleInfo";
import { lidar3DPointCloudExampleInfo } from "../Examples/FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo/exampleInfo";
import { audioAnalyzerExampleInfo } from "../Examples/FeaturedApps/ScientificCharts/AudioAnalyzer/exampleInfo";
import { waterfallChartExampleInfo } from "../Examples/FeaturedApps/ScientificCharts/InteractiveWaterfallChart/exampleInfo";
import { tenorCurvesExampleInfo } from "../Examples/FeaturedApps/ScientificCharts/TenorCurves3D/exampleInfo";
import { loadOneMillionPointsExampleInfo } from "../Examples/FeaturedApps/PerformanceDemos/Load1MillionPoints/exampleInfo";
import { dragAxisToScaleExampleInfo } from "../Examples/Charts2D/ZoomingAndPanning/DragAxisToScale/exampleInfo";
import { realtimeZoomPanExampleInfo } from "../Examples/Charts2D/ZoomingAndPanning/RealtimeZoomPan/exampleInfo";
import { zoomAndPanWithMultipleChartModifiersExampleInfo } from "../Examples/Charts2D/ZoomingAndPanning/MultipleZoomPanModifiers/exampleInfo";
import { editableAnnotationsExampleInfo } from "../Examples/Charts2D/ChartAnnotations/EditableAnnotations/exampleInfo";
import { dragHorizontalThresholdExampleInfo } from "../Examples/Charts2D/ChartAnnotations/DragHorizontalThreshold/exampleInfo";
import { metaDataExampleInfo } from "../Examples/Charts2D/TooltipsAndHittest/MetaData/exampleInfo";
import { logarithmicAxisExampleInfo } from "../Examples/Charts2D/ModifyAxisBehavior/LogarithmicAxis/exampleInfo";
import { simpleChartExampleInfo } from "../Examples/BuilderApi/SimpleChart/exampleInfo";
import { fullChartExampleInfo } from "../Examples/BuilderApi/FullChart/exampleInfo";
import { chartFromJSONExampleInfo } from "../Examples/BuilderApi/ChartFromJSON/exampleInfo";
import { sharedDataExampleInfo } from "../Examples/BuilderApi/SharedData/exampleInfo";
import { customTypesExampleInfo } from "../Examples/BuilderApi/CustomTypes/exampleInfo";
import { multiLineLabelsExampleInfo } from "../Examples/Charts2D/AxisLabelCustomization/MultiLineLabels/exampleInfo";
import { imageLabelsExampleInfo } from "../Examples/Charts2D/AxisLabelCustomization/ImageLabels/exampleInfo";
import { rotatedLabelsExampleInfo } from "../Examples/Charts2D/AxisLabelCustomization/RotatedLabels/exampleInfo";
import { percentageChangeExampleInfo } from "../Examples/Charts2D/Filters/PercentageChange/exampleInfo";
import { trendMARatioExampleInfo } from "../Examples/Charts2D/Filters/TrendMARatio/exampleInfo";
import { customFiltersExampleInfo } from "../Examples/Charts2D/Filters/CustomFilters/exampleInfo";
import { dataAnimationExampleInfo } from "../Examples/Charts2D/Animations/DataAnimation/exampleInfo";
import { styleAnimationExampleInfo } from "../Examples/Charts2D/Animations/StyleAnimation/exampleInfo";
import { startupAnimationExampleInfo } from "../Examples/Charts2D/Animations/StartupAnimation/exampleInfo";
import { dataPointSelectionExampleInfo } from "../Examples/Charts2D/TooltipsAndHittest/DatapointSelection/exampleInfo";
import { overviewExampleInfo } from "../Examples/Charts2D/ZoomingAndPanning/OverviewModifier/exampleInfo";
import { genericAnimationExampleInfo } from "../Examples/Charts2D/Animations/GenericAnimation/exampleInfo";
import { drawBehindAxesExampleInfo } from "../Examples/Charts2D/ModifyAxisBehavior/DrawBehindAxes/exampleInfo";
import { nonUniformHeatmapExampleInfo } from "../Examples/Charts2D/BasicChartTypes/NonUniformHeatmapChart/exampleInfo";
import { axisTypesExampleInfo } from "../Examples/FeaturedApps/FeatureDemos/AxisTypes/exampleInfo";
import { subChartStockChartsExampleInfo } from "../Examples/Charts2D/CreateStockCharts/SubChartStockCharts/exampleInfo";
import { axisLayoutExampleInfo } from "../Examples/FeaturedApps/FeatureDemos/AxisLayout/exampleInfo";
import { subchartsGridExampleInfo } from "../Examples/FeaturedApps/FeatureDemos/SubChartsAPI/exampleInfo";
import { websocketBigDataDemoExampleInfo } from "../Examples/FeaturedApps/ShowCases/WebsocketBigData/exampleInfo";
import { serverTrafficDashboardDemoExampleInfo } from "../Examples/FeaturedApps/ShowCases/ServerTrafficDashboard/exampleInfo";
import { oilAndGasExplorerDashboard } from "../Examples/FeaturedApps/ShowCases/OilAndGasDashboard/exampleInfo";
import { datalabelsExampleInfo } from "../Examples/Charts2D/StylingAndTheming/DataLabels/exampleInfo";
import { virtualizedDataOverviewExampleInfo } from "../Examples/Charts2D/ZoomingAndPanning/VirtualizedDataWithOverview/exampleInfo";
import { heatmapInteractionsExampleInfo } from "../Examples/FeaturedApps/ShowCases/HeatmapInteractions/exampleInfo";
import { depthChartExampleInfo } from "../Examples/Charts2D/CreateStockCharts/DepthChart/exampleInfo";
import { textChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/TextSeriesChart/exampleInfo";
import { chartTitleExampleInfo } from "../Examples/FeaturedApps/FeatureDemos/ChartTitle/exampleInfo";
import { backgroundAnnotationsExampleInfo } from "../Examples/Charts2D/ChartAnnotations/BackgroundAnnotations/exampleInfo";
import { realtimeSurfaceMesh3DChartExampleInfo } from "../Examples/Charts3D/Basic3DChartTypes/RealtimeSurfaceMesh3DChart/exampleInfo";
import { dynamicLayoutExampleInfo } from "../Examples/FeaturedApps/ShowCases/DynamicLayout/exampleInfo";
import { usingVerticalSliceModifierExampleInfo } from "../Examples/Charts2D/TooltipsAndHittest/UsingVerticalSliceModifier/exampleInfo";
import { syncMultiChartExampleInfo } from "../Examples/Charts2D/MultiChart/SyncMultiChart/exampleInfo";
import { eventMarkersExampleInfo } from "../Examples/FeaturedApps/ShowCases/EventMarkers/exampleInfo";
import { multiplePointMarkersExampleInfo } from "../Examples/Charts2D/StylingAndTheming/MultiStyleSeries/exampleInfo";
import { populationPyramidExampleInfo } from "../Examples/FeaturedApps/ShowCases/PopulationPyramid/exampleInfo";
import { userAnnotatedStockChartExampleInfo } from "../Examples/Charts2D/CreateStockCharts/UserAnnotatedStockChart/exampleInfo";
import { smoothStackedMountainChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/SmoothStackedMountainChart/exampleInfo";
import { lineSplittingThresholdsExampleInfo } from "../Examples/Charts2D/StylingAndTheming/LineSplittingThresholds/exampleInfo";
import { column3DChartExampleInfo } from "../Examples/Charts3D/Basic3DChartTypes/Column3DChart/exampleInfo";
*/

export type TExampleInfo = {
    exampleTitle: string;
    id: string;
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
    reactComponent?: string;
    exampleDirectory?: string;
};

export type TExamplePage = TPage & TExampleInfo;

function asRecord<T extends Record<string, TExamplePage>>(arg: T): T & Record<string, TExamplePage> {
    return arg;
}

/*
export const EXAMPLES_PAGES_DATA = {
    chart2D_Animations_DataAnimation: {
        id: "chart2D_Animations_DataAnimation",
        path: "../Examples/Charts2D/Animations/DataAnimation",
        exportName: "dataAnimationExampleInfo", // dataAnimationExampleInfo
        info: dataAnimationExampleInfo,
    },
    chart2D_Animations_StyleAnimation: {
        id: "chart2D_Animations_StyleAnimation",
        path: "../Examples/Charts2D/Animations/StyleAnimation/exampleInfo.tsx",
        exportName: "styleAnimationExampleInfo",
        info: styleAnimationExampleInfo,
    },
    chart2D_Animations_StartupAnimation: {
        id: "chart2D_Animations_StartupAnimation",
        path: "../Examples/Charts2D/Animations/StartupAnimation/exampleInfo.tsx",
        exportName: "startupAnimationExampleInfo",
        info: startupAnimationExampleInfo,
    },
    chart2D_Animations_GenericAnimation: {
        id: "chart2D_Animations_GenericAnimation",
        path: "../Examples/Charts2D/Animations/GenericAnimation/exampleInfo.tsx",
        exportName: "genericAnimationExampleInfo",
        info: genericAnimationExampleInfo,
    },
    chart2D_basicCharts_BandSeriesChart: {
        id: "chart2D_basicCharts_BandSeriesChart",
        path: "../Examples/Charts2D/BasicChartTypes/BandSeriesChart/exampleInfo.tsx",
        exportName: "bandSeriesChartExampleInfo",
        info: bandSeriesChartExampleInfo,
    },
    chart2D_basicCharts_SplineBandChart: {
        id: "chart2D_basicCharts_SplineBandChart",
        path: "../Examples/Charts2D/BasicChartTypes/SplineBandSeriesChart/exampleInfo.tsx",
        exportName: "splineBandSeriesChartExampleInfo",
        info: splineBandSeriesChartExampleInfo,
    },
    chart2D_basicCharts_DigitalBandSeriesChart: {
        id: "chart2D_basicCharts_DigitalBandSeriesChart",
        path: "../Examples/Charts2D/BasicChartTypes/DigitalBandSeriesChart/exampleInfo.tsx",
        exportName: "digitalBandSeriesChartExampleInfo",
        info: digitalBandSeriesChartExampleInfo,
    },
    chart2D_basicCharts_FanChart: {
        id: "chart2D_basicCharts_FanChart",
        path: "../Examples/Charts2D/BasicChartTypes/FanChart/exampleInfo.tsx",
        exportName: "fanChartExampleInfo",
        info: fanChartExampleInfo,
    },
    chart2D_basicCharts_BubbleChart: {
        id: "chart2D_basicCharts_BubbleChart",
        path: "../Examples/Charts2D/BasicChartTypes/BubbleChart/exampleInfo.tsx",
        exportName: "bubbleChartExampleInfo",
        info: bubbleChartExampleInfo,
    },
    chart2D_basicCharts_CandlestickChart: {
        id: "chart2D_basicCharts_CandlestickChart",
        path: "../Examples/Charts2D/BasicChartTypes/CandlestickChart/exampleInfo.tsx",
        exportName: "candlestickChartExampleInfo",
        info: candlestickChartExampleInfo,
    },
    chart2D_basicCharts_OhlcChart: {
        id: "chart2D_basicCharts_OhlcChart",
        path: "../Examples/Charts2D/BasicChartTypes/OhlcChart/exampleInfo.tsx",
        exportName: "ohlcChartExampleInfo",
        info: ohlcChartExampleInfo,
    },
    chart2D_basicCharts_ErrorBarsChart: {
        id: "chart2D_basicCharts_ErrorBarsChart",
        path: "../Examples/Charts2D/BasicChartTypes/ErrorBarsChart/exampleInfo.tsx",
        exportName: "errorBarsChartExampleInfo",
        info: errorBarsChartExampleInfo,
    },
    chart2D_basicCharts_ColumnChart: {
        id: "chart2D_basicCharts_ColumnChart",
        path: "../Examples/Charts2D/BasicChartTypes/ColumnChart/exampleInfo.tsx",
        exportName: "columnChartExampleInfo",
        info: columnChartExampleInfo,
    },
    chart2D_basicCharts_ImpulseChart: {
        id: "chart2D_basicCharts_ImpulseChart",
        path: "../Examples/Charts2D/BasicChartTypes/ImpulseChart/exampleInfo.tsx",
        exportName: "impulseChartExampleInfo",
        info: impulseChartExampleInfo,
    },
    chart2D_basicCharts_HeatmapChart: {
        id: "chart2D_basicCharts_HeatmapChart",
        path: "../Examples/Charts2D/BasicChartTypes/HeatmapChart/exampleInfo.tsx",
        exportName: "heatmapChartExampleInfo",
        info: heatmapChartExampleInfo,
    },
    chart2D_basicCharts_NonUniformHeatmapChart: {
        id: "chart2D_basicCharts_NonUniformHeatmapChart",
        path: "../Examples/Charts2D/BasicChartTypes/NonUniformHeatmapChart/exampleInfo.tsx",
        exportName: "nonUniformHeatmapExampleInfo",
        info: nonUniformHeatmapExampleInfo,
    },
    chart2D_basicCharts_ContourChart: {
        id: "chart2D_basicCharts_ContourChart",
        path: "../Examples/Charts2D/BasicChartTypes/ContoursChart/exampleInfo.tsx",
        exportName: "contourChartExampleInfo",
        info: contourChartExampleInfo,
    },
    chart2D_basicCharts_LineChart: {
        id: "chart2D_basicCharts_LineChart",
        path: "../Examples/Charts2D/BasicChartTypes/LineChart/exampleInfo.tsx",
        exportName: "lineChartExampleInfo",
        info: lineChartExampleInfo,
    },
    chart2D_basicCharts_SplineLineChart: {
        id: "chart2D_basicCharts_SplineLineChart",
        path: "../Examples/Charts2D/BasicChartTypes/SplineLineChart/exampleInfo.tsx",
        exportName: "splineLineChartExampleInfo",
        info: splineLineChartExampleInfo,
    },
    chart2D_basicCharts_DigitalLineChart: {
        id: "chart2D_basicCharts_DigitalLineChart",
        path: "../Examples/Charts2D/BasicChartTypes/DigitalLineChart/exampleInfo.tsx",
        exportName: "digitalLineChartExampleInfo",
        info: digitalLineChartExampleInfo,
    },
    chart2D_basicCharts_MountainChart: {
        id: "chart2D_basicCharts_MountainChart",
        path: "../Examples/Charts2D/BasicChartTypes/MountainChart/exampleInfo.tsx",
        exportName: "mountainChartExampleInfo",
        info: mountainChartExampleInfo,
    },
    chart2D_basicCharts_SplineMountainChart: {
        id: "chart2D_basicCharts_SplineMountainChart",
        path: "../Examples/Charts2D/BasicChartTypes/SplineMountainChart/exampleInfo.tsx",
        exportName: "splineMountainChartExampleInfo",
        info: splineMountainChartExampleInfo,
    },
    chart2D_basicCharts_DigitalMountainChart: {
        id: "chart2D_basicCharts_DigitalMountainChart",
        path: "../Examples/Charts2D/BasicChartTypes/DigitalMountainChart/exampleInfo.tsx",
        exportName: "digitalMountainChartExampleInfo",
        info: digitalMountainChartExampleInfo,
    },
    chart2D_basicCharts_ScatterChart: {
        id: "chart2D_basicCharts_ScatterChart",
        path: "../Examples/Charts2D/BasicChartTypes/ScatterChart/exampleInfo.tsx",
        exportName: "scatterChartExampleInfo",
        info: scatterChartExampleInfo,
    },
    chart2D_basicCharts_DonutChart: {
        id: "chart2D_basicCharts_DonutChart",
        path: "../Examples/Charts2D/BasicChartTypes/DonutChart/exampleInfo.tsx",
        exportName: "donutChartExampleInfo",
        info: donutChartExampleInfo,
    },
    chart2D_basicCharts_PieChart: {
        id: "chart2D_basicCharts_PieChart",
        path: "../Examples/Charts2D/BasicChartTypes/PieChart/exampleInfo.tsx",
        exportName: "pieChartExampleInfo",
        info: pieChartExampleInfo,
    },
    chart2D_basicCharts_RealtimeMountainChart: {
        id: "chart2D_basicCharts_RealtimeMountainChart",
        path: "../Examples/Charts2D/BasicChartTypes/RealTimeMountainChart/exampleInfo.tsx",
        exportName: "realTimeMountainChartExampleInfo",
        info: realTimeMountainChartExampleInfo,
    },
    chart2D_basicCharts_TextChart: {
        id: "chart2D_basicCharts_TextChart",
        path: "../Examples/Charts2D/BasicChartTypes/TextSeriesChart/exampleInfo.tsx",
        exportName: "textChartExampleInfo",
        info: textChartExampleInfo,
    },
    chart2D_chartAnnotations_AnnotationsAreEasy: {
        id: "chart2D_chartAnnotations_AnnotationsAreEasy",
        path: "../Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy/exampleInfo.tsx",
        exportName: "annotationsAreEasyExampleInfo",
        info: annotationsAreEasyExampleInfo,
    },
    chart2D_chartAnnotations_AnnotationLayers: {
        id: "chart2D_chartAnnotations_AnnotationLayers",
        path: "../Examples/Charts2D/ChartAnnotations/AnnotationLayers/exampleInfo.tsx",
        exportName: "annotationLayersExampleInfo",
        info: annotationLayersExampleInfo,
    },
    chart2D_chartAnnotations_EditableAnntations: {
        id: "chart2D_chartAnnotations_EditableAnntations",
        path: "../Examples/Charts2D/ChartAnnotations/EditableAnnotations/exampleInfo.tsx",
        exportName: "editableAnnotationsExampleInfo",
        info: editableAnnotationsExampleInfo,
    },
    chart2D_chartAnnotations_TradeMarkers: {
        id: "chart2D_chartAnnotations_TradeMarkers",
        path: "../Examples/Charts2D/ChartAnnotations/TradeMarkers/exampleInfo.tsx",
        exportName: "tradeMarkerAnnotationsExampleInfo",
        info: tradeMarkerAnnotationsExampleInfo,
    },
    chart2D_chartAnnotations_DragHorizontalThreshold: {
        id: "chart2D_chartAnnotations_DragHorizontalThreshold",
        path: "../Examples/Charts2D/ChartAnnotations/DragHorizontalThreshold/exampleInfo.tsx",
        exportName: "dragHorizontalThresholdExampleInfo",
        info: dragHorizontalThresholdExampleInfo,
    },
    chart2D_chartAnnotations_BackgroundAnnotations: {
        id: "chart2D_chartAnnotations_BackgroundAnnotations",
        path: "../Examples/Charts2D/ChartAnnotations/BackgroundAnnotations/exampleInfo.tsx",
        exportName: "backgroundAnnotationsExampleInfo",
        info: backgroundAnnotationsExampleInfo,
    },
    featuredApps_performanceDemos_RealtimeGhostedTraces: {
        id: "featuredApps_performanceDemos_RealtimeGhostedTraces",
        path: "../Examples/FeaturedApps/PerformanceDemos/RealtimeGhostedTraces/exampleInfo.tsx",
        exportName: "realtimeGhostedTracesExampleInfo",
        info: realtimeGhostedTracesExampleInfo,
    },
    featuredApps_performanceDemos_LoadOneMillionPoints: {
        id: "featuredApps_performanceDemos_LoadOneMillionPoints",
        path: "../Examples/FeaturedApps/PerformanceDemos/Load1MillionPoints/exampleInfo.tsx",
        exportName: "loadOneMillionPointsExampleInfo",
        info: loadOneMillionPointsExampleInfo,
    },
    chart2D_createStockCharts_MultiPaneStockCharts: {
        id: "chart2D_createStockCharts_MultiPaneStockCharts",
        path: "../Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts/exampleInfo.tsx",
        exportName: "multiPaneStockChartsExampleInfo",
        info: multiPaneStockChartsExampleInfo,
    },
    chart2D_createStockCharts_RealtimeTickingStockCharts: {
        id: "chart2D_createStockCharts_RealtimeTickingStockCharts",
        path: "../Examples/Charts2D/CreateStockCharts/RealtimeTickingStockCharts/exampleInfo.tsx",
        exportName: "realtimeTickingStockChartsExampleInfo",
        info: realtimeTickingStockChartsExampleInfo,
    },
    chart2D_createStockCharts_SubchartStockCharts: {
        id: "chart2D_createStockCharts_SubchartStockCharts",
        path: "../Examples/Charts2D/CreateStockCharts/SubChartStockCharts/exampleInfo.tsx",
        exportName: "subChartStockChartsExampleInfo",
        info: subChartStockChartsExampleInfo,
    },
    chart2D_createStockCharts_DepthChart: {
        id: "chart2D_createStockCharts_DepthChart",
        path: "../Examples/Charts2D/CreateStockCharts/DepthChart/exampleInfo.tsx",
        exportName: "depthChartExampleInfo",
        info: depthChartExampleInfo,
    },
    chart2D_createStockCharts_SharedChart: {
        id: "chart2D_createStockCharts_SharedChart",
        path: "../Examples/Charts2D/CreateStockCharts/UserAnnotatedStockChart/exampleInfo.tsx",
        exportName: "userAnnotatedStockChartExampleInfo",
        info: userAnnotatedStockChartExampleInfo,
    },
    chart2D_legends_ChartLegendsAPI: {
        id: "chart2D_legends_ChartLegendsAPI",
        path: "../Examples/Charts2D/Legends/ChartLegendsAPI/exampleInfo.tsx",
        exportName: "chartLegendsAPIExampleInfo",
        info: chartLegendsAPIExampleInfo,
    },
    chart2D_modifyAxisBehavior_MultipleXAxes: {
        id: "chart2D_modifyAxisBehavior_MultipleXAxes",
        path: "../Examples/Charts2D/ModifyAxisBehavior/MultipleXAxes/exampleInfo.tsx",
        exportName: "multipleXAxesExampleInfo",
        info: multipleXAxesExampleInfo,
    },
    chart2D_modifyAxisBehavior_SecondaryYAxes: {
        id: "chart2D_modifyAxisBehavior_SecondaryYAxes",
        path: "../Examples/Charts2D/ModifyAxisBehavior/SecondaryYAxes/exampleInfo.tsx",
        exportName: "secondaryYAxesExampleInfo",
        info: secondaryYAxesExampleInfo,
    },
    chart2D_modifyAxisBehavior_VerticalCharts: {
        id: "chart2D_modifyAxisBehavior_VerticalCharts",
        path: "../Examples/Charts2D/ModifyAxisBehavior/VerticalCharts/exampleInfo.tsx",
        exportName: "verticalChartsExampleInfo",
        info: verticalChartsExampleInfo,
    },
    chart2D_modifyAxisBehavior_CentralAxes: {
        id: "chart2D_modifyAxisBehavior_CentralAxes",
        path: "../Examples/Charts2D/ModifyAxisBehavior/CentralAxes/exampleInfo.tsx",
        exportName: "centralAxesExampleInfo",
        info: centralAxesExampleInfo,
    },
    chart2D_modifyAxisBehavior_StaticAxis: {
        id: "chart2D_modifyAxisBehavior_StaticAxis",
        path: "../Examples/Charts2D/ModifyAxisBehavior/StaticAxis/exampleInfo.tsx",
        exportName: "staticAxisExampleInfo",
        info: staticAxisExampleInfo,
    },
    chart2D_modifyAxisBehavior_VerticallyStackedAxes: {
        id: "chart2D_modifyAxisBehavior_VerticallyStackedAxes",
        path: "../Examples/Charts2D/ModifyAxisBehavior/VerticallyStackedAxes/exampleInfo.tsx",
        exportName: "verticallyStackedAxesExampleInfo",
        info: verticallyStackedAxesExampleInfo,
    },
    chart2D_modifyAxisBehavior_LogarithmicAxis: {
        id: "chart2D_modifyAxisBehavior_LogarithmicAxis",
        path: "../Examples/Charts2D/ModifyAxisBehavior/LogarithmicAxis/exampleInfo.tsx",
        exportName: "logarithmicAxisExampleInfo",
        info: logarithmicAxisExampleInfo,
    },
    chart2D_modifyAxisBehavior_DrawBehindAxes: {
        id: "chart2D_modifyAxisBehavior_DrawBehindAxes",
        path: "../Examples/Charts2D/ModifyAxisBehavior/DrawBehindAxes/exampleInfo.tsx",
        exportName: "drawBehindAxesExampleInfo",
        info: drawBehindAxesExampleInfo,
    },
    chart2D_axisLabelCustomization_MultiLineLabels: {
        id: "chart2D_axisLabelCustomization_MultiLineLabels",
        path: "../Examples/Charts2D/AxisLabelCustomization/MultiLineLabels/exampleInfo.tsx",
        exportName: "multiLineLabelsExampleInfo",
        info: multiLineLabelsExampleInfo,
    },
    chart2D_axisLabelCustomization_ImageLabels: {
        id: "chart2D_axisLabelCustomization_ImageLabels",
        path: "../Examples/Charts2D/AxisLabelCustomization/ImageLabels/exampleInfo.tsx",
        exportName: "imageLabelsExampleInfo",
        info: imageLabelsExampleInfo,
    },
    chart2D_axisLabelCustomization_RotatedLabels: {
        id: "chart2D_axisLabelCustomization_RotatedLabels",
        path: "../Examples/Charts2D/AxisLabelCustomization/RotatedLabels/exampleInfo.tsx",
        exportName: "rotatedLabelsExampleInfo",
        info: rotatedLabelsExampleInfo,
    },
    chart2D_basicCharts_StackedColumnChart: {
        id: "chart2D_basicCharts_StackedColumnChart",
        path: "../Examples/Charts2D/BasicChartTypes/StackedColumnChart/exampleInfo.tsx",
        exportName: "stackedColumnChartExampleInfo",
        info: stackedColumnChartExampleInfo,
    },
    chart2D_basicCharts_StackedColumnSideBySide: {
        id: "chart2D_basicCharts_StackedColumnSideBySide",
        path: "../Examples/Charts2D/BasicChartTypes/StackedColumnSideBySide/exampleInfo.tsx",
        exportName: "stackedColumnSideBySideExampleInfo",
        info: stackedColumnSideBySideExampleInfo,
    },
    chart2D_basicCharts_StackedMountainChart: {
        id: "chart2D_basicCharts_StackedMountainChart",
        path: "../Examples/Charts2D/BasicChartTypes/StackedMountainChart/exampleInfo.tsx",
        exportName: "stackedMountainChartExampleInfo",
        info: stackedMountainChartExampleInfo,
    },
    chart2D_basicCharts_SmoothStackedMountainChart: {
        id: "chart2D_basicCharts_SmoothStackedMountainChart",
        path: "../Examples/Charts2D/BasicChartTypes/SmoothStackedMountainChart/exampleInfo.tsx",
        exportName: "smoothStackedMountainChartExampleInfo",
        info: smoothStackedMountainChartExampleInfo,
    },
    chart2D_stylingAndTheming_UsePointMarkers: {
        id: "chart2D_stylingAndTheming_UsePointMarkers",
        path: "../Examples/Charts2D/StylingAndTheming/UsePointMarkers/exampleInfo.tsx",
        exportName: "usePointMarkersExampleInfo",
        info: usePointMarkersExampleInfo,
    },
    chart2D_stylingAndTheming_UsingThemeManager: {
        id: "chart2D_stylingAndTheming_UsingThemeManager",
        path: "../Examples/Charts2D/StylingAndTheming/UsingThemeManager/exampleInfo.tsx",
        exportName: "usingThemeManagerExampleInfo",
        info: usingThemeManagerExampleInfo,
    },
    chart2D_stylingAndTheming_CustomTheme: {
        id: "chart2D_stylingAndTheming_CustomTheme",
        path: "../Examples/Charts2D/StylingAndTheming/CreateACustomTheme/exampleInfo.tsx",
        exportName: "createACustomThemeExampleInfo",
        info: createACustomThemeExampleInfo,
    },
    chart2D_stylingAndTheming_StylingInCode: {
        id: "chart2D_stylingAndTheming_StylingInCode",
        path: "../Examples/Charts2D/StylingAndTheming/StylingInCode/exampleInfo.tsx",
        exportName: "stylingInCodeExampleInfo",
        info: stylingInCodeExampleInfo,
    },
    chart2D_stylingAndTheming_PerPointColoring: {
        id: "chart2D_stylingAndTheming_PerPointColoring",
        path: "../Examples/Charts2D/StylingAndTheming/PerPointColoring/exampleInfo.tsx",
        exportName: "perPointColoringExampleInfo",
        info: perPointColoringExampleInfo,
    },
    chart2D_stylingAndTheming_DashedLineStyling: {
        id: "chart2D_stylingAndTheming_DashedLineStyling",
        path: "../Examples/Charts2D/StylingAndTheming/DashedLineStyling/exampleInfo.tsx",
        exportName: "dashedLineStylingExampleInfo",
        info: dashedLineStylingExampleInfo,
    },
    chart2D_stylingAndTheming_TransparentBackground: {
        id: "chart2D_stylingAndTheming_TransparentBackground",
        path: "../Examples/Charts2D/StylingAndTheming/TransparentBackground/exampleInfo.tsx",
        exportName: "transparentBackgroundExampleInfo",
        info: transparentBackgroundExampleInfo,
    },
    chart2D_stylingAndTheming_DataLabels: {
        id: "chart2D_stylingAndTheming_DataLabels",
        path: "../Examples/Charts2D/StylingAndTheming/DataLabels/exampleInfo.tsx",
        exportName: "datalabelsExampleInfo",
        info: datalabelsExampleInfo,
    },
    chart2D_stylingAndTheming_MultiplePointMarkers: {
        id: "chart2D_stylingAndTheming_MultiplePointMarkers",
        path: "../Examples/Charts2D/StylingAndTheming/MultiStyleSeries/exampleInfo.tsx",
        exportName: "multiplePointMarkersExampleInfo",
        info: multiplePointMarkersExampleInfo,
    },
    chart2D_stylingAndTheming_LineSplittingThresholds: {
        id: "chart2D_stylingAndTheming_LineSplittingThresholds",
        path: "../Examples/Charts2D/StylingAndTheming/LineSplittingThresholds/exampleInfo.tsx",
        exportName: "lineSplittingThresholdsExampleInfo",
        info: lineSplittingThresholdsExampleInfo,
    },
    chart2D_tooltipsAndHittest_HitTestApi: {
        id: "chart2D_tooltipsAndHittest_HitTestApi",
        path: "../Examples/Charts2D/TooltipsAndHittest/HitTestAPI/exampleInfo.tsx",
        exportName: "hitTestApiExampleInfo",
        info: hitTestApiExampleInfo,
    },
    chart2D_tooltipsAndHittest_UsingRolloverModifierTooltips: {
        id: "chart2D_tooltipsAndHittest_UsingRolloverModifierTooltips",
        path: "../Examples/Charts2D/TooltipsAndHittest/UsingRolloverModifierTooltips/exampleInfo.tsx",
        exportName: "usingRolloverModifierTooltipsExampleInfo",
        info: usingRolloverModifierTooltipsExampleInfo,
    },
    chart2D_tooltipsAndHittest_UsingCursorModifierTooltips: {
        id: "chart2D_tooltipsAndHittest_UsingCursorModifierTooltips",
        path: "../Examples/Charts2D/TooltipsAndHittest/UsingCursorModifierTooltips/exampleInfo.tsx",
        exportName: "usingCursorModifierTooltipsExampleInfo",
        info: usingCursorModifierTooltipsExampleInfo,
    },
    chart2D_tooltipsAndHittest_MetaData: {
        id: "chart2D_tooltipsAndHittest_MetaData",
        path: "../Examples/Charts2D/TooltipsAndHittest/MetaData/exampleInfo.tsx",
        exportName: "metaDataExampleInfo",
        info: metaDataExampleInfo,
    },
    chart2D_tooltipsAndHittest_DataPointSelection: {
        id: "chart2D_tooltipsAndHittest_DataPointSelection",
        path: "../Examples/Charts2D/TooltipsAndHittest/DatapointSelection/exampleInfo.tsx",
        exportName: "dataPointSelectionExampleInfo",
        info: dataPointSelectionExampleInfo,
    },
    chart2D_tooltipsAndHittest_SeriesSelection: {
        id: "chart2D_tooltipsAndHittest_SeriesSelection",
        path: "../Examples/Charts2D/TooltipsAndHittest/SeriesSelection/exampleInfo.tsx",
        exportName: "seriesSelectionExampleInfo",
        info: seriesSelectionExampleInfo,
    },
    chart2D_tooltipsAndHittest_VerticalSliceModifier: {
        id: "chart2D_tooltipsAndHittest_VerticalSliceModifier",
        path: "../Examples/Charts2D/TooltipsAndHittest/UsingVerticalSliceModifier/exampleInfo.tsx",
        exportName: "usingVerticalSliceModifierExampleInfo",
        info: usingVerticalSliceModifierExampleInfo,
    },
    chart2D_zoomAndPanAChart_DragAxisToScale: {
        id: "chart2D_zoomAndPanAChart_DragAxisToScale",
        path: "../Examples/Charts2D/ZoomingAndPanning/DragAxisToScale/exampleInfo.tsx",
        exportName: "dragAxisToScaleExampleInfo",
        info: dragAxisToScaleExampleInfo,
    },
    chart2D_zoomAndPanAChart_RealtimeZoomPan: {
        id: "chart2D_zoomAndPanAChart_RealtimeZoomPan",
        path: "../Examples/Charts2D/ZoomingAndPanning/RealtimeZoomPan/exampleInfo.tsx",
        exportName: "realtimeZoomPanExampleInfo",
        info: realtimeZoomPanExampleInfo,
    },
    chart2D_zoomAndPanAChart_MultipleChartModifiers: {
        id: "chart2D_zoomAndPanAChart_MultipleChartModifiers",
        path: "../Examples/Charts2D/ZoomingAndPanning/MultipleZoomPanModifiers/exampleInfo.tsx",
        exportName: "zoomAndPanWithMultipleChartModifiersExampleInfo",
        info: zoomAndPanWithMultipleChartModifiersExampleInfo,
    },
    chart2D_zoomAndPanAChart_Overview: {
        id: "chart2D_zoomAndPanAChart_Overview",
        path: "../Examples/Charts2D/ZoomingAndPanning/OverviewModifier/exampleInfo.tsx",
        exportName: "overviewExampleInfo",
        info: overviewExampleInfo,
    },
    chart2D_zoomAndPanAChart_VirtualizedDataOverview: {
        id: "chart2D_zoomAndPanAChart_VirtualizedDataOverview",
        path: "../Examples/Charts2D/ZoomingAndPanning/VirtualizedDataWithOverview/exampleInfo.tsx",
        exportName: "virtualizedDataOverviewExampleInfo",
        info: virtualizedDataOverviewExampleInfo,
    },
    chart2D_filters_PercentageChange: {
        id: "chart2D_filters_PercentageChange",
        path: "../Examples/Charts2D/Filters/PercentageChange/exampleInfo.tsx",
        exportName: "percentageChangeExampleInfo",
        info: percentageChangeExampleInfo,
    },
    chart2D_filters_TrendMARatio: {
        id: "chart2D_filters_TrendMARatio",
        path: "../Examples/Charts2D/Filters/TrendMARatio/exampleInfo.tsx",
        exportName: "trendMARatioExampleInfo",
        info: trendMARatioExampleInfo,
    },
    chart2D_filters_CustomFilters: {
        id: "chart2D_filters_CustomFilters",
        path: "../Examples/Charts2D/Filters/CustomFilters/exampleInfo.tsx",
        exportName: "customFiltersExampleInfo",
        info: customFiltersExampleInfo,
    },
    chart2D_multiChart_syncMultiChart: {
        id: "chart2D_multiChart_syncMultiChart",
        path: "../Examples/Charts2D/MultiChart/SyncMultiChart/exampleInfo.tsx",
        exportName: "syncMultiChartExampleInfo",
        info: syncMultiChartExampleInfo,
    },
    chart3D_basic3DChartTypes_Bubble3DChart: {
        id: "chart3D_basic3DChartTypes_Bubble3DChart",
        path: "../Examples/Charts3D/Basic3DChartTypes/Bubble3DChart/exampleInfo.tsx",
        exportName: "bubble3DChartExampleInfo",
        info: bubble3DChartExampleInfo,
    },
    chart3D_basic3DChartTypes_SurfaceMesh3DChart: {
        id: "chart3D_basic3DChartTypes_SurfaceMesh3DChart",
        path: "../Examples/Charts3D/Basic3DChartTypes/SurfaceMesh3DChart/exampleInfo.tsx",
        exportName: "surfaceMesh3DChartExampleInfo",
        info: surfaceMesh3DChartExampleInfo,
    },
    chart3D_basic3DChartTypes_RealtimeSurfaceMesh3DChart: {
        id: "chart3D_basic3DChartTypes_RealtimeSurfaceMesh3DChart",
        path: "../Examples/Charts3D/Basic3DChartTypes/RealtimeSurfaceMesh3DChart/exampleInfo.tsx",
        exportName: "realtimeSurfaceMesh3DChartExampleInfo",
        info: realtimeSurfaceMesh3DChartExampleInfo,
    },
    chart3D_basic3DChartTypes_PointLine3DChart: {
        id: "chart3D_basic3DChartTypes_PointLine3DChart",
        path: "../Examples/Charts3D/Basic3DChartTypes/PointLine3DChart/exampleInfo.tsx",
        exportName: "pointLine3DChartExampleInfo",
        info: pointLine3DChartExampleInfo,
    },
    chart3D_basic3DChartTypes_Column3DChart: {
        id: "chart3D_basic3DChartTypes_Column3DChart",
        path: "../Examples/Charts3D/Basic3DChartTypes/Column3DChart/exampleInfo.tsx",
        exportName: "column3DChartExampleInfo",
        info: column3DChartExampleInfo,
    },
    featuredApps_performanceDemos_Load500By500: {
        id: "featuredApps_performanceDemos_Load500By500",
        path: "../Examples/FeaturedApps/PerformanceDemos/Load500By500/exampleInfo.tsx",
        exportName: "load500By500ExampleInfo",
        info: load500By500ExampleInfo,
    },
    featuredApps_performanceDemos_RealtimePerformanceDemo: {
        id: "featuredApps_performanceDemos_RealtimePerformanceDemo",
        path: "../Examples/FeaturedApps/PerformanceDemos/RealtimePerformanceDemo/exampleInfo.tsx",
        exportName: "realtimePerformanceDemoExampleInfo",
        info: realtimePerformanceDemoExampleInfo,
    },
    featuredApps_medicalCharts_VitalSignsMonitorDemo: {
        id: "featuredApps_medicalCharts_VitalSignsMonitorDemo",
        path: "../Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo/exampleInfo.tsx",
        exportName: "vitalSignsMonitorDemoExampleInfo",
        info: vitalSignsMonitorDemoExampleInfo,
    },
    featuredApps_featureDemos_axisTypes: {
        id: "featuredApps_featureDemos_axisTypes",
        path: "../Examples/FeaturedApps/FeatureDemos/AxisTypes/exampleInfo.tsx",
        exportName: "axisTypesExampleInfo",
        info: axisTypesExampleInfo,
    },
    featuredApps_featureDemos_axisLayout: {
        id: "featuredApps_featureDemos_axisLayout",
        path: "../Examples/FeaturedApps/FeatureDemos/AxisLayout/exampleInfo.tsx",
        exportName: "axisLayoutExampleInfo",
        info: axisLayoutExampleInfo,
    },
    featuredApps_featureDemos_chartTitle: {
        id: "featuredApps_featureDemos_chartTitle",
        path: "../Examples/FeaturedApps/FeatureDemos/ChartTitle/exampleInfo.tsx",
        exportName: "chartTitleExampleInfo",
        info: chartTitleExampleInfo,
    },
    featuredApps_featureDemos_subchartsGrid: {
        id: "featuredApps_featureDemos_subchartsGrid",
        path: "../Examples/FeaturedApps/FeatureDemos/SubChartsAPI/exampleInfo.tsx",
        exportName: "subchartsGridExampleInfo",
        info: subchartsGridExampleInfo,
    },
    featuredApps_scientificCharts_Lidar3DPointCloudDemo: {
        id: "featuredApps_scientificCharts_Lidar3DPointCloudDemo",
        path: "../Examples/FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo/exampleInfo.tsx",
        exportName: "lidar3DPointCloudExampleInfo",
        info: lidar3DPointCloudExampleInfo,
    },
    featuredApps_scientificCharts_AudioAnalyzerDemo: {
        id: "featuredApps_scientificCharts_AudioAnalyzerDemo",
        path: "../Examples/FeaturedApps/ScientificCharts/AudioAnalyzer/exampleInfo.tsx",
        exportName: "audioAnalyzerExampleInfo",
        info: audioAnalyzerExampleInfo,
    },
    featuredApps_scientificCharts_WaterfallChartDemo: {
        id: "featuredApps_scientificCharts_WaterfallChartDemo",
        path: "../Examples/FeaturedApps/ScientificCharts/InteractiveWaterfallChart/exampleInfo.tsx",
        exportName: "waterfallChartExampleInfo",
        info: waterfallChartExampleInfo,
    },
    featuredApps_scientificCharts_TenorCurvesDemo: {
        id: "featuredApps_scientificCharts_TenorCurvesDemo",
        path: "../Examples/FeaturedApps/ScientificCharts/TenorCurves3D/exampleInfo.tsx",
        exportName: "tenorCurvesExampleInfo",
        info: tenorCurvesExampleInfo,
    },
    featuredApps_showcases_realtimebigdata: {
        id: "featuredApps_showcases_realtimebigdata",
        path: "../Examples/FeaturedApps/ShowCases/WebsocketBigData/exampleInfo.tsx",
        exportName: "websocketBigDataDemoExampleInfo",
        info: websocketBigDataDemoExampleInfo,
    },
    featuredApps_showcases_servertrafficdashboard: {
        id: "featuredApps_showcases_servertrafficdashboard",
        path: "../Examples/FeaturedApps/ShowCases/ServerTrafficDashboard/exampleInfo.tsx",
        exportName: "serverTrafficDashboardDemoExampleInfo",
        info: serverTrafficDashboardDemoExampleInfo,
    },
    featuredApps_showcases_oilandgasdashboard: {
        id: "featuredApps_showcases_oilandgasdashboard",
        path: "../Examples/FeaturedApps/ShowCases/OilAndGasDashboard/exampleInfo.tsx",
        exportName: "oilAndGasExplorerDashboard",
        info: oilAndGasExplorerDashboard,
    },
    featuredApps_showcases_richInteractions: {
        id: "featuredApps_showcases_richInteractions",
        path: "../Examples/FeaturedApps/ShowCases/HeatmapInteractions/exampleInfo.tsx",
        exportName: "heatmapInteractionsExampleInfo",
        info: heatmapInteractionsExampleInfo,
    },
    featuredApps_showcases_dynamicLayout: {
        id: "featuredApps_showcases_dynamicLayout",
        path: "../Examples/FeaturedApps/ShowCases/DynamicLayout/exampleInfo.tsx",
        exportName: "dynamicLayoutExampleInfo",
        info: dynamicLayoutExampleInfo,
    },
    featuredApps_showcases_eventMarkers: {
        id: "featuredApps_showcases_eventMarkers",
        path: "../Examples/FeaturedApps/ShowCases/EventMarkers/exampleInfo.tsx",
        exportName: "eventMarkersExampleInfo",
        info: eventMarkersExampleInfo,
    },
    featuredApps_showcases_populationPyramid: {
        id: "featuredApps_showcases_populationPyramid",
        path: "../Examples/FeaturedApps/ShowCases/PopulationPyramid/exampleInfo.tsx",
        exportName: "populationPyramidExampleInfo",
        info: populationPyramidExampleInfo,
    },
    builderApi_simplechart: {
        id: "builderApi_simplechart",
        path: "../Examples/BuilderApi/SimpleChart/exampleInfo.tsx",
        exportName: "simpleChartExampleInfo",
        info: simpleChartExampleInfo,
    },
    builderApi_fullchart: {
        id: "builderApi_fullchart",
        path: "../Examples/BuilderApi/FullChart/exampleInfo.tsx",
        exportName: "fullChartExampleInfo",
        info: fullChartExampleInfo,
    },
    builderApi_chartFromJSON: {
        id: "builderApi_chartFromJSON",
        path: "../Examples/BuilderApi/ChartFromJSON/exampleInfo.tsx",
        exportName: "chartFromJSONExampleInfo",
        info: chartFromJSONExampleInfo,
    },
    builderApi_SharedData: {
        id: "builderApi_SharedData",
        path: "../Examples/BuilderApi/SharedData/exampleInfo.tsx",
        exportName: "sharedDataExampleInfo",
        info: sharedDataExampleInfo,
    },
    builderApi_CustomTypes: {
        id: "builderApi_CustomTypes",
        path: "../Examples/BuilderApi/CustomTypes/exampleInfo.tsx",
        exportName: "customTypesExampleInfo",
        info: customTypesExampleInfo,
    },
};
*/

export const EXAMPLES_PAGES_DATA_NEW = [
    {
        id: "chart2D_Animations_DataAnimation",
        path: "../Examples/Charts2D/Animations/DataAnimation",
        exportName: "dataAnimationExampleInfo",
    },
    {
        id: "chart2D_Animations_StyleAnimation",
        path: "../Examples/Charts2D/Animations/StyleAnimation",
        exportName: "styleAnimationExampleInfo",
    },
    {
        id: "chart2D_Animations_StartupAnimation",
        path: "../Examples/Charts2D/Animations/StartupAnimation",
        exportName: "startupAnimationExampleInfo",
    },
    {
        id: "chart2D_Animations_GenericAnimation",
        path: "../Examples/Charts2D/Animations/GenericAnimation",
        exportName: "genericAnimationExampleInfo",
    },
    {
        id: "chart2D_basicCharts_BandSeriesChart",
        path: "../Examples/Charts2D/BasicChartTypes/BandSeriesChart",
        exportName: "bandSeriesChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_SplineBandChart",
        path: "../Examples/Charts2D/BasicChartTypes/SplineBandSeriesChart",
        exportName: "splineBandSeriesChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_DigitalBandSeriesChart",
        path: "../Examples/Charts2D/BasicChartTypes/DigitalBandSeriesChart",
        exportName: "digitalBandSeriesChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_FanChart",
        path: "../Examples/Charts2D/BasicChartTypes/FanChart",
        exportName: "fanChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_BubbleChart",
        path: "../Examples/Charts2D/BasicChartTypes/BubbleChart",
        exportName: "bubbleChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_CandlestickChart",
        path: "../Examples/Charts2D/BasicChartTypes/CandlestickChart",
        exportName: "candlestickChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_OhlcChart",
        path: "../Examples/Charts2D/BasicChartTypes/OhlcChart",
        exportName: "ohlcChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_ErrorBarsChart",
        path: "../Examples/Charts2D/BasicChartTypes/ErrorBarsChart",
        exportName: "errorBarsChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_ColumnChart",
        path: "../Examples/Charts2D/BasicChartTypes/ColumnChart",
        exportName: "columnChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_ImpulseChart",
        path: "../Examples/Charts2D/BasicChartTypes/ImpulseChart",
        exportName: "impulseChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_HeatmapChart",
        path: "../Examples/Charts2D/BasicChartTypes/HeatmapChart",
        exportName: "heatmapChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_NonUniformHeatmapChart",
        path: "../Examples/Charts2D/BasicChartTypes/NonUniformHeatmapChart",
        exportName: "nonUniformHeatmapExampleInfo",
    },
    {
        id: "chart2D_basicCharts_ContourChart",
        path: "../Examples/Charts2D/BasicChartTypes/ContoursChart",
        exportName: "contourChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_LineChart",
        path: "../Examples/Charts2D/BasicChartTypes/LineChart",
        exportName: "lineChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_SplineLineChart",
        path: "../Examples/Charts2D/BasicChartTypes/SplineLineChart",
        exportName: "splineLineChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_DigitalLineChart",
        path: "../Examples/Charts2D/BasicChartTypes/DigitalLineChart",
        exportName: "digitalLineChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_MountainChart",
        path: "../Examples/Charts2D/BasicChartTypes/MountainChart",
        exportName: "mountainChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_SplineMountainChart",
        path: "../Examples/Charts2D/BasicChartTypes/SplineMountainChart",
        exportName: "splineMountainChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_DigitalMountainChart",
        path: "../Examples/Charts2D/BasicChartTypes/DigitalMountainChart",
        exportName: "digitalMountainChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_ScatterChart",
        path: "../Examples/Charts2D/BasicChartTypes/ScatterChart",
        exportName: "scatterChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_DonutChart",
        path: "../Examples/Charts2D/BasicChartTypes/DonutChart",
        exportName: "donutChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_PieChart",
        path: "../Examples/Charts2D/BasicChartTypes/PieChart",
        exportName: "pieChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_RealtimeMountainChart",
        path: "../Examples/Charts2D/BasicChartTypes/RealTimeMountainChart",
        exportName: "realTimeMountainChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_TextChart",
        path: "../Examples/Charts2D/BasicChartTypes/TextSeriesChart",
        exportName: "textChartExampleInfo",
    },
    {
        id: "chart2D_chartAnnotations_AnnotationsAreEasy",
        path: "../Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy",
        exportName: "annotationsAreEasyExampleInfo",
    },
    {
        id: "chart2D_chartAnnotations_AnnotationLayers",
        path: "../Examples/Charts2D/ChartAnnotations/AnnotationLayers",
        exportName: "annotationLayersExampleInfo",
    },
    {
        id: "chart2D_chartAnnotations_EditableAnntations",
        path: "../Examples/Charts2D/ChartAnnotations/EditableAnnotations",
        exportName: "editableAnnotationsExampleInfo",
    },
    {
        id: "chart2D_chartAnnotations_TradeMarkers",
        path: "../Examples/Charts2D/ChartAnnotations/TradeMarkers",
        exportName: "tradeMarkerAnnotationsExampleInfo",
    },
    {
        id: "chart2D_chartAnnotations_DragHorizontalThreshold",
        path: "../Examples/Charts2D/ChartAnnotations/DragHorizontalThreshold",
        exportName: "dragHorizontalThresholdExampleInfo",
    },
    {
        id: "chart2D_chartAnnotations_BackgroundAnnotations",
        path: "../Examples/Charts2D/ChartAnnotations/BackgroundAnnotations",
        exportName: "backgroundAnnotationsExampleInfo",
    },
    {
        id: "featuredApps_performanceDemos_RealtimeGhostedTraces",
        path: "../Examples/FeaturedApps/PerformanceDemos/RealtimeGhostedTraces",
        exportName: "realtimeGhostedTracesExampleInfo",
    },
    {
        id: "featuredApps_performanceDemos_LoadOneMillionPoints",
        path: "../Examples/FeaturedApps/PerformanceDemos/Load1MillionPoints",
        exportName: "loadOneMillionPointsExampleInfo",
    },
    {
        id: "chart2D_createStockCharts_MultiPaneStockCharts",
        path: "../Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts",
        exportName: "multiPaneStockChartsExampleInfo",
    },
    {
        id: "chart2D_createStockCharts_RealtimeTickingStockCharts",
        path: "../Examples/Charts2D/CreateStockCharts/RealtimeTickingStockCharts",
        exportName: "realtimeTickingStockChartsExampleInfo",
    },
    {
        id: "chart2D_createStockCharts_SubchartStockCharts",
        path: "../Examples/Charts2D/CreateStockCharts/SubChartStockCharts",
        exportName: "subChartStockChartsExampleInfo",
    },
    {
        id: "chart2D_createStockCharts_DepthChart",
        path: "../Examples/Charts2D/CreateStockCharts/DepthChart",
        exportName: "depthChartExampleInfo",
    },
    {
        id: "chart2D_createStockCharts_SharedChart",
        path: "../Examples/Charts2D/CreateStockCharts/UserAnnotatedStockChart",
        exportName: "userAnnotatedStockChartExampleInfo",
    },
    {
        id: "chart2D_legends_ChartLegendsAPI",
        path: "../Examples/Charts2D/Legends/ChartLegendsAPI",
        exportName: "chartLegendsAPIExampleInfo",
    },
    {
        id: "chart2D_modifyAxisBehavior_MultipleXAxes",
        path: "../Examples/Charts2D/ModifyAxisBehavior/MultipleXAxes",
        exportName: "multipleXAxesExampleInfo",
    },
    {
        id: "chart2D_modifyAxisBehavior_SecondaryYAxes",
        path: "../Examples/Charts2D/ModifyAxisBehavior/SecondaryYAxes",
        exportName: "secondaryYAxesExampleInfo",
    },
    {
        id: "chart2D_modifyAxisBehavior_VerticalCharts",
        path: "../Examples/Charts2D/ModifyAxisBehavior/VerticalCharts",
        exportName: "verticalChartsExampleInfo",
    },
    {
        id: "chart2D_modifyAxisBehavior_CentralAxes",
        path: "../Examples/Charts2D/ModifyAxisBehavior/CentralAxes",
        exportName: "centralAxesExampleInfo",
    },
    {
        id: "chart2D_modifyAxisBehavior_StaticAxis",
        path: "../Examples/Charts2D/ModifyAxisBehavior/StaticAxis",
        exportName: "staticAxisExampleInfo",
    },
    {
        id: "chart2D_modifyAxisBehavior_VerticallyStackedAxes",
        path: "../Examples/Charts2D/ModifyAxisBehavior/VerticallyStackedAxes",
        exportName: "verticallyStackedAxesExampleInfo",
    },
    {
        id: "chart2D_modifyAxisBehavior_LogarithmicAxis",
        path: "../Examples/Charts2D/ModifyAxisBehavior/LogarithmicAxis",
        exportName: "logarithmicAxisExampleInfo",
    },
    {
        id: "chart2D_modifyAxisBehavior_DrawBehindAxes",
        path: "../Examples/Charts2D/ModifyAxisBehavior/DrawBehindAxes",
        exportName: "drawBehindAxesExampleInfo",
    },
    {
        id: "chart2D_axisLabelCustomization_MultiLineLabels",
        path: "../Examples/Charts2D/AxisLabelCustomization/MultiLineLabels",
        exportName: "multiLineLabelsExampleInfo",
    },
    {
        id: "chart2D_axisLabelCustomization_ImageLabels",
        path: "../Examples/Charts2D/AxisLabelCustomization/ImageLabels",
        exportName: "imageLabelsExampleInfo",
    },
    {
        id: "chart2D_axisLabelCustomization_RotatedLabels",
        path: "../Examples/Charts2D/AxisLabelCustomization/RotatedLabels",
        exportName: "rotatedLabelsExampleInfo",
    },
    {
        id: "chart2D_basicCharts_StackedColumnChart",
        path: "../Examples/Charts2D/BasicChartTypes/StackedColumnChart",
        exportName: "stackedColumnChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_StackedColumnSideBySide",
        path: "../Examples/Charts2D/BasicChartTypes/StackedColumnSideBySide",
        exportName: "stackedColumnSideBySideExampleInfo",
    },
    {
        id: "chart2D_basicCharts_StackedMountainChart",
        path: "../Examples/Charts2D/BasicChartTypes/StackedMountainChart",
        exportName: "stackedMountainChartExampleInfo",
    },
    {
        id: "chart2D_basicCharts_SmoothStackedMountainChart",
        path: "../Examples/Charts2D/BasicChartTypes/SmoothStackedMountainChart",
        exportName: "smoothStackedMountainChartExampleInfo",
    },
    {
        id: "chart2D_stylingAndTheming_UsePointMarkers",
        path: "../Examples/Charts2D/StylingAndTheming/UsePointMarkers",
        exportName: "usePointMarkersExampleInfo",
    },
    {
        id: "chart2D_stylingAndTheming_UsingThemeManager",
        path: "../Examples/Charts2D/StylingAndTheming/UsingThemeManager",
        exportName: "usingThemeManagerExampleInfo",
    },
    {
        id: "chart2D_stylingAndTheming_CustomTheme",
        path: "../Examples/Charts2D/StylingAndTheming/CreateACustomTheme",
        exportName: "createACustomThemeExampleInfo",
    },
    {
        id: "chart2D_stylingAndTheming_StylingInCode",
        path: "../Examples/Charts2D/StylingAndTheming/StylingInCode",
        exportName: "stylingInCodeExampleInfo",
    },
    {
        id: "chart2D_stylingAndTheming_PerPointColoring",
        path: "../Examples/Charts2D/StylingAndTheming/PerPointColoring",
        exportName: "perPointColoringExampleInfo",
    },
    {
        id: "chart2D_stylingAndTheming_DashedLineStyling",
        path: "../Examples/Charts2D/StylingAndTheming/DashedLineStyling",
        exportName: "dashedLineStylingExampleInfo",
    },
    {
        id: "chart2D_stylingAndTheming_TransparentBackground",
        path: "../Examples/Charts2D/StylingAndTheming/TransparentBackground",
        exportName: "transparentBackgroundExampleInfo",
    },
    {
        id: "chart2D_stylingAndTheming_DataLabels",
        path: "../Examples/Charts2D/StylingAndTheming/DataLabels",
        exportName: "datalabelsExampleInfo",
    },
    {
        id: "chart2D_stylingAndTheming_MultiplePointMarkers",
        path: "../Examples/Charts2D/StylingAndTheming/MultiStyleSeries",
        exportName: "multiplePointMarkersExampleInfo",
    },
    {
        id: "chart2D_stylingAndTheming_LineSplittingThresholds",
        path: "../Examples/Charts2D/StylingAndTheming/LineSplittingThresholds",
        exportName: "lineSplittingThresholdsExampleInfo",
    },
    {
        id: "chart2D_tooltipsAndHittest_HitTestApi",
        path: "../Examples/Charts2D/TooltipsAndHittest/HitTestAPI",
        exportName: "hitTestApiExampleInfo",
    },
    {
        id: "chart2D_tooltipsAndHittest_UsingRolloverModifierTooltips",
        path: "../Examples/Charts2D/TooltipsAndHittest/UsingRolloverModifierTooltips",
        exportName: "usingRolloverModifierTooltipsExampleInfo",
    },
    {
        id: "chart2D_tooltipsAndHittest_UsingCursorModifierTooltips",
        path: "../Examples/Charts2D/TooltipsAndHittest/UsingCursorModifierTooltips",
        exportName: "usingCursorModifierTooltipsExampleInfo",
    },
    {
        id: "chart2D_tooltipsAndHittest_MetaData",
        path: "../Examples/Charts2D/TooltipsAndHittest/MetaData",
        exportName: "metaDataExampleInfo",
    },
    {
        id: "chart2D_tooltipsAndHittest_DataPointSelection",
        path: "../Examples/Charts2D/TooltipsAndHittest/DatapointSelection",
        exportName: "dataPointSelectionExampleInfo",
    },
    {
        id: "chart2D_tooltipsAndHittest_SeriesSelection",
        path: "../Examples/Charts2D/TooltipsAndHittest/SeriesSelection",
        exportName: "seriesSelectionExampleInfo",
    },
    {
        id: "chart2D_tooltipsAndHittest_VerticalSliceModifier",
        path: "../Examples/Charts2D/TooltipsAndHittest/UsingVerticalSliceModifier",
        exportName: "usingVerticalSliceModifierExampleInfo",
    },
    {
        id: "chart2D_zoomAndPanAChart_DragAxisToScale",
        path: "../Examples/Charts2D/ZoomingAndPanning/DragAxisToScale",
        exportName: "dragAxisToScaleExampleInfo",
    },
    {
        id: "chart2D_zoomAndPanAChart_RealtimeZoomPan",
        path: "../Examples/Charts2D/ZoomingAndPanning/RealtimeZoomPan",
        exportName: "realtimeZoomPanExampleInfo",
    },
    {
        id: "chart2D_zoomAndPanAChart_MultipleChartModifiers",
        path: "../Examples/Charts2D/ZoomingAndPanning/MultipleZoomPanModifiers",
        exportName: "zoomAndPanWithMultipleChartModifiersExampleInfo",
    },
    {
        id: "chart2D_zoomAndPanAChart_Overview",
        path: "../Examples/Charts2D/ZoomingAndPanning/OverviewModifier",
        exportName: "overviewExampleInfo",
    },
    {
        id: "chart2D_zoomAndPanAChart_VirtualizedDataOverview",
        path: "../Examples/Charts2D/ZoomingAndPanning/VirtualizedDataWithOverview",
        exportName: "virtualizedDataOverviewExampleInfo",
    },
    {
        id: "chart2D_filters_PercentageChange",
        path: "../Examples/Charts2D/Filters/PercentageChange",
        exportName: "percentageChangeExampleInfo",
    },
    {
        id: "chart2D_filters_TrendMARatio",
        path: "../Examples/Charts2D/Filters/TrendMARatio",
        exportName: "trendMARatioExampleInfo",
    },
    {
        id: "chart2D_filters_CustomFilters",
        path: "../Examples/Charts2D/Filters/CustomFilters",
        exportName: "customFiltersExampleInfo",
    },
    {
        id: "chart2D_multiChart_syncMultiChart",
        path: "../Examples/Charts2D/MultiChart/SyncMultiChart",
        exportName: "syncMultiChartExampleInfo",
    },
    {
        id: "chart3D_basic3DChartTypes_Bubble3DChart",
        path: "../Examples/Charts3D/Basic3DChartTypes/Bubble3DChart",
        exportName: "bubble3DChartExampleInfo",
    },
    {
        id: "chart3D_basic3DChartTypes_SurfaceMesh3DChart",
        path: "../Examples/Charts3D/Basic3DChartTypes/SurfaceMesh3DChart",
        exportName: "surfaceMesh3DChartExampleInfo",
    },
    {
        id: "chart3D_basic3DChartTypes_RealtimeSurfaceMesh3DChart",
        path: "../Examples/Charts3D/Basic3DChartTypes/RealtimeSurfaceMesh3DChart",
        exportName: "realtimeSurfaceMesh3DChartExampleInfo",
    },
    {
        id: "chart3D_basic3DChartTypes_PointLine3DChart",
        path: "../Examples/Charts3D/Basic3DChartTypes/PointLine3DChart",
        exportName: "pointLine3DChartExampleInfo",
    },
    {
        id: "chart3D_basic3DChartTypes_Column3DChart",
        path: "../Examples/Charts3D/Basic3DChartTypes/Column3DChart",
        exportName: "column3DChartExampleInfo",
    },
    {
        id: "featuredApps_performanceDemos_Load500By500",
        path: "../Examples/FeaturedApps/PerformanceDemos/Load500By500",
        exportName: "load500By500ExampleInfo",
    },
    {
        id: "featuredApps_performanceDemos_RealtimePerformanceDemo",
        path: "../Examples/FeaturedApps/PerformanceDemos/RealtimePerformanceDemo",
        exportName: "realtimePerformanceDemoExampleInfo",
    },
    {
        id: "featuredApps_medicalCharts_VitalSignsMonitorDemo",
        path: "../Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo",
        exportName: "vitalSignsMonitorDemoExampleInfo",
    },
    {
        id: "featuredApps_featureDemos_axisTypes",
        path: "../Examples/FeaturedApps/FeatureDemos/AxisTypes",
        exportName: "axisTypesExampleInfo",
    },
    {
        id: "featuredApps_featureDemos_axisLayout",
        path: "../Examples/FeaturedApps/FeatureDemos/AxisLayout",
        exportName: "axisLayoutExampleInfo",
    },
    {
        id: "featuredApps_featureDemos_chartTitle",
        path: "../Examples/FeaturedApps/FeatureDemos/ChartTitle",
        exportName: "chartTitleExampleInfo",
    },
    {
        id: "featuredApps_featureDemos_subchartsGrid",
        path: "../Examples/FeaturedApps/FeatureDemos/SubChartsAPI",
        exportName: "subchartsGridExampleInfo",
    },
    {
        id: "featuredApps_scientificCharts_Lidar3DPointCloudDemo",
        path: "../Examples/FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo",
        exportName: "lidar3DPointCloudExampleInfo",
    },
    {
        id: "featuredApps_scientificCharts_AudioAnalyzerDemo",
        path: "../Examples/FeaturedApps/ScientificCharts/AudioAnalyzer",
        exportName: "audioAnalyzerExampleInfo",
    },
    {
        id: "featuredApps_scientificCharts_WaterfallChartDemo",
        path: "../Examples/FeaturedApps/ScientificCharts/InteractiveWaterfallChart",
        exportName: "waterfallChartExampleInfo",
    },
    {
        id: "featuredApps_scientificCharts_TenorCurvesDemo",
        path: "../Examples/FeaturedApps/ScientificCharts/TenorCurves3D",
        exportName: "tenorCurvesExampleInfo",
    },
    {
        id: "featuredApps_showcases_realtimebigdata",
        path: "../Examples/FeaturedApps/ShowCases/WebsocketBigData",
        exportName: "websocketBigDataDemoExampleInfo",
    },
    {
        id: "featuredApps_showcases_servertrafficdashboard",
        path: "../Examples/FeaturedApps/ShowCases/ServerTrafficDashboard",
        exportName: "serverTrafficDashboardDemoExampleInfo",
    },
    {
        id: "featuredApps_showcases_oilandgasdashboard",
        path: "../Examples/FeaturedApps/ShowCases/OilAndGasDashboard",
        exportName: "oilAndGasExplorerDashboard",
    },
    {
        id: "featuredApps_showcases_richInteractions",
        path: "../Examples/FeaturedApps/ShowCases/HeatmapInteractions",
        exportName: "heatmapInteractionsExampleInfo",
    },
    {
        id: "featuredApps_showcases_dynamicLayout",
        path: "../Examples/FeaturedApps/ShowCases/DynamicLayout",
        exportName: "dynamicLayoutExampleInfo",
    },
    {
        id: "featuredApps_showcases_eventMarkers",
        path: "../Examples/FeaturedApps/ShowCases/EventMarkers",
        exportName: "eventMarkersExampleInfo",
    },
    {
        id: "featuredApps_showcases_populationPyramid",
        path: "../Examples/FeaturedApps/ShowCases/PopulationPyramid",
        exportName: "populationPyramidExampleInfo",
    },
    {
        id: "builderApi_simplechart",
        path: "../Examples/BuilderApi/SimpleChart",
        exportName: "simpleChartExampleInfo",
    },
    {
        id: "builderApi_fullchart",
        path: "../Examples/BuilderApi/FullChart",
        exportName: "fullChartExampleInfo",
    },
    {
        id: "builderApi_chartFromJSON",
        path: "../Examples/BuilderApi/ChartFromJSON",
        exportName: "chartFromJSONExampleInfo",
    },
    {
        id: "builderApi_SharedData",
        path: "../Examples/BuilderApi/SharedData",
        exportName: "sharedDataExampleInfo",
    },
    {
        id: "builderApi_CustomTypes",
        path: "../Examples/BuilderApi/CustomTypes",
        exportName: "customTypesExampleInfo",
    },
];

/*
function makeExamplesPages(record: Record<string, any>): Record<string, TExamplePage> {
    const res = Object.entries(record).reduce((acc: any, [key, value]) => {
        acc[key] = { id: key, ...value.info };
        return asRecord(acc);
    }, {});
    return res;
}

export const EXAMPLES_PAGES_OLD = makeExamplesPages(EXAMPLES_PAGES_DATA);
*/
// now update the exaples pages with dynamically loaded module as well
// and check the ids are the same
/// <reference types="webpack-env" />
declare var require: any;
// Create a webpack context for files ending with "exampleInfo.tsx" (or .js/.ts)
const examplesContext = require.context("../Examples", true, /exampleInfo(\.js|\.ts|\.tsx)?$/);

// Convert a module path to the key expected by the context.
const loadModule = (modulePath: string) => {
    const relativePath = "./" + modulePath.replace(/^(\.\.\/)+Examples\//, "");
    return examplesContext(relativePath);
};

function makeExamplesPagesNew(examples: any[]) {
    // const res = Object.keys(examples).reduce((acc: any,k: string) => {
    const res = examples.reduce((acc: any, example: any) => {
        const { path, exportName } = example;
        const mod = loadModule(path + "/exampleInfo.tsx");
        const moduleExport = mod[exportName];
        moduleExport.exampleDirectory = path;
        const id = moduleExport.id;
        acc[id] = moduleExport;
        return acc;
    }, {});
    return res;
}

export const EXAMPLES_PAGES: Record<string, TExamplePage> = makeExamplesPagesNew(EXAMPLES_PAGES_DATA_NEW);

/*
function compare(o: Record<string, any>, n: Record<string, any>) {
    let different = false;
    Object.keys(o).forEach((k) => {
        const or = o[k];
        const nr = n[k];
        const orId = or?.id;
        const nrId = nr?.id;
        if (orId !== nrId) {
            console.log("different old=", orId, " new=", nrId);
            different = true;
        }
    });
    console.log(different ? "DIFFERENT" : "THE SAME");
}
*/

/*
function buildExamplesPages(paths: Record<string, { path: string; exportName: string }>): Record<string, TExamplePage> {
    return Object.keys(paths).reduce((acc, key) => {
        const { path, exportName } = paths[key];
        const mod = loadModule(path);
        const moduleExport = mod[exportName];
        if (!moduleExport.filepath) {
            moduleExport.filepath = path;
        }
        const rkey = moduleExport.id;
        acc[rkey] = moduleExport;
        return acc;
    }, {} as Record<string, TExamplePage>);
}
*/
// updateExamplesPages(EXAMPLES_PAGES_DATA);
// compare(EXAMPLES_PAGES_OLD,EXAMPLES_PAGES);
console.log(">>>>>>>>>>> loaded all modules dynamically  for real");
