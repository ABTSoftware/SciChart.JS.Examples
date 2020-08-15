import { PAGES } from "../AppRouter/pages";
import { EXAMPLES_PAGES } from "../AppRouter/examples";

export type TSearchItem = {
    title: string;
    link: string;
};

export const searchItems: TSearchItem[] = [
    { title: PAGES.homapage.title, link: "/" },
    { title: EXAMPLES_PAGES.chart2D_basicCharts_LineChart.title, link: EXAMPLES_PAGES.chart2D_basicCharts_LineChart.path },
    { title: EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart.title, link: EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart.path },
    { title: EXAMPLES_PAGES.chart3D_Basic3DChartTypes_Scatter.title, link: EXAMPLES_PAGES.chart3D_Basic3DChartTypes_Scatter.path }
];
