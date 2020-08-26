import * as React from "react";
import { SciChartSurface } from "scichart";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { FastCandlestickRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";

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

// DATA
const dateValues: number[] = [
    915408000,
    915494400,
    915580800,
    915667200,
    915753600,
    916012800,
    916099200,
    916185600,
    916272000,
    916358400,
    916617600,
    916704000,
    916790400,
    916876800,
    916963200,
    917222400,
    917308800,
    917395200,
    917481600,
    917568000,
    917827200,
    917913600,
    918000000,
    918086400,
    918172800,
    918432000,
    918518400,
    918604800,
    918691200,
    918777600,
];
const openValues: number[] = [
    1.1801,
    1.1815,
    1.1761,
    1.1623,
    1.1713,
    1.1575,
    1.1504,
    1.1561,
    1.1673,
    1.1683,
    1.1565,
    1.1605,
    1.1598,
    1.1567,
    1.1605,
    1.1579,
    1.1555,
    1.1562,
    1.1445,
    1.1407,
    1.1382,
    1.1323,
    1.1353,
    1.1309,
    1.1343,
    1.1262,
    1.1312,
    1.1314,
    1.1323,
    1.1219,
];
const highValues: number[] = [
    1.1862,
    1.1835,
    1.1773,
    1.1735,
    1.172,
    1.161,
    1.158,
    1.179,
    1.1728,
    1.1749,
    1.162,
    1.1642,
    1.1611,
    1.1619,
    1.1626,
    1.1608,
    1.1591,
    1.1565,
    1.147,
    1.1433,
    1.1397,
    1.1365,
    1.1363,
    1.1346,
    1.1373,
    1.133,
    1.1345,
    1.136,
    1.1336,
    1.1308,
];
const lowValues: number[] = [
    1.1769,
    1.175,
    1.1553,
    1.1612,
    1.1533,
    1.1487,
    1.1447,
    1.1553,
    1.1614,
    1.1552,
    1.1564,
    1.1563,
    1.1539,
    1.1545,
    1.1559,
    1.1547,
    1.155,
    1.1408,
    1.1378,
    1.1342,
    1.129,
    1.1284,
    1.13,
    1.1247,
    1.1253,
    1.122,
    1.1281,
    1.127,
    1.1214,
    1.1216,
];
const closeValues: number[] = [
    1.1815,
    1.1758,
    1.1623,
    1.1712,
    1.1585,
    1.1503,
    1.1555,
    1.1681,
    1.1681,
    1.1563,
    1.1605,
    1.1603,
    1.1566,
    1.1601,
    1.1587,
    1.1552,
    1.1562,
    1.144,
    1.1407,
    1.1367,
    1.1323,
    1.1352,
    1.1306,
    1.1344,
    1.126,
    1.1315,
    1.1315,
    1.1326,
    1.1218,
    1.1306,
];
