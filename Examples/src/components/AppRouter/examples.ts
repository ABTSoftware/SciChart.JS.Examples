import { TPage } from "./pages";
import { lineChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/LineChart/exampleInfo";
import LineChart from "../Examples/Charts2D/BasicChartTypes/LineChart";
import { bandSeriesChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/BandSeriesChart/exampleInfo";
import BandSeriesChart from "../Examples/Charts2D/BasicChartTypes/BandSeriesChart";
import { scatter3DChartExampleInfo } from "../Examples/Charts3D/Basic3DChartTypes/Scatter3DChart/exampleInfo";
import Scatter3DChart from "../Examples/Charts3D/Basic3DChartTypes/Scatter3DChart";

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
    chart2D_basicCharts_LineChart: {
        id: "chart2D_basicCharts_LineChart",
        Component: LineChart,
        ...lineChartExampleInfo,
    },
    chart2D_basicCharts_BandSeriesChart: {
        id: "chart2D_basicCharts_BandSeriesChart",
        Component: BandSeriesChart,
        ...bandSeriesChartExampleInfo,
    },
    chart3D_Basic3DChartTypes_Scatter: {
        id: "chart3D_Basic3DChartTypes_Scatter",
        Component: Scatter3DChart,
        ...scatter3DChartExampleInfo,
    },
};

export const DEFAULT_EXPENDED_MENU_ITEMS = {
    chart2D_basicCharts: false,
};

export const MENU_ITEMS_2D_ID = "MENU_ITEMS_2D_ID";
export const MENU_ITEMS_3D_ID = "MENU_ITEMS_3D_ID";
export const MENU_ITEMS_FEATURED_APPS_ID = "MENU_ITEMS_FEATURED_APPS_ID";

export const MENU_ITEMS_2D: TMenuItem[] = [
    {
        item: { id: "chart2D_basicCharts", name: "Basic Chart Types" },
        submenu: [EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart, EXAMPLES_PAGES.chart2D_basicCharts_LineChart],
    },
];

export const MENU_ITEMS_3D: TMenuItem[] = [
    {
        item: { id: "chart3D_Basic3DChartTypes", name: "Basic 3D Chart Types" },
        submenu: [EXAMPLES_PAGES.chart3D_Basic3DChartTypes_Scatter],
    },
];

export const MENU_ITEMS_FEATURED_APPS: TMenuItem[] = [];

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
