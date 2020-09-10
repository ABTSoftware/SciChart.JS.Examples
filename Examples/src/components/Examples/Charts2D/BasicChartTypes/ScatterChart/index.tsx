import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {
    EStrokePaletteMode,
    IPointMarkerPaletteProvider,
    TPointMarkerArgb
} from "scichart/Charting/Model/IPaletteProvider";
import {IRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import {parseColorToUIntArgb} from "scichart/utils/parseColor";

// tslint:disable:no-empty

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));

    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            strokeThickness: 1,
            fill: "steelblue",
            stroke: "LightSteelBlue",
        }),
        paletteProvider: new ScatterPaletteProvider()
    });
    sciChartSurface.renderableSeries.add(scatterSeries);

    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 100; i++) {
        dataSeries.append(i, Math.sin(i * 0.1));
    }
    scatterSeries.dataSeries = dataSeries;

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();
};

class ScatterPaletteProvider implements IPointMarkerPaletteProvider {
    readonly strokePaletteMode: EStrokePaletteMode;
    onAttached(parentSeries: IRenderableSeries): void {
    }

    onDetached(): void {
    }

    overridePointMarkerArgb(xValue: number, yValue: number, index: number): TPointMarkerArgb {
        // Every tenth point colour the scatter points Blue fill & red stroke
        // to demonstrate the PaletteProvider feature
        if (index % 10 === 0) {
            return {
                stroke: parseColorToUIntArgb("Red"),
                fill: parseColorToUIntArgb("White")
            }
        }
        return undefined;
    }
}

export default function ScatterChart() {
    React.useEffect(() => {
        drawExample();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
