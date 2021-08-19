import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { EAxisAlignment } from 'scichart/types/AxisAlignment';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { MouseWheelZoomModifier } from 'scichart/Charting/ChartModifiers/MouseWheelZoomModifier';
import { ZoomExtentsModifier } from 'scichart/Charting/ChartModifiers/ZoomExtentsModifier';
import { NumberRange } from 'scichart/Core/NumberRange';
import { CustomAnnotation } from 'scichart/Charting/Visuals/Annotations/CustomAnnotation';
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from 'scichart/types/AnchorPoint';
import { LegendModifier } from 'scichart/Charting/ChartModifiers/LegendModifier';
import * as domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

const chartDivId = 'scichart-root';

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
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(chartDivId);

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext);

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        labelStyle: { color: 'white' },
        visibleRange: new NumberRange(0, 8)
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const customAnnotation1 = new CustomAnnotation({
        x1: 3,
        y1: 6,
        isEditable: true,
        xCoordShift: 0,
        yCoordShift: 0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        svgString: `<svg id="two" width="50" height="50"  xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" style="fill:#00ff00"><animate attributeName="rx" values="0;25;0" dur="2s" repeatCount="indefinite" /></rect>
            </svg>`
    });

    const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
        stroke: 'white',
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5],
            yValues: [3, 4, 3, 4, 3],
            dataSeriesName: 'white series'
        })
    });

    sciChartSurface.renderableSeries.add(lineSeries1);
    sciChartSurface.annotations.add(customAnnotation1);

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomExtentsModifier(), new LegendModifier());

    document.getElementById('export_append').addEventListener('click', () => {
        domtoimage
            .toPng(document.getElementById(chartDivId))
            .then(function(dataUrl: any) {
                const img = new Image();
                img.src = dataUrl;
                const resElement = document.getElementById('export_image_result');
                resElement.innerHTML = '';
                resElement.appendChild(img);
            })
            .catch(function(error: any) {
                console.error('oops, something went wrong!', error);
            });
    });

    document.getElementById('export_download').addEventListener('click', () => {
        domtoimage.toBlob(document.getElementById(chartDivId)).then(function(blob: any) {
            saveAs(blob, 'scichart.png');
        });
    });
}

initSciChart();
