import { SciChartSurface, NumericAxis, Thickness, ESnapMode } from "scichart";
import { MeasureAnnotation } from "scichart-financial-tools";

const formatMeasureNumber = (value: number, decimals: number): string => {
    if (!isFinite(value)) {
        return "0";
    }
    const safeValue = Math.abs(value) < 1e-12 ? 0 : value;
    const safeDecimals = Math.max(0, decimals);
    const formatted = safeValue.toFixed(safeDecimals);
    if (safeDecimals === 0) {
        return formatted;
    }
    return formatted.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
};

export async function ex7MeasureAnnotation() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const growingMeasure = new MeasureAnnotation({
        isEditable: true,
        strokeThickness: 2,
        growingColor: "#2563EB",
        decliningColor: "#DC2626",
        fillOpacity: 0.16,
        labelDataTemplate: ({ deltaY, percentChange, bars }) => [
            `${formatMeasureNumber(deltaY, 2)} (${formatMeasureNumber(percentChange, 2)}%)`
        ],
        labelPadding: new Thickness(4, 8, 4, 8),
        labelCornerRadius: 6,
        yValueScaleFactor: 100,
        snapMode: ESnapMode.DataPoint,
        points: [
            { x: 4, y: 5 },
            { x: 5, y: 7 },
        ],
    });

    sciChartSurface.annotations.add(growingMeasure);
    sciChartSurface.zoomExtents();
}
