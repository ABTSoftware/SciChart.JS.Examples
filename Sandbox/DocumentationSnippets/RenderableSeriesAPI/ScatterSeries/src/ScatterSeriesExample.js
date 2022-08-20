import { SciChartSurface } from 'scichart';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";

export const drawScatterSeries = async (divElementId) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [];
    const yValues = [];
    for( let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i*0.1) - Math.cos(i * 0.01));
    }

    const xyDataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
    });

    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: xyDataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            strokeThickness: 1,
            fill: "steelblue",
            stroke: "LightSteelBlue",
        }),
    });

    sciChartSurface.renderableSeries.add(scatterSeries);
};
