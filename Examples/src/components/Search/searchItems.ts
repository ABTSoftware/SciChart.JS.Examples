import { EXAMPLES_PAGES } from "../AppRouter/examples";

export type TSearchItem = {
    title: string;
    link: string;
};

export const searchItems: TSearchItem[] = [
    {
        title: EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart.title,
        link: EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart.path,
    },
    {
        title: EXAMPLES_PAGES.chart2D_basicCharts_BubbleChart.title,
        link: EXAMPLES_PAGES.chart2D_basicCharts_BubbleChart.path,
    },
    {
        title: EXAMPLES_PAGES.chart2D_basicCharts_LineChart.title,
        link: EXAMPLES_PAGES.chart2D_basicCharts_LineChart.path,
    },
    {
        title: EXAMPLES_PAGES.chart2D_basicCharts_CandlestickChart.title,
        link: EXAMPLES_PAGES.chart2D_basicCharts_CandlestickChart.path
    },
    {
        title: EXAMPLES_PAGES.chart3D_Basic3DChartTypes_Scatter.title,
        link: EXAMPLES_PAGES.chart3D_Basic3DChartTypes_Scatter.path,
    },
];
