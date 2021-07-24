import * as React from "react";
import { TSciChart } from "scichart/types/TSciChart";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { SquarePointMarker } from "scichart/Charting/Visuals/PointMarkers/SquarePointMarker";
import { CrossPointMarker } from "scichart/Charting/Visuals/PointMarkers/CrossPointMarker";
import { SpritePointMarker } from "scichart/Charting/Visuals/PointMarkers/SpritePointMarker";
import {TrianglePointMarker} from "scichart/Charting/Visuals/PointMarkers/TrianglePointMarker";
import { createImageAsync } from "scichart/utils/imageUtil";
import customPointImage from "./img/CustomMarkerImage.png";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";

import classes from "../../../../Examples/Examples.module.scss";

const divElementId = "chart";

function createData(wasmContext: TSciChart) {
    // Create some dataseries
    const dataSeries1 = new XyDataSeries(wasmContext, { dataSeriesName: "Ellipse Marker" });
    const dataSeries2 = new XyDataSeries(wasmContext, { dataSeriesName: "Square Marker" });
    const dataSeries3 = new XyDataSeries(wasmContext, { dataSeriesName: "Triangle Marker" });
    const dataSeries4 = new XyDataSeries(wasmContext, { dataSeriesName: "Cross Marker" });
    const dataSeries5 = new XyDataSeries(wasmContext, { dataSeriesName: "Custom Marker" });

    // Append values
    const dataSize = 30;
    for (let i = 0; i < dataSize; i++) {
        dataSeries1.append(i, Math.random());
        dataSeries2.append(i, Math.random() + 1);
        dataSeries3.append(i, Math.random() + 1.8);
        dataSeries4.append(i, Math.random() + 2.5);
        dataSeries5.append(i, Math.random() + 3.6);
    }

    // Insert a break into th eline = we do this to test double.NaN for the point marker types
    dataSeries1.update(15, NaN);
    dataSeries2.update(15, NaN);
    dataSeries3.update(15, NaN);
    dataSeries4.update(15, NaN);
    dataSeries5.update(15, NaN);

    return [dataSeries1, dataSeries2, dataSeries3, dataSeries4, dataSeries5];
}

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    const dataSeriesArr = createData(wasmContext);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));

    // Add a line series with EllipsePointMarker
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "LightSteelBlue",
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 9,
                height: 9,
                strokeThickness: 2,
                fill: "#0077FF99",
                stroke: "LightSteelBlue"
            }),
            dataSeries: dataSeriesArr[0]
        })
    );

    // Add a scatter series with SquarePointMarker
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "Red",
            pointMarker: new SquarePointMarker(wasmContext, {
                width: 9,
                height: 9,
                strokeThickness: 2,
                fill: "#FF000099",
                stroke: "Red"
            }),
            dataSeries: dataSeriesArr[1]
        })
    );

    // Add a scatter series with TrianglePointMarker
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#FF6600",
            pointMarker: new TrianglePointMarker(wasmContext, {
                width: 9,
                height: 9,
                strokeThickness: 2,
                fill: "#FFDD00",
                stroke: "#FF6600"
            }),
            dataSeries: dataSeriesArr[2]
        })
    );

    // Add a scatter series with CrossPointMarker
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#FF00FF",
            pointMarker: new CrossPointMarker(wasmContext, {
                width: 9,
                height: 9,
                strokeThickness: 2,
                stroke: "#FF00FF"
            }),
            dataSeries: dataSeriesArr[3]
        })
    );

    // Add a scatter series with Custom Image using SpritePointMarker
    const imageBitmap = await createImageAsync(customPointImage);

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#F5DEB3",
            pointMarker: new SpritePointMarker(wasmContext, {
                image: imageBitmap
            }),
            dataSeries: dataSeriesArr[4]
        })
    );

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};
export default function UsePointMarkers() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
