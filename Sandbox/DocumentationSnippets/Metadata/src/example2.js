import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {NumberRange} from "scichart/Core/NumberRange";
import {parseColorToUIntArgb} from "scichart/utils/parseColor";
import {EStrokePaletteMode} from "scichart/Charting/Model/IPaletteProvider";

export async function initSciChart2() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id-2");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Create series with metadata containing color
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5],
        yValues: [4.3, 5.3, 6, 6.3, 5.7],
        metadata: [ 
            { isSelected: false, color: "red"},
            { isSelected: false, color: "green"},
            { isSelected: false, },
            { isSelected: false, color: "blue"},
            { isSelected: false, }
        ]
    });

    // PaletteProvider implementing IStrokePaletteProvider
    const linePaletteProvider = {
        onAttached: (parentSeries) => {},
        onDetached: () => {},
        strokePaletteMode: EStrokePaletteMode.SOLID,
        overrideStrokeArgb: (
            xValue,
            yValue,
            index,
            opacity,
            metadata
        ) => {
            if (metadata && metadata.color) {
                return parseColorToUIntArgb(metadata.color)
            } else {
                return undefined;
            }
        }
    }

    // Renderable series using the paletteProvider
    const series = new FastLineRenderableSeries(wasmContext, { dataSeries, paletteProvider: linePaletteProvider, strokeThickness: 5 });

    sciChartSurface.renderableSeries.add(series);
}
