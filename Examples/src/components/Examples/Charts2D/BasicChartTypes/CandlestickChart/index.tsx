import * as React from "react";
import { SciChartSurface } from "scichart";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { FastCandlestickRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { closeValues, dateValues, highValues, lowValues, openValues } from "./data/data";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import {
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IStrokePaletteProvider
} from "scichart/Charting/Model/IPaletteProvider";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { Button, ButtonGroup } from "@material-ui/core";
import Box from "../../../../../helpes/shared/Helpers/Box/Box";
import { WaveAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import { uintArgbColorMultiplyOpacity } from "scichart/utils/colorUtil";

import classes from "../../../../Examples/Examples.module.scss";

const divElementId = "chart";

// SCICHART EXAMPLE
const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Add an XAxis of type CategoryAxis - which collapses gaps in stock market data
    const xAxis = new CategoryAxis(wasmContext);
    xAxis.growBy = new NumberRange(0.05, 0.05);
    sciChartSurface.xAxes.add(xAxis);

    // Create a NumericAxis on the YAxis
    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(1.1, 1.2);
    yAxis.growBy = new NumberRange(0.1, 0.1);
    yAxis.labelProvider.formatLabel = (dataValue: number) => dataValue.toFixed(3);
    sciChartSurface.yAxes.add(yAxis);

    // Create a OhlcDataSeries with open, high, low, close values
    const dataSeries = new OhlcDataSeries(wasmContext, {
        xValues: dateValues, // XValues is number[] array of unix timestamps
        openValues, // Assuming open, high, low, close values are number[] arrays
        highValues,
        lowValues,
        closeValues
    });

    // Create and add the Candlestick series
    const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
        strokeThickness: 1,
        dataSeries,
        dataPointWidth: 0.5,
        brushUp: "#50ff50B2",
        brushDown: "#ff5050B2",
        strokeUp: "#50ff50",
        strokeDown: "#ff5050",
        paletteProvider: new CandlestickPaletteProvider(),
        animation: new WaveAnimation({ zeroLine: 1.12, pointDurationFraction: 0.5, fadeEffect: true, duration: 1000 })
    });
    sciChartSurface.renderableSeries.add(candlestickSeries);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { dataSeries, sciChartSurface };
};

/**
 * An example PaletteProvider which implements IStrokePaletteProvider and IFillPaletteProvider
 * This can be attached to line, mountain, column or candlestick series to change the stroke or fill
 * of the series conditionally
 */
class CandlestickPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    /**
     * This property chooses how stroke colors are blended when they change
     */
    readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    /**
     * This property chooses how fills are blended when they change
     */
    readonly fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;
    private parentSeries: IRenderableSeries;
    private dataSeries: OhlcDataSeries;
    private readonly highlightColor: number = parseColorToUIntArgb("#FEFEFE");

    onAttached(parentSeries: IRenderableSeries): void {
        this.parentSeries = parentSeries;
        this.dataSeries = undefined;
    }
    onDetached(): void {
        this.parentSeries = undefined;
        this.dataSeries = undefined;
    }
    /**
     * Called by SciChart and may be used to override the color of filled polygon in various chart types.
     * @remarks WARNING: CALLED PER-VERTEX, MAY RESULT IN PERFORMANCE DEGREDATION IF COMPLEX CODE EXECUTED HERE
     * @returns an ARGB color code, e.g. 0xFFFF0000 would be red, or 'undefined' for default colouring
     */
    overrideFillArgb(xValue: number, yValue: number, index: number, opacity: number): number {
        const ohlcDataSeries = this.getDataSeries();
        // Get the open, close values
        const close = ohlcDataSeries.getNativeCloseValues().get(index);
        const open = ohlcDataSeries.getNativeOpenValues().get(index);

        // If more than 1% change, return 'highlightColor' otherwise return undefined for default color
        if (Math.abs(1 - open / close) > 0.01) {
            return opacity !== undefined
                ? uintArgbColorMultiplyOpacity(this.highlightColor, opacity)
                : this.highlightColor;
        }
        return undefined;
    }
    /**
     * Called by SciChart and may be used to override the color of a line segment or
     * stroke outline in various chart types.
     * @returns an ARGB color code, e.g. 0xFFFF0000 would be red, or 'undefined' for default colouring
     */
    overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return undefined;
    }

    private getDataSeries(): OhlcDataSeries {
        if (this.dataSeries) {
            return this.dataSeries;
        }

        this.dataSeries = this.parentSeries.dataSeries as OhlcDataSeries;
        return this.dataSeries;
    }
}

// REACT COMPONENT
export default function CandlestickChart() {
    const [dataSeries, setDataSeries] = React.useState<OhlcDataSeries>();
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setDataSeries(res.dataSeries);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const handleAddPoints = () => {
        const nextIndex = dataSeries.count();
        const nextDataIndex = nextIndex % 30;
        const nextTimestemp = 915408000 + nextIndex * 86400;
        const timestamps: number[] = [];
        for (let i = 0; i < 10; i++) {
            timestamps.push(nextTimestemp + i * 86400);
        }
        dataSeries.appendRange(
            timestamps,
            openValues.slice(nextDataIndex, nextDataIndex + 10),
            highValues.slice(nextDataIndex, nextDataIndex + 10),
            lowValues.slice(nextDataIndex, nextDataIndex + 10),
            closeValues.slice(nextDataIndex, nextDataIndex + 10)
        );
        sciChartSurface.zoomExtents(200);
    };

    const handleRemovePoints = () => {
        if (dataSeries.count() > 10) {
            dataSeries.removeRange(dataSeries.count() - 10, 10);
            sciChartSurface.zoomExtents(200);
        }
    };

    return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />

            <div className={classes.ButtonsWrapper}>
                <Button onClick={handleAddPoints}>Add 10 Points</Button>
                <Button onClick={handleRemovePoints}>Remove 10 Points</Button>
            </div>
        </div>
    );
}
