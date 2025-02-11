export enum ChartType {
  Line = "Line",
  Scatter = "Scatter",
  Mountain = "Mountain",
  Column = "Column",
}

import { Positionable } from "./Positionable";

export interface ChartSpec extends Positionable {
  chartType: ChartType;
  pointCount: number;
  dataUpdateRate: number;
  chartTitle: string;
  position: {
    left: number | string;
    top: number;
  };
}
