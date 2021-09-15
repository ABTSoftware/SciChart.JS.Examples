import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {NumberRange} from "scichart/Core/NumberRange";
import {RolloverModifier} from "scichart/Charting/ChartModifiers/RolloverModifier";

export async function initSciChart3() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id-3");

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

    // A function to get the text for the rolloverModifer tooltip
    const metadataTooltipDataTemplate = (seriesInfo) => {
        const valuesWithLabels = [];    
        if (seriesInfo.pointMetadata) {
            valuesWithLabels.push("Note: " + seriesInfo.pointMetadata.note);
        }
        valuesWithLabels.push("X: " + seriesInfo.formattedXValue + " Y: " + seriesInfo.formattedYValue);
        return valuesWithLabels;
    };

    const series = new FastLineRenderableSeries(wasmContext, { dataSeries, strokeThickness: 5 });

    // You can set the toolTipDataTemplate on the RolloverModifier
    sciChartSurface.chartModifiers.add(new RolloverModifier({tooltipDataTemplate: metadataTooltipDataTemplate }));
    // Or if you need different templates for different series, set it on the renderableSeries
    // renderableSeries1.rolloverModifierProps.tooltipDataTemplate = metadataTooltipDataTemplate;

    sciChartSurface.renderableSeries.add(series);
}

