import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {NumberRange} from "scichart/Core/NumberRange";
import {I1DMetadataGenerator, IPointMetadata} from "scichart/Charting/Model/IPointMetadata";
import {chartBuilder} from "scichart/Builder/chartBuilder";
import { EBaseType } from "scichart/types/BaseType";
import { ESeriesType } from "scichart/types/SeriesType";

class NoteMetadataGenerator implements I1DMetadataGenerator {
    type = "noteGenerator";
    notes: string[];
    // Accept and store the raw data in the constructor
    constructor (data: string[]) {
        this.notes = data;
    };
    // This is called by SciChart to get the metadata to set when the dataSeries is created
    getMetadata = () => this.notes.map(n => ({ isSelected: false, note: n }));
    toJSON = () => ({ type: this.type, data: this.notes });
    // unused for this example.  Used to create a clone of a metadata template for each data point.
    getSingleMetadata: () => IPointMetadata;
}

export async function initSciChart4() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id-4");

    chartBuilder.registerType(EBaseType.MetadataGenerator, "noteGenerator", (data: any) => new NoteMetadataGenerator(data));

    chartBuilder.buildChart("scichart-div-id-4", {
        series: { type: ESeriesType.LineSeries, xyData: {
            xValues: [1, 2, 3, 4],
            yValues: [4.3, 5.3, 6, 6.3],
            metadata: { type: "noteGenerator", data: ["This", "is", "some", "metadata"] }
        }}
    });
}

