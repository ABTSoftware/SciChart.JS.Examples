import { AxisBase2D, ELabelPlacement } from "scichart";
import { ECoordinateMode, HorizontalLineAnnotation, SciChartSurface } from "scichart";

export function addMeasuringAnnotation(sciChartSurface: SciChartSurface, xAxis: AxisBase2D, yAxis: AxisBase2D) {
    const horizontalAnnotation = new HorizontalLineAnnotation({
        yAxisId: yAxis.id,
        xAxisId: xAxis.id,
        stroke: "#004c4c",
        strokeThickness: 3,
        yCoordinateMode: ECoordinateMode.Relative,
        y1: 0,
        x1: 0,
        showLabel: true,
        labelPlacement: ELabelPlacement.Axis,
        labelValue: "",
        axisLabelStroke: "#FF6600",
        axisLabelFill: "#004c4c"
    });

    sciChartSurface.annotations.add(horizontalAnnotation);

    sciChartSurface.preRender.subscribe(() => {
        horizontalAnnotation.labelValue = `Visible duration ${xAxis.visibleRange.diff}ms`;
    });
}
