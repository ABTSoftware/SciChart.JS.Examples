import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {NumberRange} from "scichart/Core/NumberRange";
import {SeriesSelectionModifier} from "scichart/Charting/ChartModifiers/SeriesSelectionModifier";

async function initSciChart() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Method 1: Pass onSelectionChanged and onHoverChanged to SeriesSelectionModifier constructor options
    const seriesSelectionModifier = new SeriesSelectionModifier( {
        enableHover: true,
        enableSelection: true,

        onSelectionChanged: (args) => {
            console.log("1 seriesSelectionModifier constructor onSelectionChanged");
        },
        onHoverChanged: (args) => {
            console.log("1 seriesSelectionModifier constructor onHoverChanged");
        }
    });

    // Method 2: Use the hoverChanged and selectionChanged events
    seriesSelectionModifier.hoverChanged.subscribe((args) => {
        console.log("2 seriesSelectionModifier.hoverChanged event");
    });

    seriesSelectionModifier.selectionChanged.subscribe((args) => {
        console.log("2 seriesSelectionModifier.selectionChanged event");
    });

    // Method 3: Use the onSelectedChanged functions on the series itself
    const series = new FastLineRenderableSeries(wasmContext, {
        stroke: "SteelBlue",
        strokeThickness: 5,
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8]
        }),

        onSelectedChanged: (sourceSeries, isSelected) => {
            console.log("3 FastLineRenderableSeries constructor onSelectedChanged");
        },
        onHoveredChanged: (sourceSeries, isHovered)  => {
            console.log("3 FastLineRenderableSeries constructor onSelectedChanged");
        }
    });

    // Method 4: use the selected and hovered events on the series
    series.hovered.subscribe((args) => {
        console.log("4 FastLineRenderableSeries.hovered event");

        series.stroke = series.isSelected ? "White" : series.isHovered ? "Orange" : "SteelBlue";
    });

    series.selected.subscribe((args) => {
        console.log("4 FastLineRenderableSeries.selected event");

        series.stroke = series.isSelected ? "White" : series.isHovered ? "Orange" : "SteelBlue";
    });

    // Add the modifier and series to chart
    sciChartSurface.chartModifiers.add(seriesSelectionModifier);
    sciChartSurface.renderableSeries.add(series);
}

initSciChart();
