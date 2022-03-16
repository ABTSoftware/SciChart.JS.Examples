import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartSurface } from "scichart";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { LeftAlignedOuterVerticallyStackedAxisLayoutStrategy } from "scichart/Charting/LayoutManager/LeftAlignedOuterVerticallyStackedAxisLayoutStrategy";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { NumberRange } from "scichart/Core/NumberRange";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {ECoordinateMode} from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {LineAnnotation} from "scichart/Charting/Visuals/Annotations/LineAnnotation";

// You may need this to configure from where wasm and data files are served
// SciChart.SciChartSurface.configure({ dataUrl: "/custom/scichart2d.data" wasmUrl: "/other/scichart2d.wasm" });

function bindAnnotation(axis, annotation, offset) {
  axis.visibleRangeChanged.subscribe((args) => {
    annotation.y1 = args.visibleRange.max + offset;
    annotation.y2 = annotation.y1;
  });
  annotation.y1 = axis.visibleRange.max + offset;
  annotation.y2 = annotation.y1;
}

async function initSciChart() {
  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  const ID_X_AXIS_1 = "xAxis1";
  const ID_Y_AXIS_1 = "yAxis1";
  const ID_Y_AXIS_2 = "yAxis2";
  const ID_Y_AXIS_3 = "yAxis3";

  // create x axis
  const xAxis1 = new NumericAxis(wasmContext, { id: ID_X_AXIS_1, axisTitle: ID_X_AXIS_1, axisAlignment: EAxisAlignment.Top });
  // Create y axes
  const yAxis1 = new NumericAxis(wasmContext, { id: ID_Y_AXIS_1, axisTitle: ID_Y_AXIS_1, axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(-2, 3), maxAutoTicks: 5 });
  const yAxis2 = new NumericAxis(wasmContext, { id: ID_Y_AXIS_2, axisTitle: ID_Y_AXIS_2, axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(-2, 2), maxAutoTicks: 5 });
  const yAxis3 = new NumericAxis(wasmContext, { id: ID_Y_AXIS_3, axisTitle: ID_Y_AXIS_3, axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(-3, 2), maxAutoTicks: 5 });

  // Add all axes to surface
  sciChartSurface.xAxes.add(xAxis1);
  sciChartSurface.yAxes.add(yAxis1, yAxis2, yAxis3);

  // This will cause axes with axisAlignment equal to EAxisAlignment.Left to be stacked up vertically
  sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy = new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();

  // Now add some text annotations. We want to dock them to the top left of each axis
  const label1 = new TextAnnotation({ x: 0.0, y: 0, xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.DataValue, text: "Label 1", xAxisId: xAxis1.id, yAxisId: yAxis1.id});
  const label2 = new TextAnnotation({ x: 0.0, y: 0, xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.DataValue, text: "Label 2", xAxisId: xAxis1.id, yAxisId: yAxis2.id});
  const label3 = new TextAnnotation({ x: 0.0, y: 0, xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.DataValue, text: "Label 3", xAxisId: xAxis1.id, yAxisId: yAxis3.id});

  // Bind the Annotation.y1 to the axis.visibleRange.max
  bindAnnotation(yAxis1, label1, -0.1);
  bindAnnotation(yAxis2, label2, -0.1);
  bindAnnotation(yAxis3, label3, -0.1);

  // Now add some line annotations to separate the chart rows
  const line1 = new LineAnnotation({ x1: 0, x2: 1, xCoordinateMode: ECoordinateMode.Relative, stroke: "#555", strokeThickness: 1, xAxisId: xAxis1.id, yAxisId: yAxis2.id });
  const line2 = new LineAnnotation({ x1: 0, x2: 1, xCoordinateMode: ECoordinateMode.Relative, stroke: "#555", strokeThickness: 1, xAxisId: xAxis1.id, yAxisId: yAxis3.id });

  // Bind these too
  bindAnnotation(yAxis2, line1, 0);
  bindAnnotation(yAxis3, line2, 0);

  // Add annotations to the chart
  sciChartSurface.annotations.add(label1, label2, label3, line1, line2);

  // Add zooming panning to show the binding works
  sciChartSurface.chartModifiers.add(new ZoomPanModifier());
}

initSciChart();
