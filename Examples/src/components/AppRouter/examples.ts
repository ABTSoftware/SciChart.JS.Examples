import BandSeriesChart from "../Examples/Charts2D/BasicChartTypes/BandSeriesChart";
import FanChart from "../Examples/Charts2D/BasicChartTypes/FanChart";
import BubbleChart from "../Examples/Charts2D/BasicChartTypes/BubbleChart";
import CandlestickChart from "../Examples/Charts2D/BasicChartTypes/CandlestickChart";
import OhlcChart from "../Examples/Charts2D/BasicChartTypes/OhlcChart";
import ColumnChart from "../Examples/Charts2D/BasicChartTypes/ColumnChart";
import HeatmapChart from "../Examples/Charts2D/BasicChartTypes/HeatmapChart";
import ContourChart from "../Examples/Charts2D/BasicChartTypes/ContoursChart";
import LineChart from "../Examples/Charts2D/BasicChartTypes/LineChart";
import MountainChart from "../Examples/Charts2D/BasicChartTypes/MountainChart";
import ScatterChart from "../Examples/Charts2D/BasicChartTypes/ScatterChart";
import StackedColumnChart from "../Examples/Charts2D/BasicChartTypes/StackedColumnChart";
import StackedColumnSideBySide from "../Examples/Charts2D/BasicChartTypes/StackedColumnSideBySide";
import StackedMountainChart from "../Examples/Charts2D/BasicChartTypes/StackedMountainChart";
import DonutChart from "../Examples/Charts2D/BasicChartTypes/DonutChart";
import PieChart from "../Examples/Charts2D/BasicChartTypes/PieChart";

import AnnotationsAreEasy from "../Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy";
import TradeMarkers from "../Examples/Charts2D/ChartAnnotations/TradeMarkers";

import RealtimeGhostedTraces from "../Examples/FeaturedApps/PerformanceDemos/RealtimeGhostedTraces";

import MultiPaneStockCharts from "../Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts";
import RealtimeTickingStockCharts from "../Examples/Charts2D/CreateStockCharts/RealtimeTickingStockCharts";

import ChartLegendsAPI from "../Examples/Charts2D/Legends/ChartLegendsAPI";

import MultipleXAxes from "../Examples/Charts2D/ModifyAxisBehavior/MultipleXAxes";
import SecondaryYAxes from "../Examples/Charts2D/ModifyAxisBehavior/SecondaryYAxes";
import VerticalCharts from "../Examples/Charts2D/ModifyAxisBehavior/VerticalCharts";

import UsePointMarkers from "../Examples/Charts2D/StylingAndTheming/UsePointMarkers";
import UsingThemeManager from "../Examples/Charts2D/StylingAndTheming/UsingThemeManager";
import CustomTheme from "../Examples/Charts2D/StylingAndTheming/CreateACustomTheme/";
import StylingInCode from "../Examples/Charts2D/StylingAndTheming/StylingInCode";
import PerPointColoring from "../Examples/Charts2D/StylingAndTheming/PerPointColoring";

import HitTestAPI from "../Examples/Charts2D/TooltipsAndHittest/HitTestAPI";
import UsingRolloverModifierTooltips from "../Examples/Charts2D/TooltipsAndHittest/UsingRolloverModifierTooltips";
import UsingCursorModifierTooltips from "../Examples/Charts2D/TooltipsAndHittest/UsingCursorModifierTooltips";
import Bubble3DChart from "../Examples/Charts3D/Basic3DChartTypes/Bubble3DChart";

import Load500By500 from "../Examples/FeaturedApps/PerformanceDemos/Load500By500";
import RealtimePerformanceDemo from "../Examples/FeaturedApps/PerformanceDemos/RealtimePerformanceDemo";

import VitalSignsMonitorDemo from "../Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo";
import SurfaceMesh3DChart from "../Examples/Charts3D/Basic3DChartTypes/SurfaceMesh3DChart";

import LiDAR3DPointCloudDemo from "../Examples/FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo";

import { EXAMPLES_PAGES, TExamplePage } from "./examplePages";
import AudioAnalyzer from "../Examples/FeaturedApps/ScientificCharts/AudioAnalyzer";
import TenorCurves3DChart from "../Examples/FeaturedApps/ScientificCharts/TenorCurves3D";
import Load1MillionPointsChart from "../Examples/FeaturedApps/PerformanceDemos/Load1MillionPoints";
import DragAxisToScale from "../Examples/Charts2D/ZoomingAndPanning/DragAxisToScale";
import RealtimeZoomPan from "../Examples/Charts2D/ZoomingAndPanning/RealtimeZoomPan";

