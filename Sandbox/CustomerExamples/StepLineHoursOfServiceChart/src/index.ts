import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { EAxisAlignment } from 'scichart/types/AxisAlignment';
import { NumberRange } from 'scichart/Core/NumberRange';
import { ENumericFormat } from 'scichart/types/NumericFormat';
import { SciChartJSLightTheme } from 'scichart/Charting/Themes/SciChartJSLightTheme';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { AxisMarkerAnnotation } from 'scichart/Charting/Visuals/Annotations/AxisMarkerAnnotation';
import { ECoordinateMode } from 'scichart/Charting/Visuals/Annotations/AnnotationBase';

async function initSciChart() {
    // LICENSING //
    // Set your license code here
    // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
    // Purchased license keys can be viewed at https://www.scichart.com/profile
    //
    // e.g.
    //
    // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
    //
    // Also, once activated (trial or paid license) having the licensing wizard open on your machine
    // will mean any or all applications you run locally will be fully licensed.

    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-root');
    sciChartSurface.applyTheme(new SciChartJSLightTheme());

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 24),
        autoTicks: false
    });
    xAxis.majorDelta = 1;
    xAxis.minorDelta = 0.5;
    xAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
    xAxis.drawMajorBands = false;

    const xValues = [0, 7.25, 7.45, 8, 9.25, 10, 10.5, 10.75, 11.25, 11.5, 15.25, 16, 24];
    const yValues = [1, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 1, 1];
    const total = calcTotal(xValues, yValues);

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        visibleRange: new NumberRange(0.5, 4.5),
        autoTicks: false,
        flippedCoordinates: true
    });
    yAxis.majorDelta = 1;
    yAxis.minorDelta = 1;
    yAxis.drawMajorBands = false;
    yAxis.labelProvider.formatLabel = value => {
        switch (value) {
            case 1:
                return `Off Duty`;
            case 2:
                return `Sleepper`;
            case 3:
                return `Driving`;
            case 4:
                return `On Duty`;
            default:
                return '';
        }
    };

    const yAxis2 = new NumericAxis(wasmContext, {
        id: 'yAxis2',
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0.5, 4.5),
        autoTicks: false,
        flippedCoordinates: true
    });
    yAxis2.drawMajorGridLines = false;
    yAxis2.drawMinorGridLines = false;
    yAxis2.drawMajorTickLines = false;
    yAxis2.drawMinorGridLines = false;
    yAxis2.majorDelta = 1;
    yAxis2.minorDelta = 1;
    yAxis2.labelProvider.formatLabel = value => {
        switch (value) {
            case 1:
                return formatMinutes(total[1]);
            case 2:
                return formatMinutes(total[2]);
            case 3:
                return formatMinutes(total[3]);
            case 4:
                return formatMinutes(total[4]);
            default:
                return '';
        }
    };

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
    sciChartSurface.yAxes.add(yAxis2);

    const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        isDigitalLine: true,
        stroke: 'blue',
        strokeThickness: 5,
        dataSeries
    });
    const axisMarkerAnnotation = new AxisMarkerAnnotation({
        yAxisId: 'yAxis2',
        yCoordinateMode: ECoordinateMode.DataValue,
        color: '#555555FF',
        backgroundColor: '#F9F9F9FF',
        formattedValue: 'Total Hours',
        y1: 0.5
    });
    sciChartSurface.annotations.add(axisMarkerAnnotation);

    sciChartSurface.renderableSeries.add(lineSeries);
}

function calcTotal(xValues: number[], yValues: number[]) {
    const res: Record<string, number> = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0
    };
    for (let i = 0; i < xValues.length - 1; i++) {
        const time = xValues[i + 1] - xValues[i];
        const val = yValues[i];
        res[val] += time;
    }
    return res;
}

function formatMinutes(hoursInput: number) {
    const secondsTotal = Math.floor(hoursInput * 60 * 60);
    let seconds = (secondsTotal % 60).toString(10);
    seconds = seconds.length === 1 ? '0' + seconds : seconds;
    const minutesTotal = Math.floor(secondsTotal / 60);
    let minutes = (minutesTotal % 60).toString(10);
    minutes = minutes.length === 1 ? '0' + minutes : minutes;
    const hours = Math.floor(minutesTotal / 60);
    return `${hours}:${minutes}:${seconds}`;
}

initSciChart();
