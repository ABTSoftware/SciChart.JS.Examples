import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { MouseWheelZoomModifier } from 'scichart/Charting/ChartModifiers/MouseWheelZoomModifier';
import { ZoomExtentsModifier } from 'scichart/Charting/ChartModifiers/ZoomExtentsModifier';
import { NumberRange } from 'scichart/Core/NumberRange';
import { ZoomPanModifier } from 'scichart/Charting/ChartModifiers/ZoomPanModifier';
import { StackedColumnRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries';
import { StackedColumnCollection } from 'scichart/Charting/Visuals/RenderableSeries/StackedColumnCollection';
import { RolloverModifier } from 'scichart/Charting/ChartModifiers/RolloverModifier';

const xValues = [1992, 1993, 1994, 1995, 1996];
const tomatoesData1 = [7, 30, 27, 24, 21];
const cucumberData2 = [16, 10, 9, 8, 22];
const pepperData3 = [7, 24, 21, 11, 19];

const THRESHOLD = 10;

async function initSciChart() {
    // LICENSING //
    // Set your license code here
    // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
    // Purchased license keys can be viewed at https://www.scichart.com/profile
    //
    // e.g.
    // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
    const { wasmContext, sciChartSurface } = await SciChartSurface.create('scichart-root');
    const xAxis = new NumericAxis(wasmContext);
    xAxis.labelProvider.precision = 0;
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext);
    yAxis.growBy = new NumberRange(0, 0.1);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries1 = new XyDataSeries(wasmContext, { xValues, yValues: tomatoesData1, dataSeriesName: 'Tomato' });
    const dataSeries2 = new XyDataSeries(wasmContext, { xValues, yValues: cucumberData2, dataSeriesName: 'Cucumber' });
    const dataSeries3 = new XyDataSeries(wasmContext, { xValues, yValues: pepperData3, dataSeriesName: 'Pepper' });
    const rendSeries1 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries1.fill = '#dc443f';
    rendSeries1.stroke = 'black';
    rendSeries1.strokeThickness = 1;
    rendSeries1.dataSeries = dataSeries1;
    rendSeries1.rolloverModifierProps.markerColor = '#b83735';
    rendSeries1.rolloverModifierProps.tooltipColor = '#dc443f';
    rendSeries1.rolloverModifierProps.tooltipTextColor = '#fff';
    rendSeries1.stackedGroupId = 'one';

    const rendSeries2 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries2.fill = '#aad34f';
    rendSeries2.stroke = 'black';
    rendSeries2.strokeThickness = 1;
    rendSeries2.dataSeries = dataSeries2;
    rendSeries2.rolloverModifierProps.markerColor = '#87a73e';
    rendSeries2.rolloverModifierProps.tooltipColor = '#aad34f';
    rendSeries2.rolloverModifierProps.tooltipTextColor = '#000';
    rendSeries2.stackedGroupId = 'two';

    const rendSeries3 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries3.fill = '#8562b4';
    rendSeries3.stroke = 'black';
    rendSeries3.strokeThickness = 1;
    rendSeries3.dataSeries = dataSeries3;
    rendSeries3.rolloverModifierProps.markerColor = '#715195';
    rendSeries3.rolloverModifierProps.tooltipColor = '#8562b4';
    rendSeries3.rolloverModifierProps.tooltipTextColor = '#fff';
    rendSeries3.stackedGroupId = 'three';

    const verticallyStackedColumnCollection = new StackedColumnCollection(wasmContext);
    verticallyStackedColumnCollection.dataPointWidth = 0.5;
    verticallyStackedColumnCollection.zeroLineY = 0;
    verticallyStackedColumnCollection.add(rendSeries1, rendSeries2, rendSeries3);

    sciChartSurface.renderableSeries.add(verticallyStackedColumnCollection);

    // Collection for threshold
    const yValues0_1: number[] = [];
    for (let i = 0; i < xValues.length; i++) yValues0_1.push(tomatoesData1[i] > THRESHOLD ? tomatoesData1[i] : NaN);
    const dataSeries0_1 = new XyDataSeries(wasmContext, { xValues, yValues: yValues0_1, dataSeriesName: 'Threshold' });
    const rendSeries0_1 = new StackedColumnRenderableSeries(wasmContext, {
        fill: 'red',
        stroke: 'black',
        dataSeries: dataSeries0_1,
        stackedGroupId: '1'
    });

    const yValues0_2: number[] = [];
    for (let i = 0; i < xValues.length; i++) yValues0_2.push(cucumberData2[i] > THRESHOLD ? cucumberData2[i] : NaN);
    const dataSeries0_2 = new XyDataSeries(wasmContext, { xValues, yValues: yValues0_2, dataSeriesName: 'Threshold' });
    const rendSeries0_2 = new StackedColumnRenderableSeries(wasmContext, {
        fill: 'red',
        stroke: 'black',
        dataSeries: dataSeries0_2,
        stackedGroupId: '2'
    });

    const yValues0_3: number[] = [];
    for (let i = 0; i < xValues.length; i++) yValues0_3.push(pepperData3[i] > THRESHOLD ? pepperData3[i] : NaN);
    const dataSeries0_3 = new XyDataSeries(wasmContext, { xValues, yValues: yValues0_3, dataSeriesName: 'Threshold' });
    const rendSeries0_3 = new StackedColumnRenderableSeries(wasmContext, {
        fill: 'red',
        stroke: 'black',
        dataSeries: dataSeries0_3,
        stackedGroupId: '3'
    });
    const verticallyStackedColumnCollection0 = new StackedColumnCollection(wasmContext);
    verticallyStackedColumnCollection0.dataPointWidth = 0.5;
    verticallyStackedColumnCollection0.zeroLineY = THRESHOLD;
    verticallyStackedColumnCollection0.add(rendSeries0_1, rendSeries0_2, rendSeries0_3);
    sciChartSurface.renderableSeries.add(verticallyStackedColumnCollection0);

    const rm = new RolloverModifier();
    // Exclude threshold series to hide tooltips
    rm.includeSeries(rendSeries0_1, false);
    rm.includeSeries(rendSeries0_2, false);
    rm.includeSeries(rendSeries0_3, false);

    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        rm
    );
}

initSciChart();
