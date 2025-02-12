import { Positionable } from "../DraggablePanel/Positionable";

export enum ChartType {
  Line = "Line",
  Scatter = "Scatter",
  Mountain = "Mountain",
  Column = "Column",
}

// Interface to define a chart panel
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