export type TMenuItem = {
    item: {
        id: string;
        name: string;
    };
    submenu: TExamplePage[];
};

export const MENU_ITEMS_2D_ID = "MENU_ITEMS_2D_ID";
export const MENU_ITEMS_2D: TMenuItem[] = [
    {
        item: { id: "chart2D_basicCharts", name: "JavaScript Chart Types" },
        submenu: [
            EXAMPLES_PAGES.chart2D_basicCharts_LineChart,
            EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart,
            EXAMPLES_PAGES.chart2D_basicCharts_BubbleChart,
            EXAMPLES_PAGES.chart2D_basicCharts_CandlestickChart,
            EXAMPLES_PAGES.chart2D_basicCharts_ColumnChart,
            EXAMPLES_PAGES.chart2D_basicCharts_FanChart,
            EXAMPLES_PAGES.chart2D_basicCharts_HeatmapChart,
            EXAMPLES_PAGES.chart2D_basicCharts_ContourChart,
            EXAMPLES_PAGES.chart2D_basicCharts_MountainChart,
            EXAMPLES_PAGES.chart2D_basicCharts_OhlcChart,
            EXAMPLES_PAGES.chart2D_basicCharts_ScatterChart,
            EXAMPLES_PAGES.chart2D_basicCharts_StackedColumnChart,
            EXAMPLES_PAGES.chart2D_basicCharts_StackedColumnSideBySide,
            EXAMPLES_PAGES.chart2D_basicCharts_StackedMountainChart,
            EXAMPLES_PAGES.chart2D_basicCharts_PieChart,
            EXAMPLES_PAGES.chart2D_basicCharts_DonutChart
        ]
    },
    {
        item: { id: "chart2D_chartAnnotations", name: "Chart Annotations" },
        submenu: [
            EXAMPLES_PAGES.chart2D_chartAnnotations_AnnotationsAreEasy,
            EXAMPLES_PAGES.chart2D_chartAnnotations_TradeMarkers
        ]
    },
    {
        item: { id: "chart2D_createStockCharts", name: "Create Stock Charts" },
        submenu: [
            EXAMPLES_PAGES.chart2D_createStockCharts_MultiPaneStockCharts,
            EXAMPLES_PAGES.chart2D_createStockCharts_RealtimeTickingStockCharts
        ]
    },
    {
        item: { id: "chart2D_legends", name: "Chart Legends" },
        submenu: [EXAMPLES_PAGES.chart2D_legends_ChartLegendsAPI]
    },
    {
        item: { id: "chart2D_modifyAxisBehavior", name: "Chart Axis APIs" },
        submenu: [
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_MultipleXAxes,
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_SecondaryYAxes,
            EXAMPLES_PAGES.chart2D_modifyAxisBehavior_VerticalCharts,
        ]
    },
    {
        item: { id: "chart2D_stylingAndTheming", name: "Styling and Theming" },
        submenu: [
            EXAMPLES_PAGES.chart2D_stylingAndTheming_UsingThemeManager,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_CustomTheme,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_StylingInCode,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_PerPointColoring,
            EXAMPLES_PAGES.chart2D_stylingAndTheming_UsePointMarkers
        ]
    },
    {
        item: { id: "chart2D_tooltipsAndHittest", name: "Tooltips and Hit-Test" },
        submenu: [
            EXAMPLES_PAGES.chart2D_tooltipsAndHittest_HitTestApi,
            EXAMPLES_PAGES.chart2D_tooltipsAndHittest_UsingRolloverModifierTooltips,
            EXAMPLES_PAGES.chart2D_tooltipsAndHittest_UsingCursorModifierTooltips
        ]
    },
    {
        item: { id: "chart2D_zoomingAndPanning", name: "Zoom and Pan a Chart" },
        submenu: [
            EXAMPLES_PAGES.chart2D_zoomAndPanAChart_DragAxisToScale,
            EXAMPLES_PAGES.chart2D_zoomAndPanAChart_RealtimeZoomPan,
        ]
    }
];

export const MENU_ITEMS_3D_ID = "MENU_ITEMS_3D_ID";
export const MENU_ITEMS_3D: TMenuItem[] = [
    {
        item: { id: "chart3D_Basic3DChartTypes", name: "JavaScript 3D Chart Types" },
        submenu: [
            EXAMPLES_PAGES.chart3D_basic3DChartTypes_Bubble3DChart,
            EXAMPLES_PAGES.chart3D_basic3DChartTypes_SurfaceMesh3DChart
        ]
    }
];

