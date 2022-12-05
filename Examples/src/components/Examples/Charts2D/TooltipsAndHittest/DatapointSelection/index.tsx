import * as React from "react";
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
import {appTheme} from "../../../theme";
import {
    SeriesSelectionModifier
} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/ChartModifiers/SeriesSelectionModifier";
import {
    SplineLineRenderableSeries
} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Visuals/RenderableSeries/SplineLineRenderableSeries";
import {EPointMarkerType} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/types/PointMarkerType";
import {AUTO_COLOR} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Themes/IThemeProvider";
import {
    TextAnnotation
} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Visuals/Annotations/TextAnnotation";
import {EHorizontalAnchorPoint} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/types/AnchorPoint";
import {
    ECoordinateMode
} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Visuals/Annotations/AnnotationBase";
import {
    LegendModifier
} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/ChartModifiers/LegendModifier";
import {
    DataLabelProvider
} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Visuals/RenderableSeries/DataLabels/DataLabelProvider";
import {
    LineSeriesDataLabelProvider
} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Visuals/RenderableSeries/DataLabels/LineSeriesDataLabelProvider";
import {
    DataLabelState
} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Visuals/RenderableSeries/DataLabels/DataLabelState";

const divElementId = "chart";
const HIT_TEST_RADIUS = 10;

// Generate some data for the example
const dataSize = 30;
const xValues: number[] = [];
const yValues: number[] = [];
const y1Values: number[] = [];
const y2Values: number[] = [];
const y3Values: number[] = [];
const y4Values: number[] = [];
for (let i = 0; i < dataSize; i++) {
    xValues.push(i);
    y4Values.push(Math.random());
    y3Values.push(Math.random() + 1);
    y2Values.push(Math.random() + 1.8);
    y1Values.push(Math.random() + 2.5);
    yValues.push(Math.random() + 3.6);
}

const drawExample = async (setSelectedPoints: (selectedPoints: DataPointInfo[]) => void) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
        })
    );

    sciChartSurface.chartModifiers.add(new SeriesSelectionModifier({
        enableHover: true,
        enableSelection: true
    }));

    // Stroke/fill for selected points
    const stroke = appTheme.ForegroundColor;
    const fill: string = appTheme.PaleSkyBlue + "77";

    // Optional: show datalabels but only for selected points
    const getDataLabelProvider = () => {
        const dataLabelProvider = new LineSeriesDataLabelProvider()
        dataLabelProvider.style = {fontFamily: "Arial", fontSize: 13};
        dataLabelProvider.color = appTheme.ForegroundColor;
        dataLabelProvider.getText = (state: DataLabelState) => {
            return state.getMetaData()?.isSelected ? `x,y [${state.xValues.get(state.index).toFixed(1)}, ` +
                `${state.yValues.get(state.index).toFixed(1)}] selected`
                : "";
        };
        return dataLabelProvider;
    }

    // Add some series onto the chart for selection
    sciChartSurface.renderableSeries.add(new SplineLineRenderableSeries(wasmContext, {
        id: "Series1",
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "First Series"}),
        pointMarker: { type: EPointMarkerType.Ellipse, options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 } },
        strokeThickness: 3,
        // Optional visual feedback for selected points can be provided by the DataPointSelectionPaletteProvider
        // When dataSeries.metadata[i].isSelected, this still is applied
        paletteProvider: new DataPointSelectionPaletteProvider({ stroke, fill }),
        // Optional: show datalabels but only for selected points
        dataLabelProvider: getDataLabelProvider()
    }));

    sciChartSurface.renderableSeries.add(new SplineLineRenderableSeries(wasmContext, {
        id: "Series2",
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y1Values, dataSeriesName: "Second Series"}),
        pointMarker: { type: EPointMarkerType.Ellipse, options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 } },
        strokeThickness: 3,
        // Optional visual feedback for selected points
        paletteProvider: new DataPointSelectionPaletteProvider({ stroke, fill }),
        // Optional: show datalabels but only for selected points
        dataLabelProvider: getDataLabelProvider()
    }));

    sciChartSurface.renderableSeries.add(new SplineLineRenderableSeries(wasmContext, {
        id: "Series3",
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y2Values, dataSeriesName: "Third Series"}),
        pointMarker: { type: EPointMarkerType.Ellipse, options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 } },
        strokeThickness: 3,
        // Optional visual feedback for selected points
        paletteProvider: new DataPointSelectionPaletteProvider({ stroke, fill }),
        // Optional: show datalabels but only for selected points
        dataLabelProvider: getDataLabelProvider()
    }));

    sciChartSurface.renderableSeries.add(new SplineLineRenderableSeries(wasmContext, {
        id: "Series4",
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y3Values, dataSeriesName: "Fourth Series"}),
        pointMarker: { type: EPointMarkerType.Ellipse, options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 } },
        strokeThickness: 3,
        // Optional visual feedback for selected points
        paletteProvider: new DataPointSelectionPaletteProvider({ stroke, fill }),
        // Optional: show datalabels but only for selected points
        dataLabelProvider: getDataLabelProvider()
    }));

    // Todo: Show how to programmatically set points. Requires some changes in scichart.js API

    // Add title annotation
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Click & Drag Select points. Output is shown in the table below",
            fontSize: 20,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            y1: 0,
            opacity: 0.77,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative
        })
    );

    // Add a legend to the chart
    sciChartSurface.chartModifiers.add(new LegendModifier());

    // Add the DataPointSelectonModifier to the chart.
    // selectionChanged event / callback has the selected points in the arguments
    const dataPointSelection = new DataPointSelectionModifier();
    dataPointSelection.selectionChanged.subscribe((data: DataPointSelectionChangedArgs) => {
        // When points are selected, set them - we render the selected points to a table below the chart
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

    const pointsBoxStyle: CSSProperties = {
        flexBasis: 100, flexGrow: 1, flexShrink: 1,
        color: appTheme.PaleSkyBlue,
        background: appTheme.DarkIndigo
    };

    const chartStyle: CSSProperties = {
        flexBasis: 400, flexGrow: 1, flexShrink: 1
    };

    const columnItemStyle: CSSProperties = {
        flex: "auto",
        width: "100px",
        borderRight: `solid 1px ${appTheme.MutedSkyBlue}`,
        borderBottom: `solid 1px ${appTheme.MutedSkyBlue}`,
        textAlign: "center"
    };
    const columnItemStyleRight: CSSProperties = {
        flex: "auto",
        width: "100px",
        borderBottom: `solid 1px ${appTheme.MutedSkyBlue}`,
        textAlign: "center"
    };

    const scrollbarStyle: CSSProperties = {
        height: "120px",
        overflow: "scroll",
        overflowX: "hidden"
    };

    return (
        <div className={classes.FullHeightChartWrapper}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div id={divElementId} style={chartStyle} />
                <div style={pointsBoxStyle}>
                    <h3 style={{color: appTheme.PaleSkyBlue, margin: 5}}>Selected Points</h3>
                    <div style={{...rowStyle, marginRight: "17px"}}>
                        <div style={columnItemStyle}>Series Name</div>
                        <div style={columnItemStyle}>X Value</div>
                        <div style={columnItemStyleRight}>Y Value</div>
                    </div>
                    <div style={scrollbarStyle}>
                        {selectedPoints.map((dp, index) => (
                            <div style={rowStyle}>
                                <div style={columnItemStyle}>{dp.seriesName}</div>
                                <div style={columnItemStyle}>{dp.xValue.toFixed(2)}</div>
                                <div style={columnItemStyleRight}>{dp.yValue.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
