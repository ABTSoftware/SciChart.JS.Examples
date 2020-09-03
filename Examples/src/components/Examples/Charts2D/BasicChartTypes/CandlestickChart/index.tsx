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
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new CategoryAxis(wasmContext);
    xAxis.growBy = new NumberRange(0.05, 0.05);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(1.1, 1.2);
    yAxis.growBy = new NumberRange(0.1, 0.1);
    yAxis.labelProvider.formatLabel = (dataValue: number) => dataValue.toFixed(3);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new OhlcDataSeries(wasmContext, {
        xValues: dateValues,
        openValues,
        highValues,
        lowValues,
        closeValues,
    });
    const lineSeries = new FastCandlestickRenderableSeries(wasmContext, {
        strokeThickness: 2,
        dataSeries,
        dataPointWidth: 0.5,
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

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
