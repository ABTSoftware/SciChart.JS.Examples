export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { closeValues, dateValues, highValues, lowValues, openValues } from "./data/data";
import { FastOhlcRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastOhlcRenderableSeries";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { EStrokePaletteMode, IStrokePaletteProvider } from "scichart/Charting/Model/IPaletteProvider";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import Box from "../../../../shared/Helpers/Box/Box";
import { Button, ButtonGroup } from "@material-ui/core";
import { uintArgbColorMultiplyOpacity } from "scichart/utils/colorUtil";
import { SweepAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/SweepAnimation";

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

    // Add a YAxis and set text formatting
    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(1.1, 1.2);
    yAxis.growBy = new NumberRange(0.1, 0.1);
    yAxis.labelProvider.formatLabel = (dataValue: number) => dataValue.toFixed(3);
    sciChartSurface.yAxes.add(yAxis);

    // Create an OhlcDataSeries. This accepts xValues as unix timestamps, and open, high, low, close values
    const dataSeries = new OhlcDataSeries(wasmContext, {
        xValues: dateValues,
        openValues,
        highValues,
        lowValues,
        closeValues
    });
    // Create the Ohlc series and add to the chart
    const ohlcSeries = new FastOhlcRenderableSeries(wasmContext, {
        strokeThickness: 1,
        dataSeries,
        dataPointWidth: 0.7,
        strokeUp: "#50ff50",
        strokeDown: "#ff5050",
        paletteProvider: new OhlcPaletteProvider(),
        animation: new SweepAnimation({ duration: 5000, fadeEffect: true })
    });
    sciChartSurface.renderableSeries.add(ohlcSeries);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext, dataSeries };
};

/**
 * An example PaletteProvider which implements IStrokePaletteProvider
 * This can be attached to line, mountain, column or candlestick series to change the stroke or fill
 * of the series conditionally
 */
class OhlcPaletteProvider implements IStrokePaletteProvider {
    /**
     * This property chooses how stroke colors are blended when they change
     */
    readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
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
     * Called by SciChart and may be used to override the color of a line segment or
     * stroke outline in various chart types.
     * @remarks WARNING: CALLED PER-VERTEX, MAY RESULT IN PERFORMANCE DEGREDATION IF COMPLEX CODE EXECUTED HERE
     * @returns an ARGB color code, e.g. 0xFFFF0000 would be red, or 'undefined' for default colouring
     */
    overrideStrokeArgb(xValue: number, yValue: number, index: number, opacity: number): number {
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

    private getDataSeries(): OhlcDataSeries {
        if (this.dataSeries) {
            return this.dataSeries;
        }

        this.dataSeries = this.parentSeries.dataSeries as OhlcDataSeries;
        return this.dataSeries;
    }
}

// REACT COMPONENT
export default function OhlcChart() {
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
            <Box mt={20}>
                <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                    <Button onClick={handleAddPoints}>Add 10 Points</Button>
                </ButtonGroup>
                <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                    <Button onClick={handleRemovePoints} style={{ marginLeft: 10 }}>
                        Remove 10 Points
                    </Button>
                </ButtonGroup>
            </Box>
        </div>
    );
}
`;