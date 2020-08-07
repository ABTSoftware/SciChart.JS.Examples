import { PAGES } from "../AppRouter/pages";

export type TSearchItem = {
    title: string;
    link: string;
};

export const searchItems: TSearchItem[] = [
    { title: PAGES.homapage.title, link: "/" },
    { title: PAGES.chart2D_basicCharts_LineChart.title, link: PAGES.chart2D_basicCharts_LineChart.path },
    { title: PAGES.chart2D_basicCharts_BandSeriesChart.title, link: PAGES.chart2D_basicCharts_BandSeriesChart.path }
];
