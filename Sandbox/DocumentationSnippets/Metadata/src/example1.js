import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {NumberRange} from "scichart/Core/NumberRange";
import {SeriesSelectionModifier} from "scichart/Charting/ChartModifiers/SeriesSelectionModifier";

export async function initSciChart() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Create metadata with initial values
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4],
        yValues: [4.3, 5.3, 6, 6.3],
        metadata: [ 
            { isSelected: false, note: "This"},
            { isSelected: false, note: "is"},
            { isSelected: false, note: "some"},
            { isSelected: false, note: "metadata"}
        ]
    });
    // Append data with metadata
    dataSeries.append(5, 6.5, { isSelected: false, note: "Appended"});
    // Insert a point with metadata
    dataSeries.insert(3, 3.5, 6.8, { isSelected: false, note: "Inserted"});
    // Update a point and its metadata
    dataSeries.update(0, 3.3, { isSelected: false, note: "Updated"});

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries }));
}

