import { SciChartSurface, NumericAxis } from "scichart";
import { FlatBottomChannelAnnotation } from "scichart-financial-tools";

export async function ex4FlatBottomChannelAnnotation() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const annotation = new FlatBottomChannelAnnotation({
        isEditable: true,
        points: [
            { x: 1, y: 5 },
            { x: 5, y: 8 },
            { x: 5, y: 3 },
        ],
    });

    sciChartSurface.annotations.add(annotation);
    sciChartSurface.zoomExtents();
}
