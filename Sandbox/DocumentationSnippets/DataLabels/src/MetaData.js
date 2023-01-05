import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {NumberRange} from "scichart/Core/NumberRange";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { EPointMarkerType } from "scichart/types/PointMarkerType";

export async function dataLabelsMetadataExample(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Create a chart with line series with a point-marker
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: "SteelBlue",
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            strokeThickness: 2,
            stroke: "SteelBlue",
            fill: "LightSteelBlue"}),
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8],
            metadata: [
                { text: "Bananas", isSelected: false },
                { text: "Apples", isSelected: false },
                { text: "Pears", isSelected: false },
                { text: "Pineapples", isSelected: false },
                { text: "Plums", isSelected: false },
                { text: "Cherries", isSelected: false },
                { text: "Strawberries", isSelected: false },
                { text: "Blueberries", isSelected: false },
                { text: "Lemons", isSelected: false },
                { text: "Limes", isSelected: false },
                { text: "Papaya", isSelected: false },
                { text: "Guava", isSelected: false },
            ]
        }),
        dataLabels: {
            metaDataSelector: (metaData) => metaData.text,
            style: {
                fontFamily: "Arial",
                fontSize: 16
            },
            color: "#EEE"
        }
    }));
}

export async function dataLabelsMetadataBuilderApiExample(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        series: {
            type: ESeriesType.LineSeries,
            xyData: {
                xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8],
                metadata: [
                    { text: "Bananas", isSelected: false },
                    { text: "Apples", isSelected: false },
                    { text: "Pears", isSelected: false },
                    { text: "Pineapples", isSelected: false },
                    { text: "Plums", isSelected: false },
                    { text: "Cherries", isSelected: false },
                    { text: "Strawberries", isSelected: false },
                    { text: "Blueberries", isSelected: false },
                    { text: "Lemons", isSelected: false },
                    { text: "Limes", isSelected: false },
                    { text: "Papaya", isSelected: false },
                    { text: "Guava", isSelected: false },
                ]
            },
            options: {
                stroke: "SteelBlue",
                strokeThickness: 3,
                pointMarker: {
                    type: EPointMarkerType.Ellipse,
                    options: {
                        stroke: "SteelBlue",
                        fill: "LightSteelBlue",
                        width: 10,
                        height: 10,
                        strokeThickness: 2
                    }
                },
                dataLabels: {
                    metaDataSelector: (metadata) => metadata.text,
                    style: {
                        fontFamily: "Arial",
                        fontSize: 16
                    },
                    color: "#EEE"
                }
            },
        }
    });
}
