import { createMainChart } from "./main-chart-config";
import { createPageStatisticsChart } from "./page-statistics-chart-config";
import { createRegionStatisticsColumnChart, createRegionStatisticsPieChart } from "./region-statistic-charts";
import { createServerLoadChart } from "./server-load-chart-config";

export type TMainChartConfigFuncResult = Awaited<ReturnType<typeof createMainChart>>;
export type TPageStatsConfigFuncResult = Awaited<ReturnType<typeof createPageStatisticsChart>>;
export type TServerStatsChartConfigFuncResult = Awaited<ReturnType<typeof createServerLoadChart>>;
export type TRegionStatsColumnChartConfigFuncResult = Awaited<ReturnType<typeof createRegionStatisticsColumnChart>>;
export type TRegionStatsPieChartConfigFuncResult = Awaited<ReturnType<typeof createRegionStatisticsPieChart>>;

export type TInitResults = [
    TMainChartConfigFuncResult,
    TPageStatsConfigFuncResult,
    TServerStatsChartConfigFuncResult,
    TRegionStatsColumnChartConfigFuncResult,
    TRegionStatsPieChartConfigFuncResult
];
