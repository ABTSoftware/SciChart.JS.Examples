import * as React from "react";
import { SciChartSurface } from "scichart";
import { SeriesSelectionModifier } from "scichart/Charting/ChartModifiers/SeriesSelectionModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import classes from "../../../../Examples/Examples.module.scss";
import { ELabelAlignment } from "scichart/types/LabelAlignment";

const divElementId = "chart";

export const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
            id: EAxisAlignment.Left.toString(),
            axisAlignment: EAxisAlignment.Left,
            labelPrecision: 0
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
            id: EAxisAlignment.Right.toString(),
            axisAlignment: EAxisAlignment.Right,
            labelPrecision: 0,
            labelStyle: { alignment: ELabelAlignment.Right }
        })
    );
    sciChartSurface.applyTheme(new SciChartJSLightTheme());
    sciChartSurface.chartModifiers.add(new SeriesSelectionModifier({ enableHover: true, enableSelection: true }));

    const seriesCount = 80;
    const seriesPointCount = 50;

    const s = sciChartSurface.suspendUpdates();
    for (let i = 0; i < seriesCount; i++) {
        const alignment = i % 2 === 0 ? EAxisAlignment.Left : EAxisAlignment.Right;
        const { xValues, yValues } = generateData(i, alignment, seriesPointCount);
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "Series " + i }),
            strokeThickness: 2,
            stroke: "Blue",
            opacity: 0.5,
            yAxisId: alignment.toString(),
            onSelectedChanged: (sourceSeries, isSelected) => {
                sourceSeries.strokeThickness = isSelected ? 5 : 2;
                sourceSeries.stroke = isSelected ? "Purple" : "Blue";
                sourceSeries.pointMarker = isSelected
                    ? new EllipsePointMarker(wasmContext, {
                          width: 9,
                          height: 9,
                          strokeThickness: 1,
                          stroke: "White",
                          fill: "Purple"
                      })
                    : undefined;
            },
            onHoveredChanged: (sourceSeries, isHovered) => {
                sourceSeries.opacity = isHovered ? 1.0 : 0.7;
                sourceSeries.strokeThickness = isHovered ? 2 : 1;
            }
        });
        sciChartSurface.renderableSeries.add(lineSeries);
    }
    s.resume();

    return { sciChartSurface, wasmContext };
};

function generateData(index: number, alignment: EAxisAlignment, pointCount: number) {
    const gradient = alignment === EAxisAlignment.Right ? index : -index;
    const yIntercept = alignment === EAxisAlignment.Right ? 0.0 : 14000;

    const xValues: number[] = [];
    const yValues: number[] = [];

    for (let i = 0; i < pointCount; i++) {
        const x = i + 1;
        const y = gradient * x + yIntercept;
        xValues.push(x);
        yValues.push(y);
    }
    return { xValues, yValues };
}

let scs: SciChartSurface;

export default function SeriesSelection() {
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => scs?.delete();
    }, []);

    return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />
        </div>
    );
}
