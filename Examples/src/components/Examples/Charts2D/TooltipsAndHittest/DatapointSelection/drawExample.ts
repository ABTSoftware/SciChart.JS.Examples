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
    DataLabelState,
    ELegendPlacement,
} from "scichart";
import { appTheme } from "../../../theme";

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

export const drawExample = async (
    rootElement: string | HTMLDivElement,
    setSelectedPoints: (selectedPoints: DataPointInfo[]) => void
) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
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
                options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 },
            },
            strokeThickness: 3,
            // Optional visual feedback for selected points can be provided by the DataPointSelectionPaletteProvider
            // When dataSeries.metadata[i].isSelected, this still is applied
            paletteProvider: new DataPointSelectionPaletteProvider({ stroke, fill }),
            // Optional: show datalabels but only for selected points
            dataLabelProvider: getDataLabelProvider(),
        })
    );

    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            id: "Series2",
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y1Values, dataSeriesName: "Second Series" }),
            pointMarker: {
                type: EPointMarkerType.Ellipse,
                options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 },
            },
            strokeThickness: 3,
            // Optional visual feedback for selected points
            paletteProvider: new DataPointSelectionPaletteProvider({ stroke, fill }),
            // Optional: show datalabels but only for selected points
            dataLabelProvider: getDataLabelProvider(),
        })
    );

    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            id: "Series3",
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y2Values, dataSeriesName: "Third Series" }),
            pointMarker: {
                type: EPointMarkerType.Ellipse,
                options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 },
            },
            strokeThickness: 3,
            // Optional visual feedback for selected points
            paletteProvider: new DataPointSelectionPaletteProvider({ stroke, fill }),
            // Optional: show datalabels but only for selected points
            dataLabelProvider: getDataLabelProvider(),
        })
    );

    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            id: "Series4",
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y3Values, dataSeriesName: "Fourth Series" }),
            pointMarker: {
                type: EPointMarkerType.Ellipse,
                options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 },
            },
            strokeThickness: 3,
            // Optional visual feedback for selected points
            paletteProvider: new DataPointSelectionPaletteProvider({ stroke, fill }),
            // Optional: show datalabels but only for selected points
            dataLabelProvider: getDataLabelProvider(),
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
            yCoordinateMode: ECoordinateMode.Relative,
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
            yCoordinateMode: ECoordinateMode.Relative,
        })
    );

    // Add a legend to the chart
    sciChartSurface.chartModifiers.add(new LegendModifier({ placement: ELegendPlacement.BottomLeft }));

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
