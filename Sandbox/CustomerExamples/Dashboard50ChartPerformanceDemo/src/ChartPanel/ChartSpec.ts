import { Positionable } from "../DraggablePanel/Positionable";

export enum ChartType {
  Line = "Line",
  Scatter = "Scatter",
  Mountain = "Mountain",
  Column = "Column",
}

// Interface to define a chart panel
export interface ChartSpec extends Positionable {
  // What chart type to draw (Line, scatter, mountain, column)
  chartType: ChartType;
  // number of points per chart (max) and data update rate per tick
  pointCount: number;
  dataUpdateRate: number;
  // chartTitle
  chartTitle: string;
  // when true, freeze (don't draw) charts out of view
  hideOutOfView: boolean;
  // Position of the draggable chart window
  position: {
    left: number | string;
    top: number;
  };
  // When true, draw axis labels
  drawLabels: boolean;
  // When true, use Native WebGL text rendering
  useNativeText: boolean;
  // When true, use axis label caching
  cacheLabels: boolean;
  // When true, reduce axis elements such as gridlines, ticks, to demonstrate performance change
  reduceAxisElements: boolean;
}
