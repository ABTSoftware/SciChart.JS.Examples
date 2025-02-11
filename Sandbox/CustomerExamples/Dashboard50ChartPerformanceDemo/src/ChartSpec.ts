export enum ChartType {
  Line = "Line",
  Scatter = "Scatter",
  Mountain = "Mountain",
  Column = "Column",
}

export interface ChartSpec {
  chartType: ChartType;
  pointCount: number;
  dataUpdateRate: number;
}
