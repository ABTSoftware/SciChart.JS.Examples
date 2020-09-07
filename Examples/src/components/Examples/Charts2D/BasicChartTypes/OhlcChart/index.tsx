import * as React from "react";
import { SciChartSurface } from "scichart";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { closeValues, dateValues, highValues, lowValues, openValues } from "./data/data";
import {FastOhlcRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastOhlcRenderableSeries";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";

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
        closeValues,
    });
    // Create the Ohlc series and add to the chart
    const ohlcSeries = new FastOhlcRenderableSeries(wasmContext, {
        strokeThickness: 2,
        dataSeries,
        dataPointWidth: 0.5,
    });
    sciChartSurface.renderableSeries.add(ohlcSeries);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    sciChartSurface.zoomExtents();
    return { dataSeries, sciChartSurface };
};

// REACT COMPONENT
export default function OhlcChart() {
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
