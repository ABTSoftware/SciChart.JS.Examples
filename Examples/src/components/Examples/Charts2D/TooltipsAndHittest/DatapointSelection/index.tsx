import * as React from "react";
import { CSSProperties } from "react";
import classes from "../../../styles/Examples.module.scss";
import { appTheme } from "scichart-example-dependencies";

import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    XyDataSeries,
    DataPointSelectionModifier,
    DataPointSelectionChangedArgs,
    DataPointInfo,
    DataPointSelectionPaletteProvider,
    SplineLineRenderableSeries,
    EPointMarkerType,
    AUTO_COLOR,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode,
    LegendModifier,
    LineSeriesDataLabelProvider,
    DataLabelState
} from "scichart";
import { SciChartReact } from "scichart-react";

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

const drawExample = async (rootElement:string | HTMLDivElement, setSelectedPoints: (selectedPoints: DataPointInfo[]) => void) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1)
        })
    );

    // Stroke/fill for selected points
    const stroke = appTheme.ForegroundColor;
    const fill: string = appTheme.PaleSkyBlue + "77";

    // Optional: show datalabels but only for selected points
    const getDataLabelProvider = () => {
        const dataLabelProvider = new LineSeriesDataLabelProvider();
        dataLabelProvider.style = { fontFamily: "Arial", fontSize: 13 };
        dataLabelProvider.color = appTheme.ForegroundColor;
        dataLabelProvider.getText = (state: DataLabelState) => {
            return state.getMetaData()?.isSelected
                ? `x,y [${state.xValues.get(state.index).toFixed(1)}, ` +
                      `${state.yValues.get(state.index).toFixed(1)}] selected`
                : "";
        };
        return dataLabelProvider;
    };

    // Add some series onto the chart for selection
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            id: "Series1",
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "First Series" }),
            pointMarker: {
                type: EPointMarkerType.Ellipse,
                options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 }
            },
            strokeThickness: 3,
            // Optional visual feedback for selected points can be provided by the DataPointSelectionPaletteProvider
            // When dataSeries.metadata[i].isSelected, this still is applied
            paletteProvider: new DataPointSelectionPaletteProvider({ stroke, fill }),
            // Optional: show datalabels but only for selected points
            dataLabelProvider: getDataLabelProvider()
        })
    );

    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            id: "Series2",
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y1Values, dataSeriesName: "Second Series" }),
            pointMarker: {
                type: EPointMarkerType.Ellipse,
                options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 }
            },
            strokeThickness: 3,
            // Optional visual feedback for selected points
            paletteProvider: new DataPointSelectionPaletteProvider({ stroke, fill }),
            // Optional: show datalabels but only for selected points
            dataLabelProvider: getDataLabelProvider()
        })
    );

    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            id: "Series3",
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y2Values, dataSeriesName: "Third Series" }),
            pointMarker: {
                type: EPointMarkerType.Ellipse,
                options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 }
            },
            strokeThickness: 3,
            // Optional visual feedback for selected points
            paletteProvider: new DataPointSelectionPaletteProvider({ stroke, fill }),
            // Optional: show datalabels but only for selected points
            dataLabelProvider: getDataLabelProvider()
        })
    );

    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            id: "Series4",
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y3Values, dataSeriesName: "Fourth Series" }),
            pointMarker: {
                type: EPointMarkerType.Ellipse,
                options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 }
            },
            strokeThickness: 3,
            // Optional visual feedback for selected points
            paletteProvider: new DataPointSelectionPaletteProvider({ stroke, fill }),
            // Optional: show datalabels but only for selected points
            dataLabelProvider: getDataLabelProvider()
        })
    );

    // Todo: Show how to programmatically set points. Requires some changes in scichart.js API

    // Add title annotations
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Click & Drag Select points",
            fontSize: 20,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            opacity: 0.77,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative
        })
    );

    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Try single click, CTRL+CLICK & Drag to select",
            fontSize: 16,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            yCoordShift: 40,
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

export default function DatapointSelection() {
    const [selectedPoints, setSelectedPoints] = React.useState<DataPointInfo[]>([]);

    const rowStyle = {
        height: "30px",
        display: "flex"
    };

    const pointsBoxStyle: CSSProperties = {
        flexBasis: 70,
        flexGrow: 1,
        flexShrink: 1,
        color: appTheme.PaleSkyBlue,
        background: appTheme.DarkIndigo
    };

    const chartStyle: CSSProperties = {
        flexBasis: 400,
        flexGrow: 1,
        flexShrink: 1
    };

    const columnItemStyle: CSSProperties = {
        flex: "auto",
        width: "100px",
        borderRight: `solid 1px ${appTheme.MutedSkyBlue}`,
        borderBottom: `solid 1px ${appTheme.MutedSkyBlue}`,
        textAlign: "center",
        fontSize: 14
    };
    const columnItemStyleRight: CSSProperties = {
        flex: "auto",
        width: "100px",
        borderBottom: `solid 1px ${appTheme.MutedSkyBlue}`,
        textAlign: "center",
        fontSize: 14
    };

    const scrollbarStyle: CSSProperties = {
        height: "100%",
        overflow: "scroll",
        overflowX: "hidden"
    };

    return (
        <div className={classes.FullHeightChartWrapper}>
            <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
                <SciChartReact 
                    style={chartStyle} 
                    initChart={(rootElement) => drawExample(rootElement, setSelectedPoints)}
                />
                <div style={pointsBoxStyle}>
                    <h3 style={{ color: appTheme.PaleSkyBlue, margin: 5 }}>Selected Points</h3>
                    <div style={{ ...rowStyle, marginRight: "17px" }}>
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
