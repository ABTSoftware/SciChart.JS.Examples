import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EAutoRange} from "scichart/types/AutoRange";
import {EAxisAlignment} from "scichart/types/AxisAlignment";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {CategoryAxis} from "scichart/Charting/Visuals/Axis/CategoryAxis";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";

export async function initCategoryAxis() {
    const {sciChartSurface, wasmContext} = await SciChartSurface.create("scichart-div-3");

    // Unix Epoch for March 1st 2022 & March 2nd
    const March1st2022 = 1646092800;
    const March2nd2022 = 1646179200;
    const OneDay = March2nd2022 - March1st2022;

    // Creating a CategoryAxis as an XAxis on the bottom
    sciChartSurface.xAxes.add(new CategoryAxis(wasmContext, {
        defaultXStart: March1st2022,
        defaultXStep: OneDay,
        drawMajorGridLines: true,
        drawMinorGridLines: true,
        axisTitle: "Category X Axis",
        axisAlignment: EAxisAlignment.Bottom,
        autoRange: EAutoRange.Once,
        labelFormat: ENumericFormat.Date_DDMMYYYY
    }));

    // Creating a NumericAxis as a YAxis on the left,
    // with title = 'Y Axis' and custom label format
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        drawMajorGridLines: true,
        drawMinorGridLines: true,
        axisTitle: "Numeric Y Axis",
        axisAlignment: EAxisAlignment.Left,
        autoRange: EAutoRange.Once,
    }));

    // Note: a category axis will require a series to be able to draw unless defaultXStart, defaultXStep or defaultXValues are defined
    // sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    //     dataSeries: new XyDataSeries(wasmContext, {
    //         xValues: [1E5,1E7,1E9,1E11],
    //         yValues: [2,3,4,5]
    //     })
    // }))
}
