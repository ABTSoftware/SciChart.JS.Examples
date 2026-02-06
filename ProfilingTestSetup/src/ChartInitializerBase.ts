import { ESeriesType, SciChartSurface } from "scichart";
import { TChartInitializerOptions } from "./types";

export abstract class ChartInitializerBase {
    protected options: TChartInitializerOptions;
    protected surfaces: SciChartSurface[] = [];
}
