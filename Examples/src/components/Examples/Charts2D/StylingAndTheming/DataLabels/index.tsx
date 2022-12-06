import * as React from "react";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {FastColumnRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {SciChartSurface} from "scichart";
import {NumberRange} from "scichart/Core/NumberRange";
import classes from "../../../../Examples/Examples.module.scss";
import {WaveAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import {appTheme} from "../../../theme";
import {GradientParams} from "scichart/Core/GradientParams";
import {
    EHorizontalTextPosition,
    EVerticalTextPosition
} from "scichart/types/TextPosition";
import {PaletteFactory} from "scichart/Charting/Model/PaletteFactory";
import {Thickness} from "scichart/Core/Thickness";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SweepAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/SweepAnimation";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import { XyScaleOffsetFilter } from "scichart/Charting/Model/Filters/XyScaleOffsetFilter";
import { EXyDirection } from "scichart/types/XyDirection";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const {sciChartSurface, wasmContext} = await SciChartSurface.create(divElementId, {theme: appTheme.SciChartJsTheme});

    // Add an X, Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRangeLimit: new NumberRange(0, 20)}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {growBy: new NumberRange(0.1, 0.1)}));

    // normal labels
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, ExampleDataProvider.getSpectrumData(0, 20, 10, 1, 0.01)),
        stroke: appTheme.VividOrange,
        strokeThickness: 3,
        dataLabels: {
            // To enable datalabels, set fontFamily and size
            style: { fontFamily: "Arial", fontSize: 16 },
            color: appTheme.ForegroundColor,
            // Normal label format and precision options are supported
            precision: 2,
        },
    }));

    // reduce label calculation with skipnum
    const data2 = ExampleDataProvider.getSpectrumData(10, 1000, 10, 100, 0.02);
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data2.xValues.map(x=> x/50), yValues: data2.yValues.map(y=>y*0.3 + 7) }),
        stroke: appTheme.VividGreen,
        strokeThickness: 3,
        dataLabels: {
            style: { fontFamily: "Arial", fontSize: 14 },
            color: appTheme.ForegroundColor,
            aboveBelow: false,
            verticalTextPosition: EVerticalTextPosition.Top,
            skipNumber: 100
        },
    }));

    const data3 = ExampleDataProvider.getSpectrumData(10, 1000, 30, 100, 0.04);
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data3.xValues.map(x=> x/50), yValues: data3.yValues.map(y=>y*0.3 + 15) } ),
        stroke: appTheme.VividPink,
        strokeThickness: 3,
        dataLabels: {
            style: { fontFamily: "Arial", fontSize: 14 },
            color: appTheme.ForegroundColor,
            pointGapThreshold: 1
        },
    }));

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection}));

    sciChartSurface.zoomExtents();

    return {sciChartSurface, wasmContext};
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function DataLabelsExample() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper}/>;
}
