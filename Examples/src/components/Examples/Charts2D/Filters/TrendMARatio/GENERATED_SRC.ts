export const code = `import { ButtonGroup } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import { SciChartSurface } from "scichart";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { SeriesInfo } from "scichart/Charting/Model/ChartData/SeriesInfo";
import { XySeriesInfo } from "scichart/Charting/Model/ChartData/XySeriesInfo";
import { XyMovingAverageFilter } from "scichart/Charting/Model/Filters/XyMovingAverageFilter";
import { XyLinearTrendFilter } from "scichart/Charting/Model/Filters/XyLinearTrendFilter";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { HitTestInfo } from "scichart/Charting/Visuals/RenderableSeries/HitTest/HitTestInfo";
import { EAutoRange } from "scichart/types/AutoRange";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { formatNumber } from "scichart/utils/number";
import classes from "../../../Examples.module.scss";
import { XyRatioFilter } from "scichart/Charting/Model/Filters/XyRatioFilter";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";

export const divElementId = "chart";

const getRandomData = (start: number, scale: number, count: number) => {
    const data: number[] = [];
    let y = start;
    for (let i = 0; i < count; i++) {
        y = y + Math.random() * scale - scale / 2;
        data.push(y);
    }
    return data;
};

const y1Data = getRandomData(50, 4, 200);
const y2Data = getRandomData(40, 2, 200);

export const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
        axisAlignment: EAxisAlignment.Left,
        axisTitle: "Original Data"
    });
    const yAxisRatio = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
        id: "yRatio",
        axisTitle: "Ratio"
    });

    sciChartSurface.yAxes.add(yAxis, yAxisRatio);

    const xValues = Array.apply(null, Array(y1Data.length)).map((x, i) => i);
    const dataSeries1 = new XyDataSeries(wasmContext, { xValues, yValues: y1Data, dataSeriesName: "Original" });
    const dataSeries2 = new XyDataSeries(wasmContext, { xValues, yValues: y2Data, dataSeriesName: "Divisor" });

    const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
        strokeThickness: 3,
        stroke: "#456990",
        dataSeries: dataSeries1,
    });
    const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
        strokeThickness: 3,
        stroke: "#C6E2E9",
        dataSeries: dataSeries2
    });

    const ratio = new XyRatioFilter(dataSeries1, { divisorSeries: dataSeries2, dataSeriesName: "Ratio" });
    const ratioSeries = new FastLineRenderableSeries(wasmContext, {
        strokeThickness: 3,
        stroke: "#F7B32B",
        dataSeries: ratio,
        yAxisId: "yRatio"
    });

    const maSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#A93F55",
        strokeThickness: 3,
        dataSeries: new XyMovingAverageFilter(ratio, { length: 20, dataSeriesName: "Ratio MA(20)" }),
        yAxisId: "yRatio",
    });
    const trendSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#F2BAC9",
        strokeThickness: 3,
        dataSeries: new XyLinearTrendFilter(ratio, { dataSeriesName: "Ratio Trend"}),
        yAxisId: "yRatio"
    });
    sciChartSurface.renderableSeries.add(lineSeries1, lineSeries2, ratioSeries, maSeries, trendSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new LegendModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext, dataSeries1, dataSeries2 };
};

let scs: SciChartSurface;
let dataSeries1: XyDataSeries;
let dataSeries2: XyDataSeries;

export default function TrendMARatio() {

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
            dataSeries1 = res.dataSeries1;
            dataSeries2 = res.dataSeries2;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            scs?.delete();
        };
    }, []);

    const handleAddData = () => {
        const xValues = Array.apply(null, Array(100)).map((x, i) => i + dataSeries1.count());
        // Must append to the divisor series first, 
        // otherwise the series will not be the same length when the filter calculates on append to the main series
        const lasty2 = dataSeries2.getNativeYValues().get(dataSeries2.count() - 1);
        const newy2 = getRandomData(lasty2, 4, 100);
        y2Data.push(...newy2);
        dataSeries2.appendRange(xValues, newy2);

        const lasty1 = dataSeries1.getNativeYValues().get(dataSeries1.count() - 1);
        const newy1 = getRandomData(lasty1, 2, 100);
        y1Data.push(...newy1);
        dataSeries1.appendRange(xValues, newy1);
        scs.zoomExtents();
    };

    return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />
            
            <div className={classes.ButtonsWrapper}>
                    <Button className={classes.ButtonsText} size="medium" onClick={handleAddData}>
                            Add Data
                    </Button>
                </div>
        </div>
    );
}
`;