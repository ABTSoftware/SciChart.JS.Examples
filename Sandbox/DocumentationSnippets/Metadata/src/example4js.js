import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {chartBuilder} from "scichart/Builder/chartBuilder";
import { EBaseType } from "scichart/types/BaseType";
import { ESeriesType } from "scichart/types/SeriesType";

class NoteMetadataGenerator {
    // Accept and store the raw data in the constructor
    constructor (data) {
        this.type = "noteGenerator";
        this.notes = data;
        // This is called by SciChart to get the metadata to set when the dataSeries is created
        this.getMetadata = () => this.notes.map(n => ({ isSelected: false, note: n }));
        this.toJSON = () => ({ type: this.type, data: this.notes });
    };
}

export async function initSciChart4() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id-4");

    chartBuilder.registerType(EBaseType.MetadataGenerator, "noteGenerator", (data) => new NoteMetadataGenerator(data));

    chartBuilder.buildChart("scichart-div-id-4", {
        series: { type: ESeriesType.LineSeries, xyData: {
            xValues: [1, 2, 3, 4],
            yValues: [4.3, 5.3, 6, 6.3],
            metadata: { type: "noteGenerator", data: ["This", "is", "some", "metadata"] }
        }}
    });
}

