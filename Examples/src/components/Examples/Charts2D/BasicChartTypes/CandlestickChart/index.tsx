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
        closeValues,
    });

    // Create and add the Candlestick series
    const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
        strokeThickness: 2,
        dataSeries,
        dataPointWidth: 0.5,
        brushUp: "#33ff33",
        brushDown: "#ff3333",
        strokeUp: "#77ff77",
        strokeDown: "#ff7777",
    });
    sciChartSurface.renderableSeries.add(candlestickSeries);


    sciChartSurface.zoomExtents();
    return { dataSeries, sciChartSurface };
};

// REACT COMPONENT
export default function CandlestickChart() {
    const [dataSeries, setDataSeries] = React.useState<OhlcDataSeries>();
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        drawExample().then((res) => {
            setSciChartSurface(res.sciChartSurface);
            setDataSeries(res.dataSeries);
        });
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
            <div id={divElementId} style={{ maxWidth: 900 }} />
            <div style={{ marginTop: 20 }}>
                <button onClick={handleAddPoints}>Add 10 Points</button>
                <button onClick={handleRemovePoints} style={{ marginLeft: 10 }}>
                    Remove 10 Points
                </button>
            </div>
        </div>
    );
}
