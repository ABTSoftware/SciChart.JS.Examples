import * as SciChart from "scichart";

const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    NumberRange,
    SeriesSelectionModifier,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode,
    EllipsePointMarker
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function seriesSelectionStyle(divElementId) {
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const defaultStroke = "SteelBlue";
    const defaultFill = "LightSteelBlue";

    const applyStyle = (series, isSelected, isHovered) => {
        series.stroke =
            isSelected && isHovered ? "#FFBB99" : isSelected ? "#FFF" : isHovered ? "#FF7733" : defaultStroke;
        series.pointMarker.stroke = series.stroke;
        series.pointMarker.fill =
            isSelected && isHovered ? "#FFBB99" : isSelected ? "#FFF" : isHovered ? "#FF7733" : defaultFill;
    };

    // Create a chart with line series with a point-marker
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: defaultStroke,
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                strokeThickness: 2,
                stroke: defaultStroke,
                fill: defaultFill
            }),
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8]
            }),

            // Apply a style to the series on selected and hovered
            onSelectedChanged: sourceSeries => {
                applyStyle(sourceSeries, sourceSeries.isSelected, sourceSeries.isHovered);
            },

            onHoveredChanged: sourceSeries => {
                applyStyle(sourceSeries, sourceSeries.isSelected, sourceSeries.isHovered);
            }
        })
    );

    // Add the DatapointSelectionModifier to the chart
    sciChartSurface.chartModifiers.add(
        new SeriesSelectionModifier({
            enableSelection: true,
            enableHover: true
        })
    );

    // #endregion

    // Add some instructions to the user
    const options = {
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0.5,
        y1: 0.0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.33,
        textColor: "White"
    };
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "SeriesSelectionModifier Example",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Hover or click the series. Check the output in the console.",
            fontSize: 20,
            yCoordShift: 75,
            ...options
        })
    );
}

seriesSelectionStyle("scichart-root");
