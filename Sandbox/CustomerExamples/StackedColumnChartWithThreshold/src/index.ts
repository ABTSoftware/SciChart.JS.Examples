import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { MouseWheelZoomModifier } from 'scichart/Charting/ChartModifiers/MouseWheelZoomModifier';
import { ZoomExtentsModifier } from 'scichart/Charting/ChartModifiers/ZoomExtentsModifier';
import { ZoomPanModifier } from 'scichart/Charting/ChartModifiers/ZoomPanModifier';
import { StackedColumnRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries';
import { StackedColumnCollection } from 'scichart/Charting/Visuals/RenderableSeries/StackedColumnCollection';
import { RolloverModifier } from 'scichart/Charting/ChartModifiers/RolloverModifier';
import { ELegendOrientation, ELegendPlacement } from 'scichart/Charting/Visuals/Legend/SciChartLegendBase';
import { LegendModifier } from 'scichart/Charting/ChartModifiers/LegendModifier';
import { EAxisAlignment } from 'scichart/types/AxisAlignment';
import { TSciChart } from 'scichart/types/TSciChart';
import { NumberRange } from 'scichart/Core/NumberRange';
import { CustomStackedColumnSeries } from "./CustomStackedColumnSeries";

let dataSeries1: XyDataSeries;
let dataSeries2: XyDataSeries;
let dataSeries3: XyDataSeries;

async function initSciChart() {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create('scichart-root');

    const dataSeries1 = new XyDataSeries(wasmContext);
    const dataSeries2 = new XyDataSeries(wasmContext);
    const dataSeries3 = new XyDataSeries(wasmContext);

    for (let x = 0; x < 50; x++) {
        dataSeries1.append(x, 0);
        dataSeries2.append(x, 0);
        dataSeries3.append(x, 0);
    }

    const xAxis = new NumericAxis(wasmContext);
    xAxis.minorDelta = 1;
    xAxis.drawMinorGridLines = false;
    xAxis.autoTicks = false;
    xAxis.majorDelta = 1;
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0, 0.1)
    });
    yAxis.labelProvider.formatLabel = dataValue => {
        return dataValue.toFixed(2);
    };
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();

    const lm = new LegendModifier({
        placement: ELegendPlacement.TopRight,
        orientation: ELegendOrientation.Horizontal,
        showLegend: true,
        showCheckboxes: true,
        showSeriesMarkers: true
    });

    sciChartSurface.chartModifiers.add(lm);
    updateHistogram(wasmContext, sciChartSurface, lm);
}

async function updateHistogram(wasmContext: TSciChart, sciChartSurface: SciChartSurface, lm: LegendModifier) {
    // Threshold series
    const THRESHOLD = 5;

    const thresholdDataSeries1 = new XyDataSeries(wasmContext, { dataSeriesName: 'Threshold' });
    const thresholdDataSeries2 = new XyDataSeries(wasmContext, { dataSeriesName: 'Threshold' });
    const thresholdDataSeries3 = new XyDataSeries(wasmContext, { dataSeriesName: 'Threshold' });

    const thresholdSeries1 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: thresholdDataSeries1,
        fill: 'red',
        stroke: 'black',
        stackedGroupId: '1'
    });
    const thresholdSeries2 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: thresholdDataSeries2,
        fill: 'red',
        stroke: 'black',
        stackedGroupId: '2'
    });
    const thresholdSeries3 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: thresholdDataSeries3,
        fill: 'red',
        stroke: 'black',
        stackedGroupId: '3'
    });

    const thresholdStackedCollection = new StackedColumnCollection(wasmContext);
    thresholdStackedCollection.dataPointWidth = 0.5;
    thresholdStackedCollection.zeroLineY = THRESHOLD;
    thresholdStackedCollection.add(thresholdSeries1, thresholdSeries2, thresholdSeries3);

    // Original Series
    const dataSeries1 = new XyDataSeries(wasmContext, { dataSeriesName: 'Apple ' });
    const dataSeries2 = new XyDataSeries(wasmContext, { dataSeriesName: 'Orange' });
    const dataSeries3 = new XyDataSeries(wasmContext, { dataSeriesName: 'Grape' });

    const rendSeries1 = new CustomStackedColumnSeries(wasmContext, thresholdSeries1);
    rendSeries1.dataSeries = dataSeries1;
    rendSeries1.fill = '#FF5768';
    rendSeries1.stroke = 'black';
    rendSeries1.strokeThickness = 1;
    rendSeries1.stackedGroupId = 'one';

    const rendSeries2 = new CustomStackedColumnSeries(wasmContext, thresholdSeries2);
    rendSeries2.dataSeries = dataSeries2;
    rendSeries2.fill = '#00B0BA';
    rendSeries2.stroke = 'black';
    rendSeries2.strokeThickness = 1;
    rendSeries2.stackedGroupId = 'two';

    const rendSeries3 = new CustomStackedColumnSeries(wasmContext, thresholdSeries3);
    rendSeries3.dataSeries = dataSeries3;
    rendSeries3.fill = '#0065A2';
    rendSeries3.stroke = 'black';
    rendSeries3.strokeThickness = 1;
    rendSeries3.stackedGroupId = 'three';

    const stackedCollection = new StackedColumnCollection(wasmContext);
    stackedCollection.dataPointWidth = 0.5;
    stackedCollection.add(rendSeries1, rendSeries2, rendSeries3);

    sciChartSurface.renderableSeries.clear();
    sciChartSurface.renderableSeries.add(stackedCollection);
    sciChartSurface.renderableSeries.add(thresholdStackedCollection);

    for (let x = 0; x < 50; x++) {
        const fruit1Value = Math.floor(Math.random() * 10);
        const fruit2Value = Math.floor(Math.random() * 10);
        const fruit3Value = Math.floor(Math.random() * 10);

        dataSeries1.append(x, fruit1Value);
        dataSeries2.append(x, fruit2Value);
        dataSeries3.append(x, fruit3Value);

        thresholdDataSeries1.append(x, fruit1Value > THRESHOLD ? fruit1Value : NaN);
        thresholdDataSeries2.append(x, fruit2Value > THRESHOLD ? fruit2Value : NaN);
        thresholdDataSeries3.append(x, fruit3Value > THRESHOLD ? fruit3Value : NaN);
    }

    rendSeries1.dataSeries = dataSeries1;
    rendSeries2.dataSeries = dataSeries2;
    rendSeries3.dataSeries = dataSeries3;

    const rm = new RolloverModifier();
    // Exclude threshold series to hide tooltips
    rm.includeSeries(thresholdSeries1, false);
    rm.includeSeries(thresholdSeries2, false);
    rm.includeSeries(thresholdSeries3, false);
    // Exlude threshold value from the Legend
    lm.includeSeries(thresholdSeries1, false);
    lm.includeSeries(thresholdSeries2, false);
    lm.includeSeries(thresholdSeries3, false);

    sciChartSurface.chartModifiers.add(rm);
}

initSciChart();
