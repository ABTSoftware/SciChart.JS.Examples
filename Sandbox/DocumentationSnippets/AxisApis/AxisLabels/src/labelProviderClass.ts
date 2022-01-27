import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { AxisCore } from "scichart/Charting/Visuals/Axis/AxisCore";
import { ELabelProviderType } from "scichart/types/LabelProviderType";
import { LabelProviderBase2D } from "scichart/Charting/Visuals/Axis/LabelProvider/LabelProviderBase2D";
/**
 * A CustomLabelProvider to format Axis Labels and Cursor / Tooltips for NumericAxis types
 */
export class CustomLabelProvider extends LabelProviderBase2D {
    constructor() {
        super();
    }
    public readonly type: ELabelProviderType.Numeric;
    /**
     * Called when the LabelProvider is attached to an Axis
     */
    public attachedToAxis(axis: AxisCore) {
        super.attachedToAxis(axis);
    }
    /**
     * Called once when an axis drawing pass begins. Use this method to do one-time setup
     */
    public onBeginAxisDraw(): void {
        // TODO: one-time setup at the beginning of a draw pass
    }
}
// Apply a label provider to an axis
export async function labelProviderClassExampleTs(divId: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);
    // Create an XAxis
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    // Create a YAxis
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.yAxes.add(yAxis);
    xAxis.labelProvider = new CustomLabelProvider();
    xAxis.labelProvider.formatCursorLabel = value => value.toFixed(4);
    xAxis.labelProvider.formatLabel = value => value.toFixed(4);
}