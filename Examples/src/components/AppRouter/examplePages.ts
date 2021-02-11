import { bandSeriesChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/BandSeriesChart/exampleInfo";
import { digitalBandSeriesChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/DigitalBandSeriesChart/exampleInfo";
import { fanChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/FanChart/exampleInfo";
import { bubbleChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/BubbleChart/exampleInfo";
import { candlestickChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/CandlestickChart/exampleInfo";
import { ohlcChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/OhlcChart/exampleInfo";
import { columnChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/ColumnChart/exampleInfo";
import { heatmapChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/HeatmapChart/exampleInfo";
import { contourChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/ContoursChart/exampleInfo";
import { lineChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/LineChart/exampleInfo";
import { digitalLineChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/DigitalLineChart/exampleInfo";
import { mountainChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/MountainChart/exampleInfo";
import { digitalMountainChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/DigitalMountainChart/exampleInfo";
import { scatterChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/ScatterChart/exampleInfo";
import { donutChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/DonutChart/exampleInfo";
import { pieChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/PieChart/exampleInfo";
import { realTimeMountainChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/RealtimeMountainChart/exampleInfo";
import { annotationsAreEasyExampleInfo } from "../Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy/exampleInfo";
import { tradeMarkerAnnotationsExampleInfo } from "../Examples/Charts2D/ChartAnnotations/TradeMarkers/exampleInfo";
import { realtimeGhostedTracesExampleInfo } from "../Examples/FeaturedApps/PerformanceDemos/RealtimeGhostedTraces/exampleInfo";
import { multiPaneStockChartsExampleInfo } from "../Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts/exampleInfo";
import { realtimeTickingStockChartsExampleInfo } from "../Examples/Charts2D/CreateStockCharts/RealtimeTickingStockCharts/exampleInfo";
import { chartLegendsAPIExampleInfo } from "../Examples/Charts2D/Legends/ChartLegendsAPI/exampleInfo";
import { multipleXAxesExampleInfo } from "../Examples/Charts2D/ModifyAxisBehavior/MultipleXAxes/exampleInfo";
import { secondaryYAxesExampleInfo } from "../Examples/Charts2D/ModifyAxisBehavior/SecondaryYAxes/exampleInfo";
import { verticalChartsExampleInfo } from "../Examples/Charts2D/ModifyAxisBehavior/VerticalCharts/exampleInfo";
import { stackedColumnChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/StackedColumnChart/exampleInfo";
import { stackedColumnSideBySideExampleInfo } from "../Examples/Charts2D/BasicChartTypes/StackedColumnSideBySide/exampleInfo";
import { stackedMountainChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/StackedMountainChart/exampleInfo";
import { usePointMarkersExampleInfo } from "../Examples/Charts2D/StylingAndTheming/UsePointMarkers/exampleInfo";
import { usingThemeManagerExampleInfo } from "../Examples/Charts2D/StylingAndTheming/UsingThemeManager/exampleInfo";
import { createACustomThemeExampleInfo } from "../Examples/Charts2D/StylingAndTheming/CreateACustomTheme/exampleInfo";
import { stylingInCodeExampleInfo } from "../Examples/Charts2D/StylingAndTheming/StylingInCode/exampleInfo";
import { perPointColoringExampleInfo } from "../Examples/Charts2D/StylingAndTheming/PerPointColoring/exampleInfo";
import { hitTestApiExampleInfo } from "../Examples/Charts2D/TooltipsAndHittest/HitTestAPI/exampleInfo";
import { usingRolloverModifierTooltipsExampleInfo } from "../Examples/Charts2D/TooltipsAndHittest/UsingRolloverModifierTooltips/exampleInfo";
import { usingCursorModifierTooltipsExampleInfo } from "../Examples/Charts2D/TooltipsAndHittest/UsingCursorModifierTooltips/exampleInfo";
import { bubble3DChartExampleInfo } from "../Examples/Charts3D/Basic3DChartTypes/Bubble3DChart/exampleInfo";
import { surfaceMesh3DChartExampleInfo } from "../Examples/Charts3D/Basic3DChartTypes/SurfaceMesh3DChart/exampleInfo";
import { load500By500ExampleInfo } from "../Examples/FeaturedApps/PerformanceDemos/Load500By500/exampleInfo";
import { realtimePerformanceDemoExampleInfo } from "../Examples/FeaturedApps/PerformanceDemos/RealtimePerformanceDemo/exampleInfo";
import { vitalSignsMonitorDemoExampleInfo } from "../Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo/exampleInfo";
import { lidar3DPointCloudExampleInfo } from "../Examples/FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo/exampleInfo";
import { audioAnalyzerExampleInfo } from "../Examples/FeaturedApps/ScientificCharts/AudioAnalyzer/exampleInfo";
import { TPage } from "./pages";
import { tenorCurvesExampleInfo } from "../Examples/FeaturedApps/ScientificCharts/TenorCurves3D/exampleInfo";
import { loadOneMillionPointsExampleInfo } from "../Examples/FeaturedApps/PerformanceDemos/Load1MillionPoints/exampleInfo";
import { dragAxisToScaleExampleInfo } from "../Examples/Charts2D/ZoomingAndPanning/DragAxisToScale/exampleInfo";
import { realtimeZoomPanExampleInfo } from "../Examples/Charts2D/ZoomingAndPanning/RealtimeZoomPan/exampleInfo";
import { editableAnnotationsExampleInfo } from "../Examples/Charts2D/ChartAnnotations/EditableAnnotations/exampleInfo";

export type TExampleInfo = {
    title: string;
    path: string;
    subtitle: () => JSX.Element;
    description: () => JSX.Element;
    code: string;
    githubUrl: string;
    seoDescription: string;
    seoKeywords: string;
    thumbnailImage?: string;
};

export type TExamplePage = TPage & TExampleInfo;

function asRecord<T extends Record<string, TExamplePage>>(arg: T): T & Record<string, TExamplePage> {
    return arg;
}

export const EXAMPLES_PAGES = asRecord({
    chart2D_basicCharts_BandSeriesChart: {
        id: "chart2D_basicCharts_BandSeriesChart",
        ...bandSeriesChartExampleInfo
    },
    chart2D_basicCharts_DigitalBandSeriesChart: {
        id: "chart2D_basicCharts_DigitalBandSeriesChart",
        ...digitalBandSeriesChartExampleInfo
    },
    chart2D_basicCharts_FanChart: {
        id: "chart2D_basicCharts_FanChart",
        ...fanChartExampleInfo
    },
    chart2D_basicCharts_BubbleChart: {
        id: "chart2D_basicCharts_BubbleChart",
        ...bubbleChartExampleInfo
    },
    chart2D_basicCharts_CandlestickChart: {
        id: "chart2D_basicCharts_CandlestickChart",
        ...candlestickChartExampleInfo
    },
    chart2D_basicCharts_OhlcChart: {
        id: "chart2D_basicCharts_OhlcChart",
        ...ohlcChartExampleInfo
    },
    chart2D_basicCharts_ColumnChart: {
        id: "chart2D_basicCharts_ColumnChart",
        ...columnChartExampleInfo
    },
    chart2D_basicCharts_HeatmapChart: {
        id: "chart2D_basicCharts_HeatmapChart",
        ...heatmapChartExampleInfo
    },
    chart2D_basicCharts_ContourChart: {
        id: "chart2D_basicCharts_ContourChart",
        ...contourChartExampleInfo
    },
    chart2D_basicCharts_LineChart: {
        id: "chart2D_basicCharts_LineChart",
        ...lineChartExampleInfo
    },
    chart2D_basicCharts_DigitalLineChart: {
        id: "chart2D_basicCharts_DigitalLineChart",
        ...digitalLineChartExampleInfo
    },
    chart2D_basicCharts_MountainChart: {
        id: "chart2D_basicCharts_MountainChart",
        ...mountainChartExampleInfo
    },
    chart2D_basicCharts_DigitalMountainChart: {
        id: "chart2D_basicCharts_DigitalMountainChart",
        ...digitalMountainChartExampleInfo
    },
    chart2D_basicCharts_ScatterChart: {
        id: "chart2D_basicCharts_ScatterChart",
        ...scatterChartExampleInfo
    },
    chart2D_basicCharts_DonutChart: {
        id: "chart2D_basicCharts_DonutChart",
        ...donutChartExampleInfo
    },
    chart2D_basicCharts_PieChart: {
        id: "chart2D_basicCharts_PieChart",
        ...pieChartExampleInfo
    },
    chart2D_basicCharts_RealtimeMountainChart: {
        id: "chart2D_basicCharts_RealtimeMountainChart",
        ...realTimeMountainChartExampleInfo
    },
    chart2D_chartAnnotations_AnnotationsAreEasy: {
        id: "chart2D_chartAnnotations_AnnotationsAreEasy",
        ...annotationsAreEasyExampleInfo
    },
    chart2D_chartAnnotations_EditableAnntations: {
        id: "chart2D_chartAnnotations_EditableAnntations",
        ...editableAnnotationsExampleInfo
    },
    chart2D_chartAnnotations_TradeMarkers: {
        id: "chart2D_chartAnnotations_TradeMarkers",
        ...tradeMarkerAnnotationsExampleInfo
    },
    featuredApps_performanceDemos_RealtimeGhostedTraces: {
        id: "featuredApps_performanceDemos_RealtimeGhostedTraces",
        ...realtimeGhostedTracesExampleInfo
    },
    featuredApps_performanceDemos_LoadOneMillionPoints: {
        id: "featuredApps_performanceDemos_LoadOneMillionPoints",
        ...loadOneMillionPointsExampleInfo
    },
    chart2D_createStockCharts_MultiPaneStockCharts: {
        id: "chart2D_createStockCharts_MultiPaneStockCharts",
        ...multiPaneStockChartsExampleInfo
    },
    chart2D_createStockCharts_RealtimeTickingStockCharts: {
        id: "chart2D_createStockCharts_RealtimeTickingStockCharts",
        ...realtimeTickingStockChartsExampleInfo
    },
    chart2D_legends_ChartLegendsAPI: {
        id: "chart2D_legends_ChartLegendsAPI",
        ...chartLegendsAPIExampleInfo
    },
    chart2D_modifyAxisBehavior_MultipleXAxes: {
        id: "chart2D_modifyAxisBehavior_MultipleXAxes",
        ...multipleXAxesExampleInfo
    },
    chart2D_modifyAxisBehavior_SecondaryYAxes: {
        id: "chart2D_modifyAxisBehavior_SecondaryYAxes",
        ...secondaryYAxesExampleInfo
    },
    chart2D_modifyAxisBehavior_VerticalCharts: {
        id: "chart2D_modifyAxisBehavior_VerticalCharts",
        ...verticalChartsExampleInfo
    },
    chart2D_basicCharts_StackedColumnChart: {
        id: "chart2D_basicCharts_StackedColumnChart",
        ...stackedColumnChartExampleInfo
    },
    chart2D_basicCharts_StackedColumnSideBySide: {
        id: "chart2D_basicCharts_StackedColumnSideBySide",
        ...stackedColumnSideBySideExampleInfo
    },
    chart2D_basicCharts_StackedMountainChart: {
        id: "chart2D_basicCharts_StackedMountainChart",
        ...stackedMountainChartExampleInfo
    },
    chart2D_stylingAndTheming_UsePointMarkers: {
        id: "chart2D_stylingAndTheming_UsePointMarkers",
        ...usePointMarkersExampleInfo
    },
    chart2D_stylingAndTheming_UsingThemeManager: {
        id: "chart2D_stylingAndTheming_UsingThemeManager",
        ...usingThemeManagerExampleInfo
    },
    chart2D_stylingAndTheming_CustomTheme: {
        id: "chart2D_stylingAndTheming_CustomTheme",
        ...createACustomThemeExampleInfo
    },
    chart2D_stylingAndTheming_StylingInCode: {
        id: "chart2D_stylingAndTheming_StylingInCode",
        ...stylingInCodeExampleInfo
    },
    chart2D_stylingAndTheming_PerPointColoring: {
        id: "chart2D_stylingAndTheming_PerPointColoring",
        ...perPointColoringExampleInfo
    },
    chart2D_tooltipsAndHittest_HitTestApi: {
        id: "chart2D_tooltipsAndHittest_HitTestApi",
        ...hitTestApiExampleInfo
    },
    chart2D_tooltipsAndHittest_UsingRolloverModifierTooltips: {
        id: "chart2D_tooltipsAndHittest_UsingRolloverModifierTooltips",
        ...usingRolloverModifierTooltipsExampleInfo
    },
    chart2D_tooltipsAndHittest_UsingCursorModifierTooltips: {
        id: "chart2D_tooltipsAndHittest_UsingCursorModifierTooltips",
        ...usingCursorModifierTooltipsExampleInfo
    },
    chart2D_zoomAndPanAChart_DragAxisToScale: {
        id: "chart2D_zoomAndPanAChart_DragAxisToScale",
        ...dragAxisToScaleExampleInfo
    },
    chart2D_zoomAndPanAChart_RealtimeZoomPan: {
        id: "chart2D_zoomAndPanAChart_RealtimeZoomPan",
        ...realtimeZoomPanExampleInfo
    },
    chart3D_basic3DChartTypes_Bubble3DChart: {
        id: "chart3D_basic3DChartTypes_Bubble3DChart",
        ...bubble3DChartExampleInfo
    },
    chart3D_basic3DChartTypes_SurfaceMesh3DChart: {
        id: "chart3D_basic3DChartTypes_SurfaceMesh3DChart",
        ...surfaceMesh3DChartExampleInfo
    },
    featuredApps_performanceDemos_Load500By500: {
        id: "featuredApps_performanceDemos_Load500By500",
        ...load500By500ExampleInfo
    },
    featuredApps_performanceDemos_RealtimePerformanceDemo: {
        id: "featuredApps_performanceDemos_RealtimePerformanceDemo",
        ...realtimePerformanceDemoExampleInfo
    },
    featuredApps_medicalCharts_VitalSignsMonitorDemo: {
        id: "featuredApps_medicalCharts_VitalSignsMonitorDemo",
        ...vitalSignsMonitorDemoExampleInfo
    },
    featuredApps_scientificCharts_Lidar3DPointCloudDemo: {
        id: "featuredApps_scientificCharts_Lidar3DPointCloudDemo",
        ...lidar3DPointCloudExampleInfo
    },
    featuredApps_scientificCharts_AudioAnalyzerDemo: {
        id: "featuredApps_scientificCharts_AudioAnalyzerDemo",
        ...audioAnalyzerExampleInfo
    },
    featuredApps_scientificCharts_TenorCurvesDemo: {
        id: "featuredApps_scientificCharts_TenorCurvesDemo",
        ...tenorCurvesExampleInfo
    }
});
