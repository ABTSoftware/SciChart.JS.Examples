import * as SciChart from "scichart";

async function basicSeriesSelection(divElementId) {
    // #region ExampleA
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

    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Method 1: Pass onSelectionChanged and onHoverChanged to SeriesSelectionModifier constructor options
    const seriesSelectionModifier = new SeriesSelectionModifier({
        enableHover: true,
        enableSelection: true,
        onSelectionChanged: args => {
            console.log("1 seriesSelectionModifier constructor onSelectionChanged");
        },
        onHoverChanged: args => {
            console.log("1 seriesSelectionModifier constructor onHoverChanged");
        }
    });

    // Method 2: Use the hoverChanged and selectionChanged events
    seriesSelectionModifier.hoverChanged.subscribe(args => {
        console.log("2 seriesSelectionModifier.hoverChanged event");
    });

    seriesSelectionModifier.selectionChanged.subscribe(args => {
        console.log("2 seriesSelectionModifier.selectionChanged event");
    });

    // Method 3: Use the onSelectedChanged functions on the series itself
    const series = new FastLineRenderableSeries(wasmContext, {
        stroke: "SteelBlue",
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            strokeThickness: 2,
            stroke: "SteelBlue",
            fill: "LightSteelBlue"
        }),
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8]
        }),
        onSelectedChanged: (sourceSeries, isSelected) => {
            console.log("3 FastLineRenderableSeries constructor onSelectedChanged");
        },
        onHoveredChanged: (sourceSeries, isHovered) => {
            console.log("3 FastLineRenderableSeries constructor onSelectedChanged");
        }
    });

    // Method 4: use the selected and hovered events on the series
    series.hovered.subscribe(args => {
        console.log("4 FastLineRenderableSeries.hovered event");

        series.stroke = series.isSelected ? "White" : series.isHovered ? "Orange" : "SteelBlue";
    });

    series.selected.subscribe(args => {
        console.log("4 FastLineRenderableSeries.selected event");

        series.stroke = series.isSelected ? "White" : series.isHovered ? "Orange" : "SteelBlue";
    });

    // Add the modifier and series to chart
    sciChartSurface.chartModifiers.add(seriesSelectionModifier);
    sciChartSurface.renderableSeries.add(series);
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

basicSeriesSelection("scichart-root");
