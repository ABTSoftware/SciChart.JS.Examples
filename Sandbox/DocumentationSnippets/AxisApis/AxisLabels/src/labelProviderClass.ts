import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {AxisCore} from "scichart/Charting/Visuals/Axis/AxisCore";
import {ELabelProviderType} from "scichart/types/LabelProviderType";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {LabelProviderBase2D} from "scichart/Charting/Visuals/Axis/LabelProvider/LabelProviderBase2D";

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
    /**
     * Formats a data-value into a string for display on a cursor or tooltip
     */
    public formatCursorLabel(dataValue: number): string {
        return dataValue.toFixed(4);
    }
    /**
     * Formats a data-value into a string for display on the axis labels
     */
    public formatLabel(dataValue: number, format?: ENumericFormat): string {
        return dataValue.toFixed(4);
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
}
