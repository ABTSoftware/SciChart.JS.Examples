import * as React from "react";
import customPointImage from "./img/CustomMarkerImage.png";
import classes from "../../../styles/Examples.module.scss";
import {appTheme} from "scichart-example-dependencies";

import {
    SciChartSurface,
    XyDataSeries,
    NumericAxis,
    NumberRange,
    EllipsePointMarker,
    SquarePointMarker,
    CrossPointMarker,
    SpritePointMarker,
    TrianglePointMarker,
    createImageAsync,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    SplineLineRenderableSeries,
    LegendModifier,
    ELegendOrientation,
    ELegendPlacement,
    TSciChart,
} from "scichart";

const divElementId = "chart";

function createData(wasmContext: TSciChart) {
    // Create some dataseries
    const dataSeries1 = new XyDataSeries(wasmContext, {dataSeriesName: "Ellipse Marker"});
    const dataSeries2 = new XyDataSeries(wasmContext, {dataSeriesName: "Square Marker"});
    const dataSeries3 = new XyDataSeries(wasmContext, {dataSeriesName: "Triangle Marker"});
    const dataSeries4 = new XyDataSeries(wasmContext, {dataSeriesName: "Cross Marker"});
    const dataSeries5 = new XyDataSeries(wasmContext, {dataSeriesName: "Custom Marker"});

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
    const {sciChartSurface, wasmContext} = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    const dataSeriesArr = createData(wasmContext);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {growBy: new NumberRange(0.1, 0.1)}));

    // Add a line series with EllipsePointMarker
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 13,
                height: 13,
                strokeThickness: 2,
                fill: appTheme.VividSkyBlue,
                stroke: appTheme.ForegroundColor
            }),
            dataSeries: dataSeriesArr[0]
        })
    );

    // Add a scatter series with SquarePointMarker
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            stroke: appTheme.VividPink,
            strokeThickness: 3,
            pointMarker: new SquarePointMarker(wasmContext, {
                width: 11,
                height: 11,
                strokeThickness: 2,
                fill: appTheme.MutedPink,
                stroke: appTheme.VividPink
            }),
            dataSeries: dataSeriesArr[1]
        })
    );

    // Add a scatter series with TrianglePointMarker
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            stroke: appTheme.VividOrange,
            strokeThickness: 3,
            pointMarker: new TrianglePointMarker(wasmContext, {
                width: 13,
                height: 13,
                strokeThickness: 2,
                fill: appTheme.VividOrange,
                stroke: appTheme.VividOrange,
            }),
            dataSeries: dataSeriesArr[2]
        })
    );

    // Add a scatter series with CrossPointMarker
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            stroke: appTheme.VividPurple,
            strokeThickness: 3,
            pointMarker: new CrossPointMarker(wasmContext, {
                width: 13,
                height: 13,
                strokeThickness: 3,
                stroke: appTheme.VividPurple,
            }),
            dataSeries: dataSeriesArr[3]
        })
    );

    // Add a scatter series with Custom Image using SpritePointMarker
    const imageBitmap = await createImageAsync(customPointImage);

    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            stroke: appTheme.MutedOrange,
            strokeThickness: 2,
            pointMarker: new SpritePointMarker(wasmContext, {
                image: imageBitmap
            }),
            dataSeries: dataSeriesArr[4]
        })
    );

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new LegendModifier({
        orientation: ELegendOrientation.Horizontal,
        placement: ELegendPlacement.TopLeft
    }));

    sciChartSurface.zoomExtents();

    return {sciChartSurface, wasmContext};
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
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

    return <div id={divElementId} className={classes.ChartWrapper}/>;
}
