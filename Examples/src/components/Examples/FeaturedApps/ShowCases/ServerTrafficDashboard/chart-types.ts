import { TResolvedReturnType } from "scichart-react";
import { createMainChart } from "./main-chart-config";
import { createPageStatisticsChart } from "./page-statistics-chart-config";
import { createRegionStatisticsColumnChart, createRegionStatisticsPieChart } from "./region-statistic-charts";
import { createServerLoadChart } from "./server-load-chart-config";

export type TMainChartConfigFuncResult = TResolvedReturnType<typeof createMainChart>;
export type TPageStatsConfigFuncResult = TResolvedReturnType<typeof createPageStatisticsChart>;
export type TServerStatsChartConfigFuncResult = TResolvedReturnType<typeof createServerLoadChart>;
export type TRegionStatsColumnChartConfigFuncResult = TResolvedReturnType<typeof createRegionStatisticsColumnChart>;
export type TRegionStatsPieChartConfigFuncResult = TResolvedReturnType<typeof createRegionStatisticsPieChart>;

export type TInitResults = [
    TMainChartConfigFuncResult,
    TPageStatsConfigFuncResult,
    TServerStatsChartConfigFuncResult,
    TRegionStatsColumnChartConfigFuncResult,
    TRegionStatsPieChartConfigFuncResult
];
