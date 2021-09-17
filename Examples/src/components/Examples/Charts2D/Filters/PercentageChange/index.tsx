import { ButtonGroup } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import { SciChartSurface } from "scichart";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { SeriesInfo } from "scichart/Charting/Model/ChartData/SeriesInfo";
import { XySeriesInfo } from "scichart/Charting/Model/ChartData/XySeriesInfo";
import { XyScaleOffsetFilter } from "scichart/Charting/Model/Filters/XyScaleOffsetFilter";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { HitTestInfo } from "scichart/Charting/Visuals/RenderableSeries/HitTest/HitTestInfo";
import { EAutoRange } from "scichart/types/AutoRange";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { formatNumber } from "scichart/utils/number";
import classes from "../../../Examples.module.scss";

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

const y1Data = getRandomData(100, 6, 200);
const y2Data = getRandomData(20, 1, 200);

export const drawExample = async (usePercentage: boolean) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
        labelPostfix: usePercentage ? "%" : "",
        labelPrecision: usePercentage ? 0 : 1
    });
    // Override the formatting of the cursor label as we don't want it to show the % postfix, since we're showing original data
    yAxis.labelProvider.formatCursorLabel = (value: number) => formatNumber(value, ENumericFormat.Decimal, 1);

    sciChartSurface.yAxes.add(yAxis);

    const lineSeries = new TransformedSeries(wasmContext, {
        strokeThickness: 3,
        stroke: "white"
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    const xValues = Array.apply(null, Array(y1Data.length)).map((x, i) => i);

    const dataSeries1 = new XyDataSeries(wasmContext, { xValues, yValues: y1Data });

    const transform1 = new XyScaleOffsetFilter(dataSeries1, { offset: -100 });
    xAxis.visibleRangeChanged.subscribe(args => (transform1.scale = getScaleValue(dataSeries1, args.visibleRange.min)));
    if (usePercentage) {
        lineSeries.dataSeries = transform1;
        lineSeries.originalSeries = dataSeries1;
    } else {
        lineSeries.dataSeries = dataSeries1;
    }

    const lineSeries2 = new TransformedSeries(wasmContext, {
        strokeThickness: 3,
        stroke: "green"
    });
    sciChartSurface.renderableSeries.add(lineSeries2);

    const dataSeries2 = new XyDataSeries(wasmContext, { xValues, yValues: y2Data });

    const transform2 = new XyScaleOffsetFilter(dataSeries2, { offset: -100 });
    xAxis.visibleRangeChanged.subscribe(args => (transform2.scale = getScaleValue(dataSeries2, args.visibleRange.min)));

    if (usePercentage) {
        lineSeries2.dataSeries = transform2;
        lineSeries2.originalSeries = dataSeries2;
    } else {
        lineSeries2.dataSeries = dataSeries2;
    }

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new RolloverModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext, dataSeries1, dataSeries2 };
};

const getScaleValue = (dataSeries: XyDataSeries, zeroXValue: number) => {
    const dataLength = dataSeries.count();
    let zeroIndex = -1;
    for (let i = 0; i < dataLength; i++) {
        const xValue = dataSeries.getNativeXValues().get(i);
        if (xValue >= zeroXValue) {
            zeroIndex = i;
            break;
        }
    }
    if (zeroIndex === -1) {
        return 1;
    }
    return 100 / dataSeries.getNativeYValues().get(zeroIndex);
};

class TransformedSeries extends FastLineRenderableSeries {
    public originalSeries: XyDataSeries;

    public getSeriesInfo(hitTestInfo: HitTestInfo): SeriesInfo {
        const info = new XySeriesInfo(this, hitTestInfo);
        // Use y value from original series
        if (this.originalSeries && info.dataSeriesIndex) {
            info.yValue = this.originalSeries.getNativeYValues().get(info.dataSeriesIndex);
        }
        return info;
    }
}

let scs: SciChartSurface;
let dataSeries1: XyDataSeries;
let dataSeries2: XyDataSeries;

export default function PercentageChange() {
    const [usePercentage, setUsePercentage] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            const res = await drawExample(usePercentage);
            scs = res.sciChartSurface;
            dataSeries1 = res.dataSeries1;
            dataSeries2 = res.dataSeries2;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            scs?.delete();
        };
    }, [usePercentage, y2Data]);

    const handleUsePercentage = () => {
        const newValue = !usePercentage;
        setUsePercentage(newValue);
    };

    const handleAddData = () => {
        const xValues = Array.apply(null, Array(100)).map((x, i) => i + dataSeries1.count());
        const lasty1 = dataSeries1.getNativeYValues().get(dataSeries1.count() - 1);
        dataSeries1.appendRange(xValues, getRandomData(lasty1, 4, 100));

        const lasty2 = dataSeries2.getNativeYValues().get(dataSeries2.count() - 1);
        dataSeries2.appendRange(xValues, getRandomData(lasty2, 2, 100));
    };

    return (
        <div>
            <div id={divElementId} style={{ width: "75%", marginBottom: 20, touchAction: "none" }} />
            
            <div className={classes.ButtonsWrapper}>
                <ToggleButtonGroup 
                    exclusive 
                    value={usePercentage}
                    onChange={handleUsePercentage}
                    size="medium" color="primary" aria-label="small outlined button group">
                    <ToggleButton value={true} >
                        Percentage Change
                    </ToggleButton>
                    <ToggleButton value={false} >
                        Original Data
                    </ToggleButton>
                </ToggleButtonGroup>

                    <Button className={classes.ButtonsText} size="medium" onClick={handleAddData}>
                            Add Data
                    </Button>
                </div>
        </div>
    );
}
