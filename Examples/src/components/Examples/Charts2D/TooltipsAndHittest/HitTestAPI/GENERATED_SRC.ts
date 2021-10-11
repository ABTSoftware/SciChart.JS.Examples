export const code = `import * as React from "react";
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
import { CustomAnnotation } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import classes from "../../../../Examples/Examples.module.scss";
import Box from "../../../../../helpers/shared/Helpers/Box/Box";
import { DpiHelper } from "scichart/Charting/Visuals/TextureManager/DpiHelper";
import { translateFromCanvasToSeriesViewRect } from "scichart/utils/translate";

const divElementId = "chart";
const HIT_TEST_RADIUS = 10;

const drawExample = async (setHitTestsList: (hitTestsList: HitTestInfo[]) => void) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Top });
    xAxis.visibleRange = new NumberRange(-0.5, 8.5);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Left });
    yAxis.visibleRange = new NumberRange(0, 6);
    sciChartSurface.yAxes.add(yAxis);

    // Candlestick series
    const xOhlcValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const openValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];
    const highValues = [3.7, 3.8, 4.0, 5.3, 5.9, 5.7, 5.0, 4.3, 3.2];
    const lowValues = [2.2, 3.4, 3.3, 3.8, 5.0, 4.8, 3.5, 3.0, 1.8];
    const closeValues = [3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0, 2.0];
    const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
        dataPointWidth: 0.3,
        strokeThickness: 2,
        dataSeries: new OhlcDataSeries(wasmContext, {
            xValues: xOhlcValues,
            openValues,
            highValues,
            lowValues,
            closeValues
        })
    });
    sciChartSurface.renderableSeries.add(candlestickSeries);

    // Bubble series
    const xBubbleValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yBubbleValues = [0.5, 1.0, 1.8, 2.9, 3.5, 3.0, 2.7, 2.4, 1.7];
    const zBubbleValues = [24, 12, 13, 16, 12, 15, 12, 19, 12];
    const bubbleSeries = new FastBubbleRenderableSeries(wasmContext, {
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 24,
            height: 24,
            fill: "white",
            strokeThickness: 2,
            stroke: "#368BC1"
        }),
        dataSeries: new XyzDataSeries(wasmContext, {
            xValues: xBubbleValues,
            yValues: yBubbleValues,
            zValues: zBubbleValues
        })
    });
    sciChartSurface.renderableSeries.add(bubbleSeries);

    // Line series
    const xLineValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yLineValues = [0, 0.5, 1.3, 2.4, 3, 2.5, 2.2, 1.9, 1.2];
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#368BC1",
        strokeThickness: 3,
        dataSeries: new XyDataSeries(wasmContext, { xValues: xLineValues, yValues: yLineValues })
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    // Column series
    const xColumnValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yColumnValues = [0, 0.2, 1, 2.0, 2.5, 1.9, 1.9, 1.5, 1.2];
    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        fill: "rgba(255,255,255,0.9)",
        dataPointWidth: 0.5,
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: xColumnValues,
            yValues: yColumnValues
        })
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    const svgAnnotation = new CustomAnnotation({
        svgString: '<svg width="8" height="8"><circle cx="50%" cy="50%" r="4" fill="#368BC1"/></svg>',
        isHidden: true,
        xCoordShift: -4,
        yCoordShift: -4
    });
    sciChartSurface.annotations.add(svgAnnotation);
    sciChartSurface.domCanvas2D.addEventListener("mousedown", (mouseEvent: MouseEvent) => {
        const newHitTestsList: HitTestInfo[] = [];
        const dpiScaledPoint = new Point(
            mouseEvent.offsetX * DpiHelper.PIXEL_RATIO,
            mouseEvent.offsetY * DpiHelper.PIXEL_RATIO
        );
        const dpiScaledRadius = HIT_TEST_RADIUS * DpiHelper.PIXEL_RATIO;
        const clickInSeriesViewRect = translateFromCanvasToSeriesViewRect(
            dpiScaledPoint,
            sciChartSurface.seriesViewRect
        );
        if (clickInSeriesViewRect) {
            sciChartSurface.renderableSeries.asArray().forEach(rs => {
                // Interpolation is used for LineSeries to test hit on the line
                // for CandlestickSeries to test hit on the candle
                // for ColumnSeries to test hit on the column
                if (rs.hitTestProvider) {
                    const hitTestInfo = rs.hitTestProvider.hitTest(dpiScaledPoint.x, dpiScaledPoint.y, dpiScaledRadius);
                    svgAnnotation.isHidden = false;
                    svgAnnotation.x1 = hitTestInfo.hitTestPointValues.x;
                    svgAnnotation.y1 = hitTestInfo.hitTestPointValues.y;
                    if (!hitTestInfo.isEmpty) {
                        newHitTestsList.push(hitTestInfo);
                    }
                }
            });
            setHitTestsList(newHitTestsList);
        }
    });

    return { wasmContext, sciChartSurface };
};

let scs: SciChartSurface;

export default function HitTestAPI() {
    const [hitTestsList, setHitTestsList] = React.useState<HitTestInfo[]>([]);

    React.useEffect(() => {
        (async () => {
            const res = await drawExample(setHitTestsList);
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
`;