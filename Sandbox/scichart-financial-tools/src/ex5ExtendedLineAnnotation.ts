import { SciChartSurface, NumericAxis } from "scichart";
import { ExtendedLineAnnotation } from "scichart-financial-tools";

export async function ex5ExtendedLineAnnotation() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const annotation = new ExtendedLineAnnotation({
        isEditable: true,
        isSelected: true,
        points: [
            { x: 2, y: 2 },
            { x: 6, y: 6 },
        ],
    });

    sciChartSurface.annotations.add(annotation);
    sciChartSurface.zoomExtents();
}
