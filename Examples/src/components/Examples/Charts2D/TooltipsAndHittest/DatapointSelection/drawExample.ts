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
    AUTO_COLOR,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode,
    LegendModifier,
    LineSeriesDataLabelProvider,
    DataLabelState,
    ELegendPlacement,
    EllipsePointMarker,
    ELegendOrientation,
    EVerticalTextPosition,
    DpiHelper,
    Point,
} from "scichart";
import { appTheme } from "../../../theme";

// Generate some data for the example
const dataSize = 30;
const xValues: number[] = [];
const y1Values: number[] = [];
const y2Values: number[] = [];
const y3Values: number[] = [];
const y4Values: number[] = [];
for (let i = 0; i < dataSize; i++) {
    xValues.push(i);
    y4Values.push(Math.random());
    y3Values.push(Math.random() + 1);
    y2Values.push(Math.random() + 2.5);
    y1Values.push(Math.random() + 4);
}

export const drawExample = async (
    rootElement: string | HTMLDivElement,
    setSelectedPoints: (selectedPoints: DataPointInfo[]) => void
) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.2, 0.2) }));

    // Optional: show datalabels but only for selected points
    const getDataLabelProvider = () => {
        const dataLabelProvider = new LineSeriesDataLabelProvider({ aboveBelow: false, verticalTextPosition: EVerticalTextPosition.Center });
        dataLabelProvider.style = { fontFamily: "Arial", fontSize: 13 };
        const defaultPosition = dataLabelProvider.getPosition.bind(dataLabelProvider);

        // Optional: change the position of the labels to give the selected point marker some breathing room.
        dataLabelProvider.getPosition = (state, textBounds) => {
            const result = defaultPosition(state, textBounds);
            const gap = (state.parentSeries.pointMarker?.width ?? 0) / 2 + (6 * DpiHelper.PIXEL_RATIO);
            const pointX = state.xCoord();
            const labelWidth = textBounds.m_fWidth;
            const rectWidth = state.parentSeries.parentSurface.seriesViewRect.width;
            const rightX = pointX + gap;
            const leftX = pointX - gap - labelWidth;
            const x = Math.max(0, Math.min(
                rightX + labelWidth <= rectWidth ? rightX : leftX,
                rectWidth - labelWidth
            ));
            return { 
                ...result, 
                position: new Point(x, result.position.y) 
            };
        };

        dataLabelProvider.color = appTheme.ForegroundColor;
        dataLabelProvider.getText = (state: DataLabelState) => {
            return state.getMetaData()?.isSelected
                ? `x, y: {${state.xValues[state.index].toFixed(0)}, ${state.yValues[state.index].toFixed(1)}}`
                : "";
        };
        return dataLabelProvider;
    };

    // Render the 4 series
    [y1Values, y2Values, y3Values, y4Values].forEach((yValues, index) => {
        sciChartSurface.renderableSeries.add(
            new SplineLineRenderableSeries(wasmContext, {
                id: `s-${index + 4}`,
                stroke: AUTO_COLOR,
                strokeThickness: 3,

                dataSeries: new XyDataSeries(wasmContext, { 
                    xValues, 
                    yValues: yValues, 
                    dataSeriesName: `Series-${index + 1}`
                }),

                pointMarker: new EllipsePointMarker(wasmContext, {
                    fill: appTheme.Background,
                    stroke: AUTO_COLOR,
                    strokeThickness: 2,
                    width: 14,
                    height: 14,
                }),

                // Optional: visual feedback for selected points
                paletteProvider: new DataPointSelectionPaletteProvider({ 
                    stroke: appTheme.ForegroundColor, 
                    fill: appTheme.ForegroundColor + "44"
                }),

                // Optional: show datalabels but only for selected points
                dataLabelProvider: getDataLabelProvider(),
            })
        );
    })

    // title annotations
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Click & Drag Select points",
            fontSize: 23,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
        }),
        new TextAnnotation({
            text: "Try: Single-Click | CTRL + Click | Click + Drag-to-select",
            fontSize: 16,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            yCoordShift: 30,
            opacity: 0.8,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
        })
    );

    // Add a legend to the chart
    sciChartSurface.chartModifiers.add(
        new LegendModifier({ 
            placement: ELegendPlacement.BottomLeft,
            backgroundColor: appTheme.Background,
            orientation: ELegendOrientation.Horizontal,
        })
    );

    // Add the DataPointSelectionModifier to the chart.
    const dataPointSelection = new DataPointSelectionModifier({
        hitTestRadius: 20
    });
    
    // selectionChanged event / callback has the selected points in the arguments
    dataPointSelection.selectionChanged.subscribe((data: DataPointSelectionChangedArgs) => {
        // When points are selected, set them - we render the selected points to a table below the chart
        setSelectedPoints(data.selectedDataPoints);
    });
    sciChartSurface.chartModifiers.add(dataPointSelection);

    return { wasmContext, sciChartSurface };
};
