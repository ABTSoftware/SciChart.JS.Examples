import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {NumberRange} from "scichart/Core/NumberRange";
import {I1DMetadataGenerator, IPointMetadata} from "scichart/Charting/Model/IPointMetadata";
import {chartBuilder} from "scichart/Builder/chartBuilder";
import { EBaseType } from "scichart/types/BaseType";

class NoteMetadataGenerator implements I1DMetadataGenerator {
    type = "noteGenerator";
    notes: string[];
    constructor (data: string[]) {
        this.notes = data;
    };
    getMetadata = () => this.notes.map(n => ({ isSelected: false, note: n }));
    toJSON = () => ({ type: this.type, data: this.notes });
    // unused here
    getSingleMetadata: () => IPointMetadata;
}

export async function initSciChart4() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Create metadata with template
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4],
        yValues: [4.3, 5.3, 6, 6.3],
        metadata: { isSelected: false, note: ""} as IPointMetadata
    });
    
    // Update a metadata value.  This will not trigger a chart redraw
    dataSeries.getMetadataAt(0).note = "Updated";

    chartBuilder.registerType(EBaseType.MetadataGenerator, "noteGenerator", (data: any) => new NoteMetadataGenerator(data));

    const dataSeries2 = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4],
        yValues: [4.3, 5.3, 6, 6.3],
        metadata: { type: "noteGenerator", data: ["This", "is", "some", "metadata"] }
    });

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries }));
}

