import { SciChartSurface, NumericAxis } from "scichart";
import { PitchforkAnnotation, PitchfanAnnotation } from "scichart-financial-tools";

export async function ex2PitchforkAnnotation() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const simplePitchfork = new PitchforkAnnotation({
        isEditable: true,
        points: [
            { x: 2, y: 2 },
            { x: 1, y: 5 },
            { x: 3, y: 5 },
        ],
    });

    const pitchfan = new PitchfanAnnotation({
        isEditable: true,
        stroke: "#aA8C15",
        strokeThickness: 2,
        showShoulderLine: true,
        // showFullWidthZone: true,
        fullWidthZoneFill: "#AA8C1526",
        fullWidthZoneStroke: "#aA8C15",
        // showHalfWidthZone: true,
        halfWidthZoneFill: "#A55E0B33",
        halfWidthZoneStroke: "#A55E0B",
        points: [
            { x: 7, y: 2 },
            { x: 6.5, y: 5 },
            { x: 7.5, y: 5 },
        ],
    });

    sciChartSurface.annotations.add(simplePitchfork, pitchfan);
    sciChartSurface.zoomExtents();
}
