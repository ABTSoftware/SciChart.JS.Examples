export type TPage = {
    id: string;
    title: string;
    path: string;
};

export const PAGES: Record<string, TPage> = {
    homapage: {
        id: "homepage",
        title: "Homepage",
        path: "/"
    },
    chart2D_basicCharts_LineChart: {
        id: "chart2D_basicCharts_LineChart",
        title: "Line Chart",
        path: "/chart2D_basicCharts_LineChart"
        // path: "/chart2d/basic-charts/line-chart"
    },
    chart2D_basicCharts_BandSeriesChart: {
        id: "chart2D_basicCharts_BandSeriesChart",
        title: "Band Series Chart",
        path: "/chart2D_basicCharts_BandSeriesChart"
        // path: "/chart2d/basic-charts/band-series-chart"
    }
};
