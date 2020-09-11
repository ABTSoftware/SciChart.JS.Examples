import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { FastBubbleRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBubbleRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { XyzDataSeries } from "scichart/Charting/Model/XyzDataSeries";
import {
    EStrokePaletteMode,
    IPointMarkerPaletteProvider,
    TPointMarkerArgb,
} from "scichart/Charting/Model/IPaletteProvider";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import { YAxisDragModifier } from "scichart/Charting/ChartModifiers/YAxisDragModifier";
import { EDragMode } from "scichart/types/DragMode";
import { XAxisDragModifier } from "scichart/Charting/ChartModifiers/XAxisDragModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));

    // Line Series
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#FFFFFF",
        strokeThickness: 2,
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    // Bubble Series
    const bubbleSeries = new FastBubbleRenderableSeries(wasmContext, {
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 64,
            height: 64,
            strokeThickness: 0,
            fill: "#4682b477",
        }),
        paletteProvider: new BubblePaletteProvider(),
    });
    sciChartSurface.renderableSeries.add(bubbleSeries);

    // Populate data to both series
    const lineDataSeries = new XyDataSeries(wasmContext);
    const bubbleDataSeries = new XyzDataSeries(wasmContext);
    const POINTS = 20;
    let prevYValue = 0;
    for (let i = 0; i < POINTS; i++) {
        const curYValue = Math.sin(i) * 10 - 5;
        const size = Math.sin(i) * 60 + 3;

        lineDataSeries.append(i, prevYValue + curYValue);
        bubbleDataSeries.append(i, prevYValue + curYValue, size);

        prevYValue += curYValue;
    }

    lineSeries.dataSeries = lineDataSeries;
    bubbleSeries.dataSeries = bubbleDataSeries;

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

class BubblePaletteProvider implements IPointMarkerPaletteProvider {
    private parentSeries: IRenderableSeries;
    private dataSeries: XyzDataSeries;
    onAttached(parentSeries: IRenderableSeries): void {
        this.parentSeries = parentSeries;
        this.dataSeries = this.getDataSeries();
    }

    onDetached(): void {
        this.parentSeries = undefined;
        this.dataSeries = undefined;
    }

    readonly strokePaletteMode: EStrokePaletteMode;

    overridePointMarkerArgb(xValue: number, yValue: number, index: number): TPointMarkerArgb {
        return {
            fill: 0xffffffff,
            stroke: 0xffffffff,
        };
    }
    private getDataSeries(): XyzDataSeries {
        if (this.dataSeries) {
            return this.dataSeries;
        }
        this.dataSeries = this.parentSeries?.dataSeries as XyzDataSeries;
        return this.dataSeries;
    }
}

export default function BubbleChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
