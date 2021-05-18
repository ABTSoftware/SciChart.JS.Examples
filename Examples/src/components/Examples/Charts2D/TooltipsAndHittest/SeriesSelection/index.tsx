import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { NumberRange } from "scichart/Core/NumberRange";
import { FastCandlestickRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { FastBubbleRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBubbleRenderableSeries";
import { XyzDataSeries } from "scichart/Charting/Model/XyzDataSeries";
import { HitTestInfo } from "scichart/Charting/Visuals/RenderableSeries/HitTest/HitTestInfo";
import { Point } from "scichart/Core/Point";
import { ENearestPointLogic } from "scichart/Charting/Visuals/RenderableSeries/HitTest/IHitTestProvider";
import { CustomAnnotation } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import classes from "../../../../Examples/Examples.module.scss";
import Box from "../../../../../helpers/shared/Helpers/Box/Box";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";

const divElementId = "chart";

export const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
            id: EAxisAlignment.Left.toString(),
            axisAlignment: EAxisAlignment.Left
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
            id: EAxisAlignment.Right.toString(),
            axisAlignment: EAxisAlignment.Right
        })
    );
    sciChartSurface.applyTheme(new SciChartJSLightTheme());
    // sciChartSurface.chartModifiers.add(new SeriesSelectionModifier({ enableHover: true, enableSelection: true }));

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
            yAxisId: alignment.toString()
            // onSelectedChanged: (sourceSeries, isSelected) => {
            //     sourceSeries.strokeThickness = isSelected ? 5 : 2;
            //     sourceSeries.stroke = isSelected ? "Purple" : "Blue";
            //     sourceSeries.pointMarker = isSelected ? new EllipsePointMarker(wasmContext, {
            //         width: 9,
            //         height: 9,
            //         strokeThickness: 1,
            //         stroke: "White",
            //         fill: "Purple",
            //     }) : undefined;
            // },
            // onHoveredChanged: (sourceSeries, isHovered) => {
            //     sourceSeries.opacity = isHovered ? 1.0 : 0.7;
            //     sourceSeries.strokeThickness = isHovered ? 2 : 1;
            // },
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

const HIT_TEST_RADIUS = 10;

let scs: SciChartSurface;

export default function HitTestAPI() {
    const [hitTestsList, setHitTestsList] = React.useState<HitTestInfo[]>([]);

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
            <Box mt={20}>
                {hitTestsList.map((ht, index) => (
                    <Alert key={index} style={{ marginTop: "16px" }}>
                        <AlertTitle>{ht.dataSeriesName}</AlertTitle>
                        Mouse Coord: {ht.hitTestPoint.x.toFixed(2)}, {ht.hitTestPoint.y.toFixed(2)}; Is Hit:{" "}
                        {ht.isHit && <span style={{ color: "red" }}>true</span>}
                        {!ht.isHit ? "false" : ""}, Index: {ht.dataSeriesIndex}, Radius: {ht.hitTestRadius}; Nearest
                        Data Coord: {ht.xCoord.toFixed(2)}, {ht.yCoord.toFixed(2)}; Nearest Data Value:{" "}
                        {ht.xValue.toFixed(2)}, {ht.yValue.toFixed(2)}
                    </Alert>
                ))}
            </Box>
        </div>
    );
}
