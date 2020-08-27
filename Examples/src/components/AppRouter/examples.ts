import { TPage } from "./pages";
import BandSeriesChart from "../Examples/Charts2D/BasicChartTypes/BandSeriesChart";
import { bandSeriesChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/BandSeriesChart/exampleInfo";
import BubbleChart from "../Examples/Charts2D/BasicChartTypes/BubbleChart";
import { bubbleChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/BubbleChart/exampleInfo";
import CandlestickChart from "../Examples/Charts2D/BasicChartTypes/CandlestickChart";
import { candlestickChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/CandlestickChart/exampleInfo";
import ColumnChart from "../Examples/Charts2D/BasicChartTypes/ColumnChart";
import { columnChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/ColumnChart/exampleInfo";
import HeatmapChart from "../Examples/Charts2D/BasicChartTypes/HeatmapChart";
import { heatmapChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/HeatmapChart/exampleInfo";
import LineChart from "../Examples/Charts2D/BasicChartTypes/LineChart";
import { lineChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/LineChart/exampleInfo";
import MountainChart from "../Examples/Charts2D/BasicChartTypes/MountainChart";
import { mountainChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/MountainChart/exampleInfo";
import ScatterChart from "../Examples/Charts2D/BasicChartTypes/ScatterChart";
import { scatterChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/ScatterChart/exampleInfo";

import AnnotationsAreEasy from "../Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy";
import { annotationsAreEasyExampleInfo } from "../Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy/exampleInfo";

import RealtimeGhostedTraces from "../Examples/Charts2D/CreateRealtimeCharts/RealtimeGhostedTraces";
import { realtimeGhostedTracesExampleInfo } from "../Examples/Charts2D/CreateRealtimeCharts/RealtimeGhostedTraces/exampleInfo";

import RealtimeTickingStockCharts from "../Examples/Charts2D/CreateStockCharts/RealtimeTickingStockCharts";
import { realtimeTickingStockChartsExampleInfo } from "../Examples/Charts2D/CreateStockCharts/RealtimeTickingStockCharts/exampleInfo";

import Bubble3DChart from "../Examples/Charts3D/Basic3DChartTypes/Bubble3DChart";
import { bubble3DChartExampleInfo } from "../Examples/Charts3D/Basic3DChartTypes/Bubble3DChart/exampleInfo";

import VitalSignsMonitorDemo from "../Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo";
import { vitalSignsMonitorDemoExampleInfo } from "../Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo/exampleInfo";

export type TExampleInfo = {
    title: string;
    path: string;
    subtitle: string;
    description: string;
    code: string;
};

export type TExamplePage = TPage & TExampleInfo & { Component: () => JSX.Element };

export type TMenuItem = {
    item: {
        id: string;
        name: string;
    };
    submenu: TExamplePage[];
};

export const EXAMPLES_PAGES: Record<string, TExamplePage> = {
    chart2D_basicCharts_BandSeriesChart: {
        id: "chart2D_basicCharts_BandSeriesChart",
        Component: BandSeriesChart,
        ...bandSeriesChartExampleInfo,
    },
    chart2D_basicCharts_BubbleChart: {
        id: "chart2D_basicCharts_BubbleChart",
        Component: BubbleChart,
        ...bubbleChartExampleInfo,
    },
    chart2D_basicCharts_CandlestickChart: {
        id: "chart2D_basicCharts_CandlestickChart",
        Component: CandlestickChart,
        ...candlestickChartExampleInfo,
    },
    chart2D_basicCharts_ColumnChart: {
        id: "chart2D_basicCharts_ColumnChart",
        Component: ColumnChart,
        ...columnChartExampleInfo,
    },
    chart2D_basicCharts_HeatmapChart: {
        id: "chart2D_basicCharts_HeatmapChart",
        Component: HeatmapChart,
        ...heatmapChartExampleInfo,
    },
    chart2D_basicCharts_LineChart: {
        id: "chart2D_basicCharts_LineChart",
        Component: LineChart,
        ...lineChartExampleInfo,
    },
    chart2D_basicCharts_MountainChart: {
        id: "chart2D_basicCharts_MountainChart",
        Component: MountainChart,
        ...mountainChartExampleInfo,
    },
    chart2D_basicCharts_ScatterChart: {
        id: "chart2D_basicCharts_ScatterChart",
        Component: ScatterChart,
        ...scatterChartExampleInfo,
    },
    chart2D_chartAnnotations_AnnotationsAreEasy: {
        id: "chart2D_chartAnnotations_AnnotationsAreEasy",
        Component: AnnotationsAreEasy,
        ...annotationsAreEasyExampleInfo,
    },
    chart2D_createRealtimeCharts_RealtimeGhostedTraces: {
        id: "chart2D_createRealtimeCharts_RealtimeGhostedTraces",
        Component: RealtimeGhostedTraces,
        ...realtimeGhostedTracesExampleInfo,
    },
    chart2D_createStockCharts_RealtimeTickingStockCharts: {
        id: "chart2D_createStockCharts_RealtimeTickingStockCharts",
        Component: RealtimeTickingStockCharts,
        ...realtimeTickingStockChartsExampleInfo,
    },
    chart3D_Basic3DChartTypes_Bubble3DChart: {
        id: "chart3D_Basic3DChartTypes_Bubble3DChart",
        Component: Bubble3DChart,
        ...bubble3DChartExampleInfo,
    },
    featuredApps_medicalCharts_VitalSignsMonitorDemo: {
        id: "featuredApps_medicalCharts_VitalSignsMonitorDemo",
        Component: VitalSignsMonitorDemo,
        ...vitalSignsMonitorDemoExampleInfo,
    },
};

export const MENU_ITEMS_2D_ID = "MENU_ITEMS_2D_ID";
export const MENU_ITEMS_2D: TMenuItem[] = [
    {
        item: { id: "chart2D_basicCharts", name: "Basic Chart Types" },
        submenu: [
            EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart,
            EXAMPLES_PAGES.chart2D_basicCharts_BubbleChart,
            EXAMPLES_PAGES.chart2D_basicCharts_CandlestickChart,
            EXAMPLES_PAGES.chart2D_basicCharts_ColumnChart,
            EXAMPLES_PAGES.chart2D_basicCharts_HeatmapChart,
            EXAMPLES_PAGES.chart2D_basicCharts_LineChart,
            EXAMPLES_PAGES.chart2D_basicCharts_MountainChart,
            EXAMPLES_PAGES.chart2D_basicCharts_ScatterChart,
        ],
    },
    {
        item: { id: "chart2D_chartAnnotations", name: "Chart Annotations" },
        submenu: [EXAMPLES_PAGES.chart2D_chartAnnotations_AnnotationsAreEasy],
    },
    {
        item: { id: "chart2D_createRealtimeCharts", name: "Create Realtime Charts" },
        submenu: [EXAMPLES_PAGES.chart2D_createRealtimeCharts_RealtimeGhostedTraces],
    },
    {
        item: { id: "chart2D_createStockCharts", name: "Create Stock Charts" },
        submenu: [EXAMPLES_PAGES.chart2D_createStockCharts_RealtimeTickingStockCharts],
    },
];

export const MENU_ITEMS_3D_ID = "MENU_ITEMS_3D_ID";
export const MENU_ITEMS_3D: TMenuItem[] = [
    {
        item: { id: "chart3D_Basic3DChartTypes", name: "Basic 3D Chart Types" },
        submenu: [EXAMPLES_PAGES.chart3D_Basic3DChartTypes_Bubble3DChart],
    },
];

export const MENU_ITEMS_FEATURED_APPS_ID = "MENU_ITEMS_FEATURED_APPS_ID";
export const MENU_ITEMS_FEATURED_APPS: TMenuItem[] = [
    {
        item: { id: "featuredApps_medicalCharts", name: "Medical Charts" },
        submenu: [EXAMPLES_PAGES.featuredApps_medicalCharts_VitalSignsMonitorDemo],
    },
];

export const getParentMenuIds = (exampleId: string): string[] => {
    const getSubmenuLevelIds = (menuItemsArr: TMenuItem[], id: string): string[] => {
        const res: string[] = [];
        menuItemsArr.forEach((item) => {
            item.submenu.forEach((subItem) => {
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
