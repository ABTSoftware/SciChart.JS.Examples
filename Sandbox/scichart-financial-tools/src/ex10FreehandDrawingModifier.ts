import { SciChartSurface, NumericAxis, FreehandDrawingModifier } from "scichart";

export async function ex10FreehandDrawingModifier() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const freeMod = new FreehandDrawingModifier({ keepDrawingAfterComplete: true });
    freeMod.startDrawing({});

    sciChartSurface.chartModifiers.add(freeMod);
    sciChartSurface.zoomExtents();
}
