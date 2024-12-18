export const mockFiles = [
    {
        name: "drawExample-for-testing.ts",
        content: `import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { EAutoRange } from "scichart/types/AutoRange";

export async function drawExample(divId: string) {  
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { 
        axisAlignment: EAxisAlignment.Bottom 
    }));

    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { 
        axisAlignment: EAxisAlignment.Left, 
        autoRange: EAutoRange.Always 
    }));

    sciChartSurface.renderableSeries.add(new LineSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: "Line Series",
            xValues: [1, 2, 3, 4, 5],
            yValues: [1, 2, 3, 4, 5]
        })
    }))

    sciChartSurface.zoomExtents();
}`,
    },
    {
        name: "index.tsx",
        content: `import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";`,
    },
    {
        name: "example.html",
        content: `<div id="scichart-root" style="width: 100%; height: 100%"></div>`,
    }
];
