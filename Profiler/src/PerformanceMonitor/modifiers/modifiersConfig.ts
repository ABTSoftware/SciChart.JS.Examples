import {
    ZoomPanModifier,
    EXyDirection,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    EExecuteOn,
    SeriesSelectionModifier,
    SelectionChangedArgs,
    AxisBase2D,
    SciChartSurface,
    XAxisDragModifier,
    YAxisDragModifier,
    DataPointSelectionModifier,
    DataPointSelectionChangedArgs
} from "scichart";
import { CustomRubberBandModifier } from "./CustomRubberBandModifier";
import { addRollover } from "./rolloverConfig";
import { LineSegmentTooltipModifier } from "./LineSegmentTooltip";
import { DpiHelper } from "scichart";
import { EDragMode } from "scichart";
import { AnnotationHoverModifier } from "scichart";

export function addModifiers(sciChartSurface: SciChartSurface, xAxis: AxisBase2D, yAxis: AxisBase2D) {
    addRollover(sciChartSurface, xAxis, yAxis);

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ xyDirection: EXyDirection.XDirection, includedXAxisIds: [xAxis.id] }),
        new XAxisDragModifier(), // TODO this one doesn't seem to work properly
        new YAxisDragModifier({ dragMode: EDragMode.Panning }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
        new MouseWheelZoomModifier({
            xyDirection: EXyDirection.XDirection,
            includedXAxisIds: [xAxis.id],
            growFactor: 0.005
        }),
        // TODO preventDefault
        new CustomRubberBandModifier({
            xyDirection: EXyDirection.XDirection,
            executeCondition: { button: EExecuteOn.MouseRightButton }
        }),
        // new DataPointSelectionModifier({
        //     allowDragSelect: false,
        //     allowClickSelect: true,
        //     onSelectionChanged: (args: DataPointSelectionChangedArgs) => {
        //         console.log("DataSelectionModifier.onSelectionChanged", args)
        //     }
        // }),
        // new SeriesSelectionModifier({
        //     enableHover: false,
        //     enableSelection: true,
        //     xAxisId: xAxis.id,
        //     yAxisId: yAxis.id,
        //     hitTestRadius: 10,
        //     // onHoverChanged
        //     onSelectionChanged: (args: SelectionChangedArgs) => {
        //         console.log("onSelectionChanged", args);
        //     }
        // })

        new LineSegmentTooltipModifier({ hitTestRadius: 15 * DpiHelper.PIXEL_RATIO }),
        new AnnotationHoverModifier({
            enableHover: true,
            notifyOutEvent: true
        })
    );
}