export const MENU_ITEMS_FEATURED_APPS_ID = "MENU_ITEMS_FEATURED_APPS_ID";
export const MENU_ITEMS_FEATURED_APPS: TMenuItem[] = [
    {
        item: { id: "featuredApps_performanceDemos", name: "Performance Demos" },
        submenu: [
            EXAMPLES_PAGES.featuredApps_performanceDemos_Load500By500,
            EXAMPLES_PAGES.featuredApps_performanceDemos_LoadOneMillionPoints,
            EXAMPLES_PAGES.featuredApps_performanceDemos_RealtimePerformanceDemo,
            EXAMPLES_PAGES.featuredApps_performanceDemos_RealtimeGhostedTraces
        ]
    },
    {
        item: { id: "featuredApps_scientificCharts", name: "Scientific Charts" },
        submenu: [EXAMPLES_PAGES.featuredApps_scientificCharts_AudioAnalyzerDemo,
            EXAMPLES_PAGES.featuredApps_scientificCharts_Lidar3DPointCloudDemo,
            EXAMPLES_PAGES.featuredApps_scientificCharts_TenorCurvesDemo]
    },
    {
        item: { id: "featuredApps_medicalCharts", name: "Medical Charts" },
        submenu: [EXAMPLES_PAGES.featuredApps_medicalCharts_VitalSignsMonitorDemo]
    }
];

export const getParentMenuIds = (exampleId: string): string[] => {
    const getSubmenuLevelIds = (menuItemsArr: TMenuItem[], id: string): string[] => {
        const res: string[] = [];
        menuItemsArr.forEach(item => {
            item.submenu.forEach(subItem => {
                if (subItem.id === id) {
                    res.push(item.item.id);
                }
            });
        });
        return res;
    };

    const resMenuLevel: string[] = [];

    const resSubmenuLevel2D = getSubmenuLevelIds(MENU_ITEMS_2D, exampleId);
    if (resSubmenuLevel2D.length > 0) {
        resMenuLevel.push(MENU_ITEMS_2D_ID);
    }

    const resSubmenuLevel3D = getSubmenuLevelIds(MENU_ITEMS_3D, exampleId);
    if (resSubmenuLevel3D.length > 0) {
        resMenuLevel.push(MENU_ITEMS_3D_ID);
    }

    const resSubmenuLevelFeaturedApps = getSubmenuLevelIds(MENU_ITEMS_FEATURED_APPS, exampleId);
    if (resSubmenuLevelFeaturedApps.length > 0) {
        resMenuLevel.push(MENU_ITEMS_FEATURED_APPS_ID);
    }

    return [...resMenuLevel, ...resSubmenuLevel2D, ...resSubmenuLevel3D, ...resSubmenuLevelFeaturedApps];
};

