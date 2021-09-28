import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { NumberRange } from 'scichart/Core/NumberRange';
import { DpiHelper } from 'scichart/Charting/Visuals/TextureManager/DpiHelper';
import { CustomAnnotation } from 'scichart/Charting/Visuals/Annotations/CustomAnnotation';
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from 'scichart/types/AnchorPoint';
import { FastCandlestickRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries';
import { OhlcDataSeries } from 'scichart/Charting/Model/OhlcDataSeries';

export async function hitTestCandlestickTs(divId: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);
    const HIT_TEST_RADIUS = 50 * DpiHelper.PIXEL_RATIO;

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));

    const xOhlcValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const openValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];
    const highValues = [3.7, 3.8, 4.0, 5.3, 5.9, 5.7, 5.0, 4.3, 3.2];
    const lowValues = [2.2, 3.4, 3.3, 3.8, 5.0, 4.8, 3.5, 3.0, 1.8];
    const closeValues = [3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0, 2.0];
    const candlestickSeries = new FastCandlestickRenderableSeries(wasmContext, {
        dataPointWidth: 0.3,
        strokeThickness: 2,
        dataSeries: new OhlcDataSeries(wasmContext, {
            xValues: xOhlcValues,
            openValues,
            highValues,
            lowValues,
            closeValues
        })
    });
    sciChartSurface.renderableSeries.add(candlestickSeries);

    // Add an SVG annotation to display the mouse click
    const svgAnnotation = new CustomAnnotation({
        svgString: `<svg width="8" height="8"><circle cx="50%" cy="50%" r="4" fill="#FF0000"/></svg>`,
        isHidden: true,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center
    });
    sciChartSurface.annotations.add(svgAnnotation);

    sciChartSurface.domCanvas2D.addEventListener('mousedown', (mouseEvent: MouseEvent) => {
        const mouseClickX = mouseEvent.offsetX;
        const mouseClickY = mouseEvent.offsetY;
        console.log('mouseClickX', mouseClickX, 'mouseClickY', mouseClickY);
        const premultipliedX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const premultipliedY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
        console.log('premultipliedX', premultipliedX, 'premultipliedY', premultipliedY);
        // IHitTestProvider.hitTest
        const hitTestInfo = candlestickSeries.hitTestProvider.hitTest(premultipliedX, premultipliedY, HIT_TEST_RADIUS);
        svgAnnotation.x1 = hitTestInfo.hitTestPointValues.x;
        svgAnnotation.y1 = hitTestInfo.hitTestPointValues.y;
        svgAnnotation.isHidden = false;

        const resultDiv = document.getElementById('result');
        resultDiv.innerText = `isHit = ${hitTestInfo.isHit}`;
        console.log('hitTestInfo', hitTestInfo);
    });
}
