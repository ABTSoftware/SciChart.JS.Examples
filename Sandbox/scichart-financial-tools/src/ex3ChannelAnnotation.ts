import { SciChartSurface, NumericAxis } from "scichart";
import { ChannelAnnotation, DisjointChannelAnnotation } from "scichart-financial-tools";

export async function ex3ChannelAnnotation() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const channelAnnotation = new ChannelAnnotation({
        isEditable: true,
        isSelected: true,
        points: [
            { x: 1, y: 5 },
            { x: 4, y: 8 },
            { x: 4, y: 5 },
        ],
    });

    const disjointChannelAnnotation = new DisjointChannelAnnotation({
        isEditable: true,
        points: [
            { x: 6, y: 5 },
            { x: 9, y: 8 },
            { x: 9, y: 5 },
        ],
    });

    sciChartSurface.annotations.add(channelAnnotation, disjointChannelAnnotation);
    sciChartSurface.zoomExtents();
}
