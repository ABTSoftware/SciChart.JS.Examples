import { ButtonGroup } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import { SciChartSurface } from "scichart";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { BaseDataSeries } from "scichart/Charting/Model/BaseDataSeries";
import { SeriesInfo } from "scichart/Charting/Model/ChartData/SeriesInfo";
import { XySeriesInfo } from "scichart/Charting/Model/ChartData/XySeriesInfo";
import { XyFilterBase } from "scichart/Charting/Model/Filters/XyFilterBase";
import { XyScaleOffsetFilter } from "scichart/Charting/Model/Filters/XyScaleOffsetFilter";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { HitTestInfo } from "scichart/Charting/Visuals/RenderableSeries/HitTest/HitTestInfo";
import { EAutoRange } from "scichart/types/AutoRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { formatNumber } from "scichart/utils/number";
import classes from "../../../Examples.module.scss";

export const divElementId = "chart";

const getRandomData = (start: number, count: number) => {
    const data: number[] = [];
    let y = start;
    for (let i = 0; i < count; i++) {
        y = y + (Math.random() > 0.5 ? 1 : -1)
        data.push(y);
    }
    return data;
};

const y1Data = getRandomData(100, 200);

export const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const rawXAxis = new NumericAxis(wasmContext, { id: "rawX", isVisible: false });
    const aggXAxis = new NumericAxis(wasmContext, { id: "aggX" });

    sciChartSurface.xAxes.add(rawXAxis, aggXAxis);

    const rawYAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
        id: "rawY",
    });
    const aggYAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
        id: "aggY",
        axisAlignment: EAxisAlignment.Left
    });

    sciChartSurface.yAxes.add(rawYAxis, aggYAxis);

    const xValues = Array.apply(null, Array(y1Data.length)).map((x, i) => i);
    const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues: y1Data });
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        strokeThickness: 3,
        stroke: "blue",
        dataSeries,
        xAxisId: "rawX",
        yAxisId: "rawY"
    });
    
    const agg = new AggregationFilter(dataSeries);
    const colSeries = new FastColumnRenderableSeries(wasmContext, { dataSeries: agg, xAxisId: "aggX", yAxisId: "aggY" });

    sciChartSurface.renderableSeries.add(colSeries, lineSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new RolloverModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext, dataSeries };
};

class AggregationFilter extends XyFilterBase {
    private bins: Map<number, number> = new Map<number, number>();
    public binWidth: number = 1;

    constructor(originalSeries: BaseDataSeries) {
        super(originalSeries);
        this.filterAll();
    }

    protected filterAll(): void {
        this.clear();
        for (let i = 0; i < this.originalSeries.count(); i++) {
            const yVal = this.getOriginalYValues().get(i);
            const x = Math.ceil(yVal / this.binWidth);
            if (this.bins.has(x)) {
                this.bins.set(x, this.bins.get(x) + 1);
            } else {
                this.bins.set(x, 1);
            }
        };
        for (const bin of Array.from(this.bins.entries())) {
            this.append(bin[0], bin[1]);
        }
    }
    protected onClear(): void {
        this.clear();
    }

}

let scs: SciChartSurface;
let dataSeries1: XyDataSeries;

export default function CustomFilters() {

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
            dataSeries1 = res.dataSeries;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            scs?.delete();
        };
    }, []);


    const handleAddData = () => {
        const xValues = Array.apply(null, Array(100)).map((x, i) => i + dataSeries1.count());
        const lasty1 = dataSeries1.getNativeYValues().get(dataSeries1.count() - 1);
        dataSeries1.appendRange(xValues, getRandomData(lasty1, 100));
    };

    return (
        <div>
            <div id={divElementId} style={{ width: "75%", marginBottom: 20, touchAction: "none" }} />
            
            <div className={classes.ButtonsWrapper}>

                    <Button className={classes.ButtonsText} size="medium" onClick={handleAddData}>
                            Add Data
                    </Button>
                </div>
        </div>
    );
}
