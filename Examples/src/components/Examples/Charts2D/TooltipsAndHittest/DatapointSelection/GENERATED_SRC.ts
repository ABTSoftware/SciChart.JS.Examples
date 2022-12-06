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
import { DataPointSelectionModifier } from "scichart/Charting/ChartModifiers/DataPointSelectionModifier";
import { DataPointSelectionChangedArgs } from "scichart/Charting/ChartModifiers/DataPointSelectionChangedArgs";
import { DataPointInfo } from "scichart/Charting/ChartModifiers/DataPointInfo";
import { DataPointSelectionPaletteProvider } from "scichart/Charting/Model/DataPointSelectionPaletteProvider";
import { CSSProperties } from "react";

const divElementId = "chart";
const HIT_TEST_RADIUS = 10;

const drawExample = async (setSelectedPoints: (selectedPoints: DataPointInfo[]) => void) => {
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
            dataSeriesName: "Candlestick",
            xValues: xOhlcValues,
            openValues,
            highValues,
            lowValues,
            closeValues
        }),
        paletteProvider: new DataPointSelectionPaletteProvider({ stroke: "#eb7d34", fill: "#1890b5" })
    });
    sciChartSurface.renderableSeries.add(candlestickSeries);

    // Bubble series
    const xBubbleValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yBubbleValues = [0.5, 1.0, 1.8, 2.9, 3.5, 3.0, 2.7, 2.4, 1.7];
    const zBubbleValues = [24, 12, 13, 16, 12, 15, 12, 19, 12];
    const bubbleSeries = new FastBubbleRenderableSeries(wasmContext, {
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 36,
            height: 36,
            fill: "#D36582",
            strokeThickness: 0
        }),
        dataSeries: new XyzDataSeries(wasmContext, {
            dataSeriesName: "Bubble",
            xValues: xBubbleValues,
            yValues: yBubbleValues,
            zValues: zBubbleValues
        }),
        paletteProvider: new DataPointSelectionPaletteProvider({ stroke: "#eb7d34", fill: "#1890b5" })
    });
    sciChartSurface.renderableSeries.add(bubbleSeries);

    // Line series
    const xLineValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yLineValues = [0, 0.5, 1.3, 2.4, 3, 2.5, 2.2, 1.9, 1.2];
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#368BC1",
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 14,
            height: 14,
            fill: "#00000000",
            stroke: "#00000000",
            strokeThickness: 2
        }),
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: "Line",
            xValues: xLineValues,
            yValues: yLineValues
        }),
        paletteProvider: new DataPointSelectionPaletteProvider({ stroke: "#eb7d34", fill: "#1890b5" })
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    // Column series
    const xColumnValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yColumnValues = [0, 0.2, 1, 2.0, 2.5, 1.9, 1.9, 1.5, 1.2];
    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        fill: "#057530",
        stroke: "#61cf8b",
        dataPointWidth: 0.5,
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: "Column",
            xValues: xColumnValues,
            yValues: yColumnValues
        }),
        paletteProvider: new DataPointSelectionPaletteProvider({ stroke: "#eb7d34", fill: "#1890b5" })
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    const dataPointSelection = new DataPointSelectionModifier();
    dataPointSelection.selectionChanged.subscribe((data: DataPointSelectionChangedArgs) => {
        setSelectedPoints(data.selectedDataPoints);
    });
    sciChartSurface.chartModifiers.add(dataPointSelection);

    return { wasmContext, sciChartSurface };
};

let scs: SciChartSurface;

export default function DatapointSelection() {
    const [selectedPoints, setSelectedPoints] = React.useState<DataPointInfo[]>([]);

    React.useEffect(() => {
        (async () => {
            const res = await drawExample(setSelectedPoints);
            scs = res.sciChartSurface;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => scs?.delete();
    }, []);

    const rowStyle = {
        height: "30px",
        display: "flex"
    };

    const columnItemStyle: CSSProperties = {
        flex: "auto",
        width: "100px",
        border: "solid 1px black",
        textAlign: "center"
    };

    return (
        <div className={classes.FullHeightChartWrapper}>
            <div id={divElementId} />
            <Box mt={20}>
                {/* <div style={{width: "200px", height: "500px", display: "flex", flexDirection: "column"}}> */}
                <div style={rowStyle}>
                    <div style={columnItemStyle}>Series Name</div>
                    <div style={columnItemStyle}>X Value</div>
                    <div style={columnItemStyle}>Y Value</div>
                </div>
                {selectedPoints.map((dp, index) => (
                    <div style={rowStyle}>
                        <div style={columnItemStyle}>{dp.seriesName}</div>
                        <div style={columnItemStyle}>{dp.xValue.toFixed(2)}</div>
                        <div style={columnItemStyle}>{dp.yValue.toFixed(2)}</div>
                    </div>
                ))}
                {/* </div> */}
            </Box>
        </div>
    );
}
`;