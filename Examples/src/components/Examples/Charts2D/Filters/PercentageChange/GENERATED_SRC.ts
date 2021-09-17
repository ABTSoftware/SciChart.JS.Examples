export const code = `import * as React from "react";
import Button from "@material-ui/core/Button";
import { SciChartSurface } from "scichart";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAutoRange } from "scichart/types/AutoRange";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { getNextRandomPriceBarFactory } from "scichart/utils/randomPricesDataSource";
import { calcAverageForDoubleVector } from "scichart/utils/calcAverage";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { FastOhlcRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastOhlcRenderableSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { EXyDirection } from "scichart/types/XyDirection";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import { TSciChart } from "scichart/types/TSciChart";
import { ESeriesType } from "scichart/types/SeriesType";
import { EColor } from "scichart/types/Color";
import { FastCandlestickRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { XyMovingAverageFilter } from "scichart/Charting/Model/Filters/XyMovingAverageFilter";
import classes from "../../../../Examples/Examples.module.scss";
import { FormControl, Typography } from "@material-ui/core";
import { ToggleButton } from "@material-ui/lab";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { SeriesInfo } from "scichart/Charting/Model/ChartData/SeriesInfo";
import { XySeriesInfo } from "scichart/Charting/Model/ChartData/XySeriesInfo";
import { XyScaleOffsetFilter } from "scichart/Charting/Model/Filters/XyScaleOffsetFilter";
import { HitTestInfo } from "scichart/Charting/Visuals/RenderableSeries/HitTest/HitTestInfo";

export const divElementId = "chart";

export const drawExample = async (usePercentage: boolean) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Always });
    sciChartSurface.yAxes.add(yAxis);

    const lineSeries = new TransformedSeries(wasmContext, {
        strokeThickness: 5,
        stroke: "white"
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    const dataSeries = new XyDataSeries(wasmContext, { containsNaN: true });
    let y = 10;
    for (let i = 0; i < 100; i++) {
        y = y + (Math.random() * 2) - 1;
        dataSeries.append(i, y);
    }
    const transform1 = new XyScaleOffsetFilter(dataSeries, { offset: -100 });
    xAxis.visibleRangeChanged.subscribe(args => (transform1.scale = getScaleValue(dataSeries, args.visibleRange.min)));
    if (usePercentage) {
        lineSeries.dataSeries = transform1;
        lineSeries.originalSeries = dataSeries;
    } else {
        lineSeries.dataSeries = dataSeries;
    }

    const lineSeries2 = new TransformedSeries(wasmContext, {
        drawNaNAs: ELineDrawMode.PolyLine,
        isDigitalLine: false
    });
    lineSeries2.strokeThickness = 5;
    sciChartSurface.renderableSeries.add(lineSeries2);
    lineSeries2.stroke = "green";

    const dataSeries2 = new XyDataSeries(wasmContext, { containsNaN: true });
    let y2 = 1
    for (let i = 0; i < 200; i++) {
        y2 = y2 + (Math.random() * 2) - 1;
        dataSeries2.append(i, y2);
    }
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
    return { sciChartSurface, wasmContext };
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
        if (this.originalSeries) {
            info.yValue = this.originalSeries.getNativeYValues().get(info.dataSeriesIndex);
        }
        return info;
    }
}

let scs: SciChartSurface;

export default function PercentageChange() {
    const [wasmContext, setWasmContext] = React.useState<TSciChart>();
    const [usePercentage, setUsePercentage] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const res = await drawExample(usePercentage);
            scs = res.sciChartSurface;
            setWasmContext(res.wasmContext);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            scs?.delete();
        };
    }, []);

    const handleUsePercentage = () => {
        const newValue = !usePercentage;
        setUsePercentage(newValue);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Scale multiple series using Percentage Change
            </Typography>
             <div style={{ maxWidth: 800, marginBottom: 20 }}>
            <FormControl variant="filled" >
                <ToggleButton size="medium" selected={usePercentage} onChange={handleUsePercentage} value={usePercentage}>
                    Use Percentage
                </ToggleButton>
            </FormControl>
            </div>
            <div id={divElementId} style={{ width: "75%", marginBottom: 20, touchAction: "none" }} />
        </div>
    );
}
`;