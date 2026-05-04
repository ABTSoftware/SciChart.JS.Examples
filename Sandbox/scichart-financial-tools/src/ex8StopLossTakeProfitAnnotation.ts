import { SciChartSurface, NumericAxis } from "scichart";
import { StopLossTakeProfitAnnotation } from "scichart-financial-tools";

export async function ex8StopLossTakeProfitAnnotation() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const takeProfitArea = new StopLossTakeProfitAnnotation({
        isEditable: true,
        strokeThickness: 2,
        strokeDashArray: [6, 3],
        takeProfitColor: "#16A34A",
        stopLossColor: "#DC2626",
        fillOpacity: 0.2,
        points: [
            { x: 2, y: 5 },
            { x: 4, y: 8 },
        ],
        isSelected: true
    });

    const stopLossArea = new StopLossTakeProfitAnnotation({
        isEditable: true,
        strokeThickness: 2,
        strokeDashArray: [6, 3],
        takeProfitColor: "#16A34A",
        stopLossColor: "#EF4444",
        fillOpacity: 0.18,
        points: [
            { x: 6, y: 5 },
            { x: 8, y: 3 },
        ],
    });

    sciChartSurface.annotations.add(takeProfitArea, stopLossArea);
    sciChartSurface.zoomExtents();
}