export const getExampleComponent = (exampleId: string): (() => JSX.Element) => {
    switch (exampleId) {
        case EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart.id:
            return BandSeriesChart;
        case EXAMPLES_PAGES.chart2D_basicCharts_FanChart.id:
            return FanChart;
        case EXAMPLES_PAGES.chart2D_basicCharts_BubbleChart.id:
            return BubbleChart;
        case EXAMPLES_PAGES.chart2D_basicCharts_CandlestickChart.id:
            return CandlestickChart;
        case EXAMPLES_PAGES.chart2D_basicCharts_OhlcChart.id:
            return OhlcChart;
        case EXAMPLES_PAGES.chart2D_basicCharts_ColumnChart.id:
            return ColumnChart;
        case EXAMPLES_PAGES.chart2D_basicCharts_HeatmapChart.id:
            return HeatmapChart;
        case EXAMPLES_PAGES.chart2D_basicCharts_ContourChart.id:
            return ContourChart;
        case EXAMPLES_PAGES.chart2D_basicCharts_LineChart.id:
            return LineChart;
        case EXAMPLES_PAGES.chart2D_basicCharts_MountainChart.id:
            return MountainChart;
        case EXAMPLES_PAGES.chart2D_basicCharts_ScatterChart.id:
            return ScatterChart;
        case EXAMPLES_PAGES.chart2D_basicCharts_DonutChart.id:
            return DonutChart;
        case EXAMPLES_PAGES.chart2D_basicCharts_PieChart.id:
            return PieChart;
        case EXAMPLES_PAGES.chart2D_chartAnnotations_AnnotationsAreEasy.id:
            return AnnotationsAreEasy;
        case EXAMPLES_PAGES.chart2D_chartAnnotations_TradeMarkers.id:
            return TradeMarkers;
        case EXAMPLES_PAGES.featuredApps_performanceDemos_RealtimeGhostedTraces.id:
            return RealtimeGhostedTraces;
        case EXAMPLES_PAGES.chart2D_createStockCharts_MultiPaneStockCharts.id:
            return MultiPaneStockCharts;
        case EXAMPLES_PAGES.chart2D_createStockCharts_RealtimeTickingStockCharts.id:
            return RealtimeTickingStockCharts;
        case EXAMPLES_PAGES.chart2D_legends_ChartLegendsAPI.id:
            return ChartLegendsAPI;
        case EXAMPLES_PAGES.chart2D_modifyAxisBehavior_MultipleXAxes.id:
            return MultipleXAxes;
        case EXAMPLES_PAGES.chart2D_modifyAxisBehavior_SecondaryYAxes.id:
            return SecondaryYAxes;
        case EXAMPLES_PAGES.chart2D_modifyAxisBehavior_VerticalCharts.id:
            return VerticalCharts;
        case EXAMPLES_PAGES.chart2D_basicCharts_StackedColumnChart.id:
            return StackedColumnChart;
        case EXAMPLES_PAGES.chart2D_basicCharts_StackedColumnSideBySide.id:
            return StackedColumnSideBySide;
        case EXAMPLES_PAGES.chart2D_basicCharts_StackedMountainChart.id:
            return StackedMountainChart;
        case EXAMPLES_PAGES.chart2D_stylingAndTheming_UsePointMarkers.id:
            return UsePointMarkers;
        case EXAMPLES_PAGES.chart2D_stylingAndTheming_UsingThemeManager.id:
            return UsingThemeManager;
        case EXAMPLES_PAGES.chart2D_stylingAndTheming_CustomTheme.id:
            return CustomTheme;
        case EXAMPLES_PAGES.chart2D_stylingAndTheming_StylingInCode.id:
            return StylingInCode;
        case EXAMPLES_PAGES.chart2D_stylingAndTheming_PerPointColoring.id:
            return PerPointColoring;
        case EXAMPLES_PAGES.chart2D_tooltipsAndHittest_HitTestApi.id:
            return HitTestAPI;
        case EXAMPLES_PAGES.chart2D_tooltipsAndHittest_UsingRolloverModifierTooltips.id:
            return UsingRolloverModifierTooltips;
        case EXAMPLES_PAGES.chart2D_tooltipsAndHittest_UsingCursorModifierTooltips.id:
            return UsingCursorModifierTooltips;
        case EXAMPLES_PAGES.chart2D_zoomAndPanAChart_DragAxisToScale.id:
            return DragAxisToScale;
        case EXAMPLES_PAGES.chart2D_zoomAndPanAChart_RealtimeZoomPan.id:
            return RealtimeZoomPan;
        case EXAMPLES_PAGES.chart3D_basic3DChartTypes_Bubble3DChart.id:
            return Bubble3DChart;
        case EXAMPLES_PAGES.chart3D_basic3DChartTypes_SurfaceMesh3DChart.id:
            return SurfaceMesh3DChart;
        case EXAMPLES_PAGES.featuredApps_performanceDemos_Load500By500.id:
            return Load500By500;
        case EXAMPLES_PAGES.featuredApps_performanceDemos_RealtimePerformanceDemo.id:
            return RealtimePerformanceDemo;
        case EXAMPLES_PAGES.featuredApps_performanceDemos_LoadOneMillionPoints.id:
            return Load1MillionPointsChart;
        case EXAMPLES_PAGES.featuredApps_medicalCharts_VitalSignsMonitorDemo.id:
            return VitalSignsMonitorDemo;
        case EXAMPLES_PAGES.featuredApps_scientificCharts_Lidar3DPointCloudDemo.id:
            return LiDAR3DPointCloudDemo;
        case EXAMPLES_PAGES.featuredApps_scientificCharts_AudioAnalyzerDemo.id:
            return AudioAnalyzer;
        case EXAMPLES_PAGES.featuredApps_scientificCharts_TenorCurvesDemo.id:
            return TenorCurves3DChart;
        default:
            return () => undefined;
    }
};
