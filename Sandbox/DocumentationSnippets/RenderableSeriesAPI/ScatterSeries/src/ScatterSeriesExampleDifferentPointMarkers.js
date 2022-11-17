import { SciChartSurface } from 'scichart';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { SquarePointMarker } from "scichart/Charting/Visuals/PointMarkers/SquarePointMarker";
import { TrianglePointMarker } from "scichart/Charting/Visuals/PointMarkers/TrianglePointMarker";
import { CrossPointMarker } from "scichart/Charting/Visuals/PointMarkers/CrossPointMarker";
import { createImageAsync } from "scichart/utils/imageUtil";
import { SpritePointMarker } from "scichart/Charting/Visuals/PointMarkers/SpritePointMarker";
import customPointImage from "./img/CustomMarkerImage.png";
import { NumberRange } from "scichart/Core/NumberRange";

export const drawScatterSeriesPointMarkers = async (divElementId) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    const dataSeriesArr = createData(wasmContext);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 5) }));

    // Add a line series with EllipsePointMarker
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 11,
                height: 11,
                strokeThickness: 2,
                fill: "#0077FF99",
                stroke: "LightSteelBlue"
            }),
            dataSeries: dataSeriesArr[0]
        })
    );

    // Add a scatter series with SquarePointMarker
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            pointMarker: new SquarePointMarker(wasmContext, {
                width: 11,
                height: 11,
                strokeThickness: 2,
                fill: "#FF000099",
                stroke: "Red"
            }),
            dataSeries: dataSeriesArr[1]
        })
    );

    // Add a scatter series with TrianglePointMarker
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            pointMarker: new TrianglePointMarker(wasmContext, {
                width: 11,
                height: 11,
                strokeThickness: 2,
                fill: "#FFDD00",
                stroke: "#FF6600"
            }),
            dataSeries: dataSeriesArr[2]
        })
    );

    // Add a scatter series with CrossPointMarker
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            pointMarker: new CrossPointMarker(wasmContext, {
                width: 11,
                height: 11,
                strokeThickness: 2,
                stroke: "#FF00FF"
            }),
            dataSeries: dataSeriesArr[3]
        })
    );

    // Add a scatter series with Custom Image using SpritePointMarker
    const imageBitmap = await createImageAsync(customPointImage);

    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            pointMarker: new SpritePointMarker(wasmContext, {
                image: imageBitmap
            }),
            dataSeries: dataSeriesArr[4]
        })
    );
};

function createData(wasmContext) {
    // Create some dataseries
    const dataSeries1 = new XyDataSeries(wasmContext, { dataSeriesName: "Ellipse Marker" });
    const dataSeries2 = new XyDataSeries(wasmContext, { dataSeriesName: "Square Marker" });
    const dataSeries3 = new XyDataSeries(wasmContext, { dataSeriesName: "Triangle Marker" });
    const dataSeries4 = new XyDataSeries(wasmContext, { dataSeriesName: "Cross Marker" });
    const dataSeries5 = new XyDataSeries(wasmContext, { dataSeriesName: "Custom Marker" });

    // Append values
    const dataSize = 30;
    for (let i = 0; i < dataSize; i++) {
        dataSeries1.append(i, Math.random() * 0.4 + 0.5);
        dataSeries2.append(i, Math.random() * 0.4 + 1.5);
        dataSeries3.append(i, Math.random() * 0.4 + 2.3);
        dataSeries4.append(i, Math.random() * 0.4 + 3.0);
        dataSeries5.append(i, Math.random() * 0.4 + 4.1);
    }

    return [dataSeries1, dataSeries2, dataSeries3, dataSeries4, dataSeries5];
}
