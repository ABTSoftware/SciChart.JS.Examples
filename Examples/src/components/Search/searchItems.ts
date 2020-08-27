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
        title: EXAMPLES_PAGES.chart2D_basicCharts_CandlestickChart.title,
        link: EXAMPLES_PAGES.chart2D_basicCharts_CandlestickChart.path,
    },
    {
        title: EXAMPLES_PAGES.chart2D_basicCharts_ColumnChart.title,
        link: EXAMPLES_PAGES.chart2D_basicCharts_ColumnChart.path,
    },
    {
        title: EXAMPLES_PAGES.chart2D_basicCharts_HeatmapChart.title,
        link: EXAMPLES_PAGES.chart2D_basicCharts_HeatmapChart.path,
    },
    {
        title: EXAMPLES_PAGES.chart2D_basicCharts_LineChart.title,
        link: EXAMPLES_PAGES.chart2D_basicCharts_LineChart.path,
    },
    {
        title: EXAMPLES_PAGES.chart2D_basicCharts_MountainChart.title,
        link: EXAMPLES_PAGES.chart2D_basicCharts_MountainChart.path,
    },
    {
        title: EXAMPLES_PAGES.chart2D_basicCharts_ScatterChart.title,
        link: EXAMPLES_PAGES.chart2D_basicCharts_ScatterChart.path,
    },
    {
        title: EXAMPLES_PAGES.chart2D_chartAnnotations_AnnotationsAreEasy.title,
        link: EXAMPLES_PAGES.chart2D_chartAnnotations_AnnotationsAreEasy.path,
    },
    {
        title: EXAMPLES_PAGES.chart2D_createRealtimeCharts_RealtimeGhostedTraces.title,
        link: EXAMPLES_PAGES.chart2D_createRealtimeCharts_RealtimeGhostedTraces.path,
    },
    {
        title: EXAMPLES_PAGES.chart2D_createStockCharts_RealtimeTickingStockCharts.title,
        link: EXAMPLES_PAGES.chart2D_createStockCharts_RealtimeTickingStockCharts.path,
    },
    {
        title: EXAMPLES_PAGES.chart3D_Basic3DChartTypes_Bubble3DChart.title,
        link: EXAMPLES_PAGES.chart3D_Basic3DChartTypes_Bubble3DChart.path,
    },
];
